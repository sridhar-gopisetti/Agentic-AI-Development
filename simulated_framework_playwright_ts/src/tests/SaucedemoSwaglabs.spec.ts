// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// AUT_MODULES_IN_SCOPE  → set AUT_MODULES_IN_SCOPE in .env (assumed: SauceDemo Login, Inventory, Cart, Checkout, Logout)
// LIVE_AUT_ACCESSIBLE  → set LIVE_AUT_ACCESSIBLE in .env (assumed: false)
// ════════════════════════════════════════════════════

import { test, expect } from '../fixtures';

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const baseUrl = requiredEnv('BASE_URL');
const validUsername = requiredEnv('SD_USERNAME');
const validPassword = requiredEnv('SD_PASSWORD');
const invalidUsername = requiredEnv('SD_INVALID_USERNAME');
const invalidPassword = requiredEnv('SD_INVALID_PASSWORD');

const checkoutData = {
  firstName: requiredEnv('SD_CHECKOUT_FIRST_NAME'),
  lastName: requiredEnv('SD_CHECKOUT_LAST_NAME'),
  postalCode: requiredEnv('SD_CHECKOUT_POSTAL_CODE'),
};

const expected = {
  emptyUsername: requiredEnv('SD_EMPTY_USERNAME_ERROR'),
  emptyPassword: requiredEnv('SD_EMPTY_PASSWORD_ERROR'),
  emptyCredentials: requiredEnv('SD_EMPTY_CREDENTIALS_ERROR'),
  invalidUsername: requiredEnv('SD_INVALID_USERNAME_ERROR'),
  invalidPassword: requiredEnv('SD_INVALID_PASSWORD_ERROR'),
  emptyFirstName: requiredEnv('SD_EMPTY_FIRST_NAME_ERROR'),
  emptyLastName: requiredEnv('SD_EMPTY_LAST_NAME_ERROR'),
  emptyPostalCode: requiredEnv('SD_EMPTY_POSTAL_CODE_ERROR'),
  emptyCheckout: requiredEnv('SD_EMPTY_CHECKOUT_ERROR'),
};

const readiness = {
  modulesInScope:
    process.env.AUT_MODULES_IN_SCOPE ??
    // STUB: AUT_MODULES_IN_SCOPE not confirmed — using inferred SauceDemo scope
    'SauceDemo Login, Inventory, Cart, Checkout, Logout',
  liveAutAccessible:
    process.env.LIVE_AUT_ACCESSIBLE ??
    // STUB: LIVE_AUT_ACCESSIBLE not confirmed — using false
    'false',
};

void readiness;

test.describe('SauceDemo Swag Labs — Functional and Error Handling Coverage', () => {
  test.beforeEach(async ({ page, sauceDemoLoginPage }) => {
    // LOCATOR_UNCONFIRMED — not in AUT KB
    await sauceDemoLoginPage.navigateTo('/');
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: testInfo.outputPath('screenshot-on-failure.png'),
      });
    }
  });

  test(
    '[TC-ACG-RU-001][SCR-ACG-RU-001] Valid login',
    async ({ page, sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-001
      // script_id    : SCR-ACG-RU-001
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Step 1 — Enter username.
      await test.step('Step 1 — Enter username.', async () => {
        // Traceability: TC-ACG-RU-001
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterUsername(validUsername);
      });

      // Step 2 — Enter password.
      await test.step('Step 2 — Enter password.', async () => {
        // Traceability: TC-ACG-RU-001
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterPassword(validPassword);
      });

      // Step 3 — Click Login button.
      await test.step('Step 3 — Click Login button.', async () => {
        // Traceability: TC-ACG-RU-001
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.clickLoginButton();
        // Traceability: TC-ACG-RU-001
        await expect(page).toHaveURL(/inventory/);
        // Traceability: TC-ACG-RU-001
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(page.locator('.inventory_list')).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-002][SCR-ACG-RU-002] Add product to cart',
    async ({ page, sauceDemoLoginPage, inventoryPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-002
      // script_id    : SCR-ACG-RU-002
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // LOCATOR_UNCONFIRMED — not in AUT KB
      await sauceDemoLoginPage.login(validUsername, validPassword);

      // Step 4 — Click Add to Cart for a product.
      await test.step('Step 4 — Click Add to Cart for a product.', async () => {
        // Traceability: TC-ACG-RU-002
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);
        // Traceability: TC-ACG-RU-002
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(inventoryPage.getCartBadgeLocator()).toBeVisible();
        // Traceability: TC-ACG-RU-002
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(inventoryPage.getCartBadgeLocator()).toHaveText('1');
      });
    },
  );

  test(
    '[TC-ACG-RU-003][SCR-ACG-RU-003] Remove product from cart',
    async ({ sauceDemoLoginPage, inventoryPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-003
      // script_id    : SCR-ACG-RU-003
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Test setup: authenticate and add an item so the remove action is available.
      // LOCATOR_UNCONFIRMED — not in AUT KB
      await sauceDemoLoginPage.login(validUsername, validPassword);
      // LOCATOR_UNCONFIRMED — not in AUT KB
      await inventoryPage.clickAddToCartByIndex(0);

      // Step 5 — Click Remove button.
      await test.step('Step 5 — Click Remove button.', async () => {
        // Traceability: TC-ACG-RU-003
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickRemoveFromCartByIndex(0);
        // Traceability: TC-ACG-RU-003
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(inventoryPage.getCartBadgeLocator()).not.toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-004][SCR-ACG-RU-004] View cart',
    async ({ page, sauceDemoLoginPage, inventoryPage, sauceDemoCartPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-004
      // script_id    : SCR-ACG-RU-004
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Test setup: authenticate and add an item for cart viewing.
      // LOCATOR_UNCONFIRMED — not in AUT KB
      await sauceDemoLoginPage.login(validUsername, validPassword);
      // LOCATOR_UNCONFIRMED — not in AUT KB
      await inventoryPage.clickAddToCartByIndex(0);

      // Step 6 — Click Cart icon.
      await test.step('Step 6 — Click Cart icon.', async () => {
        // Traceability: TC-ACG-RU-004
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
        // Traceability: TC-ACG-RU-004
        await expect(page).toHaveURL(/cart/);
      });
    },
  );

  test(
    '[TC-ACG-RU-005][SCR-ACG-RU-005] Checkout with valid information',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
      checkoutInfoPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-005
      // script_id    : SCR-ACG-RU-005
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Test setup: authenticate and add an item before the mapped cart steps.
      // LOCATOR_UNCONFIRMED — not in AUT KB
      await sauceDemoLoginPage.login(validUsername, validPassword);
      // LOCATOR_UNCONFIRMED — not in AUT KB
      await inventoryPage.clickAddToCartByIndex(0);

      // Step 7 — Open Cart.
      await test.step('Step 7 — Open Cart.', async () => {
        // Traceability: TC-ACG-RU-005
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
        // Traceability: TC-ACG-RU-005
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoCartPage.getCartListLocator()).toBeVisible();
        // Traceability: TC-ACG-RU-005
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(1);
      });

      // Step 8 — Click Checkout.
      await test.step('Step 8 — Click Checkout.', async () => {
        // Traceability: TC-ACG-RU-005
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoCartPage.clickCheckout();
        // Traceability: TC-ACG-RU-005
        await expect(page).toHaveURL(/checkout-step-one/);
      });

      // Step 9 — Enter: First Name, Last Name, Postal Code.
      await test.step('Step 9 — Enter: First Name, Last Name, Postal Code.', async () => {
        // Traceability: TC-ACG-RU-005
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.fillCheckoutInfo(
          checkoutData.firstName,
          checkoutData.lastName,
          checkoutData.postalCode,
        );
      });

      // Step 10 — Click Continue.
      await test.step('Step 10 — Click Continue.', async () => {
        // Traceability: TC-ACG-RU-005
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.clickContinue();
        // Traceability: TC-ACG-RU-005
        await expect(page).toHaveURL(/checkout-step-two/);
      });
    },
  );

  test(
    '[TC-ACG-RU-006][SCR-ACG-RU-006] Review and complete order',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
      checkoutInfoPage,
      checkoutOverviewPage,
      checkoutCompletePage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-006
      // script_id    : SCR-ACG-RU-006
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Test setup: independently reach Checkout Overview with one item.
      // LOCATOR_UNCONFIRMED — not in AUT KB
      await sauceDemoLoginPage.login(validUsername, validPassword);
      // LOCATOR_UNCONFIRMED — not in AUT KB
      await inventoryPage.clickAddToCartByIndex(0);
      // LOCATOR_UNCONFIRMED — not in AUT KB
      await inventoryPage.clickCartIcon();
      // LOCATOR_UNCONFIRMED — not in AUT KB
      await sauceDemoCartPage.clickCheckout();
      // LOCATOR_UNCONFIRMED — not in AUT KB
      await checkoutInfoPage.fillCheckoutInfo(
        checkoutData.firstName,
        checkoutData.lastName,
        checkoutData.postalCode,
      );
      // LOCATOR_UNCONFIRMED — not in AUT KB
      await checkoutInfoPage.clickContinue();

      // Step 11 — Review order details.
      await test.step('Step 11 — Review order details.', async () => {
        // Traceability: TC-ACG-RU-006
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(checkoutOverviewPage.getOrderSummaryLocator()).toBeVisible();
        // Traceability: TC-ACG-RU-006
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(checkoutOverviewPage.getCartItemsLocator()).toBeVisible();
      });

      // Step 12 — Click Finish.
      await test.step('Step 12 — Click Finish.', async () => {
        // Traceability: TC-ACG-RU-006
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutOverviewPage.clickFinish();
        // Traceability: TC-ACG-RU-006
        await expect(page).toHaveURL(/checkout-complete/);
        // Traceability: TC-ACG-RU-006
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(checkoutCompletePage.getCompleteContainerLocator()).toBeVisible();
        // Traceability: TC-ACG-RU-006
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(checkoutCompletePage.getSuccessHeaderLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-007][SCR-ACG-RU-007] Logout',
    async ({ page, sauceDemoLoginPage, inventoryPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-007
      // script_id    : SCR-ACG-RU-007
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Test setup: authenticate before exercising the logout steps.
      // LOCATOR_UNCONFIRMED — not in AUT KB
      await sauceDemoLoginPage.login(validUsername, validPassword);

      // Step 13 — Open menu.
      await test.step('Step 13 — Open menu.', async () => {
        // Traceability: TC-ACG-RU-007
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.openMenu();
      });

      // Step 14 — Click Logout.
      await test.step('Step 14 — Click Logout.', async () => {
        // Traceability: TC-ACG-RU-007
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickLogout();
        // Traceability: TC-ACG-RU-007
        await expect(page).toHaveURL(new URL('/', baseUrl).toString());
        // Traceability: TC-ACG-RU-007
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-008][SCR-ACG-RU-008] Login with blank username',
    async ({ page, sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-008
      // script_id    : SCR-ACG-RU-008
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Step 15 — Leave Username blank.
      await test.step('Step 15 — Leave Username blank.', async () => {
        // Traceability: TC-ACG-RU-008
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterUsername('');
      });

      // Step 16 — Enter valid Password.
      await test.step('Step 16 — Enter valid Password.', async () => {
        // Traceability: TC-ACG-RU-008
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterPassword(validPassword);
      });

      // Step 17 — Click Login.
      await test.step('Step 17 — Click Login.', async () => {
        // Traceability: TC-ACG-RU-008
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.clickLoginButton();
        // Traceability: TC-ACG-RU-008
        await expect(page).toHaveURL(new URL('/', baseUrl).toString());
        // Traceability: TC-ACG-RU-008
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
        // Traceability: TC-ACG-RU-008
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoLoginPage.getErrorMessageLocator()).toContainText(
          expected.emptyUsername,
        );
      });
    },
  );

  test(
    '[TC-ACG-RU-009][SCR-ACG-RU-009] Login with blank password',
    async ({ page, sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-009
      // script_id    : SCR-ACG-RU-009
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Step 18 — Enter valid Username.
      await test.step('Step 18 — Enter valid Username.', async () => {
        // Traceability: TC-ACG-RU-009
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterUsername(validUsername);
      });

      // Step 19 — Leave Password blank.
      await test.step('Step 19 — Leave Password blank.', async () => {
        // Traceability: TC-ACG-RU-009
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterPassword('');
      });

      // Step 20 — Click Login.
      await test.step('Step 20 — Click Login.', async () => {
        // Traceability: TC-ACG-RU-009
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.clickLoginButton();
        // Traceability: TC-ACG-RU-009
        await expect(page).toHaveURL(new URL('/', baseUrl).toString());
        // Traceability: TC-ACG-RU-009
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
        // Traceability: TC-ACG-RU-009
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoLoginPage.getErrorMessageLocator()).toContainText(
          expected.emptyPassword,
        );
      });
    },
  );

  test(
    '[TC-ACG-RU-010][SCR-ACG-RU-010] Login with blank credentials',
    async ({ page, sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-010
      // script_id    : SCR-ACG-RU-010
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Step 21 — Leave Username blank.
      await test.step('Step 21 — Leave Username blank.', async () => {
        // Traceability: TC-ACG-RU-010
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterUsername('');
      });

      // Step 22 — Leave Password blank.
      await test.step('Step 22 — Leave Password blank.', async () => {
        // Traceability: TC-ACG-RU-010
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterPassword('');
      });

      // Step 23 — Click Login.
      await test.step('Step 23 — Click Login.', async () => {
        // Traceability: TC-ACG-RU-010
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.clickLoginButton();
        // Traceability: TC-ACG-RU-010
        await expect(page).toHaveURL(new URL('/', baseUrl).toString());
        // Traceability: TC-ACG-RU-010
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
        // Traceability: TC-ACG-RU-010
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoLoginPage.getErrorMessageLocator()).toContainText(
          expected.emptyCredentials,
        );
      });
    },
  );

  test(
    '[TC-ACG-RU-011][SCR-ACG-RU-011] Login with invalid username',
    async ({ page, sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-011
      // script_id    : SCR-ACG-RU-011
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Step 24 — Enter invalid username.
      await test.step('Step 24 — Enter invalid username.', async () => {
        // Traceability: TC-ACG-RU-011
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterUsername(invalidUsername);
      });

      // Step 25 — Enter valid password.
      await test.step('Step 25 — Enter valid password.', async () => {
        // Traceability: TC-ACG-RU-011
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterPassword(validPassword);
      });

      // Step 26 — Click Login.
      await test.step('Step 26 — Click Login.', async () => {
        // Traceability: TC-ACG-RU-011
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.clickLoginButton();
        // Traceability: TC-ACG-RU-011
        await expect(page).toHaveURL(new URL('/', baseUrl).toString());
        // Traceability: TC-ACG-RU-011
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
        // Traceability: TC-ACG-RU-011
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoLoginPage.getErrorMessageLocator()).toContainText(
          expected.invalidUsername,
        );
      });
    },
  );

  test(
    '[TC-ACG-RU-012][SCR-ACG-RU-012] Login with invalid password',
    async ({ page, sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-012
      // script_id    : SCR-ACG-RU-012
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Step 27 — Enter valid username.
      await test.step('Step 27 — Enter valid username.', async () => {
        // Traceability: TC-ACG-RU-012
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterUsername(validUsername);
      });

      // Step 28 — Enter invalid password.
      await test.step('Step 28 — Enter invalid password.', async () => {
        // Traceability: TC-ACG-RU-012
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterPassword(invalidPassword);
      });

      // Step 29 — Click Login.
      await test.step('Step 29 — Click Login.', async () => {
        // Traceability: TC-ACG-RU-012
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.clickLoginButton();
        // Traceability: TC-ACG-RU-012
        await expect(page).toHaveURL(new URL('/', baseUrl).toString());
        // Traceability: TC-ACG-RU-012
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
        // Traceability: TC-ACG-RU-012
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoLoginPage.getErrorMessageLocator()).toContainText(
          expected.invalidPassword,
        );
      });
    },
  );

  test(
    '[TC-ACG-RU-013][SCR-ACG-RU-013] Open cart without products',
    async ({ page, sauceDemoLoginPage, inventoryPage, sauceDemoCartPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-013
      // script_id    : SCR-ACG-RU-013
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Step 30 — Login successfully.
      await test.step('Step 30 — Login successfully.', async () => {
        // Traceability: TC-ACG-RU-013
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.login(validUsername, validPassword);
        // Traceability: TC-ACG-RU-013
        await expect(page).toHaveURL(/inventory/);
      });

      // Step 31 — Open cart without adding products.
      await test.step('Step 31 — Open cart without adding products.', async () => {
        // Traceability: TC-ACG-RU-013
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
        // Traceability: TC-ACG-RU-013
        await expect(page).toHaveURL(/cart/);
        // Traceability: TC-ACG-RU-013
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(0);
        // Traceability: TC-ACG-RU-013
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(inventoryPage.getCartBadgeLocator()).not.toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-014][SCR-ACG-RU-014] Checkout with blank first name',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
      checkoutInfoPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-014
      // script_id    : SCR-ACG-RU-014
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Step 32 — Add product to cart.
      await test.step('Step 32 — Add product to cart.', async () => {
        // Traceability: TC-ACG-RU-014
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.login(validUsername, validPassword);
        // Traceability: TC-ACG-RU-014
        await expect(page).toHaveURL(/inventory/);
        // Traceability: TC-ACG-RU-014
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);
      });

      // Step 33 — Open Checkout page.
      await test.step('Step 33 — Open Checkout page.', async () => {
        // Traceability: TC-ACG-RU-014
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
        // Traceability: TC-ACG-RU-014
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoCartPage.clickCheckout();
        // Traceability: TC-ACG-RU-014
        await expect(page).toHaveURL(/checkout-step-one/);
      });

      // Step 34 — Leave First Name empty.
      await test.step('Step 34 — Leave First Name empty.', async () => {
        // Traceability: TC-ACG-RU-014
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterFirstName('');
      });

      // Step 35 — Enter Last Name and Postal Code.
      await test.step('Step 35 — Enter Last Name and Postal Code.', async () => {
        // Traceability: TC-ACG-RU-014
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterLastName(checkoutData.lastName);
        // Traceability: TC-ACG-RU-014
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterPostalCode(checkoutData.postalCode);
      });

      // Step 36 — Click Continue.
      await test.step('Step 36 — Click Continue.', async () => {
        // Traceability: TC-ACG-RU-014
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.clickContinue();
        // Traceability: TC-ACG-RU-014
        await expect(page).toHaveURL(/checkout-step-one/);
        // Traceability: TC-ACG-RU-014
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(checkoutInfoPage.getErrorLocator()).toContainText(
          expected.emptyFirstName,
        );
      });
    },
  );

  test(
    '[TC-ACG-RU-015][SCR-ACG-RU-015] Checkout with blank last name',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
      checkoutInfoPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-015
      // script_id    : SCR-ACG-RU-015
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Step 37 — Add product to cart.
      await test.step('Step 37 — Add product to cart.', async () => {
        // Traceability: TC-ACG-RU-015
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.login(validUsername, validPassword);
        // Traceability: TC-ACG-RU-015
        await expect(page).toHaveURL(/inventory/);
        // Traceability: TC-ACG-RU-015
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);
      });

      // Step 38 — Open Checkout page.
      await test.step('Step 38 — Open Checkout page.', async () => {
        // Traceability: TC-ACG-RU-015
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
        // Traceability: TC-ACG-RU-015
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoCartPage.clickCheckout();
        // Traceability: TC-ACG-RU-015
        await expect(page).toHaveURL(/checkout-step-one/);
      });

      // Step 39 — Enter First Name.
      await test.step('Step 39 — Enter First Name.', async () => {
        // Traceability: TC-ACG-RU-015
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterFirstName(checkoutData.firstName);
      });

      // Step 40 — Leave Last Name empty.
      await test.step('Step 40 — Leave Last Name empty.', async () => {
        // Traceability: TC-ACG-RU-015
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterLastName('');
      });

      // Step 41 — Enter Postal Code.
      await test.step('Step 41 — Enter Postal Code.', async () => {
        // Traceability: TC-ACG-RU-015
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterPostalCode(checkoutData.postalCode);
      });

      // Step 42 — Click Continue.
      await test.step('Step 42 — Click Continue.', async () => {
        // Traceability: TC-ACG-RU-015
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.clickContinue();
        // Traceability: TC-ACG-RU-015
        await expect(page).toHaveURL(/checkout-step-one/);
        // Traceability: TC-ACG-RU-015
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(checkoutInfoPage.getErrorLocator()).toContainText(
          expected.emptyLastName,
        );
      });
    },
  );

  test(
    '[TC-ACG-RU-016][SCR-ACG-RU-016] Checkout with blank postal code',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
      checkoutInfoPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-016
      // script_id    : SCR-ACG-RU-016
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Step 43 — Add product to cart.
      await test.step('Step 43 — Add product to cart.', async () => {
        // Traceability: TC-ACG-RU-016
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.login(validUsername, validPassword);
        // Traceability: TC-ACG-RU-016
        await expect(page).toHaveURL(/inventory/);
        // Traceability: TC-ACG-RU-016
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);
      });

      // Step 44 — Open Checkout page.
      await test.step('Step 44 — Open Checkout page.', async () => {
        // Traceability: TC-ACG-RU-016
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
        // Traceability: TC-ACG-RU-016
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoCartPage.clickCheckout();
        // Traceability: TC-ACG-RU-016
        await expect(page).toHaveURL(/checkout-step-one/);
      });

      // Step 45 — Enter First Name.
      await test.step('Step 45 — Enter First Name.', async () => {
        // Traceability: TC-ACG-RU-016
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterFirstName(checkoutData.firstName);
      });

      // Step 46 — Enter Last Name.
      await test.step('Step 46 — Enter Last Name.', async () => {
        // Traceability: TC-ACG-RU-016
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterLastName(checkoutData.lastName);
      });

      // Step 47 — Leave Postal Code empty.
      await test.step('Step 47 — Leave Postal Code empty.', async () => {
        // Traceability: TC-ACG-RU-016
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterPostalCode('');
      });

      // Step 48 — Click Continue.
      await test.step('Step 48 — Click Continue.', async () => {
        // Traceability: TC-ACG-RU-016
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.clickContinue();
        // Traceability: TC-ACG-RU-016
        await expect(page).toHaveURL(/checkout-step-one/);
        // Traceability: TC-ACG-RU-016
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(checkoutInfoPage.getErrorLocator()).toContainText(
          expected.emptyPostalCode,
        );
      });
    },
  );

  test(
    '[TC-ACG-RU-017][SCR-ACG-RU-017] Checkout with all fields blank',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
      checkoutInfoPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-017
      // script_id    : SCR-ACG-RU-017
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Step 49 — Add item to cart.
      await test.step('Step 49 — Add item to cart.', async () => {
        // Traceability: TC-ACG-RU-017
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.login(validUsername, validPassword);
        // Traceability: TC-ACG-RU-017
        await expect(page).toHaveURL(/inventory/);
        // Traceability: TC-ACG-RU-017
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);
      });

      // Step 50 — Click Checkout.
      await test.step('Step 50 — Click Checkout.', async () => {
        // Traceability: TC-ACG-RU-017
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
        // Traceability: TC-ACG-RU-017
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoCartPage.clickCheckout();
        // Traceability: TC-ACG-RU-017
        await expect(page).toHaveURL(/checkout-step-one/);
      });

      // Step 51 — Leave all fields empty.
      await test.step('Step 51 — Leave all fields empty.', async () => {
        // Traceability: TC-ACG-RU-017
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.fillCheckoutInfo('', '', '');
      });

      // Step 52 — Click Continue.
      await test.step('Step 52 — Click Continue.', async () => {
        // Traceability: TC-ACG-RU-017
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.clickContinue();
        // Traceability: TC-ACG-RU-017
        await expect(page).toHaveURL(/checkout-step-one/);
        // Traceability: TC-ACG-RU-017
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(checkoutInfoPage.getErrorLocator()).toContainText(
          expected.emptyCheckout,
        );
      });
    },
  );

  test(
    '[TC-ACG-RU-018][SCR-ACG-RU-018] Login and open cart without products',
    async ({ page, sauceDemoLoginPage, inventoryPage, sauceDemoCartPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-018
      // script_id    : SCR-ACG-RU-018
      // acg_run_id   : ACG-RUN-20261027-003
      // ─────────────────────────────────────────────────────────

      // Step 53 — Login.
      await test.step('Step 53 — Login.', async () => {
        // Traceability: TC-ACG-RU-018
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.login(validUsername, validPassword);
        // Traceability: TC-ACG-RU-018
        await expect(page).toHaveURL(/inventory/);
      });

      // Step 54 — Open cart without products.
      await test.step('Step 54 — Open cart without products.', async () => {
        // Traceability: TC-ACG-RU-018
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
        // Traceability: TC-ACG-RU-018
        await expect(page).toHaveURL(/cart/);
        // Traceability: TC-ACG-RU-018
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(0);
        // Traceability: TC-ACG-RU-018
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(inventoryPage.getCartBadgeLocator()).not.toBeVisible();
      });
    },
  );
});