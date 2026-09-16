import { test, expect } from '../../../fixtures';

const validUsername = process.env.SD_USERNAME as string;
const validPassword = process.env.SD_PASSWORD as string;

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

test.describe('SauceDemo — Swag Labs Manual Workflow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test.afterEach(async ({ page }, testInfo) => {
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
        // Traceability: FR-01 | Manual Step 1
        await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
      });

      // Manual Step 2: Enter password.
      await test.step('Step 2 — Enter password', async () => {
        await sauceDemoLoginPage.enterPassword(validPassword);
        // Traceability: FR-01 | Manual Step 2
        await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
      });

      // Manual Step 3: Click Login button.
      await test.step('Step 3 — Click Login button', async () => {
        await sauceDemoLoginPage.clickLoginButton();
        // Traceability: FR-01 | Manual Step 3
        await expect(page).toHaveURL(/inventory/);
      });

      // Manual Step 4: Click Add to Cart for a product.
      await test.step('Step 4 — Click Add to Cart for a product', async () => {
        await inventoryPage.clickAddToCartByIndex(0);
        // Traceability: FR-04 | Manual Step 4
        await expect(inventoryPage.getCartBadgeLocator()).toHaveText('1');
      });

      // Manual Step 5: Click Remove button.
      await test.step('Step 5 — Click Remove button', async () => {
        await inventoryPage.clickRemoveFromCartByIndex(0);
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
        await expect(checkoutCompletePage.getCompleteContainerLocator()).toBeVisible();
        // Traceability: FR-08 | Manual Step 9
        await expect(checkoutCompletePage.getSuccessHeaderLocator()).toContainText('Thank you');
        await checkoutCompletePage.clickBackToProducts();
      });

      // Manual Step 10: Click Logout.
      await test.step('Step 10 — Click Logout', async () => {
        await inventoryPage.openMenu();
        await inventoryPage.clickLogout();
        // Traceability: FR-10 | Manual Step 11
        await expect(page).toHaveURL(/\/$/);
        // Traceability: FR-10 | Manual Step 11
        await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
      });
    },
  );
});