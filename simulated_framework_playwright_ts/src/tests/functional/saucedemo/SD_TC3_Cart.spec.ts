/**
 * SD_TC3_Cart.spec.ts — playwright-typescript framework
 *
 * SauceDemo (Swag Labs) — Shopping Cart Test Suite
 * Covers: FR-04 (add to cart), FR-05 (remove from cart), FR-06 (view cart), ER-06 (empty cart)
 *
 * Traceability:
 *   Requirements: FR-04, FR-05, FR-06, ER-06
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

test.describe('SauceDemo — Shopping Cart', () => {

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

  // ── FR-04: Add Product to Cart ────────────────────────────────────────────────

  test('FR-04: User can add a product to the cart and cart badge increments', async ({ inventoryPage, sauceDemoCartPage, page }) => {

    await test.step('Step 100 — Click Add to Cart for the first product', async () => {
      await inventoryPage.clickAddToCartByIndex(0);
    });

    await test.step('Step 200 — Assert cart badge count increments to 1', async () => {
      // Traceability: FR-04
      await expect(inventoryPage.getCartBadgeLocator()).toBeVisible();
      await expect(inventoryPage.getCartBadgeLocator()).toHaveText('1');
    });

    await test.step('Step 300 — Navigate to cart and assert product is present', async () => {
      // Traceability: FR-04
      await inventoryPage.clickCartIcon();
      await expect(page).toHaveURL(/cart/);
      await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(1);
    });
  });

  // ── FR-05: Remove Product from Cart ──────────────────────────────────────────

  test('FR-05: User can remove a product from the cart and cart count is updated', async ({ inventoryPage, sauceDemoCartPage, page }) => {

    await test.step('Step 100 — Add product to cart (setup)', async () => {
      await inventoryPage.clickAddToCartByIndex(0);
      await expect(inventoryPage.getCartBadgeLocator()).toHaveText('1');
    });

    await test.step('Step 200 — Click Remove button for the first product', async () => {
      await inventoryPage.clickRemoveFromCartByIndex(0);
    });

    await test.step('Step 300 — Assert product removed (cart badge not visible)', async () => {
      // Traceability: FR-05
      await expect(inventoryPage.getCartBadgeLocator()).not.toBeVisible();
    });

    await test.step('Step 400 — Navigate to cart and assert cart is empty', async () => {
      // Traceability: FR-05
      await inventoryPage.clickCartIcon();
      await expect(page).toHaveURL(/cart/);
      await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(0);
    });
  });

  // ── FR-06: View Cart ──────────────────────────────────────────────────────────

  test('FR-06: User can open cart page and see added products', async ({ inventoryPage, sauceDemoCartPage, page }) => {

    await test.step('Step 100 — Add product to cart', async () => {
      await inventoryPage.clickAddToCartByIndex(0);
    });

    await test.step('Step 200 — Click Cart icon', async () => {
      await inventoryPage.clickCartIcon();
    });

    await test.step('Step 300 — Assert Cart page opens', async () => {
      // Traceability: FR-06
      await expect(page).toHaveURL(/cart/);
    });

    await test.step('Step 400 — Assert added product is displayed in cart', async () => {
      // Traceability: FR-06
      const isReady = await sauceDemoCartPage.validate();
      expect(isReady).toBe(true);
      await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(1);
    });
  });

  // ── ER-06: Access Cart Without Items ─────────────────────────────────────────

  test('ER-06: User can open cart without items — cart page opens with no products', async ({ inventoryPage, sauceDemoCartPage, page }) => {

    await test.step('Step 100 — Login successfully (done in beforeEach)', async () => {
      await expect(page).toHaveURL(/inventory/);
    });

    await test.step('Step 200 — Open cart without adding products', async () => {
      await inventoryPage.clickCartIcon();
    });

    await test.step('Step 300 — Assert cart page opens', async () => {
      // Traceability: ER-06
      await expect(page).toHaveURL(/cart/);
    });

    await test.step('Step 400 — Assert no products are displayed in cart', async () => {
      // Traceability: ER-06
      await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(0);
    });
  });

});
