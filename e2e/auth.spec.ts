import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login form on protected routes', async ({ page }) => {
    // Try to access admin page
    await page.goto('/admin');
    
    // Should be redirected to login
    await expect(page).toHaveURL(/.*login/);
    
    // Verify login form elements
    await expect(page.getByRole('heading')).toContainText(/Sign in/i);
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('should handle invalid login attempts', async ({ page }) => {
    await page.goto('/login');
    
    // Try invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Should show error message
    await expect(page.getByText(/invalid credentials/i)).toBeVisible();
    
    // Should still be on login page
    await expect(page).toHaveURL(/.*login/);
  });

  test('should allow user to sign out', async ({ page }) => {
    // First sign in with test credentials
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(process.env.TEST_USER_EMAIL || 'test@example.com');
    await page.getByLabel(/password/i).fill(process.env.TEST_USER_PASSWORD || 'testpass123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Verify successful login
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Sign out
    await page.getByRole('button', { name: /sign out/i }).click();
    
    // Should be redirected to home
    await expect(page).toHaveURL(/^\//);
    
    // Try to access protected route again
    await page.goto('/admin');
    await expect(page).toHaveURL(/.*login/);
  });
}); 