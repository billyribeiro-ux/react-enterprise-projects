import { test, expect } from '@playwright/test';

test.describe('Module Federation Shell', () => {
  test('renders shell', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('mfe-root')).toBeVisible();
  });
});