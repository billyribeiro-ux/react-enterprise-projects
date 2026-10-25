import { test, expect } from '@playwright/test';

test.describe('Kinetic Kanban Flow', () => {
  test('renders board and tasks', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('kanban-root')).toBeVisible();
  });
});