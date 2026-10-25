import { test, expect } from '@playwright/test';

test.describe('3D Audio DAW', () => {
  test('renders 3D audio ribbon canvas', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('daw-root')).toBeVisible();
    await expect(page.getByTestId('audio-canvas')).toBeVisible();
  });
});