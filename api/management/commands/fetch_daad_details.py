import requests
from bs4 import BeautifulSoup
from django.core.management.base import BaseCommand
from api.models import DAADProgram


class Command(BaseCommand):
    help = 'Fetch detailed information for DAAD programs from their detail pages'

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=10,
            help='Number of programs to fetch details for (default: 10)',
        )
        parser.add_argument(
            '--id',
            type=int,
            default=None,
            help='Fetch details for a specific program ID',
        )

    def handle(self, *args, **options):
        limit = options.get('limit', 10)
        specific_id = options.get('id')

        if specific_id:
            programs = DAADProgram.objects.filter(daad_id=specific_id)
        else:
            programs = DAADProgram.objects.filter(published=True)[:limit]

        self.stdout.write(f'Fetching details for {programs.count()} programs...')

        for program in programs:
            if not program.link:
                self.stdout.write(f'Skipping program {program.id} - no link')
                continue

            try:
                self.stdout.write(f'Fetching details for: {program.course_name}')
                
                # Fetch the detail page
                response = requests.get(program.link, timeout=30)
                response.raise_for_status()
                
                # Parse HTML
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Remove navigation and footer
                for elem in soup.find_all(['nav', 'footer', 'header']):
                    elem.decompose()
                
                # Extract all text content and try to find relevant sections
                text = soup.get_text(separator='\n', strip=True)
                lines = [line.strip() for line in text.split('\n') if line.strip()]
                
                # Extract description (look for Description/content section)
                description = []
                in_description = False
                for i, line in enumerate(lines):
                    if 'description' in line.lower() and 'content' in line.lower():
                        in_description = True
                        continue
                    if in_description:
                        if any(keyword in line.lower() for keyword in ['teaching language', 'language level', 'date', 'target group', 'recognised']):
                            break
                        if len(line) > 20:
                            description.append(line)
                if description:
                    program.description = '\n'.join(description[:10])  # Limit to 10 paragraphs
                
                # Extract language requirements
                lang_req = []
                in_lang = False
                for i, line in enumerate(lines):
                    if 'german language skills' in line.lower() or 'english language skills' in line.lower():
                        in_lang = True
                        continue
                    if in_lang:
                        if any(keyword in line.lower() for keyword in ['application documents', 'submit application', 'is accommodation']):
                            break
                        if len(line) > 5:
                            lang_req.append(line)
                if lang_req:
                    program.language_requirements = '\n'.join(lang_req[:5])
                
                # Extract application documents
                docs = []
                in_docs = False
                for i, line in enumerate(lines):
                    if 'application documents' in line.lower():
                        in_docs = True
                        continue
                    if in_docs:
                        if any(keyword in line.lower() for keyword in ['submit application', 'via', 'is accommodation']):
                            break
                        if line.startswith('*') or line.startswith('-') or len(line) > 10:
                            docs.append(line)
                if docs:
                    program.application_documents = '\n'.join(docs[:8])
                
                # Extract costs/living info
                costs = []
                in_costs = False
                for i, line in enumerate(lines):
                    if 'dates and costs' in line.lower():
                        in_costs = True
                        continue
                    if in_costs:
                        if any(keyword in line.lower() for keyword in ['teaching language', 'language level', 'german language']):
                            break
                        if line.startswith('*') or line.startswith('-') or len(line) > 10:
                            costs.append(line)
                if costs:
                    program.living_costs = '\n'.join(costs[:8])
                
                # Extract contact info
                contact = []
                in_contact = False
                for i, line in enumerate(lines):
                    if 'contact' in line.lower() and ('email' in lines[i+1:i+3] or 'university' in lines[i+1:i+3]):
                        in_contact = True
                        continue
                    if in_contact:
                        if line.startswith('*') or line.startswith('-') or '@' in line or len(line) > 10:
                            contact.append(line)
                        if len(contact) > 5:
                            break
                if contact:
                    program.contact_info = '\n'.join(contact[:5])
                
                program.save()
                self.stdout.write(self.style.SUCCESS(f'Updated details for: {program.course_name}'))
                
            except requests.RequestException as e:
                self.stdout.write(
                    self.style.ERROR(f'Error fetching details for {program.course_name}: {e}')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'Error processing {program.course_name}: {e}')
                )

        self.stdout.write(self.style.SUCCESS('Done fetching details'))
