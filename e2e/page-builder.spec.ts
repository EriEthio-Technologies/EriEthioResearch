import { test, expect } from '@playwright/test';

test.describe('Page Builder', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin
    await page.goto('/login');
    await page.getByLabel(/email/i).fill(process.env.ADMIN_EMAIL || 'admin@example.com');
    await page.getByLabel(/password/i).fill(process.env.ADMIN_PASSWORD || 'adminpass123');
    await page.getByRole('button', { name: /sign in/i }).click();
    
    // Navigate to page builder
    await page.goto('/admin/pages/new');
  });

  test('should create a new page with basic components', async ({ page }) => {
    // Fill in page details
    await page.getByLabel(/page title/i).fill('Test Page');
    await page.getByLabel(/page slug/i).fill('test-page');
    
    // Add a heading component
    await page.getByRole('button', { name: /add component/i }).click();
    await page.getByRole('button', { name: /heading/i }).click();
    await page.getByLabel(/heading text/i).fill('Welcome to Test Page');
    
    // Add a text component
    await page.getByRole('button', { name: /add component/i }).click();
    await page.getByRole('button', { name: /text/i }).click();
    await page.getByLabel(/text content/i).fill('This is a test page created with the page builder.');
    
    // Save the page
    await page.getByRole('button', { name: /save page/i }).click();
    
    // Verify success message
    await expect(page.getByText(/page saved successfully/i)).toBeVisible();
    
    // Verify page was created
    await page.goto('/test-page');
    await expect(page.getByRole('heading')).toContainText('Welcome to Test Page');
    await expect(page.getByText(/this is a test page/i)).toBeVisible();
  });

  test('should edit an existing page', async ({ page }) => {
    // Navigate to edit page
    await page.goto('/admin/pages');
    await page.getByRole('link', { name: /test-page/i }).click();
    
    // Edit heading
    await page.getByLabel(/heading text/i).fill('Updated Test Page');
    
    // Save changes
    await page.getByRole('button', { name: /save changes/i }).click();
    
    // Verify success message
    await expect(page.getByText(/changes saved successfully/i)).toBeVisible();
    
    // Verify changes on public page
    await page.goto('/test-page');
    await expect(page.getByRole('heading')).toContainText('Updated Test Page');
  });

  test('should handle component reordering', async ({ page }) => {
    await page.goto('/admin/pages/new');
    
    // Add multiple components
    await page.getByRole('button', { name: /add component/i }).click();
    await page.getByRole('button', { name: /heading/i }).click();
    await page.getByLabel(/heading text/i).fill('First Heading');
    
    await page.getByRole('button', { name: /add component/i }).click();
    await page.getByRole('button', { name: /heading/i }).click();
    await page.getByLabel(/heading text/i).fill('Second Heading');
    
    // Drag second heading above first
    const secondHeading = page.getByText('Second Heading');
    const firstHeading = page.getByText('First Heading');
    await secondHeading.dragTo(firstHeading);
    
    // Save and verify order
    await page.getByRole('button', { name: /save page/i }).click();
    
    const headings = await page.getByRole('heading').all();
    await expect(headings[0]).toContainText('Second Heading');
    await expect(headings[1]).toContainText('First Heading');
  });
}); 