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

const emptyCartCheckoutBehavior = requiredEnv(
  'SD_EMPTY_CART_CHECKOUT_BEHAVIOR',
);

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

test.describe(
  'SauceDemo Swag Labs — Functional and Error Handling Coverage',
  () => {
    test.beforeEach(async ({ sauceDemoLoginPage }) => {
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
      '[TC-ACG-RU-001][SCR-ACG-RU-001] Valid checkout and logout flow',
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
        // test_case_id : TC-ACG-RU-001
        // script_id    : SCR-ACG-RU-001
        // acg_run_id   : ACG-RUN-20261012-009
        // Traceability tags: FR-01, FR-02, FR-03, FR-04, FR-05, FR-06, FR-07, FR-08, FR-09, FR-10
        // ─────────────────────────────────────────────────────────

        // Step 1 — Enter username.
        // Traceability: FR-01
        await test.step('Step 1 — Enter username.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.enterUsername(validUsername);
        });

        // Step 2 — Enter password.
        // Traceability: FR-01
        await test.step('Step 2 — Enter password.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.enterPassword(validPassword);
        });

        // Step 3 — Click Login button.
        // Traceability: FR-01
        await test.step('Step 3 — Click Login button.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.clickLoginButton();
          // Traceability: FR-01
          await expect(page).toHaveURL(/inventory/);
        });

        // Step 4 — Click Add to Cart for a product.
        // Traceability: FR-04
        await test.step(
          'Step 4 — Click Add to Cart for a product.',
          async () => {
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await inventoryPage.clickAddToCartByIndex(0);
            // Traceability: FR-04
            await expect(inventoryPage.getCartBadgeLocator()).toBeVisible();
            // Traceability: FR-04
            await expect(inventoryPage.getCartBadgeLocator()).toHaveText('1');
          },
        );

        // Step 5 — Click Remove button.
        // Traceability: FR-05
        await test.step('Step 5 — Click Remove button.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await inventoryPage.clickRemoveFromCartByIndex(0);
          // Traceability: FR-05
          await expect(inventoryPage.getCartBadgeLocator()).not.toBeVisible();
        });

        // Step 6 — Click Cart icon.
        // Traceability: FR-06
        await test.step('Step 6 — Click Cart icon.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await inventoryPage.clickCartIcon();
          // Traceability: FR-06
          await expect(page).toHaveURL(/cart/);
        });

        // Step 7 — Open Cart.
        // Traceability: FR-06
        await test.step('Step 7 — Open Cart.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const cartLoaded = await sauceDemoCartPage.validate();
          // Traceability: FR-06
          await expect(sauceDemoCartPage.getCartListLocator()).toBeVisible();
          // PT-005 correction: assertion is awaited.
          // Traceability: FR-06
          await expect(cartLoaded).toBe(true);
        });

        // Step 8 — Click Checkout.
        // Traceability: FR-07
        await test.step('Step 8 — Click Checkout.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoCartPage.clickCheckout();
          // Traceability: FR-07
          await expect(page).toHaveURL(/checkout-step-one/);
        });

        // Step 9 — Enter: First Name, Last Name, Postal Code.
        // Traceability: FR-07
        await test.step(
          'Step 9 — Enter: First Name, Last Name, Postal Code.',
          async () => {
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await checkoutInfoPage.enterFirstName(checkoutData.firstName);
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await checkoutInfoPage.enterLastName(checkoutData.lastName);
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await checkoutInfoPage.enterPostalCode(checkoutData.postalCode);
          },
        );

        // Step 10 — Click Continue.
        // Traceability: FR-07
        await test.step('Step 10 — Click Continue.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await checkoutInfoPage.clickContinue();
          // Traceability: FR-07
          await expect(page).toHaveURL(/checkout-step-two/);
        });

        // Step 11 — Review order details.
        // Traceability: FR-08
        await test.step('Step 11 — Review order details.', async () => {
          // Traceability: FR-08
          await expect(
            checkoutOverviewPage.getOrderSummaryLocator(),
          ).toBeVisible();
          // Traceability: FR-08
          await expect(
            checkoutOverviewPage.getCartItemsLocator(),
          ).toBeVisible();
        });

        // Step 12 — Click Finish.
        // Traceability: FR-08
        await test.step('Step 12 — Click Finish.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await checkoutOverviewPage.clickFinish();
          // Traceability: FR-08
          await expect(page).toHaveURL(/checkout-complete/);
          // Traceability: FR-08
          await expect(
            checkoutCompletePage.getCompleteContainerLocator(),
          ).toBeVisible();
          // Traceability: FR-08
          await expect(
            checkoutCompletePage.getSuccessHeaderLocator(),
          ).toBeVisible();
        });

        // Step 13 — Open menu.
        // Traceability: FR-09
        await test.step('Step 13 — Open menu.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await inventoryPage.openMenu();
        });

        // Step 14 — Click Logout.
        // Traceability: FR-10
        await test.step('Step 14 — Click Logout.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await inventoryPage.clickLogout();
          // Traceability: FR-10
          await expect(page).toHaveURL(/\/$/);
          // Traceability: FR-10
          await expect(
            sauceDemoLoginPage.getLoginButtonLocator(),
          ).toBeVisible();
        });
      },
    );

    test(
      '[TC-ACG-RU-002][SCR-ACG-RU-002] Empty username validation',
      async ({ page, sauceDemoLoginPage }) => {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-ACG-RU-002
        // script_id    : SCR-ACG-RU-002
        // acg_run_id   : ACG-RUN-20261012-009
        // ─────────────────────────────────────────────────────────

        // Step 15 — Leave Username blank.
        // Traceability: TC-ACG-RU-002
        await test.step('Step 15 — Leave Username blank.', async () => {
          // Username remains blank after setup.
          // Traceability: TC-ACG-RU-002
          await expect(page).toHaveURL(/\/$/);
        });

        // Step 16 — Enter valid Password.
        // Traceability: TC-ACG-RU-002
        await test.step('Step 16 — Enter valid Password.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.enterPassword(validPassword);
        });

        // Step 17 — Click Login.
        // Traceability: TC-ACG-RU-002
        await test.step('Step 17 — Click Login.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.clickLoginButton();
          // Traceability: ER-01
          await expect(page).toHaveURL(/\/$/);
          // Traceability: ER-01
          await expect(
            sauceDemoLoginPage.getLoginButtonLocator(),
          ).toBeVisible();
          // Traceability: ER-01
          await expect(
            sauceDemoLoginPage.getErrorMessageLocator(),
          ).toContainText(expected.emptyUsername);
        });
      },
    );

    test(
      '[TC-ACG-RU-003][SCR-ACG-RU-003] Empty password validation',
      async ({ page, sauceDemoLoginPage }) => {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-ACG-RU-003
        // script_id    : SCR-ACG-RU-003
        // acg_run_id   : ACG-RUN-20261012-009
        // ─────────────────────────────────────────────────────────

        // Step 18 — Enter valid Username.
        // Traceability: TC-ACG-RU-003
        await test.step('Step 18 — Enter valid Username.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.enterUsername(validUsername);
        });

        // Step 19 — Leave Password blank.
        // Traceability: TC-ACG-RU-003
        await test.step('Step 19 — Leave Password blank.', async () => {
          // Password remains blank after setup.
          // Traceability: TC-ACG-RU-003
          await expect(page).toHaveURL(/\/$/);
        });

        // Step 20 — Click Login.
        // Traceability: TC-ACG-RU-003
        await test.step('Step 20 — Click Login.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.clickLoginButton();
          // Traceability: ER-02
          await expect(page).toHaveURL(/\/$/);
          // Traceability: ER-02
          await expect(
            sauceDemoLoginPage.getLoginButtonLocator(),
          ).toBeVisible();
          // Traceability: ER-02
          await expect(
            sauceDemoLoginPage.getErrorMessageLocator(),
          ).toContainText(expected.emptyPassword);
        });
      },
    );

    test(
      '[TC-ACG-RU-004][SCR-ACG-RU-004] Empty username and password validation',
      async ({ page, sauceDemoLoginPage }) => {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-ACG-RU-004
        // script_id    : SCR-ACG-RU-004
        // acg_run_id   : ACG-RUN-20261012-009
        // ─────────────────────────────────────────────────────────

        // Step 21 — Leave Username blank.
        // Traceability: FR-10
        await test.step('Step 21 — Leave Username blank.', async () => {
          // Username remains blank after setup.
          // Traceability: FR-10
          await expect(page).toHaveURL(/\/$/);
        });

        // Step 22 — Leave Password blank.
        // Traceability: FR-10
        await test.step('Step 22 — Leave Password blank.', async () => {
          // Password remains blank after setup.
          // Traceability: FR-10
          await expect(page).toHaveURL(/\/$/);
        });

        // Step 23 — Click Login.
        // Traceability: FR-10
        await test.step('Step 23 — Click Login.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.clickLoginButton();
          // Traceability: ER-03
          await expect(page).toHaveURL(/\/$/);
          // Traceability: ER-03
          await expect(
            sauceDemoLoginPage.getLoginButtonLocator(),
          ).toBeVisible();
          // Traceability: ER-03
          await expect(
            sauceDemoLoginPage.getErrorMessageLocator(),
          ).toContainText(expected.emptyCredentials);
        });
      },
    );

    test(
      '[TC-ACG-RU-005][SCR-ACG-RU-005] Invalid username validation',
      async ({ page, sauceDemoLoginPage }) => {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-ACG-RU-005
        // script_id    : SCR-ACG-RU-005
        // acg_run_id   : ACG-RUN-20261012-009
        // ─────────────────────────────────────────────────────────

        // Step 24 — Enter invalid username.
        // Traceability: TC-ACG-RU-005
        await test.step('Step 24 — Enter invalid username.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.enterUsername(invalidUsername);
        });

        // Step 25 — Enter valid password.
        // Traceability: TC-ACG-RU-005
        await test.step('Step 25 — Enter valid password.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.enterPassword(validPassword);
        });

        // Step 26 — Click Login.
        // Traceability: TC-ACG-RU-005
        await test.step('Step 26 — Click Login.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.clickLoginButton();
          // Traceability: ER-04
          await expect(page).toHaveURL(/\/$/);
          // Traceability: ER-04
          await expect(
            sauceDemoLoginPage.getErrorMessageLocator(),
          ).toContainText(expected.invalidUsername);
        });
      },
    );

    test(
      '[TC-ACG-RU-006][SCR-ACG-RU-006] Invalid password and empty-cart access',
      async ({
        page,
        sauceDemoLoginPage,
        inventoryPage,
        sauceDemoCartPage,
      }) => {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-ACG-RU-006
        // script_id    : SCR-ACG-RU-006
        // acg_run_id   : ACG-RUN-20261012-009
        // ─────────────────────────────────────────────────────────

        // Step 27 — Enter valid Username.
        // Traceability: ER-06
        await test.step('Step 27 — Enter valid Username.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.enterUsername(validUsername);
        });

        // Step 28 — Enter invalid password.
        // Traceability: ER-06
        await test.step('Step 28 — Enter invalid password.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.enterPassword(invalidPassword);
        });

        // Step 29 — Click Login.
        // Traceability: ER-05
        await test.step('Step 29 — Click Login.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.clickLoginButton();
          // Traceability: ER-05
          await expect(page).toHaveURL(/\/$/);
          // Traceability: ER-05
          await expect(
            sauceDemoLoginPage.getErrorMessageLocator(),
          ).toContainText(expected.invalidPassword);
        });

        // Step 30 — Login successfully.
        // Traceability: FR-01
        await test.step('Step 30 — Login successfully.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.login(validUsername, validPassword);
          // Traceability: FR-01
          await expect(page).toHaveURL(/inventory/);
        });

        // Step 31 — Open cart without adding products.
        // Traceability: ER-06
        await test.step(
          'Step 31 — Open cart without adding products.',
          async () => {
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await inventoryPage.clickCartIcon();
            // Traceability: ER-06
            await expect(page).toHaveURL(/cart/);
            // Traceability: ER-06
            await expect(
              sauceDemoCartPage.getCartItemsLocator(),
            ).toHaveCount(0);
            // Traceability: ER-06
            await expect(inventoryPage.getCartBadgeLocator()).not.toBeVisible();
          },
        );
      },
    );

    test(
      '[TC-ACG-RU-007][SCR-ACG-RU-007] Checkout validation and empty-cart behavior',
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
        // acg_run_id   : ACG-RUN-20261012-009
        // ─────────────────────────────────────────────────────────

        // Step 32 — Add product to cart.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 32 — Add product to cart.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.login(validUsername, validPassword);
          // Traceability: TC-ACG-RU-007
          await expect(page).toHaveURL(/inventory/);
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await inventoryPage.clickAddToCartByIndex(0);
        });

        // Step 33 — Open Checkout page.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 33 — Open Checkout page.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await inventoryPage.clickCartIcon();
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoCartPage.clickCheckout();
          // Traceability: TC-ACG-RU-007
          await expect(page).toHaveURL(/checkout-step-one/);
        });

        // Step 34 — Leave First Name empty.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 34 — Leave First Name empty.', async () => {
          // First name remains blank.
          // Traceability: TC-ACG-RU-007
          await expect(page).toHaveURL(/checkout-step-one/);
        });

        // Step 35 — Enter Last Name and Postal Code.
        // Traceability: TC-ACG-RU-007
        await test.step(
          'Step 35 — Enter Last Name and Postal Code.',
          async () => {
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await checkoutInfoPage.enterLastName(checkoutData.lastName);
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await checkoutInfoPage.enterPostalCode(checkoutData.postalCode);
          },
        );

        // Step 36 — Click Continue.
        // Traceability: ER-07
        await test.step('Step 36 — Click Continue.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await checkoutInfoPage.clickContinue();
          // Traceability: ER-07
          await expect(page).toHaveURL(/checkout-step-one/);
          // Traceability: ER-07
          await expect(checkoutInfoPage.getErrorLocator()).toContainText(
            expected.emptyFirstName,
          );
        });

        // Step 37 — Add product to cart.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 37 — Add product to cart.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await page.goto(`${baseUrl}/inventory.html`);
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await inventoryPage.clickAddToCartByIndex(0);
        });

        // Step 38 — Open Checkout page.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 38 — Open Checkout page.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await inventoryPage.clickCartIcon();
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoCartPage.clickCheckout();
          // Traceability: TC-ACG-RU-007
          await expect(page).toHaveURL(/checkout-step-one/);
        });

        // Step 39 — Enter First Name.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 39 — Enter First Name.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await checkoutInfoPage.enterFirstName(checkoutData.firstName);
        });

        // Step 40 — Leave Last Name empty.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 40 — Leave Last Name empty.', async () => {
          // Last name remains blank.
          // Traceability: TC-ACG-RU-007
          await expect(page).toHaveURL(/checkout-step-one/);
        });

        // Step 41 — Enter Postal Code.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 41 — Enter Postal Code.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await checkoutInfoPage.enterPostalCode(checkoutData.postalCode);
        });

        // Step 42 — Click Continue.
        // Traceability: ER-08
        await test.step('Step 42 — Click Continue.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await checkoutInfoPage.clickContinue();
          // Traceability: ER-08
          await expect(page).toHaveURL(/checkout-step-one/);
          // Traceability: ER-08
          await expect(checkoutInfoPage.getErrorLocator()).toContainText(
            expected.emptyLastName,
          );
        });

        // Step 43 — Add product to cart.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 43 — Add product to cart.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await page.goto(`${baseUrl}/inventory.html`);
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await inventoryPage.clickAddToCartByIndex(0);
        });

        // Step 44 — Open Checkout page.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 44 — Open Checkout page.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await inventoryPage.clickCartIcon();
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoCartPage.clickCheckout();
          // Traceability: TC-ACG-RU-007
          await expect(page).toHaveURL(/checkout-step-one/);
        });

        // Step 45 — Enter First Name.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 45 — Enter First Name.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await checkoutInfoPage.enterFirstName(checkoutData.firstName);
        });

        // Step 46 — Enter Last Name.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 46 — Enter Last Name.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await checkoutInfoPage.enterLastName(checkoutData.lastName);
        });

        // Step 47 — Leave Postal Code empty.
        // Traceability: TC-ACG-RU-007
        await test.step(
          'Step 47 — Leave Postal Code empty.',
          async () => {
            // Postal code remains blank.
            // Traceability: TC-ACG-RU-007
            await expect(page).toHaveURL(/checkout-step-one/);
          },
        );

        // Step 48 — Click Continue.
        // Traceability: ER-09
        await test.step('Step 48 — Click Continue.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await checkoutInfoPage.clickContinue();
          // Traceability: ER-09
          await expect(page).toHaveURL(/checkout-step-one/);
          // Traceability: ER-09
          await expect(checkoutInfoPage.getErrorLocator()).toContainText(
            expected.emptyPostalCode,
          );
        });

        // Step 49 — Add item to cart.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 49 — Add item to cart.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await page.goto(`${baseUrl}/inventory.html`);
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await inventoryPage.clickAddToCartByIndex(0);
        });

        // Step 50 — Click Checkout.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 50 — Click Checkout.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await inventoryPage.clickCartIcon();
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoCartPage.clickCheckout();
          // Traceability: TC-ACG-RU-007
          await expect(page).toHaveURL(/checkout-step-one/);
        });

        // Step 51 — Leave all fields empty.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 51 — Leave all fields empty.', async () => {
          // All checkout fields remain blank.
          // Traceability: TC-ACG-RU-007
          await expect(page).toHaveURL(/checkout-step-one/);
        });

        // Step 52 — Click Continue.
        // Traceability: ER-10
        await test.step('Step 52 — Click Continue.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await checkoutInfoPage.clickContinue();
          // Traceability: ER-10
          await expect(page).toHaveURL(/checkout-step-one/);
          // Traceability: ER-10
          await expect(checkoutInfoPage.getErrorLocator()).toContainText(
            expected.emptyCheckout,
          );
        });

        // Step 53 — Login.
        // Traceability: TC-ACG-RU-007
        await test.step('Step 53 — Login.', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.navigateTo('/');
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await sauceDemoLoginPage.login(validUsername, validPassword);
          // Traceability: TC-ACG-RU-007
          await expect(page).toHaveURL(/inventory/);
        });

        // Step 54 — Open cart without products.
        // Traceability: ER-11
        await test.step(
          'Step 54 — Open cart without products.',
          async () => {
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await inventoryPage.clickCartIcon();
            // Traceability: ER-11
            await expect(page).toHaveURL(/cart/);
            // Traceability: ER-11
            await expect(
              sauceDemoCartPage.getCartItemsLocator(),
            ).toHaveCount(0);
            // Traceability: ER-11
            await expect(inventoryPage.getCartBadgeLocator()).not.toBeVisible();

            // LOCATOR_UNCONFIRMED — not in AUT KB
            const checkoutControl =
              sauceDemoCartPage.getCheckoutButtonLocator();

            if (emptyCartCheckoutBehavior === 'hidden') {
              // Traceability: ER-11
              await expect(checkoutControl).not.toBeVisible();
            } else if (emptyCartCheckoutBehavior === 'disabled') {
              // Traceability: ER-11
              await expect(checkoutControl).toBeDisabled();
            } else if (emptyCartCheckoutBehavior === 'rejected') {
              // Traceability: ER-11
              await expect(checkoutControl).toBeVisible();
              // LOCATOR_UNCONFIRMED — not in AUT KB
              await sauceDemoCartPage.clickCheckout();
              // Traceability: ER-11
              await expect(page).toHaveURL(/cart/);
            } else {
              throw new Error(
                'SD_EMPTY_CART_CHECKOUT_BEHAVIOR must be hidden, disabled, or rejected',
              );
            }
          },
        );
      },
    );
  },
);