import { test, expect } from '@playwright/test';

test.describe('RBAC Gateway', () => {
  test('renders authorization shield', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('rbac-root')).toBeVisible();
  });
});