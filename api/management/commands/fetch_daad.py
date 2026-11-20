import requests
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from api.models import DAADProgram


class Command(BaseCommand):
    help = 'Fetch programs from DAAD API and save to database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=100,
            help='Number of programs to fetch (default: 100)',
        )
        parser.add_argument(
            '--subject',
            type=str,
            default='',
            help='Filter by subject (optional)',
        )
        parser.add_argument(
            '--city',
            type=str,
            default='',
            help='Filter by city (optional)',
        )

    def handle(self, *args, **options):
        limit = options.get('limit', 100)
        subject = options.get('subject', '')
        city = options.get('city', '')

        self.stdout.write(f'Fetching {limit} programs from DAAD API...')

        url = "https://www2.daad.de/deutschland/studienangebote/international-programmes/api/solr/en/search.json"
        params = {
            'cert': '',
            'admReq': '',
            'scholarshipLC': '',
            'scholarshipSC': '',
            'fos': subject,
            'langDeAvailable': '',
            'langEnAvailable': '',
            'sort': '4',
            'q': city,
            'limit': limit,
            'offset': '',
            'display': 'list',
            'isSep': ''
        }

        try:
            response = requests.get(url, params=params, timeout=30)
            response.raise_for_status()
            data = response.json()

            courses = data.get('courses', [])
            self.stdout.write(f'Found {len(courses)} programs')

            created_count = 0
            updated_count = 0

            for course in courses:
                course_type_mapping = {
                    "1": 1,  # Bachelor's degree
                    "2": 2,  # Master's degree
                    "3": 3,  # PhD/Doctorate
                    "4": 4,  # Cross-faculty graduate and research school
                    "5": 5,  # Prep course
                    "6": 6,  # Language course
                    "7": 7,  # Short course
                    "8": 8,  # Study online
                    "56": 56,  # Summer/Winter School
                }

                course_type_int = str(course.get('courseType', ''))
                course_type = course_type_mapping.get(course_type_int)

                # Generate slug from course name and academy
                base_slug = slugify(f"{course.get('courseName', '')}-{course.get('academy', '')}")[:200]
                slug = base_slug

                # Make slug unique
                counter = 1
                while DAADProgram.objects.filter(slug=slug).exists():
                    slug = f"{base_slug}-{counter}"
                    counter += 1

                program, created = DAADProgram.objects.update_or_create(
                    daad_id=course['id'],
                    defaults={
                        'slug': slug,
                        'course_name': course.get('courseName', ''),
                        'course_name_short': course.get('courseNameShort', ''),
                        'academy': course.get('academy', ''),
                        'city': course.get('city', ''),
                        'languages': course.get('languages', []),
                        'language_level_german': course.get('languageLevelGerman', []),
                        'language_level_english': course.get('languageLevelEnglish', []),
                        'subject': course.get('subject', ''),
                        'tuition_fees': course.get('tuitionFees', ''),
                        'programme_duration': course.get('programmeDuration', ''),
                        'beginning': course.get('beginning', ''),
                        'application_deadline': course.get('applicationDeadline', ''),
                        'cost_string': course.get('costString', ''),
                        'course_type': course_type,
                        'is_elearning': course.get('isElearning', False),
                        'is_complete_online_possible': course.get('isCompleteOnlinePossible', False),
                        'financial_support': course.get('financialSupport', ''),
                        'structured_research': course.get('structuredResearch', False),
                        'support_international_students': course.get('supportInternationalStudents', []),
                        'link': f"https://www2.daad.de{course.get('link', '')}" if course.get('link') else '',
                        'image': course.get('image', ''),
                        'request_language': course.get('requestLanguage', 'en'),
                    }
                )

                if not created:
                    # Update existing record
                    program.slug = slug
                    program.course_name = course.get('courseName', '')
                    program.course_name_short = course.get('courseNameShort', '')
                    program.academy = course.get('academy', '')
                    program.city = course.get('city', '')
                    program.languages = course.get('languages', [])
                    program.language_level_german = course.get('languageLevelGerman', [])
                    program.language_level_english = course.get('languageLevelEnglish', [])
                    program.subject = course.get('subject', '')
                    program.tuition_fees = course.get('tuitionFees', '')
                    program.programme_duration = course.get('programmeDuration', '')
                    program.beginning = course.get('beginning', '')
                    program.application_deadline = course.get('applicationDeadline', '')
                    program.cost_string = course.get('costString', '')
                    program.course_type = course_type
                    program.is_elearning = course.get('isElearning', False)
                    program.is_complete_online_possible = course.get('isCompleteOnlinePossible', False)
                    program.financial_support = course.get('financialSupport', '')
                    program.structured_research = course.get('structuredResearch', False)
                    program.support_international_students = course.get('supportInternationalStudents', [])
                    program.link = f"https://www2.daad.de{course.get('link', '')}" if course.get('link') else ''
                    program.image = course.get('image', '')
                    program.request_language = course.get('requestLanguage', 'en')
                    program.save()
                    updated_count += 1
                else:
                    created_count += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully imported {created_count} new programs and updated {updated_count} existing programs'
                )
            )

        except requests.RequestException as e:
            self.stdout.write(
                self.style.ERROR(f'Error fetching data from DAAD API: {e}')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error processing data: {e}')
            )
