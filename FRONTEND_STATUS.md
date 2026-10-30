# Frontend development status

## Inspection at handover

The working tree was clean on `arena/33dca5df-apply-now`. The project is an existing React 19 / TypeScript / Vite application with React Router, TanStack Query, Tailwind, Lucide, Recharts and local Inter, Manrope and Vazirmatn fonts. Its visual assets and bilingual demonstration copy already exist. The supplied proposal calls for a responsive bilingual consultancy site and a management panel; payment and secure access are future integration concerns for this frontend-only stage.

### Completed

- [x] Shared public layout, header, footer, mobile navigation, typography, colour tokens, cards, breadcrumbs and CTA components.
- [x] Public route structure for home, services and service details, destinations and destination details, pricing, experts and expert details, about, blog and article details, consultation, contact, FAQ and legal pages, including `/fa` routes.
- [x] Existing bilingual public copy and detailed seed content for the ten requested services, six countries, packages, experts, articles and FAQs.
- [x] Public page layouts include the requested homepage sections, reusable detail templates, searches, filters, accordions and form validation.
- [x] Existing responsive CSS and mobile public/admin navigation, local imagery, metadata helpers and reusable TypeScript types.
- [x] Admin layouts for a dashboard, requests and notes, content management, payments and settings already exist, with reusable resource configuration and form components.
- [x] Baseline Vite production build and frontend TypeScript check pass when dependencies are installed without backend native install scripts.

### Partially completed

- [ ] All public content and detail pages currently require `/api`; without the existing backend the public layout stops at an error rather than functioning as a frontend-only preview.
- [ ] Consultation and contact forms validate, but submit to a real API and currently claim a real response or delivery; demo-only submission and explicit messaging are needed.
- [ ] Pricing, payment and admin copy refers to live/verified transactions or server security. Demo prices, payments and authentication must be clearly distinguished from production functionality.
- [ ] Admin management, charts, filters, pagination, notes, settings and CRUD are implemented as API clients, but need a local mock adapter to work independently. Requested `/admin/dashboard`, `/admin/requests` and `/admin/pricing` routes are not present as aliases.
- [ ] Public Persian/English routing, translations and RTL are in place, but the admin UI and its language switcher are mostly missing; several demo labels and dynamic content need translation.
- [ ] Existing responsive styles need cross-viewport verification. Reveal-on-scroll leaves offscreen content invisible in full-page capture and may hide content when motion/observer behaviour is impaired.
- [ ] Existing automated tests assume a running database/server and real administrator credentials; add frontend-only route, interaction, locale and viewport checks.
- [ ] Contact details, team profiles, testimonials, legal text and prices are illustrative and must remain clearly marked for business/legal review.

### Not implemented for this stage

- [ ] A frontend-only data/service adapter, demonstration session and local CRUD persistence, separate from UI and prepared for a future backend.
- [ ] Demonstration request/payment datasets and local exports with no implication that real payments were processed.
- [ ] Explicit frontend-only setup/run documentation and final QA/status report.

## Remaining implementation plan

1. Preserve all existing layouts, content, assets and server files; introduce a frontend mock data store behind the existing API boundary.
2. Make the public site, forms and every admin module work without network APIs; keep demonstration behaviour and storage limitations visible.
3. Add the requested admin route aliases, finish admin localisation and correct RTL/mobile edge cases.
4. Remove misleading delivery, payment, security and production-storage claims from the demo UI; validate forms and local CRUD interactions.
5. Run build/type checks and automated browser checks over public/admin routes, filters, forms, CRUD, both locales and desktop/tablet/mobile widths. Document any remaining limitations.

---

## Completion report — 2026-10-30

The checklist above records the state **before** implementation. The following is the current status.

### Completed

- [x] Preserved the existing visual identity, assets, page structure, server files and current branch. The public site and reusable service, destination, expert and article details now work independently of a server, including pricing, FAQ, consultation, contact, privacy and terms pages.
- [x] Completed English/Persian public and admin UI, language switching, `/fa` public URLs and RTL/LTR layouts. Dynamic sample content, validation, status labels, menus and dialogs are localized; editors must supply translations for newly authored content, and some optional fields fall back to English.
- [x] Added a browser-local mock adapter at `src/data/demoStore.ts` behind `src/lib/api.ts`, with separate bilingual sample content in `src/data/mock-content.ts`. Consultation and contact forms validate, show loading and save demo records locally with explicit no-submission notices.
- [x] Completed the demo admin login, dashboard, request search/filters/pagination, request details/status/notes, contact messages, sample payments/CSV, and `/admin/dashboard`, `/admin/requests` and `/admin/pricing` aliases. A guarded login now returns to the intended admin route, query and hash.
- [x] Completed local list, search/filter, view, add, edit, delete and confirmation workflows for services, destinations, packages, experts, articles and FAQs, plus categories and testimonials. Updates are reflected publicly. Added slug/currency/rating validation and browser-local image uploads (750 KB maximum).
- [x] Completed local settings for branding/logo, contact/social links, homepage, statistics, footer/CTA, SEO, language and verification notes; legal text can also be edited locally. Open tabs refresh their displayed data when another tab saves. Dialogs and mobile menus support Escape, contained keyboard focus and focus restoration.
- [x] Added persistent demo disclosures, placeholder legal copy, non-transactional payment pages, honest sample pricing and sample identity messaging. Added frontend-only setup and reset documentation in `README.md`.

### Partially completed / requires review

- [ ] Replace and independently verify all sample business details, team profiles, testimonials, claims, statistics, prices, destination requirements, photos and legal text. A qualified professional must review legal and immigration content; translations of future user-authored entries are not automatic.
- [ ] Browser-local data is not durable shared storage: clearing browser storage loses it, uploads count against browser quota, and simultaneous edits in different tabs can overwrite each other. Local CSV exports currently include at most the first 1,000 matching records.
- [ ] QA used headless Chromium and simulated viewports, not real devices, Safari/Firefox, assistive technologies or a full accessibility/security audit. Further cross-browser, accessibility, performance and real-device testing is needed before launch. The main production JS chunk is approximately 595 KB uncompressed and can be optimized later.

### Not implemented intentionally (outside frontend scope)

- [ ] Real authentication/authorization, a production API/database, server-side validation, email, secure/shared uploads, payment checkout/verification/refunds, backups and deployment hardening. The old server is retained but is **not** connected to the frontend demo, including when `npm run dev:full` is used.

### Verification performed

- `npm run typecheck` — passed for both frontend and existing server TypeScript projects.
- `npm run build` — passed (Vite production build).
- `LD_LIBRARY_PATH=/tmp/faratech-browser-libs/lib PLAYWRIGHT_CHROMIUM_EXECUTABLE=/tmp/chromium npm run test:e2e` — **30 passed** in Chromium. Covers bilingual public/admin routes, forms, local request/message handling, six CRUD workflows, filters/pagination/CSV, image uploads, settings/legal persistence, legacy-brand migration, local cross-tab updates, demo checkout, redirects, keyboard focus, dialogs and full-height mobile navigation in both directions.
- Additional headless route audit at 1440px: 18 public and 14 admin routes in each locale, with no captured page/console errors or document overflow; loaded public images had no broken sources. Responsive audit: 15 public and 12 admin routes in each locale at 320, 390, 768 and 1024px, with no captured console/page errors or document-level horizontal overflow. These ad hoc audits supplement, rather than replace, the automated Playwright tests.
- `git diff --check` — passed. The initial normal `npm ci` could not build the existing native SQLite dependency in this sandbox; `npm ci --ignore-scripts` worked for the frontend, which does not need SQLite.

### Run and readiness

```sh
npm ci --ignore-scripts
npm run dev
```

Open `http://localhost:5173`; the admin demo is at `/admin/login` with the prefilled `demo@applynow.example` / `demo` values. For normal local Playwright use, install Chromium via `npx playwright install chromium` and run `npm run test:e2e`. See `README.md` for storage keys, environment details and limitations.

**Readiness:** suitable for an interactive frontend demonstration and review, not for production use or real applicant information. The project branch has an open pull request; review its current commits to confirm which updates have been published.

### Branding and mobile navigation update — 2026-10-30

**Completed**

- [x] Renamed the default website identity to **Apply Now** and used the supplied Apply Now Immigration Group artwork in the public header, footer, mobile menu, administrator login and navigation, and favicon. Site settings can still override the public logo and name.
- [x] Updated default bilingual content, page metadata and sample contact addresses. Existing browser storage is retained; unchanged old-brand sample content is migrated while custom edits, uploaded logos and saved records are preserved for review.
- [x] Fixed the public mobile menu so the overlay and drawer cover the viewport rather than only the sticky header. Its header remains accessible, content scrolls independently, and it supports English and Persian, keyboard focus, Escape and backdrop dismissal. Both public and admin mobile navigation close and restore scrolling when resized to desktop width.
- [x] Fixed the settings logo-upload controls to fit narrow screens. Re-ran the full 30-test Chromium suite, typecheck, production build, desktop route audit and the 320/390/768/1024px responsive audit; all passed. The audits reported no captured page/console errors or document-level horizontal overflow.

**Partially completed / remaining**

- [ ] Review any previously customized branding, legal text and logo; custom values are intentionally not overwritten. Validate the result on physical mobile devices and additional browsers, including Safari and Firefox.
- [ ] Address the demo and production limitations above before launching the website.
