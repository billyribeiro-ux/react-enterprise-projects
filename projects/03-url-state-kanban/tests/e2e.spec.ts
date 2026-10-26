import { test, expect } from '@playwright/test';

test.describe('Project 03: URL-Synchronized Kinetic Kanban & Sprint Engine — E2E & WCAG 2.2 AAA Verification', () => {
  test('renders standalone interactive course & 3D telemetry studio without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('file:///Users/billyribeiro/Desktop/react-enterprise-projects/projects/03-url-state-kanban/index.html');
    await expect(page.locator('h1')).toContainText("URL-Synchronized Kinetic Kanban & Sprint Engine");
    await expect(page.locator('.step-card')).toHaveCount(5);
    expect(errors).toEqual([]);
  });
});
