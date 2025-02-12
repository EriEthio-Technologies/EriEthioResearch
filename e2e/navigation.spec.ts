import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to main pages', async ({ page }) => {
    // Home page
    await page.goto('/');
    await expect(page).toHaveTitle(/EriEthio Research/);
    
    // Education page
    await page.getByRole('link', { name: /education/i }).click();
    await expect(page).toHaveURL(/.*education/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Education/i);
    
    // Research page
    await page.getByRole('link', { name: /research/i }).click();
    await expect(page).toHaveURL(/.*research/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Research/i);
    
    // Products page
    await page.getByRole('link', { name: /products/i }).click();
    await expect(page).toHaveURL(/.*products/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Products/i);
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.getByRole('heading')).toContainText(/404/i);
    await expect(page).toHaveURL(/.*non-existent-page/);
  });
}); 