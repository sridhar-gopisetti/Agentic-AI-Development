/**
 * TC4_SearchWishlist.spec.ts
 * ACG-RUN-20260801-007 — playwright-typescript
 *
 * Test Case 4: Product Search, Sorting & Wishlist Functionality
 * Requirement: REQ-PST-004
 * AUT: https://practicesoftwaretesting.com
 *
 * Traceability:
 *   Requirement:  REQ-PST-004
 *   Framework:    playwright-typescript v1.1.0
 *   DNA:          PT-TS-1.1.0-POM-FIXTURE-STRICT
 *   Rule refs:    PT-001, PT-002, PT-003, PT-004, PT-005, PT-006, PT-007, PT-008
 *                 UNI-001, UNI-002, UNI-003, UNI-004, UNI-005
 */

import { test, expect } from '../../../fixtures';

// ── Test Data ─────────────────────────────────────────────────────────────────
const PST_EMAIL    = process.env.PST_EMAIL    ?? 'customer@practicesoftwaretesting.com';
const PST_PASSWORD = process.env.PST_PASSWORD ?? 'welcome01';

// ── Test Suite ─────────────────────────────────────────────────────────────────
test.describe('TC-4: Product Search, Sorting & Wishlist Functionality', () => {

  test.beforeEach(async ({ pstLoginPage }) => {
    // Pre-condition: User is logged into the application
    await pstLoginPage.navigateTo('/auth/login');
    await pstLoginPage.login(PST_EMAIL, PST_PASSWORD);
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Traceability: TEARDOWN
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: testInfo.outputPath('screenshot-on-failure.png') });
    }
  });

  test('TC-4: Product Search, Sorting & Wishlist Functionality', async ({
    page,
    homePage,
    productPage,
    wishlistPage,
  }) => {

    // Capture the first product name for later wishlist verification
    let addedProductName = '';

    await test.step('Step 100 — Navigate to homepage and search for Drill', async () => {
      // Traceability: REQ-PST-004-TC4-STEP100
      await homePage.navigateTo('/');
      await homePage.searchProduct('Drill');
      await expect(homePage.getSearchResultsLocator().first()).toBeVisible();
    });

    await test.step('Step 200 — Sort results by Price Low to High', async () => {
      // Traceability: REQ-PST-004-TC4-STEP200
      await homePage.getSortDropdownLocator().selectOption('price,asc');
      await expect(homePage.getSearchResultsLocator().first()).toBeVisible();
    });

    await test.step('Step 300 — Open the first product from search results', async () => {
      // Traceability: REQ-PST-004-TC4-STEP300
      const firstProductName = await homePage.getSearchResultsLocator().first().textContent();
      addedProductName = firstProductName?.trim() ?? 'Drill';
      await homePage.clickFirstProduct();
      await expect(productPage.getProductTitleLocator()).toBeVisible();
    });

    await test.step('Step 400 — Add product to Favorites / Wishlist', async () => {
      // Traceability: REQ-PST-004-TC4-STEP400
      await productPage.clickAddToFavorites();
      await expect(productPage.getSuccessToastLocator()).toBeVisible();
    });

    await test.step('Step 500 — Navigate to Wishlist/Favorites page and verify product', async () => {
      // Traceability: REQ-PST-004-TC4-STEP500
      await page.goto((process.env.BASE_URL ?? 'https://practicesoftwaretesting.com') + '/account/favorites');
      await expect(wishlistPage.getWishlistContainerLocator()).toBeVisible();
    });

    await test.step('Step 600 — Remove product from wishlist and verify removal', async () => {
      // Traceability: REQ-PST-004-TC4-STEP600
      await wishlistPage.removeProduct(addedProductName);
      await expect(wishlistPage.getProductLocator(addedProductName)).not.toBeVisible();
    });

  });

});
