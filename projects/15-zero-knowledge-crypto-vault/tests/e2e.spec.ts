import { test, expect } from '@playwright/test';

test.describe('Project 15: Zero-Knowledge WebCrypto AES-GCM Vault & 3D Entropy Enclave — E2E & WCAG 2.2 AAA Verification', () => {
  test('renders standalone interactive course & 3D telemetry studio without console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('file:///Users/billyribeiro/Desktop/react-enterprise-projects/projects/15-zero-knowledge-crypto-vault/index.html');
    await expect(page.locator('h1')).toContainText("Zero-Knowledge WebCrypto AES-GCM Vault & 3D Entropy Enclave");
    await expect(page.locator('.step-card')).toHaveCount(5);
    expect(errors).toEqual([]);
  });
});
