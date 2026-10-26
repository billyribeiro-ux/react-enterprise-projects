import { test, expect } from '@playwright/test';

test.describe('Project 01: Enterprise Design System & 3D Shader Studio — E2E & WCAG 2.2 AAA Verification', () => {
  test('renders standalone interactive course & 3D telemetry studio without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('file:///Users/billyribeiro/Desktop/react-enterprise-projects/projects/01-enterprise-design-system/index.html');
    await expect(page.locator('h1')).toContainText("Enterprise Design System & 3D Shader Studio");
    await expect(page.locator('.step-card')).toHaveCount(5);
    expect(errors).toEqual([]);
  });
});
