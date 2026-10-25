import { test, expect } from '@playwright/test';

test.describe('Job Queue Dashboard', () => {
  test('renders table', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('jobqueue-root')).toBeVisible();
  });
});