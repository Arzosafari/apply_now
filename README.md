# Apply Now frontend preview

A bilingual (English/Persian, LTR/RTL) React and Vite preview for an immigration and study-abroad consultancy. The public site and management portal use **browser-local demonstration data**. This is not a production service: forms are not sent, payments are not processed, and the admin login is not secure authentication. Do not enter real credentials, personal details, or sensitive information.

## Run the frontend

Use Node.js 20.19+ or 22.12+ and npm. From the repository root:

```sh
npm ci --ignore-scripts
npm run dev
```

Open <http://localhost:5173>. The frontend preview does not require the existing server, database, environment variables, or payment credentials. `--ignore-scripts` avoids compiling the repository's existing native database dependency, which is unnecessary for the preview. If you intend to run the separate legacy server, install its native dependencies normally and configure it separately; this frontend still uses the mock adapter even when `dev:full` is running.

The management preview is at `/admin/login`. Its prefilled sample values are `demo@applynow.example` and `demo`; any valid-looking email and nonempty password open the same demo workspace. The session is a tab-local UI flag, not authentication. The EN/FA controls switch languages, and public Persian pages use the `/fa` URL prefix.

## Data and limitations

- `src/data/mock-content.ts` holds illustrative bilingual content; `src/data/demoStore.ts` implements the local adapter behind `src/lib/api.ts`. No frontend API requests are made in demo mode.
- Changes, sample uploads, notes, requests, messages, and settings are saved under the browser's `faratech_frontend_demo_v1` local-storage key. The demo session uses `faratech_demo_session` in session storage; `faratech_lang` stores the language preference. The legacy key names are retained to preserve existing data. Untouched old-brand sample text is updated automatically; custom text and logos are preserved and should be reviewed. Clear the relevant keys and reload to reset the associated demo state. Browser storage can be cleared, blocked, or exceed its quota; uploads are limited to 750 KB each. Open tabs refresh their displayed demo data when another tab saves; avoid simultaneous edits, which can overwrite one another.
- Form success means a record was saved **only in the current browser**. Nothing is emailed or submitted to an adviser. Payment records and prices are illustrative; checkout, receipts, refunds, and payment verification are not connected.
- Team profiles, testimonials, contact details, legal texts, prices, and destination requirements are samples and require business, professional, and legal review before any launch. Enter both English and Persian content for new items.
- The original server files are retained, but authentication, database, email, payment, and durable shared storage are outside this frontend-only implementation. Integrating a real backend requires replacing the mock transport and implementing and testing security and infrastructure separately.

## Verification

```sh
npm run typecheck
npm run build
npx playwright install chromium
npm run test:e2e
```

Playwright starts the frontend automatically if it is not already running. On Linux, the browser may need system libraries; see Playwright's installation guidance. If a suitable Chromium executable is already installed, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE` to its path. `PLAYWRIGHT_BASE_URL` can target an already-running preview.

See [FRONTEND_STATUS.md](./FRONTEND_STATUS.md) for the initial inspection, completion checklist, QA results, and remaining production work.
