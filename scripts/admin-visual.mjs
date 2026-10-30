import { chromium } from 'playwright';
import fs from 'node:fs/promises';

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const browser = await chromium.launch({ executablePath, headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
page.on('console', (message) => message.type() === 'error' && errors.push(message.text()));
page.on('pageerror', (error) => errors.push(error.message));

await page.goto('http://127.0.0.1:4000/admin/login', { waitUntil: 'networkidle' });
await page.fill('#admin-email', 'admin@faratech.example');
await page.fill('#admin-password', 'ChangeMe!2026');
await page.click('button[type=submit]');
await page.waitForURL('**/admin', { timeout: 15000 });
await page.waitForTimeout(800);
await fs.mkdir('artifacts/admin', { recursive: true });
await page.screenshot({ path: 'artifacts/admin/dashboard.png', fullPage: true, animations: 'disabled' });

for (const [name, path] of [
  ['consultations', '/admin/consultations'],
  ['services', '/admin/services'],
  ['settings', '/admin/settings'],
  ['payments', '/admin/payments'],
  ['messages', '/admin/messages'],
]) {
  await page.goto(`http://127.0.0.1:4000${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `artifacts/admin/${name}.png`, fullPage: false, animations: 'disabled' });
  console.log(name, page.url(), await page.title());
}

await page.goto('http://127.0.0.1:4000/admin/services', { waitUntil: 'networkidle' });
await page.waitForTimeout(400);
const firstEdit = page.locator('table tbody tr').first().locator('button[aria-label="Edit Service"]');
if (await firstEdit.count()) {
  await firstEdit.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'artifacts/admin/service-drawer.png', fullPage: false, animations: 'disabled' });
}

console.log('ERRORS', JSON.stringify(errors));
await browser.close();
