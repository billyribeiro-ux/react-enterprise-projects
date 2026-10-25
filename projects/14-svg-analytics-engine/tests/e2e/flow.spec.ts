import { test, expect } from '@playwright/test';

test.describe('SVG Vector Radar', () => {
  test('renders vector graph', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('radar-root')).toBeVisible();
    await expect(page.getByTestId('vector-svg')).toBeVisible();
  });
});