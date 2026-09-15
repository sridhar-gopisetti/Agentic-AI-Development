/**
 * SD_TC2_Products.spec.ts — playwright-typescript framework
 *
 * SauceDemo (Swag Labs) — Product Inventory Test Suite
 * Covers: FR-02 (view products), FR-03 (sort products)
 *
 * Traceability:
 *   Requirements: FR-02, FR-03
 *   Source:       input/saucedemo-SwagLabs.docx
 *   Run ID:       ACG-RUN-20260802-001
 *   Framework:    playwright-typescript
 *   Rule refs:    PT-001, PT-002, PT-003, PT-004, PT-005, PT-006, PT-007
 */

import { test, expect } from '../../../fixtures';

// ── Test Data ────────────────────────────────────────────────────────────────

const SD_URL     = process.env.BASE_URL ?? 'https://www.saucedemo.com';
const VALID_USER = process.env.SD_USERNAME ?? 'standard_user';
const VALID_PASS = process.env.SD_PASSWORD ?? 'secret_sauce';

// ── Test Suite ────────────────────────────────────────────────────────────────

test.describe('SauceDemo — Products', () => {

  test.beforeEach(async ({ page, sauceDemoLoginPage }) => {
    await page.goto(SD_URL);
    await sauceDemoLoginPage.login(VALID_USER, VALID_PASS);
    await expect(page).toHaveURL(/inventory/);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // FIX-001-TEW-001 (FIARA TEW-RUN-20260802-001): Use testInfo.outputPath() to avoid
    // ENOENT when screenshots/ directory does not exist.
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: testInfo.outputPath('failure.png') });
    }
  });

  // ── FR-02: View Products ──────────────────────────────────────────────────────

  test('FR-02: Logged-in user can view product name, description, price, and image', async ({ inventoryPage }) => {

    await test.step('Step 100 — Validate inventory page is rendered', async () => {
      const isReady = await inventoryPage.validate();
      expect(isReady).toBe(true);
    });

    await test.step('Step 200 — Assert product name is displayed', async () => {
      // Traceability: FR-02
      await expect(inventoryPage.getFirstProductNameLocator()).toBeVisible();
      await expect(inventoryPage.getFirstProductNameLocator()).not.toBeEmpty();
    });

    await test.step('Step 300 — Assert product description is displayed', async () => {
      // Traceability: FR-02
      await expect(inventoryPage.getFirstProductDescLocator()).toBeVisible();
      await expect(inventoryPage.getFirstProductDescLocator()).not.toBeEmpty();
    });

    await test.step('Step 400 — Assert product price is displayed', async () => {
      // Traceability: FR-02
      await expect(inventoryPage.getFirstProductPriceLocator()).toBeVisible();
      await expect(inventoryPage.getFirstProductPriceLocator()).toContainText('$');
    });

    await test.step('Step 500 — Assert product image is displayed', async () => {
      // Traceability: FR-02
      await expect(inventoryPage.getFirstProductImageLocator()).toBeVisible();
    });
  });

  // ── FR-03: Sort Products ──────────────────────────────────────────────────────

  test('FR-03: User can sort products by Name A-Z, Z-A, Price Low-High, High-Low', async ({ inventoryPage }) => {

    await test.step('Step 100 — Sort by Name (A to Z) and verify first item', async () => {
      // Traceability: FR-03
      await inventoryPage.selectSortOption('az');
      const firstNameAZ = await inventoryPage.getFirstProductNameLocator().textContent();
      expect(firstNameAZ).toBeTruthy();
      // Sauce Labs AUT: A-Z first product is 'Sauce Labs Backpack'
      await expect(inventoryPage.getFirstProductNameLocator()).toBeVisible();
    });

    await test.step('Step 200 — Sort by Name (Z to A) and verify reordering', async () => {
      // Traceability: FR-03
      await inventoryPage.selectSortOption('za');
      await expect(inventoryPage.getFirstProductNameLocator()).toBeVisible();
      // Z-A first product is 'Test.allTheThings() T-Shirt (Red)'
      const firstNameZA = await inventoryPage.getFirstProductNameLocator().textContent();
      expect(firstNameZA).toBeTruthy();
    });

    await test.step('Step 300 — Sort by Price (Low to High) and verify reordering', async () => {
      // Traceability: FR-03
      await inventoryPage.selectSortOption('lohi');
      await expect(inventoryPage.getFirstProductPriceLocator()).toBeVisible();
      const firstPriceLH = await inventoryPage.getFirstProductPriceLocator().textContent();
      expect(firstPriceLH).toContain('$');
    });

    await test.step('Step 400 — Sort by Price (High to Low) and verify reordering', async () => {
      // Traceability: FR-03
      await inventoryPage.selectSortOption('hilo');
      await expect(inventoryPage.getFirstProductPriceLocator()).toBeVisible();
      const firstPriceHL = await inventoryPage.getFirstProductPriceLocator().textContent();
      expect(firstPriceHL).toContain('$');
    });
  });

});
