import { expect, test, type Page } from '@playwright/test';
import { preferEnglishForExistingChecks } from './locale-fixture';

async function login(page: Page) {
  await page.goto('/admin/login');
  await expect(page.getByText(/not secure authentication/i)).toBeVisible();
  await page.getByRole('button', { name: 'Enter demo workspace' }).click();
  await expect(page).toHaveURL(/\/admin$/);
}

test.beforeEach(async ({ page }) => {
  await preferEnglishForExistingChecks(page);
  await login(page);
});

test('admin routes, sample payment filters, downloads and locale switch', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  const routes: [string, string, string][] = [
    ['/admin/dashboard', 'Dashboard', 'داشبورد'],
    ['/admin/requests', 'Consultations', 'درخواست‌های مشاوره'],
    ['/admin/requests/1', 'Consultation detail', 'جزئیات درخواست'],
    ['/admin/services', 'Services', 'خدمات'],
    ['/admin/destinations', 'Destinations', 'مقاصد'],
    ['/admin/pricing', 'Packages', 'بسته‌ها'],
    ['/admin/experts', 'Experts', 'کارشناسان'],
    ['/admin/articles', 'Articles', 'مقالات'],
    ['/admin/faqs', 'FAQs', 'پرسش‌های متداول'],
    ['/admin/payments', 'Payments', 'پرداخت‌ها'],
    ['/admin/settings', 'Website settings', 'تنظیمات وب‌سایت'],
    ['/admin/messages', 'Contact messages', 'پیام‌های تماس'],
    ['/admin/legal', 'Legal pages', 'صفحات حقوقی'],
    ['/admin/account', 'Account security', 'امنیت حساب'],
  ];
  for (const [url, en] of routes) {
    await page.goto(url);
    await expect(page.locator('h1').first()).toHaveText(en);
    await expect(page.getByText('Local demo • no real authentication or payments')).toBeVisible();
  }
  await page.goto('/admin/payments');
  await expect(page.getByText(/No payment has been processed/)).toBeVisible();
  await page.getByLabel('Filter by status').selectOption('successful');
  await expect(page.locator('tbody tr').first()).toContainText('successful');
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  expect((await download).suggestedFilename()).toBe('apply-now-demo-payments.csv');

  await page.getByRole('button', { name: 'FA', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  for (const [url, , fa] of routes) {
    await page.goto(url);
    await expect(page.locator('h1').first()).toHaveText(fa);
    await expect(page.getByText('پیش‌نمایش محلی • بدون احراز هویت یا پرداخت واقعی')).toBeVisible();
  }
  await page.goto('/admin/services');
  await expect(page.getByRole('button', { name: 'خدمت جدید' })).toBeVisible();
  await page.getByRole('button', { name: 'خدمت جدید' }).click();
  await expect(page.getByRole('tab', { name: 'فارسی' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  expect(errors).toEqual([]);
});

type ResourceCase = {
  path: string;
  singular: string;
  enField: string;
  faField: string;
  basics?: Record<string, string>;
  enExtra?: Record<string, string>;
  faExtra?: Record<string, string>;
  publicPath?: string;
};

const resources: ResourceCase[] = [
  { path: 'services', singular: 'Service', enField: 'title_en', faField: 'title_fa', basics: { slug: 'demo-test-service' }, enExtra: { short_en: 'A sample service for automated verification.' }, faExtra: { short_fa: 'این یک خدمت نمونه برای آزمایش است.' }, publicPath: '/services/demo-test-service' },
  { path: 'destinations', singular: 'Destination', enField: 'name_en', faField: 'name_fa', basics: { slug: 'demo-test-country', country_code: 'XY' }, publicPath: '/destinations/demo-test-country' },
  { path: 'pricing', singular: 'Package', enField: 'name_en', faField: 'name_fa', basics: { slug: 'demo-test-package', price_minor: '125' }, publicPath: '/pricing' },
  { path: 'experts', singular: 'Expert', enField: 'role_en', faField: 'role_fa', basics: { slug: 'demo-test-expert', name: 'Demo test expert' }, publicPath: '/experts/demo-test-expert' },
  { path: 'articles', singular: 'Article', enField: 'title_en', faField: 'title_fa', basics: { slug: 'demo-test-article', status: 'published' }, publicPath: '/blog/demo-test-article' },
  { path: 'faqs', singular: 'FAQ', enField: 'question_en', faField: 'question_fa', enExtra: { answer_en: 'This is a test answer.' }, faExtra: { answer_fa: 'این پاسخ نمونه است.' }, publicPath: '/faq' },
];

for (const resource of resources) {
  test(`${resource.singular} can be created, viewed, edited, filtered and deleted`, async ({ page }) => {
    const title = `Demo test ${resource.singular}`;
    const edited = `${title} updated`;
    await page.goto(`/admin/${resource.path}`);
    await page.getByRole('button', { name: `New ${resource.singular.toLowerCase()}`, exact: true }).click();
    const drawer = page.getByRole('dialog');
    await expect(drawer).toBeVisible();
    for (const [field, value] of Object.entries(resource.basics || {})) {
      const input = drawer.locator(`#field-${field}`);
      if (field === 'status') await input.selectOption(value);
      else await input.fill(value);
    }
    await drawer.getByRole('tab', { name: 'English', exact: true }).click();
    await drawer.locator(`#field-${resource.enField}`).fill(title);
    for (const [field, value] of Object.entries(resource.enExtra || {})) await drawer.locator(`#field-${field}`).fill(value);
    await drawer.getByRole('tab', { name: 'Persian', exact: true }).click();
    await drawer.locator(`#field-${resource.faField}`).fill('نمونه آزمایشی');
    for (const [field, value] of Object.entries(resource.faExtra || {})) await drawer.locator(`#field-${field}`).fill(value);
    await drawer.getByRole('button', { name: 'Save changes' }).click();
    await expect(drawer).toHaveCount(0);
    await expect(page.getByText(`${resource.singular} saved.`)).toBeVisible();
    const rowName = resource.path === 'experts' ? 'Demo test expert' : title;
    const row = page.locator('tbody tr').filter({ hasText: rowName });
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: `View ${resource.singular}` }).click();
    await expect(page.getByRole('dialog')).toContainText(rowName);
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await row.getByRole('button', { name: `Edit ${resource.singular}` }).click();
    await page.getByRole('dialog').getByRole('tab', { name: 'English', exact: true }).click();
    await page.locator(`#field-${resource.enField}`).fill(edited);
    await page.getByRole('dialog').getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(row).toContainText(edited);
    await page.reload();
    await expect(page.locator('tbody tr').filter({ hasText: rowName })).toContainText(edited);
    await page.getByLabel('Filter publication status').selectOption('hidden');
    await expect(page.locator('tbody tr').filter({ hasText: rowName })).toHaveCount(0);
    await page.getByLabel('Filter publication status').selectOption('all');
    await expect(page.locator('tbody tr').filter({ hasText: rowName })).toBeVisible();

    if (resource.publicPath) {
      await page.goto(resource.publicPath);
      if (resource.path === 'experts') await expect(page.locator('h1').first()).toContainText('Demo test expert');
      else if (resource.path === 'pricing' || resource.path === 'faqs') await expect(page.getByText(edited).first()).toBeVisible();
      else await expect(page.locator('h1').first()).toContainText(edited);
      await page.goto(`/admin/${resource.path}`);
    }

    const finalRow = page.locator('tbody tr').filter({ hasText: rowName });
    await finalRow.getByRole('button', { name: `Delete ${resource.singular}` }).click();
    await expect(page.getByRole('dialog')).toContainText('browser');
    await page.getByRole('dialog').getByRole('button', { name: 'Cancel' }).click();
    await expect(finalRow).toBeVisible();
    await finalRow.getByRole('button', { name: `Delete ${resource.singular}` }).click();
    await page.getByRole('dialog').getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.locator('tbody tr').filter({ hasText: rowName })).toHaveCount(0);
  });
}

test('settings and legal changes persist locally and update the public site', async ({ page }) => {
  await page.goto('/admin/settings');
  await page.getByLabel('Company name', { exact: true }).fill('Demo Company');
  await page.getByLabel('Email address', { exact: true }).fill('demo@example.com');
  await page.getByRole('button', { name: 'Homepage', exact: true }).click();
  await page.getByLabel('Main headline (English)').fill('A new sample headline');
  await page.getByLabel('Hero', { exact: true }).clear();
  await page.getByLabel('Statistic 1 value').fill('99');
  await page.getByRole('button', { name: 'Footer & CTA' }).click();
  await page.getByLabel('Footer statement (English)').fill('A local sample footer statement.');
  await page.getByRole('button', { name: 'Save settings' }).first().click();
  await expect(page.getByText('Website settings saved.')).toBeVisible();
  await page.reload();
  await expect(page.getByLabel('Company name', { exact: true })).toHaveValue('Demo Company');
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('A new sample headline');
  await expect(page.locator('img.hero-image')).toHaveAttribute('src', '/images/hero-city.jpg');
  await expect(page.getByText('A local sample footer statement.')).toBeVisible();
  await page.goto('/contact');
  await expect(page.getByText('demo@example.com').first()).toBeVisible();

  await page.goto('/admin/legal');
  await expect(page.getByRole('button', { name: 'Save page' })).toBeVisible();
  await page.getByRole('button', { name: 'Save page' }).click();
  await expect(page.getByText('Legal page saved.')).toBeVisible();
});

test('mobile sidebar works in both directions without overflow', async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 850 });
    for (const route of ['/admin/dashboard', '/admin/requests', '/admin/destinations', '/admin/settings']) {
      await page.goto(route);
      await expect(page.locator('h1').first()).toBeVisible();
      const widths = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth]);
      expect(widths[0]).toBeLessThanOrEqual(widths[1] + 1);
    }
  }
  await page.setViewportSize({ width: 390, height: 850 });
  await page.goto('/admin/dashboard');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toBeVisible();
  await page.getByRole('link', { name: 'Consultations', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/requests/);
  await page.getByRole('button', { name: 'FA', exact: true }).click();
  await page.getByRole('button', { name: 'باز کردن منو' }).click();
  const sidebar = page.locator('.admin-sidebar');
  await expect(sidebar).toBeVisible();
  const box = await sidebar.boundingBox();
  expect(box && box.x >= 0 && box.x + box.width <= 390).toBeTruthy();
  await page.getByRole('link', { name: 'خدمات', exact: true }).click();
  await expect(page.locator('h1').first()).toHaveText('خدمات');
});

test('request pagination, filters, and CSV export use local records', async ({ page }) => {
  await page.goto('/admin/requests');
  await expect(page.locator('tbody tr')).toHaveCount(15);
  await expect(page.getByRole('button', { name: 'Previous page' })).toBeDisabled();
  await page.getByRole('button', { name: 'Next page' }).click();
  await expect(page).toHaveURL(/page=2/);
  await expect(page.locator('tbody tr')).toHaveCount(3);
  await page.getByRole('button', { name: 'Previous page' }).click();
  await expect(page.locator('tbody tr')).toHaveCount(15);
  await page.getByLabel('Filter by status').selectOption('pending');
  await expect(page.locator('tbody tr')).toHaveCount(3);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export CSV' }).click();
  expect((await download).suggestedFilename()).toBe('apply-now-demo-requests.csv');
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await expect(page.locator('tbody tr')).toHaveCount(15);
});

test('resource validation shows the correct tab and image upload stays local', async ({ page }) => {
  await page.goto('/admin/services');
  await page.getByRole('button', { name: 'New service' }).click();
  const drawer = page.getByRole('dialog');
  await drawer.locator('#field-slug').fill('Invalid Slug!');
  await drawer.getByRole('tab', { name: 'English', exact: true }).click();
  await drawer.locator('#field-title_en').fill('Upload test service');
  await drawer.locator('#field-short_en').fill('Sample description');
  await drawer.getByRole('tab', { name: 'Persian', exact: true }).click();
  await drawer.locator('#field-title_fa').fill('خدمت آزمایشی');
  await drawer.locator('#field-short_fa').fill('توضیح نمونه');
  await drawer.getByRole('button', { name: 'Save changes' }).click();
  await expect(drawer.getByText('Use lowercase letters, numbers and single hyphens.')).toBeVisible();
  await drawer.locator('#field-slug').fill('student-visa');
  await drawer.getByRole('button', { name: 'Save changes' }).click();
  await expect(drawer.getByText('This URL slug is already in use.')).toBeVisible();
  await drawer.locator('#field-slug').fill('upload-test-service');
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=', 'base64');
  await drawer.locator('input[type=file]').setInputFiles({ name: 'sample.png', mimeType: 'image/png', buffer: png });
  await expect(drawer.getByLabel('Service image URL')).toHaveValue(/^data:image\/png;base64,/);
  await drawer.getByRole('button', { name: 'Save changes' }).click();
  await expect(drawer).toHaveCount(0);
  await page.reload();
  const row = page.locator('tbody tr').filter({ hasText: 'Upload test service' });
  await expect(row).toBeVisible();
  await row.getByRole('button', { name: 'View Service' }).click();
  await expect(page.getByRole('dialog').getByRole('img', { name: 'Service image' })).toBeVisible();
  await page.keyboard.press('Escape');
  await row.getByRole('button', { name: 'Edit Service' }).click();
  await expect(page.getByLabel('Service image URL')).toHaveValue(/^data:image\/png;base64,/);
});

test('language default, logout and guarded routes behave as a local demo', async ({ page }) => {
  await page.goto('/admin/settings');
  await page.getByRole('button', { name: 'Language & verification' }).click();
  await page.getByLabel('Language default').selectOption('fa');
  await page.getByRole('button', { name: 'Save settings' }).first().click();
  await expect(page.getByText('Website settings saved.')).toBeVisible();
  // Check the configured default as a new visitor, rather than the test's explicit English choice.
  await page.evaluate(() => localStorage.removeItem('faratech_lang'));
  await page.goto('/');
  await expect(page).toHaveURL(/\/fa$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');

  await page.goto('/admin/dashboard');
  await page.getByRole('button', { name: 'Sign out' }).click();
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.goto('/admin/requests');
  await expect(page).toHaveURL(/\/admin\/login/);
  await page.getByRole('button', { name: 'Enter demo workspace' }).click();
  await expect(page).toHaveURL(/\/admin\/requests/);
});

test('configured English default is respected while explicit visitor preferences take priority', async ({ page }) => {
  await page.goto('/admin/settings');
  await page.getByRole('button', { name: 'Language & verification' }).click();
  const setting = page.getByLabel('Language default');
  await expect(setting).toHaveValue('fa');
  await setting.selectOption('en');
  await page.getByRole('button', { name: 'Save settings' }).first().click();
  await expect(page.getByText('Website settings saved.')).toBeVisible();
  await page.evaluate(() => localStorage.removeItem('faratech_lang'));
  await page.goto('/');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  await page.getByRole('button', { name: 'FA', exact: true }).click();
  await expect(page).toHaveURL(/\/fa$/);
  await page.goto('/');
  await expect(page).toHaveURL(/\/fa$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('resource drawer and confirmations fit narrow LTR and RTL screens', async ({ page }) => {
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 850 });
    for (const language of ['en', 'fa']) {
      await page.goto('/admin/services');
      const target = language === 'en' ? 'EN' : 'FA';
      if ((await page.locator('html').getAttribute('dir')) !== (language === 'en' ? 'ltr' : 'rtl')) {
        await page.getByRole('button', { name: target, exact: true }).click();
      }
      await page.getByRole('button', { name: language === 'en' ? 'New service' : 'خدمت جدید', exact: true }).click();
      const drawer = page.getByRole('dialog');
      await expect(drawer).toBeVisible();
      const box = await drawer.boundingBox();
      expect(box && box.x >= 0 && box.x + box.width <= width + 1).toBeTruthy();
      await expect(page.evaluate(() => document.documentElement.scrollWidth)).resolves.toBeLessThanOrEqual(width + 1);
      await page.keyboard.press('Escape');
      await expect(drawer).toHaveCount(0);
      const deleteButton = page.locator('tbody tr').first().getByRole('button', { name: language === 'en' ? 'Delete Service' : 'حذف خدمت' });
      await deleteButton.click();
      const confirm = page.getByRole('dialog');
      const modalBox = await confirm.boundingBox();
      expect(modalBox && modalBox.x >= 0 && modalBox.x + modalBox.width <= width + 1).toBeTruthy();
      await page.keyboard.press('Escape');
      await expect(confirm).toHaveCount(0);
    }
  }
});

test('advanced request filters, editable legal text and the password demo work', async ({ page }) => {
  await page.goto('/admin/requests');
  await page.getByRole('button', { name: 'Filters', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Filters', exact: true })).toHaveAttribute('aria-expanded', 'true');
  await page.getByRole('combobox', { name: 'Service', exact: true }).selectOption({ index: 1 });
  await expect(page).toHaveURL(/serviceId=/);
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.getByRole('combobox', { name: 'Destination', exact: true }).selectOption({ index: 1 });
  await expect(page).toHaveURL(/destinationId=/);
  await page.getByRole('button', { name: 'Reset', exact: true }).click();
  await page.getByLabel('From', { exact: true }).fill('2099-01-01');
  await expect(page.getByText('No consultation requests match these filters.')).toBeVisible();

  await page.goto('/admin/legal');
  await page.getByLabel('English content').fill('## Demo notice\n\nThis local legal text is only a test.');
  await page.getByRole('button', { name: 'Save page' }).click();
  await expect(page.getByText('Legal page saved.')).toBeVisible();
  await page.goto('/privacy-policy');
  await expect(page.getByText('This local legal text is only a test.')).toBeVisible();

  await page.goto('/admin/account');
  await page.getByRole('button', { name: 'Update password' }).click();
  await expect(page.getByText('Enter your current password.')).toBeVisible();
  await page.getByLabel('Current password').fill('not-a-real-password');
  await page.getByLabel('New password', { exact: true }).fill('DemoPassword123');
  await page.getByLabel('Confirm new password').fill('DemoPassword123');
  await page.getByRole('button', { name: 'Update password' }).click();
  await expect(page.getByText('Demo only: no password was changed.')).toBeVisible();
});

test('browser-local changes update another open tab without a refresh', async ({ page, context }) => {
  const visitor = await context.newPage();
  await visitor.goto('/');
  await expect(visitor.locator('h1')).toContainText('Your Global Journey');

  await page.goto('/admin/settings');
  await page.getByRole('button', { name: 'Homepage', exact: true }).click();
  await page.getByLabel('Main headline (English)').fill('A shared browser demo headline');
  await page.getByRole('button', { name: 'Save settings' }).first().click();
  await expect(visitor.locator('h1')).toContainText('A shared browser demo headline');

  await visitor.goto('/contact');
  await visitor.locator('#contact-name').fill('Cross tab example');
  await visitor.locator('#contact-email').fill('visitor@example.com');
  await visitor.locator('#contact-subject').fill('Cross tab local message');
  await visitor.locator('#contact-message').fill('This sample stays in browser storage.');
  await visitor.getByRole('button', { name: 'Save demo message' }).click();
  await expect(visitor.getByText(/message stays in this browser/)).toBeVisible();
  await page.goto('/admin/messages');
  await expect(page.locator('tbody')).toContainText('Cross tab local message');
  await visitor.close();
});

test('keyboard focus is contained and restored in admin dialogs and mobile navigation', async ({ page }) => {
  await page.goto('/admin/services');
  const create = page.getByRole('button', { name: 'New service' });
  await create.click();
  const drawer = page.getByRole('dialog');
  const drawerClose = drawer.getByRole('button', { name: 'Close', exact: true });
  const save = drawer.getByRole('button', { name: 'Save changes' });
  await expect(drawerClose).toBeFocused();
  await save.focus();
  await page.keyboard.press('Tab');
  await expect(drawerClose).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(save).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(create).toBeFocused();

  const remove = page.locator('tbody tr').first().getByRole('button', { name: 'Delete Service' });
  await remove.click();
  const confirmation = page.getByRole('dialog');
  const cancel = confirmation.getByRole('button', { name: 'Cancel' });
  const confirm = confirmation.getByRole('button', { name: 'Delete', exact: true });
  await expect(cancel).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(confirm).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(remove).toBeFocused();

  await page.setViewportSize({ width: 390, height: 850 });
  await page.goto('/admin/dashboard');
  const toggle = page.getByRole('button', { name: 'Open navigation' });
  await toggle.click();
  const navigation = page.getByRole('dialog', { name: 'Admin navigation' });
  await expect(navigation).toBeVisible();
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press('Tab');
    expect(await navigation.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press('Escape');
  await expect(toggle).toBeFocused();
});

test('legacy sample branding is updated without losing saved data or custom logos', async ({ page }) => {
  await page.goto('/admin/settings');
  await page.getByRole('button', { name: 'Save settings' }).first().click();
  await expect(page.getByText('Website settings saved.')).toBeVisible();
  await page.evaluate(() => {
    const key = 'faratech_frontend_demo_v1';
    const stored = JSON.parse(localStorage.getItem(key)!);
    stored.settings.brand.name = 'FaraTech';
    stored.settings.brand.legalName = 'FaraTech Global Mobility';
    stored.settings.brand.email = 'contact@faratech.example';
    stored.settings.brand.logoUrl = '';
    stored.settings.seo.title = 'FaraTech — Immigration & Study Abroad Consultancy';
    stored.settings.hero.title = 'My preserved demo heading';
    stored.settings.hero.description = 'Custom FaraTech copy must be preserved.';
    stored.consultations[0].full_name = 'Retained sample record';
    const service = stored.services.find((item: { slug: string }) => item.slug === 'student-visa');
    service.timeline_en = service.timeline_en.replaceAll('Apply Now', 'FaraTech');
    const article = stored.articles.find((item: { slug: string }) => item.slug === 'building-a-realistic-study-abroad-shortlist');
    article.author = 'FaraTech Editorial';
    const faq = stored.faqs.find((item: { question_en: string }) => item.question_en === 'What does Apply Now do?');
    for (const field of ['question_en', 'question_fa', 'answer_en', 'answer_fa']) faq[field] = faq[field].replaceAll('Apply Now', 'FaraTech');
    const legal = stored.legal.find((item: { slug: string }) => item.slug === 'privacy-policy');
    legal.body_en = legal.body_en.replaceAll('Apply Now', 'FaraTech');
    localStorage.setItem(key, JSON.stringify(stored));
  });
  await page.goto('/');
  await expect(page.locator('h1')).toContainText('My preserved demo heading');
  await expect(page.getByText('Custom FaraTech copy must be preserved.')).toBeVisible();
  await expect(page.locator('.site-header img.brand-logo')).toHaveAttribute('src', '/images/apply-now-logo.png');
  await expect(page).toHaveTitle(/Apply Now/);
  await page.goto('/faq');
  await expect(page.getByRole('button', { name: 'What does Apply Now do?' })).toBeVisible();
  await page.goto('/blog/building-a-realistic-study-abroad-shortlist');
  await expect(page.getByText('Apply Now Editorial')).toBeVisible();
  await page.goto('/privacy-policy');
  await expect(page.getByText(/Forms in this preview do not contact Apply Now/)).toBeVisible();
  await page.goto('/admin/requests');
  await page.getByPlaceholder(/Search reference, name, email or phone/).fill('Retained sample record');
  await expect(page.locator('tbody')).toContainText('Retained sample record');

  await page.goto('/admin/settings');
  await page.evaluate(() => {
    const key = 'faratech_frontend_demo_v1';
    const stored = JSON.parse(localStorage.getItem(key)!);
    stored.settings.brand.logoUrl = '/images/office.jpg';
    localStorage.setItem(key, JSON.stringify(stored));
  });
  await page.reload();
  await expect(page.getByLabel('Company name', { exact: true })).toHaveValue('Apply Now');
  await expect(page.getByLabel('Logo', { exact: true })).toHaveValue('/images/office.jpg');
  await page.getByLabel('Company name', { exact: true }).fill('Custom Company');
  await page.getByRole('button', { name: 'Save settings' }).first().click();
  await page.goto('/about');
  await expect(page.locator('.site-header img.brand-logo')).toHaveAttribute('src', '/images/office.jpg');
  await expect(page.locator('.site-header img.brand-logo')).toHaveAttribute('alt', 'Custom Company');
  await expect(page).toHaveTitle(/Custom Company/);
});

test('admin mobile navigation closes when returning to desktop width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/admin/dashboard');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  await expect(page.getByRole('dialog', { name: 'Admin navigation' })).toBeVisible();
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect(page.getByRole('dialog', { name: 'Admin navigation' })).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toBeVisible();
});

test('testimonial carousel shows all published comments and hides drafts', async ({ page }) => {
  await page.goto('/admin/settings');
  await page.getByRole('button', { name: 'Save settings' }).first().click();
  await expect(page.getByText('Website settings saved.')).toBeVisible();
  await page.evaluate(() => {
    const key = 'faratech_frontend_demo_v1';
    const stored = JSON.parse(localStorage.getItem(key)!);
    const sample = stored.testimonials[0];
    stored.testimonials.push({ ...sample, id: 500, name: 'Fourth sample', name_fa: 'نمونه چهارم', published: true, sort_order: 500 });
    stored.testimonials.push({ ...sample, id: 501, name: 'Unpublished sample', name_fa: 'نمونه منتشرنشده', published: false, sort_order: 501 });
    localStorage.setItem(key, JSON.stringify(stored));
  });
  await page.goto('/');
  let carousel = page.locator('.card-carousel-testimonials');
  await expect(carousel.locator('.testimonial-card')).toHaveCount(4);
  await expect(carousel).toContainText('Fourth sample');
  await expect(carousel).not.toContainText('Unpublished sample');
  await page.goto('/fa');
  carousel = page.locator('.card-carousel-testimonials');
  await expect(carousel.locator('.testimonial-card')).toHaveCount(4);
  await expect(carousel).toContainText('نمونه چهارم');

  await page.evaluate(() => {
    const key = 'faratech_frontend_demo_v1';
    const stored = JSON.parse(localStorage.getItem(key)!);
    stored.testimonials.forEach((item: { published: boolean }, index: number) => { item.published = index === 0; });
    localStorage.setItem(key, JSON.stringify(stored));
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  await expect(carousel.locator('.testimonial-card')).toHaveCount(1);
  await expect(carousel.locator('.card-carousel-controls')).toHaveCount(0);
  const track = carousel.locator('.card-carousel-track');
  expect(await track.evaluate((element) => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(1);

  await page.evaluate(() => {
    const key = 'faratech_frontend_demo_v1';
    const stored = JSON.parse(localStorage.getItem(key)!);
    stored.testimonials.forEach((item: { published: boolean }) => { item.published = false; });
    localStorage.setItem(key, JSON.stringify(stored));
  });
  await page.reload();
  await expect(page.locator('.card-carousel-testimonials')).toHaveCount(0);
});

test('homepage consultants follow admin publication and display order', async ({ page }) => {
  await page.goto('/admin/experts');
  await page.getByRole('button', { name: 'New expert', exact: true }).click();
  const drawer = page.getByRole('dialog');
  await drawer.locator('#field-slug').fill('homepage-test-consultant');
  await drawer.locator('#field-name').fill('Homepage Test Consultant');
  await drawer.locator('#field-sort_order').fill('0');
  await drawer.getByRole('tab', { name: 'English', exact: true }).click();
  await drawer.locator('#field-role_en').fill('Test Consultant');
  await drawer.getByRole('tab', { name: 'Persian', exact: true }).click();
  await drawer.locator('#field-role_fa').fill('مشاور آزمایشی');
  await drawer.getByRole('button', { name: 'Save changes' }).click();
  await expect(drawer).toHaveCount(0);

  await page.goto('/');
  const section = page.getByRole('region', { name: 'Meet our consultants' });
  await expect(section.locator('.expert-card')).toHaveCount(4);
  await expect(section.locator('.expert-card').first()).toContainText('Homepage Test Consultant');
  await expect(section.locator('.expert-card').first()).toHaveAttribute('href', '/experts/homepage-test-consultant');

  await page.goto('/admin/experts');
  const row = page.locator('tbody tr').filter({ hasText: 'Homepage Test Consultant' });
  await row.getByRole('button', { name: 'Edit Expert' }).click();
  await page.getByRole('dialog').locator('#field-published').uncheck();
  await page.getByRole('dialog').getByRole('button', { name: 'Save changes' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.goto('/');
  await expect(page.getByRole('region', { name: 'Meet our consultants' })).not.toContainText('Homepage Test Consultant');
  await expect(page.getByRole('region', { name: 'Meet our consultants' }).locator('.expert-card')).toHaveCount(4);

  // An empty published list should not leave an empty section on the homepage.
  await page.evaluate(() => {
    const key = 'faratech_frontend_demo_v1';
    const stored = JSON.parse(localStorage.getItem(key)!);
    stored.experts.forEach((expert: { published: boolean }) => { expert.published = false; });
    localStorage.setItem(key, JSON.stringify(stored));
  });
  await page.reload();
  await expect(page.getByRole('region', { name: 'Meet our consultants' })).toHaveCount(0);
});
