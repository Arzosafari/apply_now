import { expect, test, type Page } from '@playwright/test';

const publicRoutes: [string, string, string][] = [
  ['/', 'Your Global Journey', 'سفر جهانی شما'],
  ['/services', 'Services built', 'خدماتی برای'],
  ['/services/student-visa', 'Student Visa Assistance', 'ویزای تحصیلی'],
  ['/destinations', 'Countries, compared', 'مقایسه شفاف'],
  ['/destinations/canada', 'Canada', 'کانادا'],
  ['/pricing', 'Choose the support', 'پشتیبانی مناسب'],
  ['/experts', 'sample adviser team', 'مشاوران نمونه'],
  ['/experts/sample-senior-advisor', 'Sample Senior Advisor', 'مشاور ارشد نمونه'],
  ['/about', 'Guidance', 'راهنمایی'],
  ['/blog', 'journal', 'مجله'],
  ['/blog/building-a-realistic-study-abroad-shortlist', 'Realistic Study-Abroad Shortlist', 'فهرستی واقع‌بینانه'],
  ['/consultation', 'Tell us', 'بگویید'],
  ['/contact', 'talk', 'صحبت'],
  ['/faq', 'Answers', 'پاسخ'],
  ['/privacy-policy', 'Privacy Policy', 'سیاست حریم خصوصی'],
  ['/terms-and-conditions', 'Terms', 'شرایط و قوانین'],
];

async function expectNoOverflow(page: Page) {
  const widths = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth }));
  expect(widths.scroll, 'document should not scroll horizontally').toBeLessThanOrEqual(widths.client + 1);
}

test('public routes render in English and Persian without runtime errors', async ({ page }) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });
  for (const [path, en, fa] of publicRoutes) {
    for (const language of ['en', 'fa'] as const) {
      const url = language === 'fa' ? `/fa${path === '/' ? '' : path}` : path;
      await page.goto(url);
      await expect(page.locator('h1').first(), url).toContainText(language === 'fa' ? fa : en);
      await expect(page.locator('html')).toHaveAttribute('dir', language === 'fa' ? 'rtl' : 'ltr');
      await expectNoOverflow(page);
    }
  }
  expect(errors).toEqual([]);
});

test('language, navigation, filters, detail links and accordion work', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'FA', exact: true }).click();
  await expect(page).toHaveURL(/\/fa$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  await page.getByRole('button', { name: 'EN', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('dir', 'ltr');

  await page.goto('/services');
  await page.getByPlaceholder('Search…').fill('student visa');
  const service = page.locator('.service-card').filter({ hasText: 'Student Visa Assistance' });
  await expect(service).toBeVisible();
  await service.click();
  await expect(page.locator('h1').first()).toContainText('Student Visa Assistance');
  await page.getByRole('link', { name: /Request consultation|Talk to an advisor/i }).first().click();
  await expect(page).toHaveURL(/consultation\?service=student-visa/);
  await expect(page.locator('#serviceId')).toHaveValue(/\d+/);

  await page.goto('/destinations');
  await page.getByPlaceholder('Search countries').fill('Canada');
  await page.getByRole('link', { name: 'Canada', exact: true }).first().click();
  await expect(page.locator('h1').first()).toContainText('Canada');
  await page.getByRole('button', { name: 'Work pathways' }).click();
  await expect(page.getByText('Employer-supported work permit')).toBeVisible();

  await page.goto('/faq');
  const questions = page.locator('.accordion-trigger');
  await expect(questions.first()).toHaveAttribute('aria-expanded', 'true');
  await questions.nth(1).click();
  await expect(questions.first()).toHaveAttribute('aria-expanded', 'false');
  await expect(questions.nth(1)).toHaveAttribute('aria-expanded', 'true');
  await questions.nth(1).click();
  await expect(questions.nth(1)).toHaveAttribute('aria-expanded', 'false');
  await page.getByPlaceholder('Search questions').fill('How much does a consultation cost?');
  const priceQuestion = page.getByRole('button', { name: 'How much does a consultation cost?' });
  if (await priceQuestion.getAttribute('aria-expanded') !== 'true') await priceQuestion.click();
  await expect(page.getByText(/prices on the Pricing page are illustrative examples/)).toBeVisible();
  await page.getByPlaceholder('Search questions').fill('no-such-question-xyz');
  await expect(page.getByText('No questions match your search.')).toBeVisible();
});

test('consultation and contact validation save only local demo records', async ({ page }) => {
  const apiRequests: string[] = [];
  page.on('request', (request) => { if (new URL(request.url()).pathname.startsWith('/api/')) apiRequests.push(request.url()); });
  await page.goto('/consultation');
  await expect(page.getByText(/Demo form only/)).toBeVisible();
  await page.getByRole('button', { name: 'Save demo request' }).click();
  await expect(page.getByText('This field is required.').first()).toBeVisible();
  await page.locator('#fullName').fill('Demo Applicant');
  await page.locator('#email').fill('invalid');
  await page.locator('#phone').fill('12');
  await page.getByRole('button', { name: 'Save demo request' }).click();
  await expect(page.getByText('Enter a valid email address.')).toBeVisible();
  await expect(page.getByText('Enter a valid phone number.')).toBeVisible();
  await page.locator('#email').fill('applicant@example.com');
  await page.locator('#phone').fill('+15550100100');
  await page.locator('#serviceId').selectOption({ index: 1 });
  await page.locator('#destinationId').selectOption({ index: 1 });
  await page.locator('#message').fill('This is a test request containing no real personal information.');
  await page.locator('input[type=checkbox]').check();
  await page.getByRole('button', { name: 'Save demo request' }).click();
  await expect(page.locator('h1').first()).toContainText('Demo request saved locally');
  await expect(page.getByText(/was not sent to an adviser/).first()).toBeVisible();
  const reference = await page.locator('.font-mono').filter({ hasText: /DEMO-/ }).first().innerText();

  await page.goto('/contact');
  await page.getByRole('button', { name: 'Save demo message' }).click();
  await expect(page.getByText('This field is required.').first()).toBeVisible();
  await page.locator('#contact-name').fill('Demo Visitor');
  await page.locator('#contact-email').fill('visitor@example.com');
  await page.locator('#contact-phone').fill('1');
  await page.locator('#contact-subject').fill('Local demo message');
  await page.locator('#contact-message').fill('A sample message for browser-only testing.');
  await page.getByRole('button', { name: 'Save demo message' }).click();
  await expect(page.getByText('Enter a valid phone number.')).toBeVisible();
  await page.locator('#contact-phone').fill('+15550100200');
  await page.getByRole('button', { name: 'Save demo message' }).click();
  await expect(page.getByText('Demo complete. Your message stays in this browser and was not sent.')).toBeVisible();

  await page.goto('/admin/login');
  await page.getByRole('button', { name: 'Enter demo workspace' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto('/admin/requests');
  await page.getByPlaceholder(/Search reference, name, email or phone/).fill(reference);
  const request = page.locator('tbody tr').filter({ hasText: reference });
  await expect(request).toContainText('Demo Applicant');
  await request.locator('a').first().click();
  await expect(page.getByText('Applicant information')).toBeVisible();
  await page.locator('select.admin-select').selectOption('contacted');
  await page.getByRole('button', { name: 'Update status' }).click();
  await expect(page.getByText('Status updated.')).toBeVisible();
  await page.getByPlaceholder('Add a case note, next action or internal context…').fill('Local test note.');
  await page.getByRole('button', { name: 'Add note' }).click();
  await expect(page.getByText('Local test note.')).toBeVisible();
  await page.reload();
  await expect(page.getByText('Local test note.')).toBeVisible();
  await expect(page.locator('select.admin-select')).toHaveValue('contacted');

  await page.goto('/admin/messages');
  await expect(page.getByText('Local demo message')).toBeVisible();
  await page.getByRole('button', { name: 'View', exact: true }).click();
  await expect(page.getByRole('dialog')).toContainText('A sample message');
  await page.getByRole('button', { name: 'Mark as read' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.locator('tbody tr').filter({ hasText: 'Local demo message' })).toContainText('read');
  await page.getByRole('button', { name: 'View', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(apiRequests).toEqual([]);
});

test('mobile public menu and narrow RTL forms do not overflow', async ({ page }) => {
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 850 });
    for (const route of ['/', '/fa', '/consultation', '/fa/consultation', '/contact', '/fa/contact']) {
      await page.goto(route);
      await expect(page.locator('h1').first()).toBeVisible();
      await expectNoOverflow(page);
    }
  }
  await page.setViewportSize({ width: 390, height: 850 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
  await expect(page.getByRole('dialog').getByRole('link', { name: 'Our Experts' })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).toHaveCount(0);
});

test('Persian form validation and demo checkout disclose that nothing is sent or charged', async ({ page }) => {
  await page.goto('/fa/consultation');
  await page.getByRole('button', { name: 'ذخیره درخواست نمایشی' }).click();
  await expect(page.getByText('این فیلد الزامی است.').first()).toBeVisible();
  await expect(page.getByText('یک ایمیل معتبر وارد کنید.')).toBeVisible();
  await page.goto('/pricing');
  const card = page.locator('.pricing-card').filter({ hasText: 'University Application Assistance' });
  await card.getByRole('link').click();
  await expect(page).toHaveURL(/consultation\?package=university-application/);
  await page.locator('#fullName').fill('Demo Applicant');
  await page.locator('#email').fill('sample@example.com');
  await page.locator('#phone').fill('+15550100555');
  await page.locator('#serviceId').selectOption({ index: 1 });
  await page.locator('input[type=checkbox]').check();
  await page.getByRole('button', { name: 'Save demo request' }).click();
  await expect(page.getByText('Selected sample package', { exact: false })).toBeVisible();
  await expect(page.getByText('No payment has been made or requested.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue to secure payment' })).toHaveCount(0);
  await page.goto('/payment/success?session_id=example');
  await expect(page.locator('h1').first()).toContainText('Payment was not completed');
  await expect(page.getByText('Payments are not connected in this frontend preview.')).toBeVisible();
});

test('article copy link works in a secure browser context', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/blog/building-a-realistic-study-abroad-shortlist');
  await page.getByRole('button', { name: 'Copy link' }).click();
  await expect(page.getByRole('status')).toHaveText('Link copied.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain('/blog/building-a-realistic-study-abroad-shortlist');
});

test('service, destination and blog category filters update their results', async ({ page }) => {
  await page.goto('/services');
  await page.getByRole('button', { name: 'Visas', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Visas', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.service-card').filter({ hasText: 'Student Visa Assistance' })).toBeVisible();
  await expect(page.locator('.service-card').filter({ hasText: 'Study Abroad' })).toHaveCount(0);
  await page.goto('/destinations');
  await page.getByRole('button', { name: 'Work', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Work', exact: true })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.destination-card').first()).toBeVisible();
  await page.goto('/blog');
  await page.getByPlaceholder('Search articles').fill('evidence');
  await expect(page.getByRole('link', { name: /Student Visa Evidence Checklist/ }).first()).toBeVisible();
  await page.getByPlaceholder('Search articles').fill('no-article-matches-xyz');
  await expect(page.getByText('No articles match your search.')).toBeVisible();
});

test('mobile menu keeps keyboard focus inside and returns it to the toggle', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 850 });
  for (const path of ['/', '/fa']) {
    await page.goto(path);
    const toggle = page.getByRole('button', { name: path === '/' ? 'Menu' : 'منو', exact: true });
    await toggle.click();
    const dialog = page.getByRole('dialog', { name: path === '/' ? 'Menu' : 'منو' });
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
      expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
    }
    await page.keyboard.press('Escape');
    await expect(toggle).toBeFocused();
  }
});

test('Apply Now branding and the supplied logo appear across public and admin pages', async ({ page }) => {
  for (const path of ['/', '/about', '/blog', '/faq', '/services/student-visa', '/privacy-policy', '/fa', '/fa/about', '/fa/faq']) {
    await page.goto(path);
    await expect(page.locator('h1').first()).toBeVisible();
    await expect(page).toHaveTitle(/Apply Now/);
    await expect(page.locator('.site-header img.brand-logo')).toHaveAttribute('src', '/images/apply-now-logo.png');
    await expect(page.locator('.site-header img.brand-logo')).toHaveAttribute('alt', 'Apply Now');
    await expect(page.locator('footer img.brand-logo')).toHaveAttribute('src', '/images/apply-now-logo.png');
    expect(await page.locator('body').innerText(), path).not.toContain('FaraTech');
  }
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', '/apply-now-favicon.png');
  await page.goto('/admin/login');
  await expect(page.locator('img.brand-logo').first()).toHaveAttribute('src', '/images/apply-now-logo.png');
  await expect(page.locator('#admin-email')).toHaveValue('demo@applynow.example');
  await page.getByRole('button', { name: 'Enter demo workspace' }).click();
  await expect(page.locator('.admin-sidebar img.brand-logo')).toHaveAttribute('src', '/images/apply-now-logo.png');
  await expect(page.locator('.admin-sidebar img.brand-logo')).toHaveAttribute('alt', 'Apply Now');
});

test('mobile menu fills the viewport, scrolls, and stays usable in both directions', async ({ page }) => {
  test.setTimeout(120_000);
  for (const { width, height } of [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 768, height: 1024 }]) {
    await page.setViewportSize({ width, height });
    for (const language of ['en', 'fa'] as const) {
      await page.goto(language === 'fa' ? '/fa' : '/');
      await expect(page.locator('h1').first()).toBeVisible();
      await page.evaluate(() => window.scrollTo(0, 400));
      await page.getByRole('button', { name: language === 'fa' ? 'منو' : 'Menu', exact: true }).click();
      const dialog = page.getByRole('dialog', { name: language === 'fa' ? 'منو' : 'Menu' });
      await expect(dialog).toBeVisible();
      await expect(dialog.getByText(language === 'fa' ? 'یکشنبه تا پنجشنبه، ۹:۰۰ تا ۱۸:۰۰' : 'Sunday–Thursday, 9:00–18:00', { exact: true })).toHaveCount(1);
      const expectedX = language === 'fa' ? 0 : width - Math.min(width, 420);
      await expect.poll(async () => (await dialog.boundingBox())?.x).toBeCloseTo(expectedX, 0);
      const bounds = await dialog.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.y).toBeCloseTo(0, 0);
      expect(bounds!.height).toBeCloseTo(height, 0);
      expect(bounds!.width).toBeCloseTo(Math.min(width, 420), 0);
      expect(bounds!.x).toBeCloseTo(language === 'fa' ? 0 : width - bounds!.width, 0);
      const close = dialog.getByRole('button', { name: language === 'fa' ? 'بستن منو' : 'Close menu' });
      const contact = dialog.getByRole('navigation').getByRole('link', { name: language === 'fa' ? 'تماس با ما' : 'Contact Us', exact: true });
      await contact.scrollIntoViewIfNeeded();
      await expect(close).toBeVisible();
      const closeBounds = await close.boundingBox();
      expect(closeBounds && closeBounds.y >= 0 && closeBounds.y + closeBounds.height < height).toBeTruthy();
      await contact.click();
      await expect(page).toHaveURL(language === 'fa' ? /\/fa\/contact$/ : /\/contact$/);
      await expect(dialog).toHaveCount(0);
      await expectNoOverflow(page);
    }
  }
});

test('switching from mobile to desktop closes the menu and restores scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
  await page.setViewportSize({ width: 1200, height: 800 });
  await expect(page.getByRole('dialog', { name: 'Menu' })).toHaveCount(0);
  await expect(page.locator('body')).not.toHaveCSS('overflow', 'hidden');
  await expect(page.getByRole('navigation', { name: 'Primary', exact: true })).toBeVisible();
});

test('tablet menu animates from the correct side and closes on the backdrop', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 800 });
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  for (const [path, label, animation, backdropX] of [
    ['/', 'Menu', 'drawer-in', 10],
    ['/fa', 'منو', 'drawer-in-rtl', 758],
  ] as const) {
    await page.goto(path);
    const toggle = page.getByRole('button', { name: label, exact: true });
    await toggle.click();
    const panel = page.getByRole('dialog', { name: label });
    await expect(panel).toHaveCSS('animation-name', animation);
    await page.mouse.click(backdropX, 400);
    await expect(panel).toHaveCount(0);
    await expect(toggle).toBeFocused();
  }
});

test('homepage shows consultant profiles and localized links in both languages', async ({ page }) => {
  for (const [path, title, name, sample, viewAll] of [
    ['/', 'Meet our consultants', 'Sample Senior Advisor', 'Sample', 'View all consultants'],
    ['/fa', 'با مشاوران ما آشنا شوید', 'مشاور ارشد نمونه', 'نمونه', 'مشاهده همه مشاوران'],
  ] as const) {
    await page.goto(path);
    const section = page.getByRole('region', { name: title });
    await expect(section.getByRole('heading', { name: title })).toBeVisible();
    const cards = section.locator('.expert-card');
    await expect(cards).toHaveCount(4);
    await expect(cards.first().getByRole('heading', { name })).toBeVisible();
    await expect(section.getByText(sample, { exact: true })).toHaveCount(4);
    await expect(cards.first()).toHaveAttribute('href', path === '/' ? '/experts/sample-senior-advisor' : '/fa/experts/sample-senior-advisor');
    await expect(section.getByRole('link', { name: viewAll })).toHaveAttribute('href', path === '/' ? '/experts' : '/fa/experts');
    await cards.first().click();
    await expect(page.locator('h1').first()).toHaveText(name);
    await page.goto(path);
    await page.getByRole('region', { name: title }).getByRole('link', { name: viewAll }).click();
    await expect(page).toHaveURL(path === '/' ? /\/experts$/ : /\/fa\/experts$/);
  }
});

test('conversation image swaps sides and the smaller logo fits across viewports', async ({ page }) => {
  test.setTimeout(120_000);
  for (const width of [320, 390, 639, 640, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const locale of ['en', 'fa'] as const) {
      await page.goto(locale === 'fa' ? '/fa' : '/');
      const heading = page.getByRole('heading', { name: locale === 'fa' ? 'پرسش‌هایی را بیاورید که از پرسیدنشان می‌ترسیدید.' : 'Bring the questions you have been afraid to ask.', exact: true });
      await expect(heading).toBeVisible();
      const section = heading.locator('xpath=ancestor::section');
      const copy = await section.locator('.home-advice-copy').boundingBox();
      const image = await section.locator('.home-advice-image').boundingBox();
      expect(copy).not.toBeNull();
      expect(image).not.toBeNull();
      if (width >= 1024) {
        if (locale === 'fa') expect(image!.x + image!.width).toBeLessThanOrEqual(copy!.x + 1);
        else expect(copy!.x + copy!.width).toBeLessThanOrEqual(image!.x + 1);
      } else {
        expect(copy!.y + copy!.height).toBeLessThanOrEqual(image!.y + 1);
      }
      const logo = page.locator('.site-header img.brand-logo');
      await expect(logo).toHaveCSS('height', width < 640 ? '40px' : '44px');
      const logoBounds = await logo.boundingBox();
      expect(logoBounds && logoBounds.x >= 0 && logoBounds.x + logoBounds.width <= width).toBeTruthy();
      expect(logoBounds!.width / logoBounds!.height).toBeCloseTo(540 / 320, 2);
      await expectNoOverflow(page);
    }
  }
});

test('responsive logo fits the mobile menu, footer and admin layouts', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  for (const [path, menu, close] of [['/', 'Menu', 'Close menu'], ['/fa', 'منو', 'بستن منو']] as const) {
    await page.goto(path);
    const headerLogo = page.locator('.site-header img.brand-logo');
    await expect(headerLogo).toHaveCSS('height', '40px');
    await page.getByRole('button', { name: menu, exact: true }).click();
    const dialog = page.getByRole('dialog', { name: menu });
    const menuLogo = dialog.locator('img.brand-logo');
    await expect(menuLogo).toBeVisible();
    await expect(menuLogo).toHaveCSS('height', '40px');
    const menuBox = await dialog.boundingBox();
    const logoBox = await menuLogo.boundingBox();
    expect(menuBox && logoBox && logoBox.x >= menuBox.x && logoBox.x + logoBox.width <= menuBox.x + menuBox.width).toBeTruthy();
    await dialog.getByRole('button', { name: close }).click();
    const footerLogo = page.locator('footer .brand-lockup-light img.brand-logo');
    await expect(footerLogo).toHaveCSS('height', '40px');
    await expect(footerLogo).toHaveCSS('object-fit', 'contain');
    await expectNoOverflow(page);
  }

  await page.goto('/admin/login');
  await expect(page.locator('img.brand-logo:visible')).toHaveCSS('height', '40px');
  await page.getByRole('button', { name: 'Enter demo workspace' }).click();
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const adminLogo = page.locator('.admin-sidebar img.brand-logo');
  await expect(adminLogo).toBeVisible();
  await expect(adminLogo).toHaveCSS('height', '40px');
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(adminLogo).toHaveCSS('height', '44px');
  await expectNoOverflow(page);
});

test('wide configured logos remain contained on mobile and desktop', async ({ page }) => {
  const wideLogo = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="100"><rect width="1200" height="100" fill="#09264a"/></svg>')}`;
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto('/admin/login');
  await page.getByRole('button', { name: 'Enter demo workspace' }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await page.goto('/admin/settings');
  await page.getByLabel('Logo', { exact: true }).fill(wideLogo);
  await page.getByRole('button', { name: 'Save settings' }).first().click();
  await expect(page.getByText('Website settings saved.')).toBeVisible();
  await page.goto('/');
  const logo = page.locator('.site-header img.brand-logo');
  await expect(logo).toHaveAttribute('src', wideLogo);
  await expect(logo).toHaveJSProperty('naturalWidth', 1200);
  await expect(logo).toHaveCSS('height', '40px');
  await expect(logo).toHaveCSS('object-fit', 'contain');
  expect((await logo.boundingBox())!.width).toBeLessThanOrEqual(112);
  await page.getByRole('button', { name: 'Menu', exact: true }).click();
  const menuLogo = page.getByRole('dialog', { name: 'Menu' }).locator('img.brand-logo');
  expect((await menuLogo.boundingBox())!.width).toBeLessThanOrEqual(112);
  await page.getByRole('button', { name: 'Close menu' }).click();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(logo).toHaveCSS('height', '44px');
  expect((await logo.boundingBox())!.width).toBeLessThanOrEqual(120);
  await expectNoOverflow(page);
});
