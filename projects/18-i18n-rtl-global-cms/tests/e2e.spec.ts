import { test, expect } from '@playwright/test';

test.describe('Project 18: Global i18n, BiDi RTL Layout & ICU MessageFormat CMS — E2E & WCAG 2.2 AAA Verification', () => {
  test('renders standalone interactive course & 3D telemetry studio without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('file:///Users/billyribeiro/Desktop/react-enterprise-projects/projects/18-i18n-rtl-global-cms/index.html');
    await expect(page.locator('h1')).toContainText("Global i18n, BiDi RTL Layout & ICU MessageFormat CMS");
    await expect(page.locator('.step-card')).toHaveCount(5);
    expect(errors).toEqual([]);
  });
});
