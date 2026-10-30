import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath, headless: true });
await fs.mkdir('artifacts/visual', { recursive: true });
const pages = [
  ['home', '/', 1440, 1000, true],
  ['home-fa', '/fa', 1440, 1000, true],
  ['services', '/services', 1440, 1000, true],
  ['service-detail', '/services/study-abroad', 1440, 1000, true],
  ['destination-detail', '/destinations/canada', 1440, 1000, true],
  ['pricing', '/pricing', 1440, 1000, true],
  ['consultation', '/consultation', 1440, 1000, true],
  ['contact', '/contact', 1440, 1000, true],
  ['admin-login', '/admin/login', 1440, 1000, false],
  ['home-mobile', '/', 390, 844, true],
  ['consultation-mobile', '/consultation', 390, 844, true],
];
for (const [name, path, width, height, fullPage] of pages) {
  const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  const errors = [];
  page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle', timeout: 45000 });
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += Math.max(400, height - 120)) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(60);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  await page.screenshot({ path: `artifacts/visual/${name}.png`, fullPage, animations: 'disabled' });
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    brokenImages: [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src),
    h1: document.querySelector('h1')?.textContent?.trim(),
    dir: document.documentElement.dir,
    lang: document.documentElement.lang,
  }));
  console.log(JSON.stringify({ name, errors, metrics }));
  await context.close();
}
await browser.close();
