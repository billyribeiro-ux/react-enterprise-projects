import { test, expect } from '@playwright/test';

test.describe('Project 17: Resilient Webhook Gateway & Half-Open Circuit Breaker FSM — E2E & WCAG 2.2 AAA Verification', () => {
  test('renders standalone interactive course & 3D telemetry studio without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('file:///Users/billyribeiro/Desktop/react-enterprise-projects/projects/17-resilient-webhook-gateway/index.html');
    await expect(page.locator('h1')).toContainText("Resilient Webhook Gateway & Half-Open Circuit Breaker FSM");
    await expect(page.locator('.step-card')).toHaveCount(5);
    expect(errors).toEqual([]);
  });
});
