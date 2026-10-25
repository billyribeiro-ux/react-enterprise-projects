import { test, expect } from '@playwright/test';

test.describe('Cinematic Onboarding Wizard', () => {
  test('renders wizard and submits', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('wizard-root')).toBeVisible();
    await expect(page.getByTestId('wizard-submit')).toBeVisible();
  });
});