/**
 * SauceDemo Swag Labs functional workflow
 *
 * Traceability:
 *   Source document: saucedemo-SwagLabs.docx
 *   Framework: playwright-typescript
 *   Requirements: FR-01, FR-04, FR-05, FR-06, FR-07, FR-08, FR-10
 */

import { test, expect } from '../../fixtures';

const validUsername = process.env.SD_USERNAME as string;
const validPassword = process.env.SD_PASSWORD as string;
const invalidUsername = process.env.SD_INVALID_USERNAME as string;
const invalidPassword = process.env.SD_INVALID_PASSWORD as string;
const selectedProductIndex = 0;

type CheckoutData = {
  firstName: string;
  lastName: string;
  postalCode: string;
};

const checkoutData: CheckoutData = {
  firstName: 'Test',
  lastName: 'User',
  postalCode: '500001',
};

test.describe('SauceDemo — Swag Labs functional and error-handling workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Traceability: TEARDOWN
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: testInfo.outputPath('failure.png'),
      });
    }
  });

  test(
    'SauceDemo manual workflow: login, cart, checkout, and logout',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
      checkoutInfoPage,
      checkoutOverviewPage,
      checkoutCompletePage,
    }) => {
      // Manual Step 1: Enter username.
      await test.step('Step 1 — Enter username', async () => {
        await sauceDemoLoginPage.enterUsername(validUsername);
      });

      // Manual Step 2: Enter password.
      await test.step('Step 2 — Enter password', async () => {
        await sauceDemoLoginPage.enterPassword(validPassword);
      });

      // Manual Step 3: Click Login button.
      await test.step('Step 3 — Click Login button', async () => {
        await sauceDemoLoginPage.clickLoginButton();
        // Traceability: FR-01 | Manual Step 3
        await expect(page).toHaveURL(/inventory/);
      });

      // Manual Step 4: Click Add to Cart for a product.
      await test.step('Step 4 — Click Add to Cart for a product', async () => {
        await inventoryPage.clickAddToCartByIndex(selectedProductIndex);
        // Traceability: FR-04 | Manual Step 4
        await expect(inventoryPage.getCartBadgeLocator()).toHaveText('1');
      });

      // Manual Step 5: Click Remove button.
      await test.step('Step 5 — Click Remove button', async () => {
        await inventoryPage.clickRemoveFromCartByIndex(selectedProductIndex);
        // Traceability: FR-05 | Manual Step 5
        await expect(inventoryPage.getCartBadgeLocator()).not.toBeVisible();
      });

      // Manual Step 6: Click Cart icon.
      await test.step('Step 6 — Click Cart icon', async () => {
        await inventoryPage.clickCartIcon();
        // Traceability: FR-06 | Manual Step 6
        await expect(page).toHaveURL(/cart/);
      });

      // Manual Step 7: Click Checkout.
      await test.step('Step 7 — Click Checkout', async () => {
        await sauceDemoCartPage.clickCheckout();
        // Traceability: FR-07 | Manual Step 7
        await expect(page).toHaveURL(/checkout-step-one/);
      });

      // Manual Step 8: Click Continue.
      await test.step('Step 8 — Click Continue', async () => {
        await checkoutInfoPage.fillCheckoutInfo(
          checkoutData.firstName,
          checkoutData.lastName,
          checkoutData.postalCode,
        );
        await checkoutInfoPage.clickContinue();
        // Traceability: FR-07 | Manual Step 8
        await expect(page).toHaveURL(/checkout-step-two/);
      });

      // Manual Step 9: Click Finish.
      await test.step('Step 9 — Click Finish', async () => {
        await checkoutOverviewPage.clickFinish();
        // Traceability: FR-08 | Manual Step 9
        await expect(page).toHaveURL(/checkout-complete/);
        // Traceability: FR-08 | Manual Step 9
        await expect(
          checkoutCompletePage.getCompleteContainerLocator(),
        ).toBeVisible();
        // Traceability: FR-08 | Manual Step 9
        await expect(
          checkoutCompletePage.getSuccessHeaderLocator(),
        ).toContainText('Thank you');
        await checkoutCompletePage.clickBackToProducts();
      });

      // Manual Step 10: Open menu.
      await test.step('Step 10 — Open menu', async () => {
        await inventoryPage.openMenu();
        // Traceability: FR-10 | Manual Step 10
        await expect(page.locator('#logout_sidebar_link')).toBeVisible();
      });

      // Manual Step 11: Click Logout.
      await test.step('Step 11 — Click Logout', async () => {
        await inventoryPage.clickLogout();
        // Traceability: FR-10 | Manual Step 11
        await expect(page).toHaveURL(/\/$/);
        // Traceability: FR-10 | Manual Step 11
        await expect(
          sauceDemoLoginPage.getLoginButtonLocator(),
        ).toBeVisible();
      });
    },
  );
});