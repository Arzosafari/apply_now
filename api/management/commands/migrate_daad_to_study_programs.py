from django.core.management.base import BaseCommand
from django.utils.text import slugify
from api.models import DAADProgram, StudyProgram


class Command(BaseCommand):
    help = 'Migrate DAAD programs to StudyProgram model'

    def handle(self, *args, **options):
        daad_programs = DAADProgram.objects.all()
        count = 0

        for daad in daad_programs:
            # Generate slug
            base_slug = slugify(f"{daad.course_name}-{daad.academy}")[:200]
            slug = base_slug
            counter = 1
            while StudyProgram.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1

            # Create StudyProgram from DAADProgram
            StudyProgram.objects.create(
                external_id=str(daad.daad_id),
                slug=slug,
                country='germany',
                data_source='DAAD',
                course_name=daad.course_name,
                course_name_short=daad.course_name_short,
                academy=daad.academy,
                city=daad.city,
                languages=daad.languages,
                language_level_german=daad.language_level_german,
                language_level_english=daad.language_level_english,
                subject=daad.subject,
                tuition_fees=daad.tuition_fees,
                programme_duration=daad.programme_duration,
                beginning=daad.beginning,
                application_deadline=daad.application_deadline,
                cost_string=daad.cost_string,
                course_type=daad.course_type,
                is_elearning=daad.is_elearning,
                is_complete_online_possible=daad.is_complete_online_possible,
                financial_support=daad.financial_support,
                structured_research=daad.structured_research,
                support_international_students=daad.support_international_students,
                link=daad.link,
                image=daad.image,
                request_language=daad.request_language,
                description=daad.description,
                admission_requirements=daad.admission_requirements,
                language_requirements=daad.language_requirements,
                application_documents=daad.application_documents,
                living_costs=daad.living_costs,
                scholarship_info=daad.scholarship_info,
                contact_info=daad.contact_info,
                published=daad.published,
            )
            count += 1

        self.stdout.write(
            self.style.SUCCESS(f'Migrated {count} DAAD programs to StudyProgram')
        )
