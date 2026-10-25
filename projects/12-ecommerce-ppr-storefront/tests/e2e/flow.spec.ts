import { test, expect } from '@playwright/test';

test.describe('PPR Storefront', () => {
  test('renders products', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('storefront-root')).toBeVisible();
  });
});