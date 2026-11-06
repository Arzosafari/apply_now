import type { Page } from '@playwright/test';

/** Older tests use English labels explicitly; let later user choices persist. */
export async function preferEnglishForExistingChecks(page: Page) {
  await page.addInitScript(() => {
    const marker = 'apply_now_e2e_language_initialized';
    if (!sessionStorage.getItem(marker)) {
      localStorage.setItem('faratech_lang', 'en');
      sessionStorage.setItem(marker, 'true');
    }
  });
}
