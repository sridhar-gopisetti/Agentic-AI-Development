import { test, expect } from '../../../fixtures';

const validUsername = process.env.SD_USERNAME as string;
const validPassword = process.env.SD_PASSWORD as string;

const checkoutData = {
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

  test('SauceDemo manual workflow: login, cart, checkout, and logout', async ({
    page,
    sauceDemoLoginPage,
    inventoryPage,
    sauceDemoCartPage,
    checkoutInfoPage,
  }) => {
    await test.step('Step 1 — Enter username', async () => {
      await sauceDemoLoginPage.enterUsername(validUsername);
      // Traceability: FR-01 | Manual Step 1
      await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
    });

    await test.step('Step 2 — Enter password', async () => {
      await sauceDemoLoginPage.enterPassword(validPassword);
      // Traceability: FR-01 | Manual Step 2
      await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
    });

    await test.step('Step 3 — Click Login button', async () => {
      await sauceDemoLoginPage.clickLoginButton();
      // Traceability: FR-01 | Manual Step 3
      await expect(page).toHaveURL(/inventory/);
    });

    await test.step('Step 4 — Click Add to Cart for a product', async () => {
      await inventoryPage.clickAddToCartByIndex(0);
      // Traceability: FR-04 | Manual Step 4
      await expect(inventoryPage.getCartBadgeLocator()).toHaveText('1');
    });

    await test.step('Step 5 — Click Remove button', async () => {
      await inventoryPage.clickRemoveFromCartByIndex(0);
      // Traceability: FR-05 | Manual Step 5
      await expect(inventoryPage.getCartBadgeLocator()).not.toBeVisible();
    });

    await test.step('Step 6 — Click Cart icon', async () => {
      await inventoryPage.clickCartIcon();
      // Traceability: FR-06 | Manual Step 6
      await expect(page).toHaveURL(/cart/);
    });

    await test.step('Step 7 — Click Checkout', async () => {
      await sauceDemoCartPage.clickCheckout();
      // Traceability: FR-07 | Manual Step 7
      await expect(page).toHaveURL(/checkout-step-one/);
    });

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

    await test.step('Step 9 — Click Finish', async () => {
      await inventoryPage.clickCartIcon();
      await sauceDemoCartPage.clickCheckout();
      await checkoutInfoPage.fillCheckoutInfo(
        checkoutData.firstName,
        checkoutData.lastName,
        checkoutData.postalCode,
      );
      await checkoutInfoPage.clickContinue();
      await page.locator('[data-test="finish"]').click();
      // Traceability: FR-08 | Manual Step 9
      await expect(page).toHaveURL(/checkout-complete/);
    });

    await test.step('Step 10 — Open menu', async () => {
      await inventoryPage.openMenu();
    });

    await test.step('Step 11 — Click Logout', async () => {
      await inventoryPage.clickLogout();
      // Traceability: FR-10 | Manual Step 11
      await expect(page).toHaveURL(/\/$/);
      // Traceability: FR-10 | Manual Step 11
      await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
    });
  });
});