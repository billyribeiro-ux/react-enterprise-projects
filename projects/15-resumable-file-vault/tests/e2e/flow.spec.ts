import { test, expect } from '@playwright/test';

test.describe('Resumable Vault', () => {
  test('renders 3D vault canvas', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('vault-root')).toBeVisible();
    await expect(page.getByTestId('vault-canvas')).toBeVisible();
  });
});