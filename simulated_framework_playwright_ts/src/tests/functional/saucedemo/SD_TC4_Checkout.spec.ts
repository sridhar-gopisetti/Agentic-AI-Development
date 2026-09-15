/**
 * SD_TC4_Checkout.spec.ts — playwright-typescript framework
 *
 * SauceDemo (Swag Labs) — Checkout Process Test Suite
 * Covers: FR-07 (checkout), FR-08 (complete order), FR-09 (cancel checkout),
 *         ER-07, ER-08, ER-09, ER-10 (checkout validation), ER-11 (empty cart checkout)
 *
 * Traceability:
 *   Requirements: FR-07, FR-08, FR-09, ER-07, ER-08, ER-09, ER-10, ER-11
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

const CHECKOUT_DATA = {
  firstName:  'Test',
  lastName:   'User',
  postalCode: '500001',
};

// ── Test Suite ────────────────────────────────────────────────────────────────

test.describe('SauceDemo — Checkout', () => {

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

  // ── FR-07: Checkout (Step One) ────────────────────────────────────────────────

  test('FR-07: User can complete checkout step one and reach overview page', async ({ page, inventoryPage, sauceDemoCartPage, checkoutInfoPage }) => {

    await test.step('Step 100 — Add product to cart', async () => {
      await inventoryPage.clickAddToCartByIndex(0);
    });

    await test.step('Step 200 — Open Cart', async () => {
      await inventoryPage.clickCartIcon();
      await expect(page).toHaveURL(/cart/);
    });

    await test.step('Step 300 — Click Checkout', async () => {
      await sauceDemoCartPage.clickCheckout();
      await expect(page).toHaveURL(/checkout-step-one/);
    });

    await test.step('Step 400 — Enter First Name', async () => {
      await checkoutInfoPage.enterFirstName(CHECKOUT_DATA.firstName);
    });

    await test.step('Step 500 — Enter Last Name', async () => {
      await checkoutInfoPage.enterLastName(CHECKOUT_DATA.lastName);
    });

    await test.step('Step 600 — Enter Postal Code', async () => {
      await checkoutInfoPage.enterPostalCode(CHECKOUT_DATA.postalCode);
    });

    await test.step('Step 700 — Click Continue and assert Checkout Overview page displayed', async () => {
      // Traceability: FR-07
      await checkoutInfoPage.clickContinue();
      await expect(page).toHaveURL(/checkout-step-two/);
    });
  });

  // ── FR-08: Complete Order ─────────────────────────────────────────────────────

  test('FR-08: User can complete the order and sees confirmation page', async ({ page, inventoryPage, sauceDemoCartPage, checkoutInfoPage, checkoutOverviewPage, checkoutCompletePage }) => {

    await test.step('Step 100 — Setup: add product, open cart, start checkout', async () => {
      await inventoryPage.clickAddToCartByIndex(0);
      await inventoryPage.clickCartIcon();
      await sauceDemoCartPage.clickCheckout();
      await checkoutInfoPage.fillCheckoutInfo(CHECKOUT_DATA.firstName, CHECKOUT_DATA.lastName, CHECKOUT_DATA.postalCode);
      await checkoutInfoPage.clickContinue();
      await expect(page).toHaveURL(/checkout-step-two/);
    });

    await test.step('Step 200 — Assert order summary is visible', async () => {
      // Traceability: FR-08
      await expect(checkoutOverviewPage.getOrderSummaryLocator()).toBeVisible();
    });

    await test.step('Step 300 — Click Finish button', async () => {
      await checkoutOverviewPage.clickFinish();
    });

    await test.step('Step 400 — Assert order confirmation page is displayed and success message appears', async () => {
      // Traceability: FR-08
      await expect(page).toHaveURL(/checkout-complete/);
      await expect(checkoutCompletePage.getCompleteContainerLocator()).toBeVisible();
      await expect(checkoutCompletePage.getSuccessHeaderLocator()).toBeVisible();
      await expect(checkoutCompletePage.getSuccessHeaderLocator()).toContainText('Thank you');
    });
  });

  // ── FR-09: Cancel Checkout ────────────────────────────────────────────────────

  test('FR-09: User can cancel checkout from overview and is returned to inventory', async ({ page, inventoryPage, sauceDemoCartPage, checkoutInfoPage, checkoutOverviewPage }) => {

    await test.step('Step 100 — Setup: add product, navigate to checkout overview', async () => {
      await inventoryPage.clickAddToCartByIndex(0);
      await inventoryPage.clickCartIcon();
      await sauceDemoCartPage.clickCheckout();
      await checkoutInfoPage.fillCheckoutInfo(CHECKOUT_DATA.firstName, CHECKOUT_DATA.lastName, CHECKOUT_DATA.postalCode);
      await checkoutInfoPage.clickContinue();
      await expect(page).toHaveURL(/checkout-step-two/);
    });

    await test.step('Step 200 — Click Cancel button', async () => {
      await checkoutOverviewPage.clickCancel();
    });

    await test.step('Step 300 — Assert user is returned to inventory page (no order placed)', async () => {
      // Traceability: FR-09
      await expect(page).toHaveURL(/inventory/);
    });
  });

  // ── ER-07: Checkout — Empty First Name ───────────────────────────────────────

  test('ER-07: Checkout with empty first name shows validation error', async ({ page, inventoryPage, sauceDemoCartPage, checkoutInfoPage }) => {

    await test.step('Step 100 — Add product to cart and open checkout', async () => {
      await inventoryPage.clickAddToCartByIndex(0);
      await inventoryPage.clickCartIcon();
      await sauceDemoCartPage.clickCheckout();
      await expect(page).toHaveURL(/checkout-step-one/);
    });

    await test.step('Step 200 — Leave First Name empty; enter Last Name and Postal Code', async () => {
      await checkoutInfoPage.enterLastName(CHECKOUT_DATA.lastName);
      await checkoutInfoPage.enterPostalCode(CHECKOUT_DATA.postalCode);
    });

    await test.step('Step 300 — Click Continue', async () => {
      await checkoutInfoPage.clickContinue();
    });

    await test.step('Step 400 — Assert user remains on Checkout Step One page', async () => {
      // Traceability: ER-07
      await expect(page).toHaveURL(/checkout-step-one/);
    });

    await test.step('Step 500 — Assert validation error: First Name is required', async () => {
      // Traceability: ER-07
      await expect(checkoutInfoPage.getErrorLocator()).toBeVisible();
      await expect(checkoutInfoPage.getErrorLocator()).toContainText('First Name is required');
    });
  });

  // ── ER-08: Checkout — Empty Last Name ────────────────────────────────────────

  test('ER-08: Checkout with empty last name shows validation error', async ({ page, inventoryPage, sauceDemoCartPage, checkoutInfoPage }) => {

    await test.step('Step 100 — Add product to cart and open checkout', async () => {
      await inventoryPage.clickAddToCartByIndex(0);
      await inventoryPage.clickCartIcon();
      await sauceDemoCartPage.clickCheckout();
    });

    await test.step('Step 200 — Enter First Name, leave Last Name empty, enter Postal Code', async () => {
      await checkoutInfoPage.enterFirstName(CHECKOUT_DATA.firstName);
      await checkoutInfoPage.enterPostalCode(CHECKOUT_DATA.postalCode);
    });

    await test.step('Step 300 — Click Continue', async () => {
      await checkoutInfoPage.clickContinue();
    });

    await test.step('Step 400 — Assert user remains on Checkout Step One', async () => {
      // Traceability: ER-08
      await expect(page).toHaveURL(/checkout-step-one/);
    });

    await test.step('Step 500 — Assert validation error: Last Name is required', async () => {
      // Traceability: ER-08
      await expect(checkoutInfoPage.getErrorLocator()).toBeVisible();
      await expect(checkoutInfoPage.getErrorLocator()).toContainText('Last Name is required');
    });
  });

  // ── ER-09: Checkout — Empty Postal Code ──────────────────────────────────────

  test('ER-09: Checkout with empty postal code shows validation error', async ({ page, inventoryPage, sauceDemoCartPage, checkoutInfoPage }) => {

    await test.step('Step 100 — Add product to cart and open checkout', async () => {
      await inventoryPage.clickAddToCartByIndex(0);
      await inventoryPage.clickCartIcon();
      await sauceDemoCartPage.clickCheckout();
    });

    await test.step('Step 200 — Enter First Name and Last Name, leave Postal Code empty', async () => {
      await checkoutInfoPage.enterFirstName(CHECKOUT_DATA.firstName);
      await checkoutInfoPage.enterLastName(CHECKOUT_DATA.lastName);
    });

    await test.step('Step 300 — Click Continue', async () => {
      await checkoutInfoPage.clickContinue();
    });

    await test.step('Step 400 — Assert user remains on Checkout Step One', async () => {
      // Traceability: ER-09
      await expect(page).toHaveURL(/checkout-step-one/);
    });

    await test.step('Step 500 — Assert validation error: Postal Code is required', async () => {
      // Traceability: ER-09
      await expect(checkoutInfoPage.getErrorLocator()).toBeVisible();
      await expect(checkoutInfoPage.getErrorLocator()).toContainText('Postal Code is required');
    });
  });

  // ── ER-10: Checkout — All Fields Empty ───────────────────────────────────────

  test('ER-10: Checkout with all fields empty shows validation error', async ({ page, inventoryPage, sauceDemoCartPage, checkoutInfoPage }) => {

    await test.step('Step 100 — Add product to cart', async () => {
      await inventoryPage.clickAddToCartByIndex(0);
    });

    await test.step('Step 200 — Open Checkout page', async () => {
      await inventoryPage.clickCartIcon();
      await sauceDemoCartPage.clickCheckout();
      await expect(page).toHaveURL(/checkout-step-one/);
    });

    await test.step('Step 300 — Leave all fields empty and click Continue', async () => {
      await checkoutInfoPage.clickContinue();
    });

    await test.step('Step 400 — Assert checkout did not proceed and validation error is shown', async () => {
      // Traceability: ER-10
      await expect(page).toHaveURL(/checkout-step-one/);
      await expect(checkoutInfoPage.getErrorLocator()).toBeVisible();
      await expect(checkoutInfoPage.getErrorLocator()).toContainText('First Name is required');
    });
  });

  // ── ER-11: Complete Checkout with Empty Cart ──────────────────────────────────

  test('ER-11: Opening cart without products shows empty cart state', async ({ page, inventoryPage, sauceDemoCartPage }) => {

    await test.step('Step 100 — Login successfully (done in beforeEach)', async () => {
      await expect(page).toHaveURL(/inventory/);
    });

    await test.step('Step 200 — Open cart without adding products and assert cart is empty', async () => {
      // Traceability: ER-11
      await inventoryPage.clickCartIcon();
      await expect(page).toHaveURL(/cart/);
      await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(0);
      // Cart badge not present (no items to checkout)
      await expect(inventoryPage.getCartBadgeLocator()).not.toBeVisible();
    });
  });

});
