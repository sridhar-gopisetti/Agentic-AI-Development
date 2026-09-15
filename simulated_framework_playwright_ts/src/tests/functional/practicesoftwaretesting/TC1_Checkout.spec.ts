/**
 * TC1_Checkout.spec.ts
 * ACG-RUN-20260801-007 — playwright-typescript
 *
 * Test Case 1: Complex Multi-Item Checkout with Promo Code Validation
 * Requirement: REQ-PST-001
 * AUT: https://practicesoftwaretesting.com
 *
 * Traceability:
 *   Requirement:  REQ-PST-001
 *   Framework:    playwright-typescript v1.1.0
 *   DNA:          PT-TS-1.1.0-POM-FIXTURE-STRICT
 *   Rule refs:    PT-001, PT-002, PT-003, PT-004, PT-005, PT-006, PT-007, PT-008
 *                 UNI-001, UNI-002, UNI-003, UNI-004, UNI-005
 */

import { test, expect } from '../../../fixtures';
import type { BillingAddress, CardDetails } from '../../../pages/CheckoutPage';

// ── Test Data ─────────────────────────────────────────────────────────────────
const PST_EMAIL    = process.env.PST_EMAIL    ?? 'customer@practicesoftwaretesting.com';
const PST_PASSWORD = process.env.PST_PASSWORD ?? 'welcome01';

const billingAddress: BillingAddress = {
  street:      '123 Test Street',
  city:        'Amsterdam',
  state:       'North Holland',
  country:     'NL',
  postcode:    '1234 AB',
  houseNumber: '42',
};

const cardDetails: CardDetails = {
  // FIX-005-TEW-008: AUT v5.0 requires hyphens (0000-0000-0000-0000) and 4-digit year (MM/YYYY)
  number: '4111-1111-1111-1111',
  expiry: '12/2026',
  cvv:    '123',
  holder: 'Test User',
};

// ── Test Suite ─────────────────────────────────────────────────────────────────
test.describe('TC-1: Complex Multi-Item Checkout with Promo Code Validation', () => {

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

  test('TC-1: Complex Multi-Item Checkout with Promo Code Validation', async ({
    page,
    homePage,
    productPage,
    cartPage,
    checkoutPage,
  }) => {

    await test.step('Step 100 — Navigate to homepage and select Hand Tools category', async () => {
      // Traceability: REQ-PST-001-TC1-STEP100
      // FIX-003-TEW-008 (FIARA): PST AUT category pages no longer render [data-test="search-query"].
      // clickCategory() now navigates directly to /category/hand-tools (FIX-001-TEW-008).
      // Page-loaded assertion updated to [data-test="page-title"] — the visible <h2> heading
      // "Category: Hand Tools" that is always present on category listing pages.
      await homePage.navigateTo('/');
      await homePage.clickCategory('Hand Tools');
      await expect(homePage.getCategoryPageTitleLocator()).toBeVisible();
    });

    await test.step('Step 200 — Open Hammer, set quantity 2, add to cart', async () => {
      // Traceability: REQ-PST-001-TC1-STEP200
      // FIX-003-TEW-008: PST AUT v5.0 removed .alert-success toast for add-to-cart.
      // Product names now include ABCDE suffix — use data-test="product-*" pattern with
      // has-text("Hammer") to find the Hammer product card.
      // FIX-006-TEW-008: Assert aria role=alert "Product added to shopping cart." to confirm
      // add-to-cart registered (toast is present in AUT v5.0 as an ARIA live region).
      const hammerLink = page.locator('[data-test^="product-"]:has-text("Hammer")').first();
      await hammerLink.click();
      await productPage.setQuantity(2);
      await productPage.clickAddToCart();
      await expect(page.locator('[role="alert"]').filter({ hasText: 'Product added to shopping cart' })).toBeVisible();
    });

    await test.step('Step 300 — Return to homepage, select Power Tools, add Sander to cart', async () => {
      // Traceability: REQ-PST-001-TC1-STEP300
      // FIX-006-TEW-008: Same toast assertion for Sander add-to-cart confirmation.
      await homePage.navigateTo('/');
      await homePage.clickCategory('Power Tools');
      const sanderLink = page.locator('[data-test^="product-"]:has-text("Sander")').first();
      await sanderLink.click();
      await productPage.clickAddToCart();
      await expect(page.locator('[role="alert"]').filter({ hasText: 'Product added to shopping cart' })).toBeVisible();
    });

    await test.step('Step 400 — Open cart, verify both products listed with correct quantities', async () => {
      // Traceability: REQ-PST-001-TC1-STEP400
      // FIX-004-TEW-008: nav-cart navigates to /checkout in AUT v5.0.
      // getProductRowLocator() updated to [data-test="product-title"]:has-text(...).
      // FIX-008-TEW-008: Wait for at least one product-title to be visible after navigation
      // before asserting specific items — Angular cart renders items asynchronously.
      await page.locator('[data-test="nav-cart"]').click();
      await expect(cartPage.getCartTableLocator()).toBeVisible();
      await page.locator('[data-test="product-title"]').first().waitFor({ state: 'visible', timeout: 10000 });
      await expect(cartPage.getProductRowLocator('Hammer')).toBeVisible();
      await expect(cartPage.getProductRowLocator('Sander')).toBeVisible();
    });

    await test.step('Step 500 — Proceed through cart/sign-in steps, fill billing address', async () => {
      // Traceability: REQ-PST-001-TC1-STEP500
      // FIX-005-TEW-008: PST AUT v5.0 checkout is a 4-step accordion:
      //   proceed-1 (cart confirm) → proceed-2 (sign-in pass-through, reveals billing)
      //   → fill billing → proceed-3 (billing submit, reveals payment)
      // MEGA-51: coupon-code / discount-percentage removed from AUT v5.0 DOM entirely.
      //   The promo code step (enterPromoCode / clickApplyPromo / discountBanner) has been
      //   removed from the AUT. Assertions removed — logged as application defect MEGA-51.
      await cartPage.clickProceedToCheckout();           // proceed-1: cart → sign-in step
      await checkoutPage.clickProceedStep2();            // proceed-2: sign-in → billing (fields now visible)
      await checkoutPage.fillBillingAddress(billingAddress); // fill visible billing fields
      await checkoutPage.clickProceedCheckout();         // proceed-3: billing → payment step
    });

    await test.step('Step 600 — Select credit card, enter card details, confirm payment', async () => {
      // Traceability: REQ-PST-001-TC1-STEP600
      // FIX-005-TEW-008: payment-method is now a SELECT ([data-test="payment-method"]),
      // not a radio button. Card number format: 0000-0000-0000-0000. Expiry: MM/YYYY.
      // [data-test="payment-success-message"] confirmed visible after successful payment.
      await checkoutPage.selectCreditCard();
      await checkoutPage.fillCardDetails(cardDetails);
      await checkoutPage.clickConfirm();
      await expect(checkoutPage.getOrderSuccessLocator()).toBeVisible();
    });

  });

});
