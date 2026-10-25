import { test, expect } from '@playwright/test';

test.describe('AI Streaming Copilot', () => {
  test('renders prompt form', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('copilot-root')).toBeVisible();
  });
});