import { test, expect } from '@playwright/test';

test.describe('Stripe Webhook Engine', () => {
  test('renders webhook monitor', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('webhook-root')).toBeVisible();
  });
});