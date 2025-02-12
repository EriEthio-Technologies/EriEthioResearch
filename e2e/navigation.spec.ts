import { test, expect } from './test-setup';

test.describe('Navigation', () => {
  test('should navigate to main pages', async ({ page }) => {
    // Home page
    await page.goto('/');
    await expect(page).toHaveTitle(/EriEthio Research/);
    
    // Education page
    const educationLink = page.getByRole('link', { name: /education/i });
    await expect(educationLink).toBeVisible();
    await educationLink.click();
    await expect(page).toHaveURL(/.*education/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Learn & Grow/i);
    
    // Research page
    const researchLink = page.getByRole('link', { name: /research/i });
    await expect(researchLink).toBeVisible();
    await researchLink.click();
    await expect(page).toHaveURL(/.*research/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Research Hub/i);
    
    // Products page
    const productsLink = page.getByRole('link', { name: /products/i });
    await expect(productsLink).toBeVisible();
    await productsLink.click();
    await expect(page).toHaveURL(/.*products/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/Products/i);
  });

  test('should handle 404 pages gracefully', async ({ page }) => {
    await page.goto('/non-existent-page');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
    await expect(page.getByText(/page could not be found/i)).toBeVisible();
    await expect(page).toHaveURL(/.*non-existent-page/);
  });

  test('should handle responsive navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if mobile menu button is visible
    const menuButton = page.getByRole('button', { name: /toggle menu/i });
    await expect(menuButton).toBeVisible();

    // Open mobile menu
    await menuButton.click();

    // Check if navigation links are visible in mobile menu
    await expect(page.getByRole('link', { name: /research/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /products/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /education/i })).toBeVisible();

    // Close menu by clicking outside
    await page.getByRole('link', { name: /eriethio research/i }).click();
    
    // Verify menu is closed
    await expect(page.getByRole('link', { name: /research/i })).not.toBeVisible();
  });

  test('should handle theme switching', async ({ page }) => {
    await page.goto('/');
    
    // Open theme menu
    const themeButton = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeButton).toBeVisible();
    await themeButton.click();
    
    // Select dark theme
    const darkThemeButton = page.getByRole('button', { name: /dark theme/i });
    await expect(darkThemeButton).toBeVisible();
    await darkThemeButton.click();
    
    // Verify theme change
    await expect(page.locator('html')).toHaveAttribute('class', /dark/);
  });
}); 