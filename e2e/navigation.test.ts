import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('should navigate to main pages', async ({ page }) => {
    // Home page
    await page.goto('/');
    await expect(page).toHaveTitle(/EriEthio Research/);

    // Research page
    await page.click('text=Research');
    await expect(page).toHaveURL(/.*research/);
    await expect(page.locator('h1')).toContainText('Research Hub');

    // Products page
    await page.click('text=Products');
    await expect(page).toHaveURL(/.*products/);
    await expect(page.locator('h1')).toContainText('Products');

    // Education page
    await page.click('text=Education');
    await expect(page).toHaveURL(/.*education/);
    await expect(page.locator('h1')).toContainText('Education');
  });

  test('should handle authentication flow', async ({ page }) => {
    // Go to sign in page
    await page.goto('/auth/signin');
    await expect(page.locator('h2')).toContainText('Sign in to your account');

    // Try invalid credentials
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    await expect(page.locator('text=Invalid credentials')).toBeVisible();

    // Go to sign up page
    await page.click('text=Sign up');
    await expect(page).toHaveURL(/.*signup/);
    await expect(page.locator('h2')).toContainText('Create your account');
  });

  test('should handle theme switching', async ({ page }) => {
    await page.goto('/');
    
    // Open theme picker
    await page.click('button:has-text("Theme")');
    
    // Select a different theme
    await page.click('text=Ocean Breeze');
    
    // Verify theme change (check for specific color)
    const header = page.locator('nav');
    await expect(header).toHaveCSS('background-color', /rgba\(15, 23, 42/);
  });

  test('should handle responsive navigation', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check if mobile menu button is visible
    const menuButton = page.locator('button[aria-label="Menu"]');
    await expect(menuButton).toBeVisible();

    // Open mobile menu
    await menuButton.click();

    // Check if navigation links are visible
    await expect(page.locator('text=Research')).toBeVisible();
    await expect(page.locator('text=Products')).toBeVisible();
    await expect(page.locator('text=Education')).toBeVisible();

    // Close menu by clicking outside
    await page.click('text=EriEthio Research');
    
    // Verify menu is closed
    await expect(page.locator('text=Research')).not.toBeVisible();
  });
}); 