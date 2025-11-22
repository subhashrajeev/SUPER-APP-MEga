import { test, expect } from '@playwright/test';

test.describe('Smoke Tests - Critical User Flows', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/IVR INTERIORS/);

    // Check hero section
    await expect(page.getByRole('heading', { name: /IVR INTERIORS/i })).toBeVisible();

    // Check demo credentials are visible
    await expect(page.getByText(/Demo Credentials/i)).toBeVisible();

    // Check module cards are loaded
    const moduleCards = page.getByRole('link').filter({ has: page.locator('h3') });
    await expect(moduleCards).toHaveCount(27); // All 27 modules
  });

  test('dashboard loads with stats', async ({ page }) => {
    await page.goto('/dashboard');

    // Check dashboard heading
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();

    // Check stats cards exist
    const statCards = page.locator('[class*="grid"]').first();
    await expect(statCards).toBeVisible();

    // Check at least one stat is shown
    await expect(page.getByText(/Total Leads/i)).toBeVisible();
  });

  test('leads page loads and displays leads', async ({ page }) => {
    await page.goto('/leads');

    // Check page heading
    await expect(page.getByRole('heading', { name: 'Leads CRM' })).toBeVisible();

    // Check action buttons
    await expect(page.getByRole('button', { name: /New Lead/i })).toBeVisible();

    // Check search input exists
    await expect(page.getByPlaceholder(/Search leads/i)).toBeVisible();
  });

  test('navigation between modules works', async ({ page }) => {
    await page.goto('/');

    // Navigate to dashboard
    await page.getByRole('link', { name: /Open Dashboard/i }).click();
    await expect(page).toHaveURL(/.*dashboard/);

    // Navigate to leads from dashboard
    await page.getByRole('link', { name: /Leads/i }).first().click();
    await expect(page).toHaveURL(/.*leads/);

    // Go back to home
    await page.goto('/');
    await expect(page).toHaveURL('/');
  });

  test('cost estimator widget is accessible', async ({ page }) => {
    await page.goto('/estimator');

    // Should load without authentication (public page)
    await expect(page).toHaveURL(/.*estimator/);
  });

  test('responsive design - mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size

    await page.goto('/');

    // Hero should still be visible
    await expect(page.getByRole('heading', { name: /IVR INTERIORS/i })).toBeVisible();

    // Module cards should stack vertically (check they're still accessible)
    const firstModule = page.getByRole('link').first();
    await expect(firstModule).toBeVisible();
  });
});

test.describe('Authentication Flow', () => {
  test.skip('login page exists and has form fields', async ({ page }) => {
    // Skip for now - implement when auth routes are added
    await page.goto('/login');

    await expect(page.getByLabel(/Email/i)).toBeVisible();
    await expect(page.getByLabel(/Password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign in/i })).toBeVisible();
  });
});

test.describe('Critical Business Flows', () => {
  test.skip('create lead → quotation → invoice flow', async ({ page }) => {
    // Skip for now - implement when full flow is ready
    // This would test the complete user journey:
    // 1. Create a new lead
    // 2. Convert to quotation
    // 3. Accept quotation
    // 4. Generate invoice
    // 5. Record payment
  });
});
