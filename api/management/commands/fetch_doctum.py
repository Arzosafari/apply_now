import json
import re
import time
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests
from django.core.management.base import BaseCommand
from django.db import IntegrityError, transaction
from django.utils.text import slugify

from api.models import StudyProgram

SITEMAP_URL = "https://doctum.co.uk/sitemap.xml"
BASE_URL = "https://doctum.co.uk"
HEADERS = {
    "User-Agent": "ApplyNowBot/1.0 (+https://applynow.site; study program directory)",
    "Accept": "text/html",
}


class Command(BaseCommand):
    help = "Fetch UK PhD programs from Doctum (doctum.co.uk) sitemap + JSON-LD"

    def add_arguments(self, parser):
        parser.add_argument(
            "--limit",
            type=int,
            default=0,
            help="Max programs to fetch (0 = all)",
        )
        parser.add_argument(
            "--offset",
            type=int,
            default=0,
            help="Skip first N sitemap URLs",
        )
        parser.add_argument(
            "--delay",
            type=float,
            default=0.5,
            help="Seconds between requests per worker (default: 0.5)",
        )
        parser.add_argument(
            "--workers",
            type=int,
            default=8,
            help="Parallel workers (default: 8)",
        )
        parser.add_argument(
            "--urls-file",
            type=str,
            default="",
            help="File with one URL per line (overrides sitemap)",
        )

    def get_urls(self, options):
        if options["urls_file"]:
            with open(options["urls_file"], encoding="utf-8") as f:
                return [l.strip() for l in f if l.strip()]

        resp = requests.get(SITEMAP_URL, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        urls = re.findall(r"<loc>(.*?)</loc>", resp.text)
        return [u for u in urls if "/phd/" in u]

    def handle(self, *args, **options):
        urls = self.get_urls(options)
        offset = options["offset"]
        limit = options["limit"]
        delay = options["delay"]
        workers = options["workers"]

        if offset:
            urls = urls[offset:]
        if limit:
            urls = urls[:limit]

        self.stdout.write(
            f"Found {len(urls)} PhD program URLs to process "
            f"({workers} workers)"
        )

        stats = {"created": 0, "updated": 0, "skipped": 0, "failed": 0}
        total = len(urls)

        with ThreadPoolExecutor(max_workers=workers) as pool:
            futures = {}
            for url in urls:
                futures[pool.submit(self.import_program, url, delay)] = url

            for i, future in enumerate(as_completed(futures), 1):
                url = futures[future]
                try:
                    result = future.result()
                    stats[result if result in stats else "skipped"] += 1
                except Exception as e:
                    self.stderr.write(self.style.WARNING(f"{url}: {e}"))
                    stats["failed"] += 1

                if i % 25 == 0 or i == total:
                    self.stdout.write(
                        f"[{i}/{total}] created={stats['created']} "
                        f"updated={stats['updated']} skipped={stats['skipped']} "
                        f"failed={stats['failed']}"
                    )

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Created: {stats['created']}, Updated: {stats['updated']}, "
                f"Skipped: {stats['skipped']}, Failed: {stats['failed']}"
            )
        )

    def import_program(self, url, delay=0.0):
        time.sleep(delay)
        resp = requests.get(url, headers=HEADERS, timeout=30)
        resp.raise_for_status()
        html = resp.text

        # External ID = last path segment of the doctum URL
        external_id = url.rstrip("/").rsplit("/", 1)[-1]
        if not external_id:
            return "skipped"

        program_ld = None
        breadcrumb_ld = None
        for block in re.findall(
            r'<script type="application/ld\+json">(.*?)</script>', html, re.S
        ):
            try:
                data = json.loads(block)
            except json.JSONDecodeError:
                continue
            items = data if isinstance(data, list) else [data]
            for item in items:
                if not isinstance(item, dict):
                    continue
                t = item.get("@type")
                if t == "EducationalOccupationalProgram":
                    program_ld = item
                elif t == "BreadcrumbList":
                    breadcrumb_ld = item

        if not program_ld or not program_ld.get("name"):
            return "skipped"

        course_name = program_ld["name"].strip()
        academy = (program_ld.get("provider") or {}).get("name", "")

        # Subject from breadcrumb (position 3 = subject category)
        subject = ""
        if breadcrumb_ld:
            for el in breadcrumb_ld.get("itemListElement", []):
                if el.get("position") == 3:
                    subject = el.get("name", "")
                    break

        # Funding / stipend info
        funding_bits = []
        if program_ld.get("financialAidEligible"):
            funding_bits.append(str(program_ld["financialAidEligible"]))
        offers = program_ld.get("offers") or {}
        if offers.get("category"):
            funding_bits.append(f"Category: {offers['category']}")
        scholarship_info = "\n".join(funding_bits)

        tuition_fees = ""
        if offers.get("category"):
            tuition_fees = (
                f"{offers['category']} (check advert — international fee "
                "differences may apply)"
            )

        # Who can apply — pull from page text near "Who can apply"
        intl = "Open to international" if "Open to international" in html else ""
        support_intl = [intl] if intl else []

        deadline = program_ld.get("applicationDeadline") or ""
        beginning = program_ld.get("startDate") or ""

        defaults = {
            "country": "uk",
            "data_source": "doctum",
            "course_name": course_name[:500],
            "course_name_short": course_name[:500],
            "academy": (academy or "")[:500],
            "city": "",
            "languages": ["English"],
            "subject": (subject or "")[:500],
            "tuition_fees": tuition_fees[:2000] if tuition_fees else "",
            "programme_duration": "36 months (typical PhD)",
            "beginning": str(beginning)[:255],
            "application_deadline": str(deadline)[:2000] if deadline else "",
            "cost_string": "",
            "course_type": 3,  # PhD/Doctorate
            "is_elearning": False,
            "is_complete_online_possible": False,
            "financial_support": scholarship_info[:2000] if scholarship_info else "",
            "structured_research": True,
            "support_international_students": support_intl,
            "link": (program_ld.get("sameAs") or url)[:1000],
            "image": "",
            "request_language": "en",
            "description": (program_ld.get("description") or "")[:8000],
            "published": True,
            "featured": False,
        }

        # Unique slug: find next free suffix, retry on IntegrityError races
        base_slug = (
            slugify(f"{course_name}-{academy}")[:200]
            or slugify(course_name)[:200]
            or external_id[:200]
        )
        slug_re = re.compile(rf"^{re.escape(base_slug)}(-\d+)?$")
        taken = {
            s
            for s in StudyProgram.objects.filter(slug__startswith=base_slug)
            .exclude(external_id=external_id)
            .values_list("slug", flat=True)
            if slug_re.match(s)
        }
        slug = base_slug
        counter = 1
        while slug in taken:
            slug = f"{base_slug}-{counter}"
            counter += 1

        for _ in range(10):
            try:
                with transaction.atomic():
                    program, created_flag = StudyProgram.objects.update_or_create(
                        external_id=external_id,
                        defaults={**defaults, "slug": slug},
                    )
                return "created" if created_flag else "updated"
            except IntegrityError:
                slug = f"{base_slug}-{counter}"
                counter += 1
        raise RuntimeError(f"Could not allocate slug for {external_id}")
