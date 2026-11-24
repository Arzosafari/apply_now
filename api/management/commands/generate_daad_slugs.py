from django.core.management.base import BaseCommand
from django.utils.text import slugify
from api.models import DAADProgram


class Command(BaseCommand):
    help = 'Generate slugs for existing DAAD programs'

    def handle(self, *args, **options):
        programs = DAADProgram.objects.filter(slug__isnull=True) | DAADProgram.objects.filter(slug='')
        count = 0

        for program in programs:
            base_slug = slugify(f"{program.course_name}-{program.academy}")[:200]
            slug = base_slug

            # Make slug unique
            counter = 1
            while DAADProgram.objects.filter(slug=slug).exclude(id=program.id).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            program.slug = slug
            program.save()
            count += 1

        self.stdout.write(
            self.style.SUCCESS(f'Generated slugs for {count} programs')
        )
