# Django Backend API

Django REST API backend for Apply Now project with MySQL database.

## Setup

1. Install dependencies:
```bash
pip install django==4.2.17 djangorestframework django-cors-headers mysqlclient python-decouple
```

2. Configure environment variables in `.env`:
```
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1
DB_NAME=apply-now-db
DB_USER=root
DB_PASSWORD=
DB_HOST=localhost
DB_PORT=3306
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

3. Run migrations:
```bash
python manage.py migrate
```

4. Create superuser:
```bash
python manage.py createsuperuser
```

5. Run server:
```bash
python manage.py runserver 0.0.0.0:4000
```

## API Endpoints

### Public Endpoints

- `GET /api/public/site` - Get site data (settings, services, destinations, etc.)
- `POST /api/public/consultations` - Submit consultation request
- `POST /api/public/contact` - Submit contact message

### Admin Endpoints

- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/session` - Get current session
- `GET /api/admin/stats` - Get dashboard statistics
- `GET /api/admin/consultations` - List consultations
- `GET /api/admin/consultations/<id>` - Get consultation details
- `PATCH /api/admin/consultations/<id>/update_status` - Update consultation status
- `POST /api/admin/consultations/<id>/add_note` - Add note to consultation
- `GET /api/admin/contact-messages` - List contact messages
- `PATCH /api/admin/contact-messages/<id>` - Update contact message status

### Model Endpoints

- `GET /api/services` - List services
- `GET /api/services/<id>` - Get service details
- `GET /api/destinations` - List destinations
- `GET /api/destinations/<id>` - Get destination details
- `GET /api/packages` - List packages
- `GET /api/experts` - List experts
- `GET /api/articles` - List articles
- `GET /api/faqs` - List FAQs
- `GET /api/testimonials` - List testimonials

## Default Admin Credentials

- Email: admin@faratech.example
- Password: ChangeMe!2026

## Database

Database: `apply-now-db` (MySQL)
All tables are created and managed by Django migrations.

## Models

- Admin - Admin users with authentication
- Service - Immigration/education services
- Destination - Target countries
- Package - Service packages with pricing
- Expert - Consultant profiles
- Article - Blog articles
- FAQ - Frequently asked questions
- Testimonial - Client testimonials
- Consultation - Consultation requests
- ConsultationNote - Notes on consultations
- ContactMessage - Contact form submissions
- Payment - Payment records
- SiteSetting - Site configuration
- LegalPage - Legal pages (privacy, terms)
- ActivityLog - Admin activity tracking
