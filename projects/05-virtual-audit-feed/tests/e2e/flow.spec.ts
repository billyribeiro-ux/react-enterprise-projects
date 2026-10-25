import { test, expect } from '@playwright/test';

test.describe('Cyber Audit Feed', () => {
  test('renders table rows', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('audit-feed-root')).toBeVisible();
  });
});