import { test, expect } from './test-setup';

test.describe('Authentication', () => {
  test('should show login form on protected routes', async ({ page }) => {
    // Try to access admin page
    await page.goto('/admin');
    
    // Should be redirected to signin
    await expect(page).toHaveURL(/.*signin/);
    
    // Verify login form elements
    await expect(page.getByRole('heading', { name: /sign in to your account/i })).toBeVisible();
    await expect(page.getByRole('textbox', { name: /email/i })).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should handle invalid login attempts', async ({ page }) => {
    await page.goto('/auth/signin');
    
    // Try invalid credentials
    await page.getByRole('textbox', { name: /email/i }).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
    
    // Should still be on signin page
    await expect(page).toHaveURL(/.*signin/);
  });

  test('should allow navigation to protected routes when authenticated', async ({ authenticatedPage: page }) => {
    // Try to access protected route
    await page.goto('/dashboard');
    
    // Should be allowed to access
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/welcome/i);
  });

  test('should allow admin access to admin pages', async ({ adminPage: page }) => {
    // Try to access admin page
    await page.goto('/admin');
    
    // Should be allowed to access
    await expect(page).toHaveURL(/.*admin/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(/admin dashboard/i);
  });

  test('should handle sign out', async ({ authenticatedPage: page }) => {
    await page.goto('/dashboard');
    
    // Open user menu and sign out
    await page.getByRole('button', { name: /user menu/i }).click();
    await page.getByRole('button', { name: /sign out/i }).click();
    
    // Should be redirected to home
    await expect(page).toHaveURL(/^\//);
    
    // Try to access protected route again
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/.*signin/);
  });
}); 