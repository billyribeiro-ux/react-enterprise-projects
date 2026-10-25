import { test, expect } from '@playwright/test';

test.describe('i18n CMS', () => {
  test('switches language', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('i18n-root')).toBeVisible();
    await page.getByTestId('lang-ar').click();
    await expect(page.getByTestId('i18n-root')).toHaveAttribute('dir', 'rtl');
  });
});