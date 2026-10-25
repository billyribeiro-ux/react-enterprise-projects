import { test, expect } from '@playwright/test';

test.describe('Offline Notes', () => {
  test('renders notes root', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('offline-root')).toBeVisible();
  });
});