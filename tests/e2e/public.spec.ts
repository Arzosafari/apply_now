import { expect, test } from '@playwright/test';

const stamp = Date.now();
const email = `e2e.${stamp}@example.com`;

test.describe('public website', () => {
  test('home page loads with navigation and no horizontal overflow', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Your Global Journey');
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
    await expect(page.getByText('Popular destinations')).toBeVisible();
    const widths = await page.evaluate(() => ({
      scroll: document.documentElement.scrollWidth,
      client: document.documentElement.clientWidth,
    }));
    expect(widths.scroll).toBe(widths.client);
  });

  test('Persian locale switches the page to RTL and translated hero', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'FA', exact: true }).click();
    await expect(page).toHaveURL(/\/fa$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('سفر جهانی شما');
    await page.getByRole('button', { name: 'EN', exact: true }).click();
    await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');
  });

  test('mobile menu exposes navigation and consultation CTA', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Our Experts' }).last()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Get Free Consultation' }).last()).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeHidden();
  });

  test('service search and details prefill the consultation form', async ({ page }) => {
    await page.goto('/services');
    await page.getByPlaceholder('Search…').fill('visa');
    const serviceCard = page.locator('.service-card').filter({ hasText: 'Student Visa Assistance' }).first();
    await expect(serviceCard).toBeVisible();
    await serviceCard.click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Student Visa Assistance');
    await page.getByRole('link', { name: /Request consultation|Talk to an advisor/i }).first().click();
    await expect(page).toHaveURL(/consultation\?service=student-visa/);
    await expect(page.locator('#serviceId')).toHaveValue(/\d+/);
  });

  test('destination filtering and country page render', async ({ page }) => {
    await page.goto('/destinations');
    await page.getByPlaceholder('Search countries').fill('Canada');
    const destinationCard = page.getByRole('link', { name: 'Canada', exact: true }).first();
    await expect(destinationCard).toBeVisible();
    await destinationCard.click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Canada');
    await expect(page.getByText('Immigration pathways')).toBeVisible();
    await page.getByRole('button', { name: 'Work pathways' }).click();
    await expect(page.getByText('Employer-supported work permit')).toBeVisible();
  });

  test('consultation form validates then stores a request', async ({ page }) => {
    await page.goto('/consultation');
    await page.getByRole('button', { name: 'Submit request' }).click();
    await expect(page.getByText('This field is required.').first()).toBeVisible();
    await page.fill('#fullName', 'Playwright Applicant');
    await page.fill('#email', email);
    await page.fill('#phone', '+15550002222');
    await page.selectOption('#serviceId', { index: 1 });
    await page.selectOption('#destinationId', { index: 1 });
    await page.fill('#message', 'Automated end-to-end verification request.');
    await page.check('input[type=checkbox]');
    await page.getByRole('button', { name: 'Submit request' }).click();
    await expect(page.getByRole('heading', { name: 'Request received', level: 1 })).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/FT-\d{4}-[A-F0-9]{6}/)).toBeVisible();
  });

  test('contact form submits successfully', async ({ page }) => {
    await page.goto('/contact');
    await page.fill('#contact-name', 'Playwright Visitor');
    await page.fill('#contact-email', email);
    await page.fill('#contact-subject', 'Website verification');
    await page.fill('#contact-message', 'This is an automated contact form verification message.');
    await page.getByRole('button', { name: 'Send message' }).click();
    await expect(page.getByText(/Your message has been sent/i)).toBeVisible({ timeout: 15000 });
  });

  test('FAQ accordion, pricing and legal pages work', async ({ page }) => {
    await page.goto('/faq');
    const question = page.getByRole('button', { name: /Do you guarantee a visa or admission/ });
    await question.click();
    await expect(page.getByText(/No\. Decisions are made by governments/)).toBeVisible();
    await page.goto('/pricing');
    await expect(page.getByText('Complete Study Abroad Support')).toBeVisible();
    await page.goto('/privacy-policy');
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Privacy Policy');
  });
});
