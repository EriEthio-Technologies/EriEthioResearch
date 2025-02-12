import { test, expect } from './test-setup';

test.describe('Page Builder', () => {
  test.beforeEach(async ({ adminPage: page }) => {
    // Navigate to page builder
    await page.goto('/admin/pages/new');
    await expect(page).toHaveURL(/.*pages\/new/);
  });

  test('should create a new page with basic components', async ({ adminPage: page }) => {
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
    
    // Verify page was created by visiting it
    await page.goto('/test-page');
    await expect(page.getByRole('heading')).toContainText('Welcome to Test Page');
    await expect(page.getByText(/this is a test page/i)).toBeVisible();
  });

  test('should edit an existing page', async ({ adminPage: page }) => {
    // Create a test page first
    await test.step('Create test page', async () => {
      await page.goto('/admin/pages/new');
      await page.getByLabel(/page title/i).fill('Edit Test Page');
      await page.getByLabel(/page slug/i).fill('edit-test-page');
      await page.getByRole('button', { name: /add component/i }).click();
      await page.getByRole('button', { name: /heading/i }).click();
      await page.getByLabel(/heading text/i).fill('Original Heading');
      await page.getByRole('button', { name: /save page/i }).click();
      await expect(page.getByText(/page saved successfully/i)).toBeVisible();
    });
    
    // Navigate to edit page
    await page.goto('/admin/pages');
    await page.getByRole('link', { name: /edit-test-page/i }).click();
    
    // Edit heading
    await page.getByLabel(/heading text/i).fill('Updated Heading');
    
    // Save changes
    await page.getByRole('button', { name: /save changes/i }).click();
    
    // Verify success message
    await expect(page.getByText(/changes saved successfully/i)).toBeVisible();
    
    // Verify changes on public page
    await page.goto('/edit-test-page');
    await expect(page.getByRole('heading')).toContainText('Updated Heading');
  });

  test('should handle component reordering', async ({ adminPage: page }) => {
    // Add multiple components
    await page.getByRole('button', { name: /add component/i }).click();
    await page.getByRole('button', { name: /heading/i }).click();
    await page.getByLabel(/heading text/i).fill('First Heading');
    
    await page.getByRole('button', { name: /add component/i }).click();
    await page.getByRole('button', { name: /heading/i }).click();
    await page.getByLabel(/heading text/i).fill('Second Heading');
    
    // Drag second heading above first using the drag handle
    const secondHeading = page.locator('[data-testid="component-item"]').filter({ hasText: 'Second Heading' });
    const firstHeading = page.locator('[data-testid="component-item"]').filter({ hasText: 'First Heading' });
    const dragHandle = secondHeading.locator('[data-testid="drag-handle"]');
    
    await dragHandle.hover();
    await page.mouse.down();
    await firstHeading.hover();
    await page.mouse.up();
    
    // Save and verify order in preview
    await page.getByRole('button', { name: /preview/i }).click();
    const headings = await page.getByRole('heading').all();
    expect(await headings[0].textContent()).toContain('Second Heading');
    expect(await headings[1].textContent()).toContain('First Heading');
  });
}); 