// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// TARGET_BROWSER  → set TARGET_BROWSER in .env (assumed: framework primary browser)
// AUT_MODULES_IN_SCOPE  → set AUT_MODULES_IN_SCOPE in .env (assumed: inferred from test case document titles/tags)
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

function requiredPattern(name: string): RegExp {
  return new RegExp(requiredEnv(name));
}

const readiness = {
  targetBrowser:
    process.env.TARGET_BROWSER ??
    // STUB: TARGET_BROWSER not confirmed — using framework primary browser
    'chromium',
  modulesInScope:
    process.env.AUT_MODULES_IN_SCOPE ??
    // STUB: AUT_MODULES_IN_SCOPE not confirmed — using inferred SauceDemo scope
    'SauceDemo',
  liveAutAccessible:
    process.env.LIVE_AUT_ACCESSIBLE ??
    // STUB: LIVE_AUT_ACCESSIBLE not confirmed — using false
    'false',
};

const baseUrl = requiredEnv('BASE_URL');
const loginUrlPattern = requiredPattern('SD_LOGIN_URL_PATTERN');
const inventoryUrlPattern = requiredPattern('SD_INVENTORY_URL_PATTERN');
const cartUrlPattern = requiredPattern('SD_CART_URL_PATTERN');
const checkoutStepOneUrlPattern = requiredPattern('SD_CHECKOUT_STEP_ONE_URL_PATTERN');
const checkoutStepTwoUrlPattern = requiredPattern('SD_CHECKOUT_STEP_TWO_URL_PATTERN');
const completeUrlPattern = requiredPattern('SD_COMPLETE_URL_PATTERN');
const cancelDestinationPattern = requiredPattern('SD_CANCEL_DESTINATION_PATTERN');

const validLoginData = {
  username: requiredEnv('SD_USERNAME'),
  password: requiredEnv('SD_PASSWORD'),
};

const invalidLoginData = {
  username: requiredEnv('SD_INVALID_USERNAME'),
  password: requiredEnv('SD_INVALID_PASSWORD'),
};

const checkoutData = {
  firstName: requiredEnv('SD_FIRST_NAME'),
  lastName: requiredEnv('SD_LAST_NAME'),
  postalCode: requiredEnv('SD_POSTAL_CODE'),
};

void readiness;

test.describe('SauceDemo Swag Labs — ACG-RUN-20261011-005', () => {
  // ─────────────────────────────────────────────────────────────────────────
  // Setup — required lifecycle preparation
  // Addresses T3-LCY-01.
  // ─────────────────────────────────────────────────────────────────────────
  test.beforeEach(async ({ page, sauceDemoLoginPage }) => {
    // LOCATOR_UNCONFIRMED — not in AUT KB
    await page.goto(baseUrl);
    // Traceability: framework setup
    await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
  });

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({
        path: testInfo.outputPath('screenshot-on-failure.png'),
      });
    }
  });

  test(
    '[TC-ACG-RU-001][SCR-ACG-RU-001] Valid Login',
    async ({ page, sauceDemoLoginPage, inventoryPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-001
      // script_id    : SCR-ACG-RU-001
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────

      // Step 1 — Enter username.
      await test.step('Step 1 — Enter username.', async () => {
        // Traceability: [tag RIARA-TC-01]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterUsername(validLoginData.username);
      });

      // Step 2 — Enter password.
      await test.step('Step 2 — Enter password.', async () => {
        // Traceability: [tag RIARA-TC-01]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterPassword(validLoginData.password);
      });

      // Step 3 — Click Login button.
      await test.step('Step 3 — Click Login button.', async () => {
        // Traceability: [tag RIARA-TC-01]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.clickLoginButton();
        // Traceability: [tag RIARA-TC-01]
        await expect(page).toHaveURL(inventoryUrlPattern);
        // Traceability: [tag RIARA-TC-01]
        await expect(inventoryPage.getInventoryListLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-002][SCR-ACG-RU-002] View Products',
    async ({ sauceDemoLoginPage, inventoryPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-002
      // script_id    : SCR-ACG-RU-002
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────
      await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);
      // Traceability: [tag RIARA-TC-02]
      await expect(inventoryPage.getInventoryListLocator()).toBeVisible();
      // Traceability: [tag RIARA-TC-02]
      await expect(inventoryPage.getFirstProductNameLocator()).toBeVisible();
      // Traceability: [tag RIARA-TC-02]
      await expect(inventoryPage.getFirstProductDescLocator()).toBeVisible();
      // Traceability: [tag RIARA-TC-02]
      await expect(inventoryPage.getFirstProductPriceLocator()).toBeVisible();
      // Traceability: [tag RIARA-TC-02]
      await expect(inventoryPage.getFirstProductImageLocator()).toBeVisible();
    },
  );

  test(
    '[TC-ACG-RU-003][SCR-ACG-RU-003] Sort Products',
    async ({ sauceDemoLoginPage, inventoryPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-003
      // script_id    : SCR-ACG-RU-003
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────
      await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);
      // Traceability: [tag RIARA-TC-03]
      await inventoryPage.selectSortOption('az');
      await expect(inventoryPage.getFirstProductNameLocator()).toBeVisible();
      // Traceability: [tag RIARA-TC-03]
      await inventoryPage.selectSortOption('za');
      await expect(inventoryPage.getFirstProductNameLocator()).toBeVisible();
      // Traceability: [tag RIARA-TC-03]
      await inventoryPage.selectSortOption('lohi');
      await expect(inventoryPage.getFirstProductPriceLocator()).toBeVisible();
      // Traceability: [tag RIARA-TC-03]
      await inventoryPage.selectSortOption('hilo');
      await expect(inventoryPage.getFirstProductPriceLocator()).toBeVisible();
    },
  );

  test(
    '[TC-ACG-RU-004][SCR-ACG-RU-004] Add Product',
    async ({ sauceDemoLoginPage, inventoryPage, sauceDemoCartPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-004
      // script_id    : SCR-ACG-RU-004
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────
      await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);

      // Step 4 — Click Add to Cart for a product.
      await test.step('Step 4 — Click Add to Cart for a product.', async () => {
        // Traceability: [tag RIARA-TC-04]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);
        // Traceability: [tag RIARA-TC-04]
        await expect(inventoryPage.getCartBadgeLocator()).toHaveText('1');
        await inventoryPage.clickCartIcon();
        // Traceability: [tag RIARA-TC-04]
        await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(1);
      });
    },
  );

  test(
    '[TC-ACG-RU-005][SCR-ACG-RU-005] Remove Product',
    async ({ sauceDemoLoginPage, inventoryPage, sauceDemoCartPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-005
      // script_id    : SCR-ACG-RU-005
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────
      await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);

      // Step 5 — Click Remove button.
      await test.step('Step 5 — Click Remove button.', async () => {
        // Traceability: [tag RIARA-TC-05]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);
        await inventoryPage.clickRemoveFromCartByIndex(0);
        await expect(inventoryPage.getCartBadgeLocator()).not.toBeVisible();
        await inventoryPage.clickCartIcon();
        // Traceability: [tag RIARA-TC-05]
        await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(0);
      });
    },
  );

  test(
    '[TC-ACG-RU-006][SCR-ACG-RU-006] View Cart',
    async ({ page, sauceDemoLoginPage, inventoryPage, sauceDemoCartPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-006
      // script_id    : SCR-ACG-RU-006
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────
      await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);
      await inventoryPage.clickAddToCartByIndex(0);

      // Step 6 — Click Cart icon.
      await test.step('Step 6 — Click Cart icon.', async () => {
        // Traceability: [tag RIARA-TC-06]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
      });

      // Step 7 — Open Cart.
      await test.step('Step 7 — Open Cart.', async () => {
        // Traceability: [tag RIARA-TC-06]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(page).toHaveURL(cartUrlPattern);
        await expect(sauceDemoCartPage.getCartListLocator()).toBeVisible();
        await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(1);
      });
    },
  );

  test(
    '[TC-ACG-RU-007][SCR-ACG-RU-007] Checkout',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
      checkoutInfoPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-007
      // script_id    : SCR-ACG-RU-007
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────
      await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);

      // Step 8 — Click Checkout.
      await test.step('Step 8 — Click Checkout.', async () => {
        // Traceability: [tag RIARA-TC-07]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);
        await inventoryPage.clickCartIcon();
        await sauceDemoCartPage.clickCheckout();
      });

      // Step 9 — Enter: First Name, Last Name, Postal Code
      await test.step('Step 9 — Enter: First Name, Last Name, Postal Code', async () => {
        // Traceability: [tag RIARA-TC-07]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.fillCheckoutInfo(
          checkoutData.firstName,
          checkoutData.lastName,
          checkoutData.postalCode,
        );
      });

      // Step 10 — Click Continue.
      await test.step('Step 10 — Click Continue.', async () => {
        // Traceability: [tag RIARA-TC-07]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.clickContinue();
        await expect(page).toHaveURL(checkoutStepTwoUrlPattern);
      });
    },
  );

  test(
    '[TC-ACG-RU-008][SCR-ACG-RU-008] Complete Order',
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
      // test_case_id : TC-ACG-RU-008
      // script_id    : SCR-ACG-RU-008
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────
      await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);
      await inventoryPage.clickAddToCartByIndex(0);
      await inventoryPage.clickCartIcon();
      await sauceDemoCartPage.clickCheckout();
      await checkoutInfoPage.fillCheckoutInfo(
        checkoutData.firstName,
        checkoutData.lastName,
        checkoutData.postalCode,
      );
      await checkoutInfoPage.clickContinue();

      // Step 11 — Review order details.
      await test.step('Step 11 — Review order details.', async () => {
        // Traceability: [tag RIARA-TC-08]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(checkoutOverviewPage.getOrderSummaryLocator()).toBeVisible();
      });

      // Step 12 — Click Finish.
      await test.step('Step 12 — Click Finish.', async () => {
        // Traceability: [tag RIARA-TC-08]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutOverviewPage.clickFinish();
        await expect(page).toHaveURL(completeUrlPattern);
        await expect(checkoutCompletePage.getCompleteContainerLocator()).toBeVisible();
        await expect(checkoutCompletePage.getSuccessHeaderLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-009][SCR-ACG-RU-009] Cancel Checkout',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
      checkoutInfoPage,
      checkoutOverviewPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-009
      // script_id    : SCR-ACG-RU-009
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────
      await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);
      await inventoryPage.clickAddToCartByIndex(0);
      await inventoryPage.clickCartIcon();
      await sauceDemoCartPage.clickCheckout();
      await checkoutInfoPage.fillCheckoutInfo(
        checkoutData.firstName,
        checkoutData.lastName,
        checkoutData.postalCode,
      );
      await checkoutInfoPage.clickContinue();

      // Step 13 — Open menu.
      await test.step('Step 13 — Open menu.', async () => {
        // Traceability: [tag RIARA-TC-09]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutOverviewPage.clickCancel();
        await expect(page).toHaveURL(cancelDestinationPattern);
      });
    },
  );

  test(
    '[TC-ACG-RU-010][SCR-ACG-RU-010] Logout',
    async ({ page, sauceDemoLoginPage, inventoryPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-010
      // script_id    : SCR-ACG-RU-010
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────
      await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);

      // Step 13 — Open menu.
      await test.step('Step 13 — Open menu.', async () => {
        // Traceability: [tag RIARA-TC-10]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.openMenu();
      });

      // Step 14 — Click Logout.
      await test.step('Step 14 — Click Logout.', async () => {
        // Traceability: [tag RIARA-TC-10]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickLogout();
        await expect(page).toHaveURL(loginUrlPattern);
        await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-011][SCR-ACG-RU-011] Empty Username',
    async ({ page, sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-011
      // script_id    : SCR-ACG-RU-011
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────

      // Step 15 — Leave Username blank.
      await test.step('Step 15 — Leave Username blank.', async () => {
        // Traceability: [tag RIARA-TC-11]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterUsername('');
      });

      // Step 16 — Enter valid Password.
      await test.step('Step 16 — Enter valid Password.', async () => {
        // Traceability: [tag RIARA-TC-11]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterPassword(validLoginData.password);
      });

      // Step 17 — Click Login.
      await test.step('Step 17 — Click Login.', async () => {
        // Traceability: [tag RIARA-TC-11]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.clickLoginButton();
        await expect(page).toHaveURL(loginUrlPattern);
        await expect(sauceDemoLoginPage.getErrorMessageLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-012][SCR-ACG-RU-012] Empty Password',
    async ({ page, sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-012
      // script_id    : SCR-ACG-RU-012
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────

      // Step 18 — Enter valid Username.
      await test.step('Step 18 — Enter valid Username.', async () => {
        // Traceability: [tag RIARA-TC-12]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterUsername(validLoginData.username);
      });

      // Step 19 — Leave Password blank.
      await test.step('Step 19 — Leave Password blank.', async () => {
        // Traceability: [tag RIARA-TC-12]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterPassword('');
      });

      // Step 20 — Click Login.
      await test.step('Step 20 — Click Login.', async () => {
        // Traceability: [tag RIARA-TC-12]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.clickLoginButton();
        await expect(page).toHaveURL(loginUrlPattern);
        await expect(sauceDemoLoginPage.getErrorMessageLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-013][SCR-ACG-RU-013] Empty Credentials',
    async ({ sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-013
      // script_id    : SCR-ACG-RU-013
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────

      // Step 21 — Leave Username blank.
      await test.step('Step 21 — Leave Username blank.', async () => {
        // Traceability: [tag RIARA-TC-13]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterUsername('');
      });

      // Step 22 — Leave Password blank.
      await test.step('Step 22 — Leave Password blank.', async () => {
        // Traceability: [tag RIARA-TC-13]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterPassword('');
      });

      // Step 23 — Click Login.
      await test.step('Step 23 — Click Login.', async () => {
        // Traceability: [tag RIARA-TC-13]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.clickLoginButton();
        await expect(sauceDemoLoginPage.getErrorMessageLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-014][SCR-ACG-RU-014] Invalid Username',
    async ({ page, sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-014
      // script_id    : SCR-ACG-RU-014
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────

      // Step 24 — Enter invalid username.
      await test.step('Step 24 — Enter invalid username.', async () => {
        // Traceability: [tag RIARA-TC-14]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterUsername(invalidLoginData.username);
      });

      // Step 25 — Enter valid password.
      await test.step('Step 25 — Enter valid password.', async () => {
        // Traceability: [tag RIARA-TC-14]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterPassword(validLoginData.password);
      });

      // Step 26 — Click Login.
      await test.step('Step 26 — Click Login.', async () => {
        // Traceability: [tag RIARA-TC-14]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.clickLoginButton();
        await expect(page).toHaveURL(loginUrlPattern);
        await expect(sauceDemoLoginPage.getErrorMessageLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-015][SCR-ACG-RU-015] Invalid Password',
    async ({ page, sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-015
      // script_id    : SCR-ACG-RU-015
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────

      // Step 27 — Enter valid username.
      await test.step('Step 27 — Enter valid username.', async () => {
        // Traceability: [tag RIARA-TC-15]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterUsername(validLoginData.username);
      });

      // Step 28 — Enter invalid password.
      await test.step('Step 28 — Enter invalid password.', async () => {
        // Traceability: [tag RIARA-TC-15]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterPassword(invalidLoginData.password);
      });

      // Step 29 — Click Login.
      await test.step('Step 29 — Click Login.', async () => {
        // Traceability: [tag RIARA-TC-15]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.clickLoginButton();
        await expect(page).toHaveURL(loginUrlPattern);
        await expect(sauceDemoLoginPage.getErrorMessageLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-016][SCR-ACG-RU-016] Empty Cart Access',
    async ({ page, sauceDemoLoginPage, inventoryPage, sauceDemoCartPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-016
      // script_id    : SCR-ACG-RU-016
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────

      // Step 30 — Login successfully.
      await test.step('Step 30 — Login successfully.', async () => {
        // Traceability: [tag RIARA-TC-16]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);
        await expect(page).toHaveURL(inventoryUrlPattern);
      });

      // Step 31 — Open cart without adding products.
      await test.step('Step 31 — Open cart without adding products.', async () => {
        // Traceability: [tag RIARA-TC-16]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
        await expect(page).toHaveURL(cartUrlPattern);
        await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(0);
      });
    },
  );

  test(
    '[TC-ACG-RU-017][SCR-ACG-RU-017] Empty First Name',
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
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────
      await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);

      // Step 32 — Add product to cart.
      await test.step('Step 32 — Add product to cart.', async () => {
        // Traceability: [tag RIARA-TC-17]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);
      });

      // Step 33 — Open Checkout page.
      await test.step('Step 33 — Open Checkout page.', async () => {
        // Traceability: [tag RIARA-TC-17]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
        await sauceDemoCartPage.clickCheckout();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);
      });

      // Step 34 — Leave First Name empty.
      await test.step('Step 34 — Leave First Name empty.', async () => {
        // Traceability: [tag RIARA-TC-17]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterFirstName('');
      });

      // Step 35 — Enter Last Name and Postal Code.
      await test.step('Step 35 — Enter Last Name and Postal Code.', async () => {
        // Traceability: [tag RIARA-TC-17]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterLastName(checkoutData.lastName);
        await checkoutInfoPage.enterPostalCode(checkoutData.postalCode);
      });

      // Step 36 — Click Continue.
      await test.step('Step 36 — Click Continue.', async () => {
        // Traceability: [tag RIARA-TC-17]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.clickContinue();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);
        await expect(checkoutInfoPage.getErrorLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-018][SCR-ACG-RU-018] Empty Last Name',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
      checkoutInfoPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-018
      // script_id    : SCR-ACG-RU-018
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────
      await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);

      // Step 37 — Add product to cart.
      await test.step('Step 37 — Add product to cart.', async () => {
        // Traceability: [tag RIARA-TC-18]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);
      });

      // Step 38 — Open Checkout page.
      await test.step('Step 38 — Open Checkout page.', async () => {
        // Traceability: [tag RIARA-TC-18]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
        await sauceDemoCartPage.clickCheckout();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);
      });

      // Step 39 — Enter First Name.
      await test.step('Step 39 — Enter First Name.', async () => {
        // Traceability: [tag RIARA-TC-18]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterFirstName(checkoutData.firstName);
      });

      // Step 40 — Leave Last Name empty.
      await test.step('Step 40 — Leave Last Name empty.', async () => {
        // Traceability: [tag RIARA-TC-18]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterLastName('');
      });

      // Step 41 — Enter Postal Code.
      await test.step('Step 41 — Enter Postal Code.', async () => {
        // Traceability: [tag RIARA-TC-18]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterPostalCode(checkoutData.postalCode);
      });

      // Step 42 — Click Continue.
      await test.step('Step 42 — Click Continue.', async () => {
        // Traceability: [tag RIARA-TC-18]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.clickContinue();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);
        await expect(checkoutInfoPage.getErrorLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-019][SCR-ACG-RU-019] Empty Postal Code',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
      checkoutInfoPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-019
      // script_id    : SCR-ACG-RU-019
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────
      await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);

      // Step 43 — Add product to cart.
      await test.step('Step 43 — Add product to cart.', async () => {
        // Traceability: [tag RIARA-TC-19]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);
      });

      // Step 44 — Open Checkout page.
      await test.step('Step 44 — Open Checkout page.', async () => {
        // Traceability: [tag RIARA-TC-19]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
        await sauceDemoCartPage.clickCheckout();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);
      });

      // Step 45 — Enter First Name.
      await test.step('Step 45 — Enter First Name.', async () => {
        // Traceability: [tag RIARA-TC-19]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterFirstName(checkoutData.firstName);
      });

      // Step 46 — Enter Last Name.
      await test.step('Step 46 — Enter Last Name.', async () => {
        // Traceability: [tag RIARA-TC-19]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterLastName(checkoutData.lastName);
      });

      // Step 47 — Leave Postal Code empty.
      await test.step('Step 47 — Leave Postal Code empty.', async () => {
        // Traceability: [tag RIARA-TC-19]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.enterPostalCode('');
      });

      // Step 48 — Click Continue.
      await test.step('Step 48 — Click Continue.', async () => {
        // Traceability: [tag RIARA-TC-19]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.clickContinue();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);
        await expect(checkoutInfoPage.getErrorLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-020][SCR-ACG-RU-020] All Checkout Fields Empty',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
      checkoutInfoPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-020
      // script_id    : SCR-ACG-RU-020
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────
      await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);

      // Step 49 — Add item to cart.
      await test.step('Step 49 — Add item to cart.', async () => {
        // Traceability: [tag RIARA-TC-20]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);
      });

      // Step 50 — Click Checkout.
      await test.step('Step 50 — Click Checkout.', async () => {
        // Traceability: [tag RIARA-TC-20]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
        await sauceDemoCartPage.clickCheckout();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);
      });

      // Step 51 — Leave all fields empty.
      await test.step('Step 51 — Leave all fields empty.', async () => {
        // Traceability: [tag RIARA-TC-20]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.fillCheckoutInfo('', '', '');
      });

      // Step 52 — Click Continue.
      await test.step('Step 52 — Click Continue.', async () => {
        // Traceability: [tag RIARA-TC-20]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.clickContinue();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);
        await expect(checkoutInfoPage.getErrorLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-021][SCR-ACG-RU-021] Empty Cart Checkout',
    async ({ page, sauceDemoLoginPage, inventoryPage, sauceDemoCartPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-021
      // script_id    : SCR-ACG-RU-021
      // acg_run_id   : ACG-RUN-20261011-005
      // ─────────────────────────────────────────────────────────

      // Step 53 — Login.
      await test.step('Step 53 — Login.', async () => {
        // Traceability: [tag RIARA-TC-21]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.login(validLoginData.username, validLoginData.password);
        await expect(page).toHaveURL(inventoryUrlPattern);
      });

      // Step 54 — Open cart without products.
      await test.step('Step 54 — Open cart without products.', async () => {
        // Traceability: [tag RIARA-TC-21]
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();
        await expect(page).toHaveURL(cartUrlPattern);
        await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(0);
      });
    },
  );
});