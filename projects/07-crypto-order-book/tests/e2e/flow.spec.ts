import { test, expect } from '@playwright/test';

test.describe('3D Order Book', () => {
  test('renders 3D canvas viewport', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('orderbook-root')).toBeVisible();
    await expect(page.getByTestId('orderbook-canvas')).toBeVisible();
  });
});