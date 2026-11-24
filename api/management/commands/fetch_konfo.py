import re
import requests
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from api.models import StudyProgram

BASE_URL = "https://opintopolku.fi/konfo-backend"
HEADERS = {
    "Accept": "application/json",
    "Caller-Id": "applynow.site",
}

# Map Finnish degree types to our course_type choices
DEGREE_TYPE_MAP = {
    "kandidaatti": 1,  # Bachelor's
    "bachelor": 1,
    "lisensiaatti": 2,  # Master's
    "master": 2,
    "tohtori": 3,  # PhD
    "doctor": 3,
    "yo": 1,  # Ylioppilas (university entrance -> treat as bachelor-level)
}


def strip_html(html):
    if not html:
        return ""
    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def pick_lang(value, lang="en"):
    """Extract a localized string from a {fi, sv, en} dict."""
    if not value:
        return ""
    if isinstance(value, dict):
        if lang in value:
            return value[lang] or ""
        return value.get("fi") or value.get("en") or ""
    return str(value)


class Command(BaseCommand):
    help = "Fetch study programs from Finland's Opintopolku (Konfo) API"

    def add_arguments(self, parser):
        parser.add_argument(
            "--keyword",
            type=str,
            default="",
            help="Search keyword (min 3 chars). Empty + --filters fetches all.",
        )
        parser.add_argument(
            "--size",
            type=int,
            default=50,
            help="Page size per request (default: 50)",
        )
        parser.add_argument(
            "--pages",
            type=int,
            default=1,
            help="Number of pages to fetch (default: 1)",
        )
        parser.add_argument(
            "--lng",
            type=str,
            default="en",
            choices=["en", "fi", "sv"],
            help="Response language (default: en)",
        )
        parser.add_argument(
            "--koulutustyyppi",
            type=str,
            default="",
            help="Filter by education type code (e.g., 'yo' for university)",
        )

    def handle(self, *args, **options):
        keyword = options["keyword"]
        size = options["size"]
        pages = options["pages"]
        lng = options["lng"]
        koulutustyyppi = options["koulutustyyppi"]

        created = updated = skipped = 0

        for page in range(1, pages + 1):
            params = {
                "keyword": keyword,
                "lng": lng,
                "size": size,
                "page": page,
                "sort": "name",
                "order": "asc",
            }
            if koulutustyyppi:
                params["koulutustyyppi"] = koulutustyyppi

            self.stdout.write(f"Fetching page {page} (size={size})...")
            try:
                resp = requests.get(
                    f"{BASE_URL}/external/search/koulutukset",
                    params=params,
                    headers=HEADERS,
                    timeout=30,
                )
                resp.raise_for_status()
                data = resp.json()
            except Exception as e:
                self.stderr.write(self.style.ERROR(f"Request failed: {e}"))
                break

            hits = data.get("hits", [])
            if not hits:
                self.stdout.write("No more results.")
                break

            for hit in hits:
                try:
                    result = self.import_program(hit, lng)
                    if result == "created":
                        created += 1
                    elif result == "updated":
                        updated += 1
                    else:
                        skipped += 1
                except Exception as e:
                    self.stderr.write(
                        self.style.WARNING(f"Failed to import {hit.get('oid')}: {e}")
                    )
                    skipped += 1

            total = data.get("total", 0)
            self.stdout.write(
                f"  Page {page}: {len(hits)} hits (total: {total})"
            )
            if page * size >= total:
                break

        self.stdout.write(
            self.style.SUCCESS(
                f"Done. Created: {created}, Updated: {updated}, Skipped: {skipped}"
            )
        )

    def import_program(self, hit, lng):
        oid = hit.get("oid")
        if not oid:
            return "skipped"

        course_name = pick_lang(hit.get("nimi"), lng)
        if not course_name:
            return "skipped"

        # Degree titles give us the level (Bachelor/Master/Doctor)
        degree_titles = " ".join(
            pick_lang(t.get("nimi"), lng)
            for t in hit.get("tutkintonimikkeet", [])
        ).lower()
        course_type = None
        for key, val in DEGREE_TYPE_MAP.items():
            if key in degree_titles:
                course_type = val
                break

        # Gather implementation (toteutus) info for city/university
        toteutukset = hit.get("toteutukset", [])
        city = ""
        university = ""
        link = ""
        if toteutukset:
            toteutus = toteutukset[0]
            # Try to get city from toteutus detail
            toteutus_oid = toteutus.get("toteutusOid")
            if toteutus_oid:
                try:
                    detail = requests.get(
                        f"{BASE_URL}/external/toteutus/{toteutus_oid}",
                        headers=HEADERS,
                        timeout=20,
                    )
                    if detail.ok:
                        d = detail.json()
                        org = d.get("organisaatio", {})
                        paikkakunta = org.get("paikkakunta", {}) or {}
                        city = pick_lang(paikkakunta.get("nimi"), lng) or city
                        university = pick_lang(org.get("nimi"), lng) or university
                        link = f"https://opintopolku.fi/konfo/fi/koulutus/{toteutus_oid}"
                except Exception:
                    pass
            if not city:
                kunnat = toteutus.get("kunnat", [])
                if kunnat:
                    city = pick_lang(kunnat[0].get("nimi"), lng)
            if not university:
                university = pick_lang(toteutus.get("oppilaitosNimi"), lng)
            if not link and toteutus_oid:
                link = f"https://opintopolku.fi/konfo/fi/koulutus/{toteutus_oid}"

        # Generate unique slug
        base_slug = slugify(f"{course_name}-{university}")[:200] or slugify(course_name)[:200]
        slug = base_slug
        counter = 1
        qs = StudyProgram.objects.filter(slug=slug).exclude(external_id=oid)
        while qs.exists():
            slug = f"{base_slug}-{counter}"
            counter += 1
            qs = StudyProgram.objects.filter(slug=slug).exclude(external_id=oid)

        # Languages offered by the program
        languages = hit.get("kielivalinta", []) or []

        description = strip_html(pick_lang(hit.get("kuvaus"), lng))
        if not description:
            # Fallback: try toteutus description if needed later
            pass

        defaults = {
            "slug": slug,
            "country": "finland",
            "data_source": "konfo",
            "course_name": course_name[:500],
            "course_name_short": course_name[:500],
            "academy": (university or "")[:500],
            "city": (city or "")[:255],
            "languages": languages,
            "subject": "",
            "tuition_fees": "No tuition fees for EU/EEA citizens; check program page for others",
            "programme_duration": "",
            "beginning": "",
            "application_deadline": "",
            "cost_string": "",
            "course_type": course_type,
            "is_elearning": False,
            "is_complete_online_possible": False,
            "financial_support": "",
            "structured_research": False,
            "support_international_students": [],
            "link": (link or "")[:1000],
            "image": (hit.get("teemakuva") or "")[:1000],
            "request_language": "en",
            "description": description,
            "published": True,
        }

        program, created_flag = StudyProgram.objects.update_or_create(
            external_id=oid,
            defaults=defaults,
        )
        return "created" if created_flag else "updated"
