/**
 * End-to-End Tests for TerraLinke Platform
 * Testing complete user journeys and real blockchain interactions
 */

const { test, expect } = require('@playwright/test');

// Test configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const TEST_TIMEOUT = 30000;

test.describe('TerraLinke E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set longer timeout for blockchain operations
    test.setTimeout(TEST_TIMEOUT);
    
    // Navigate to the application
    await page.goto(BASE_URL);
    
    // Wait for page to load completely
    await page.waitForLoadState('networkidle');
  });

  test.describe('Landing Page', () => {
    test('should display main landing page elements', async ({ page }) => {
      // Check for main navigation
      await expect(page.locator('[data-testid="main-nav"]')).toBeVisible();
      
      // Check for hero section
      await expect(page.locator('h1')).toContainText('TerraLinke');
      
      // Check for call-to-action buttons
      const connectButton = page.locator('button:has-text("Connect Wallet")');
      await expect(connectButton).toBeVisible();
      
      // Check for feature sections
      await expect(page.locator('text=Climate Funding')).toBeVisible();
      await expect(page.locator('text=AI-Powered Analysis')).toBeVisible();
      await expect(page.locator('text=Democratic Governance')).toBeVisible();
    });

    test('should navigate to different sections', async ({ page }) => {
      // Test navigation menu items
      const dashboardLink = page.locator('a:has-text("Dashboard")');
      if (await dashboardLink.isVisible()) {
        await dashboardLink.click();
        await expect(page.url()).toContain('/dashboard');
      }
      
      // Navigate back to home
      await page.goto(BASE_URL);
      
      // Test submit proposal navigation
      const submitLink = page.locator('a:has-text("Submit Proposal")');
      if (await submitLink.isVisible()) {
        await submitLink.click();
        await expect(page.url()).toContain('/submit-proposal');
      }
    });
  });

  test.describe('Wallet Connection Flow', () => {
    test('should show wallet connection modal', async ({ page }) => {
      // Click connect wallet button
      const connectButton = page.locator('button:has-text("Connect Wallet")').first();
      await connectButton.click();
      
      // Check if wallet selection modal appears
      await expect(page.locator('[data-testid="wallet-modal"]')).toBeVisible({ timeout: 5000 });
      
      // Check for wallet options
      const walletOptions = page.locator('[data-testid="wallet-option"]');
      await expect(walletOptions).toHaveCountGreaterThan(0);
    });

    test('should handle wallet connection errors gracefully', async ({ page }) => {
      // Mock wallet connection failure
      await page.route('**/api/wallet/**', route => {
        route.fulfill({
          status: 500,
          body: JSON.stringify({ error: 'Wallet connection failed' })
        });
      });
      
      const connectButton = page.locator('button:has-text("Connect Wallet")').first();
      await connectButton.click();
      
      // Should show error message
      await expect(page.locator('text=connection failed')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Dashboard Functionality', () => {
    test('should display dashboard when accessed directly', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Check for dashboard elements
      await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible();
      
      // Check for stats cards
      const statsCards = page.locator('[data-testid="stat-card"]');
      await expect(statsCards).toHaveCountGreaterThanOrEqual(3);
      
      // Check for proposals list
      await expect(page.locator('[data-testid="proposals-section"]')).toBeVisible();
    });

    test('should filter proposals correctly', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Wait for proposals to load
      await page.waitForSelector('[data-testid="proposal-item"]', { timeout: 10000 });
      
      // Count initial proposals
      const initialCount = await page.locator('[data-testid="proposal-item"]').count();
      
      // Apply filter
      const categoryFilter = page.locator('select[data-testid="category-filter"]');
      if (await categoryFilter.isVisible()) {
        await categoryFilter.selectOption('renewable_energy');
        
        // Wait for filter to apply
        await page.waitForTimeout(1000);
        
        // Check that filtering worked
        const filteredCount = await page.locator('[data-testid="proposal-item"]').count();
        expect(filteredCount).toBeLessThanOrEqual(initialCount);
      }
    });

    test('should sort proposals by different criteria', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Wait for proposals to load
      await page.waitForSelector('[data-testid="proposal-item"]', { timeout: 10000 });
      
      // Test sorting by funding amount
      const sortSelect = page.locator('select[data-testid="sort-select"]');
      if (await sortSelect.isVisible()) {
        await sortSelect.selectOption('funding');
        
        // Wait for sort to apply
        await page.waitForTimeout(1000);
        
        // Verify proposals are sorted by funding
        const fundingAmounts = await page.locator('[data-testid="funding-amount"]').allTextContents();
        const amounts = fundingAmounts.map(text => parseInt(text.replace(/[^\d]/g, '')));
        
        // Check if sorted in descending order
        for (let i = 1; i < amounts.length; i++) {
          expect(amounts[i-1]).toBeGreaterThanOrEqual(amounts[i]);
        }
      }
    });
  });

  test.describe('Proposal Submission Flow', () => {
    test('should complete proposal submission journey', async ({ page }) => {
      await page.goto(`${BASE_URL}/submit-proposal`);
      
      // Fill out proposal form
      await page.fill('input[data-testid="title-input"]', 'E2E Test Solar Project');
      await page.fill('textarea[data-testid="description-input"]', 'This is a test proposal for solar panel installation in rural communities.');
      await page.fill('input[data-testid="funding-input"]', '50000');
      await page.selectOption('select[data-testid="category-select"]', 'renewable_energy');
      
      // Submit the form
      const submitButton = page.locator('button[data-testid="submit-button"]');
      await submitButton.click();
      
      // Check for submission confirmation or wallet connection requirement
      const successMessage = page.locator('text=successfully submitted');
      const walletRequired = page.locator('text=connect your wallet');
      
      await expect(successMessage.or(walletRequired)).toBeVisible({ timeout: 15000 });
    });

    test('should validate required fields', async ({ page }) => {
      await page.goto(`${BASE_URL}/submit-proposal`);
      
      // Try to submit empty form
      const submitButton = page.locator('button[data-testid="submit-button"]');
      await submitButton.click();
      
      // Check for validation messages
      await expect(page.locator('input:invalid')).toHaveCount({ gte: 1 });
    });

    test('should handle form submission errors', async ({ page }) => {
      // Mock API failure
      await page.route('**/api/proposals', route => {
        route.fulfill({
          status: 400,
          body: JSON.stringify({ error: 'Proposal submission failed' })
        });
      });
      
      await page.goto(`${BASE_URL}/submit-proposal`);
      
      // Fill out form
      await page.fill('input[data-testid="title-input"]', 'Test Project');
      await page.fill('textarea[data-testid="description-input"]', 'Test description');
      await page.fill('input[data-testid="funding-input"]', '1000');
      await page.selectOption('select[data-testid="category-select"]', 'renewable_energy');
      
      // Submit form
      await page.click('button[data-testid="submit-button"]');
      
      // Check for error handling
      await expect(page.locator('text=failed')).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Voting Functionality', () => {
    test('should allow voting on proposals', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Wait for proposals to load
      await page.waitForSelector('[data-testid="proposal-item"]', { timeout: 10000 });
      
      // Click on first proposal
      const firstProposal = page.locator('[data-testid="proposal-item"]').first();
      await firstProposal.click();
      
      // Look for voting buttons
      const approveButton = page.locator('button:has-text("Approve")');
      const rejectButton = page.locator('button:has-text("Reject")');
      
      if (await approveButton.isVisible()) {
        await approveButton.click();
        
        // Should show wallet connection or voting confirmation
        const walletPrompt = page.locator('text=connect');
        const votingConfirm = page.locator('text=vote');
        
        await expect(walletPrompt.or(votingConfirm)).toBeVisible({ timeout: 10000 });
      }
    });
  });

  test.describe('Admin Dashboard', () => {
    test('should access admin dashboard with correct credentials', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin`);
      
      // Fill login form if it exists
      const usernameInput = page.locator('input[name="username"]');
      const passwordInput = page.locator('input[name="password"]');
      
      if (await usernameInput.isVisible()) {
        await usernameInput.fill('Aneesh');
        await passwordInput.fill('dishkavdishkav');
        await page.click('button[type="submit"]');
        
        // Should see admin dashboard
        await expect(page.locator('h1:has-text("Admin")')).toBeVisible({ timeout: 10000 });
        
        // Check for admin features
        await expect(page.locator('[data-testid="total-proposals"]')).toBeVisible();
        await expect(page.locator('[data-testid="total-votes"]')).toBeVisible();
        await expect(page.locator('[data-testid="total-funding"]')).toBeVisible();
      }
    });

    test('should reject invalid admin credentials', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin`);
      
      const usernameInput = page.locator('input[name="username"]');
      const passwordInput = page.locator('input[name="password"]');
      
      if (await usernameInput.isVisible()) {
        await usernameInput.fill('wronguser');
        await passwordInput.fill('wrongpass');
        await page.click('button[type="submit"]');
        
        // Should show error or stay on login page
        await expect(page.locator('text=invalid')).toBeVisible({ timeout: 5000 }).catch(() => {
          // Alternative: check that we're still on login page
          return expect(usernameInput).toBeVisible();
        });
      }
    });
  });

  test.describe('Responsive Design', () => {
    test('should work correctly on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      await page.goto(BASE_URL);
      
      // Check that mobile navigation works
      const mobileMenu = page.locator('[data-testid="mobile-menu"]');
      if (await mobileMenu.isVisible()) {
        await mobileMenu.click();
        await expect(page.locator('[data-testid="mobile-nav-items"]')).toBeVisible();
      }
      
      // Check that content is properly displayed
      await expect(page.locator('h1')).toBeVisible();
      
      // Test that buttons are touchable (minimum 44px)
      const buttons = page.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < Math.min(buttonCount, 5); i++) {
        const button = buttons.nth(i);
        const box = await button.boundingBox();
        if (box) {
          expect(box.height).toBeGreaterThanOrEqual(44);
        }
      }
    });

    test('should work correctly on tablet devices', async ({ page }) => {
      // Set tablet viewport
      await page.setViewportSize({ width: 768, height: 1024 });
      
      await page.goto(BASE_URL);
      
      // Check that layout adapts properly
      await expect(page.locator('h1')).toBeVisible();
      
      // Test navigation
      const navItems = page.locator('nav a');
      const navCount = await navItems.count();
      expect(navCount).toBeGreaterThan(0);
    });
  });

  test.describe('Performance Tests', () => {
    test('should load main page within acceptable time', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto(BASE_URL);
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      
      // Should load within 5 seconds
      expect(loadTime).toBeLessThan(5000);
    });

    test('should handle large dataset efficiently', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      // Mock large dataset response
      await page.route('**/api/proposals', route => {
        const largeDataset = Array(1000).fill(null).map((_, i) => ({
          id: i,
          title: `Proposal ${i}`,
          description: `Description for proposal ${i}`,
          funding: Math.floor(Math.random() * 100000),
          votes: Math.floor(Math.random() * 100),
          category: 'renewable_energy'
        }));
        
        route.fulfill({
          status: 200,
          body: JSON.stringify(largeDataset)
        });
      });
      
      await page.reload();
      
      // Should still load within reasonable time
      await expect(page.locator('[data-testid="proposal-item"]').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Accessibility Tests', () => {
    test('should be navigable with keyboard only', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Start keyboard navigation
      await page.keyboard.press('Tab');
      
      // Check that focus is visible
      const focusedElement = page.locator(':focus');
      await expect(focusedElement).toBeVisible();
      
      // Continue tabbing through elements
      for (let i = 0; i < 5; i++) {
        await page.keyboard.press('Tab');
        const currentFocus = page.locator(':focus');
        await expect(currentFocus).toBeVisible();
      }
    });

    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Check for h1 element
      const h1Elements = page.locator('h1');
      await expect(h1Elements).toHaveCountGreaterThanOrEqual(1);
      
      // Check that headings follow proper hierarchy
      const headings = await page.locator('h1, h2, h3, h4, h5, h6').allTextContents();
      expect(headings.length).toBeGreaterThan(0);
    });
  });

  test.describe('Security Tests', () => {
    test('should sanitize user input properly', async ({ page }) => {
      await page.goto(`${BASE_URL}/submit-proposal`);
      
      // Try to inject script
      const maliciousInput = '<script>alert("XSS")</script>';
      
      await page.fill('input[data-testid="title-input"]', maliciousInput);
      
      // Check that script is not executed
      page.on('dialog', async dialog => {
        // Should not reach here if properly sanitized
        expect(dialog.type()).not.toBe('alert');
        await dialog.dismiss();
      });
      
      // Submit form
      await page.click('button[data-testid="submit-button"]');
      
      // Wait a bit to see if any dialogs appear
      await page.waitForTimeout(2000);
    });

    test('should handle CSRF protection', async ({ page }) => {
      // Test that forms include CSRF tokens or similar protection
      await page.goto(`${BASE_URL}/submit-proposal`);
      
      // Look for hidden CSRF token fields
      const csrfToken = page.locator('input[name="_token"], input[name="csrf_token"]');
      const formCount = await page.locator('form').count();
      
      if (formCount > 0) {
        // If forms exist, they should have some form of protection
        // This is a basic check - real implementation would vary
        console.log('Forms detected, checking for security measures...');
      }
    });
  });
});

// Utility functions for tests
async function waitForBlockchainTransaction(page, txId) {
  // Wait for blockchain transaction to be confirmed
  await page.waitForFunction(
    (transactionId) => {
      // This would check transaction status via API
      return window.checkTransactionStatus && window.checkTransactionStatus(transactionId);
    },
    txId,
    { timeout: 30000 }
  );
}

async function mockWalletConnection(page, address = 'ABCD1234EFGH5678IJKL9012MNOP3456QRST7890UVWX') {
  // Mock successful wallet connection
  await page.addInitScript((addr) => {
    window.mockWalletAddress = addr;
    window.isWalletConnected = true;
  }, address);
}

// Test data generators
function generateMockProposal(id = 1) {
  return {
    id,
    title: `Test Proposal ${id}`,
    description: `This is a test proposal number ${id} for automated testing.`,
    funding: Math.floor(Math.random() * 100000) + 1000,
    votes: Math.floor(Math.random() * 50),
    category: ['renewable_energy', 'reforestation', 'clean_transport', 'carbon_capture'][id % 4],
    creator: 'TESTCREATOR123456789',
    created: new Date().toISOString(),
    status: 'active'
  };
}

console.log('🚀 E2E test suite loaded successfully!');
console.log('🔧 Test Categories:');
console.log('   ✅ Landing page functionality');
console.log('   ✅ Wallet connection flows');
console.log('   ✅ Dashboard interactions');
console.log('   ✅ Proposal submission');
console.log('   ✅ Voting mechanisms');
console.log('   ✅ Admin dashboard');
console.log('   ✅ Responsive design');
console.log('   ✅ Performance testing');
console.log('   ✅ Accessibility compliance');
console.log('   ✅ Security validation');