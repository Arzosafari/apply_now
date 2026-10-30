import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath, headless: true });
const results = [];

const pages = [
  ['home-desktop', '/', 1440, 1100, true],
  ['home-mobile', '/', 390, 844, true],
  ['services', '/services', 1440, 1000, true],
  ['service-detail', '/services/study-abroad', 1440, 1000, true],
  ['destinations', '/destinations', 1440, 1000, true],
  ['destination-detail', '/destinations/canada', 1440, 1000, true],
  ['pricing', '/pricing', 1440, 1000, true],
  ['experts', '/experts', 1440, 1000, true],
  ['about', '/about', 1440, 1000, true],
  ['blog', '/blog', 1440, 1000, true],
  ['article', '/blog/student-visa-evidence-checklist', 1440, 1000, true],
  ['consultation', '/consultation', 1440, 1000, true],
  ['contact', '/contact', 1440, 1000, true],
  ['faq', '/faq', 1440, 1000, true],
  ['home-fa', '/fa', 1440, 1100, true],
  ['consultation-mobile', '/consultation', 390, 844, true],
  ['admin-login', '/admin/login', 1440, 1000, false],
];

await fs.mkdir('artifacts', { recursive: true });

for (const [name, path, width, height, fullPage] of pages) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (error) => errors.push(`PAGEERROR ${error.message}`));
  const response = await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle', timeout: 45000 });
  await page.waitForTimeout(400);
  const documentHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < documentHeight; y += Math.max(300, height - 100)) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(90);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(500);
  await page.evaluate(async () => {
    await Promise.all(
      [...document.images].map((img) =>
        img.complete ? Promise.resolve() : new Promise((resolve) => {
          img.addEventListener('load', resolve, { once: true });
          img.addEventListener('error', resolve, { once: true });
        }),
      ),
    );
  });
  await page.waitForTimeout(300);
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    title: document.title,
    h1: document.querySelector('h1')?.textContent?.trim() || '',
    links: document.querySelectorAll('a').length,
    images: [...document.images].filter((img) => !img.complete || img.naturalWidth === 0).length,
  }));
  await page.screenshot({ path: `artifacts/${name}.png`, fullPage });
  results.push({ name, status: response?.status(), errors, overflow });
  console.log(JSON.stringify(results.at(-1)));
  await context.close();
}

await browser.close();
await fs.writeFile('artifacts/screenshot-report.json', JSON.stringify(results, null, 2));
