import { test, expect } from '@playwright/test';

test.describe('Cinematic SaaS Billing HUD', () => {
  test('displays animated KPI counters and tier cards', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('hollywood-billing')).toBeVisible();
    await expect(page.getByTestId('tile-enterprise')).toBeVisible();
  });
});