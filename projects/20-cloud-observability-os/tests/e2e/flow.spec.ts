import { test, expect } from '@playwright/test';

test.describe('Observability OS Capstone', () => {
  test('renders 3D globe and flamegraph', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('apm-root')).toBeVisible();
    await expect(page.getByTestId('globe-canvas')).toBeVisible();
  });
});