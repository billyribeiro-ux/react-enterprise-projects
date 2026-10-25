import { test, expect } from '@playwright/test';

test.describe('Collab Doc', () => {
  test('renders editor canvas', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('collab-root')).toBeVisible();
  });
});