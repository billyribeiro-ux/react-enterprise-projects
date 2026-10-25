import { test, expect } from '@playwright/test';

test.describe('Inverted Search', () => {
  test('renders search UI', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('search-root')).toBeVisible();
  });
});