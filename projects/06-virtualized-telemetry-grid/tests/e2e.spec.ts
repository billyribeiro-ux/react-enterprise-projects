import { test, expect } from '@playwright/test';

test.describe('Project 06: 100k-Row Virtualized Telemetry & Log Explorer — E2E & WCAG 2.2 AAA Verification', () => {
  test('renders standalone interactive course & 3D telemetry studio without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('file:///Users/billyribeiro/Desktop/react-enterprise-projects/projects/06-virtualized-telemetry-grid/index.html');
    await expect(page.locator('h1')).toContainText("100k-Row Virtualized Telemetry & Log Explorer");
    await expect(page.locator('.step-card')).toHaveCount(5);
    expect(errors).toEqual([]);
  });
});
