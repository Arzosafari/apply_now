import { expect, test } from '@playwright/test';

test.describe('admin portal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/admin/login');
    await page.fill('#admin-email', process.env.E2E_ADMIN_EMAIL || 'admin@faratech.example');
    await page.fill('#admin-password', process.env.E2E_ADMIN_PASSWORD || 'ChangeMe!2026');
    await page.getByRole('button', { name: /Sign in securely/i }).click();
    await expect(page).toHaveURL(/\/admin$/);
  });

  test('dashboard shows live database sections and navigation', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Dashboard', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Consultation requests', exact: true })).toBeVisible();
    await expect(page.getByText('Recent activity')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Consultations' })).toBeVisible();
    await page.screenshot({ path: 'artifacts/admin/dashboard-e2e.png', fullPage: true });
  });

  test('consultation request can be opened, updated and annotated', async ({ page }) => {
    await page.goto('/admin/consultations');
    await expect(page.getByRole('heading', { name: 'Consultation requests' })).toBeVisible();
    const firstReference = page.locator('table tbody tr').first().locator('a').first();
    await expect(firstReference).toBeVisible();
    await firstReference.click();
    await expect(page.getByText('Applicant information')).toBeVisible();
    await page.selectOption('select.admin-select', 'contacted');
    await page.getByRole('button', { name: 'Update status' }).click();
    await expect(page.getByText('Status updated.')).toBeVisible();
    await page.fill('textarea[placeholder^="Add a case note"]', 'E2E note: applicant contacted for an initial review.');
    await page.getByRole('button', { name: 'Add note' }).click();
    await expect(page.getByText('Internal note added.')).toBeVisible();
    await expect(page.getByText('E2E note: applicant contacted for an initial review.')).toBeVisible();
  });

  test('service resource can be created and deleted', async ({ page }) => {
    const slug = `e2e-test-${Date.now()}`;
    await page.goto('/admin/services');
    await page.getByRole('button', { name: /New service/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.fill('#field-slug', slug);
    await page.fill('#field-category_en', 'Testing');
    await page.fill('#field-category_fa', 'آزمایش');
    await page.getByRole('tab', { name: 'English' }).click();
    await page.fill('#field-title_en', 'E2E Test Service');
    await page.fill('#field-short_en', 'Created by the end-to-end verification suite.');
    await page.getByRole('tab', { name: 'Persian' }).click();
    await page.fill('#field-title_fa', 'خدمت آزمایشی');
    await page.fill('#field-short_fa', 'این خدمت برای آزمون خودکار ایجاد شده است.');
    await page.getByRole('button', { name: 'Save changes' }).click();
    await expect(page.getByText('Service saved.')).toBeVisible();
    await expect(page.getByText('E2E Test Service')).toBeVisible();

    const row = page.locator('table tbody tr', { hasText: 'E2E Test Service' }).first();
    await row.getByRole('button', { name: 'Delete Service' }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(page.getByText('Service deleted.')).toBeVisible();
    await expect(page.getByText('E2E Test Service')).toHaveCount(0);
  });

  test('payments, settings, legal and account pages load', async ({ page }) => {
    for (const [path, heading] of [
      ['/admin/payments', 'Payments'],
      ['/admin/settings', 'Website settings'],
      ['/admin/legal', 'Legal pages'],
      ['/admin/account', 'Account security'],
      ['/admin/messages', 'Contact messages'],
    ]) {
      await page.goto(path);
      await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();
    }

    await page.goto('/admin/settings');
    await page.getByRole('button', { name: 'Save settings', exact: true }).first().click();
    await expect(page.getByText('Website settings saved.')).toBeVisible();

    await page.goto('/admin/legal');
    await page.getByRole('button', { name: 'Save page', exact: true }).click();
    await expect(page.getByText('Legal page saved.')).toBeVisible();
  });

  test('admin navigation is usable on a mobile viewport without overflow', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/admin');
    await page.getByRole('button', { name: 'Open navigation' }).click();
    await expect(page.getByRole('navigation', { name: 'Admin navigation' })).toBeVisible();
    await page.getByRole('link', { name: 'Consultations' }).click();
    await expect(page.getByRole('heading', { name: 'Consultation requests' })).toBeVisible();
    const widths = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(widths.scroll).toBe(widths.client);
  });
});
