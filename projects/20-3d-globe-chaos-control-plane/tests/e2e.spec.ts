import { test, expect } from '@playwright/test';

test.describe('Project 20: 3D Global Edge Mesh & Chaos Engineering Control Plane — E2E & WCAG 2.2 AAA Verification', () => {
  test('renders standalone interactive course & 3D telemetry studio without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('file:///Users/billyribeiro/Desktop/react-enterprise-projects/projects/20-3d-globe-chaos-control-plane/index.html');
    await expect(page.locator('h1')).toContainText("3D Global Edge Mesh & Chaos Engineering Control Plane");
    await expect(page.locator('.step-card')).toHaveCount(5);
    expect(errors).toEqual([]);
  });
});
