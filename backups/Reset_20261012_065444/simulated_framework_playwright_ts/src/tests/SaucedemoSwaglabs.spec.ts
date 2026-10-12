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
const checkoutStepOneUrlPattern = requiredPattern(
  'SD_CHECKOUT_STEP_ONE_URL_PATTERN',
);
const checkoutStepTwoUrlPattern = requiredPattern(
  'SD_CHECKOUT_STEP_TWO_URL_PATTERN',
);
const completeUrlPattern = requiredPattern('SD_COMPLETE_URL_PATTERN');
const cancelDestinationPattern = requiredPattern(
  'SD_CANCEL_DESTINATION_PATTERN',
);

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

test.describe('SauceDemo Swag Labs — ACG-RUN-20261011-007', () => {
  test.beforeEach(async ({ page, sauceDemoLoginPage }) => {
    // LOCATOR_UNCONFIRMED — not in AUT KB
    await page.goto(baseUrl);

    // Correction for UNI-004: setup assertion now has nearby traceability.
    // Traceability: setup
    // LOCATOR_UNCONFIRMED — not in AUT KB
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
    '[TC-ACG-RU-001][SCR-ACG-RU-001] Valid login',
    async ({ page, sauceDemoLoginPage, inventoryPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-001
      // script_id    : SCR-ACG-RU-001
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 1 — Enter username.
      await test.step('Step 1 — Enter username.', async () => {
        // Traceability: FR-01
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterUsername(validLoginData.username);
      });

      // Step 2 — Enter password.
      await test.step('Step 2 — Enter password.', async () => {
        // Traceability: FR-01
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.enterPassword(validLoginData.password);
      });

      // Step 3 — Click Login button.
      await test.step('Step 3 — Click Login button.', async () => {
        // Traceability: FR-01
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.clickLoginButton();

        // Traceability: FR-01
        await expect(page).toHaveURL(inventoryUrlPattern);

        // Traceability: FR-01
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(inventoryPage.getInventoryListLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-002][SCR-ACG-RU-002] View products',
    async ({
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-002
      // script_id    : SCR-ACG-RU-002
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 4 — Click Add to Cart for a product.
      await test.step('Step 4 — Click Add to Cart for a product.', async () => {
        // Traceability: FR-02
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.login(
          validLoginData.username,
          validLoginData.password,
        );

        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);

        // Traceability: FR-02
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(inventoryPage.getCartBadgeLocator()).toHaveText('1');

        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();

        // Traceability: FR-02
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(1);
      });
    },
  );

  test(
    '[TC-ACG-RU-003][SCR-ACG-RU-003] Sort products',
    async ({
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-003
      // script_id    : SCR-ACG-RU-003
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 5 — Click Remove button.
      await test.step('Step 5 — Click Remove button.', async () => {
        // Traceability: FR-03
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.login(
          validLoginData.username,
          validLoginData.password,
        );

        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);

        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickRemoveFromCartByIndex(0);

        // Traceability: FR-03
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(inventoryPage.getCartBadgeLocator()).not.toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();

        // Traceability: FR-03
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(0);
      });
    },
  );

  test(
    '[TC-ACG-RU-004][SCR-ACG-RU-004] Add product',
    async ({
      sauceDemoLoginPage,
      inventoryPage,
      page,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-004
      // script_id    : SCR-ACG-RU-004
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 6 — Click Cart icon.
      await test.step('Step 6 — Click Cart icon.', async () => {
        // Traceability: FR-04
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.login(
          validLoginData.username,
          validLoginData.password,
        );

        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickAddToCartByIndex(0);

        // LOCATOR_UNCONFIRMED — not in AUT KB
        await inventoryPage.clickCartIcon();

        // Traceability: FR-04
        await expect(page).toHaveURL(cartUrlPattern);
      });
    },
  );

  test(
    '[TC-ACG-RU-005][SCR-ACG-RU-005] Remove product',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-005
      // script_id    : SCR-ACG-RU-005
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 7 — Open Cart.
      await test.step('Step 7 — Open Cart.', async () => {
        // Traceability: FR-05
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.login(
          validLoginData.username,
          validLoginData.password,
        );
        await inventoryPage.clickAddToCartByIndex(0);
        await inventoryPage.clickCartIcon();

        // Traceability: FR-05
        await expect(page).toHaveURL(cartUrlPattern);

        // Traceability: FR-05
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoCartPage.getCartListLocator()).toBeVisible();

        // Traceability: FR-05
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoCartPage.getCartItemsLocator()).toHaveCount(1);
      });
    },
  );

  test(
    '[TC-ACG-RU-006][SCR-ACG-RU-006] View cart',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-006
      // script_id    : SCR-ACG-RU-006
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 8 — Click Checkout.
      await test.step('Step 8 — Click Checkout.', async () => {
        // Traceability: FR-06
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoLoginPage.login(
          validLoginData.username,
          validLoginData.password,
        );
        await inventoryPage.clickAddToCartByIndex(0);
        await inventoryPage.clickCartIcon();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        await sauceDemoCartPage.clickCheckout();

        // Traceability: FR-06
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);
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
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 9 — Enter: First Name, Last Name, Postal Code
      await test.step(
        'Step 9 — Enter: First Name, Last Name, Postal Code',
        async () => {
          // Traceability: FR-07
          await sauceDemoLoginPage.login(
            validLoginData.username,
            validLoginData.password,
          );
          await inventoryPage.clickAddToCartByIndex(0);
          await inventoryPage.clickCartIcon();
          await sauceDemoCartPage.clickCheckout();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          await checkoutInfoPage.fillCheckoutInfo(
            checkoutData.firstName,
            checkoutData.lastName,
            checkoutData.postalCode,
          );
        },
      );

      // Step 10 — Click Continue.
      await test.step('Step 10 — Click Continue.', async () => {
        // Traceability: FR-07
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutInfoPage.clickContinue();
        await expect(page).toHaveURL(checkoutStepTwoUrlPattern);
      });
    },
  );

  test(
    '[TC-ACG-RU-008][SCR-ACG-RU-008] Complete order',
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
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 11 — Review order details.
      await test.step('Step 11 — Review order details.', async () => {
        // Traceability: FR-08
        await sauceDemoLoginPage.login(
          validLoginData.username,
          validLoginData.password,
        );
        await inventoryPage.clickAddToCartByIndex(0);
        await inventoryPage.clickCartIcon();
        await sauceDemoCartPage.clickCheckout();
        await checkoutInfoPage.fillCheckoutInfo(
          checkoutData.firstName,
          checkoutData.lastName,
          checkoutData.postalCode,
        );
        await checkoutInfoPage.clickContinue();

        // Traceability: FR-08
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          checkoutOverviewPage.getOrderSummaryLocator(),
        ).toBeVisible();

        // Traceability: FR-08
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          checkoutOverviewPage.getCartItemsLocator(),
        ).toBeVisible();
      });

      // Step 12 — Click Finish.
      await test.step('Step 12 — Click Finish.', async () => {
        // Traceability: FR-08
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutOverviewPage.clickFinish();

        // Traceability: FR-08
        await expect(page).toHaveURL(completeUrlPattern);

        // Traceability: FR-08
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          checkoutCompletePage.getCompleteContainerLocator(),
        ).toBeVisible();

        // Traceability: FR-08
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          checkoutCompletePage.getSuccessHeaderLocator(),
        ).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-009][SCR-ACG-RU-009] Cancel checkout',
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
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 13 — Open menu.
      await test.step('Step 13 — Open menu.', async () => {
        // Traceability: FR-09
        await sauceDemoLoginPage.login(
          validLoginData.username,
          validLoginData.password,
        );
        await inventoryPage.clickAddToCartByIndex(0);
        await inventoryPage.clickCartIcon();
        await sauceDemoCartPage.clickCheckout();
        await checkoutInfoPage.fillCheckoutInfo(
          checkoutData.firstName,
          checkoutData.lastName,
          checkoutData.postalCode,
        );
        await checkoutInfoPage.clickContinue();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        await checkoutOverviewPage.clickCancel();

        // Traceability: FR-09
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
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 14 — Click Logout.
      await test.step('Step 14 — Click Logout.', async () => {
        // Traceability: FR-10
        await sauceDemoLoginPage.login(
          validLoginData.username,
          validLoginData.password,
        );
        await inventoryPage.openMenu();
        await inventoryPage.clickLogout();

        // Traceability: FR-10
        await expect(page).toHaveURL(loginUrlPattern);

        // Traceability: FR-10
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(sauceDemoLoginPage.getLoginButtonLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-011][SCR-ACG-RU-011] Empty username',
    async ({ page, sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-011
      // script_id    : SCR-ACG-RU-011
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 15 — Leave Username blank.
      await test.step('Step 15 — Leave Username blank.', async () => {
        // Traceability: ER-01
        await sauceDemoLoginPage.enterUsername('');
      });

      // Step 16 — Enter valid Password.
      await test.step('Step 16 — Enter valid Password.', async () => {
        // Traceability: ER-01
        await sauceDemoLoginPage.enterPassword(validLoginData.password);
      });

      // Step 17 — Click Login.
      await test.step('Step 17 — Click Login.', async () => {
        // Traceability: ER-01
        await sauceDemoLoginPage.clickLoginButton();
        await expect(page).toHaveURL(loginUrlPattern);

        // Traceability: ER-01
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          sauceDemoLoginPage.getErrorMessageLocator(),
        ).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-012][SCR-ACG-RU-012] Empty password',
    async ({ page, sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-012
      // script_id    : SCR-ACG-RU-012
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 18 — Enter valid Username.
      await test.step('Step 18 — Enter valid Username.', async () => {
        // Traceability: ER-02
        await sauceDemoLoginPage.enterUsername(validLoginData.username);
      });

      // Step 19 — Leave Password blank.
      await test.step('Step 19 — Leave Password blank.', async () => {
        // Traceability: ER-02
        await sauceDemoLoginPage.enterPassword('');
      });

      // Step 20 — Click Login.
      await test.step('Step 20 — Click Login.', async () => {
        // Traceability: ER-02
        await sauceDemoLoginPage.clickLoginButton();
        await expect(page).toHaveURL(loginUrlPattern);

        // Traceability: ER-02
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          sauceDemoLoginPage.getErrorMessageLocator(),
        ).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-013][SCR-ACG-RU-013] Empty credentials',
    async ({ sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-013
      // script_id    : SCR-ACG-RU-013
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 21 — Leave Username blank.
      await test.step('Step 21 — Leave Username blank.', async () => {
        // Traceability: ER-03
        await sauceDemoLoginPage.enterUsername('');
      });

      // Step 22 — Leave Password blank.
      await test.step('Step 22 — Leave Password blank.', async () => {
        // Traceability: ER-03
        await sauceDemoLoginPage.enterPassword('');
      });

      // Step 23 — Click Login.
      await test.step('Step 23 — Click Login.', async () => {
        // Traceability: ER-03
        await sauceDemoLoginPage.clickLoginButton();

        // Traceability: ER-03
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          sauceDemoLoginPage.getErrorMessageLocator(),
        ).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-014][SCR-ACG-RU-014] Invalid username',
    async ({ page, sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-014
      // script_id    : SCR-ACG-RU-014
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 24 — Enter invalid username.
      await test.step('Step 24 — Enter invalid username.', async () => {
        // Traceability: ER-04
        await sauceDemoLoginPage.enterUsername(invalidLoginData.username);
      });

      // Step 25 — Enter valid password.
      await test.step('Step 25 — Enter valid password.', async () => {
        // Traceability: ER-04
        await sauceDemoLoginPage.enterPassword(validLoginData.password);
      });

      // Step 26 — Click Login.
      await test.step('Step 26 — Click Login.', async () => {
        // Traceability: ER-04
        await sauceDemoLoginPage.clickLoginButton();
        await expect(page).toHaveURL(loginUrlPattern);

        // Traceability: ER-04
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          sauceDemoLoginPage.getErrorMessageLocator(),
        ).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-015][SCR-ACG-RU-015] Invalid password',
    async ({ page, sauceDemoLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-015
      // script_id    : SCR-ACG-RU-015
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 27 — Enter valid username.
      await test.step('Step 27 — Enter valid username.', async () => {
        // Traceability: ER-05
        await sauceDemoLoginPage.enterUsername(validLoginData.username);
      });

      // Step 28 — Enter invalid password.
      await test.step('Step 28 — Enter invalid password.', async () => {
        // Traceability: ER-05
        await sauceDemoLoginPage.enterPassword(invalidLoginData.password);
      });

      // Step 29 — Click Login.
      await test.step('Step 29 — Click Login.', async () => {
        // Traceability: ER-05
        await sauceDemoLoginPage.clickLoginButton();
        await expect(page).toHaveURL(loginUrlPattern);

        // Traceability: ER-05
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          sauceDemoLoginPage.getErrorMessageLocator(),
        ).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-016][SCR-ACG-RU-016] Empty cart access',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-016
      // script_id    : SCR-ACG-RU-016
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 30 — Login successfully.
      await test.step('Step 30 — Login successfully.', async () => {
        // Traceability: ER-06
        await sauceDemoLoginPage.login(
          validLoginData.username,
          validLoginData.password,
        );
        await expect(page).toHaveURL(inventoryUrlPattern);
      });

      // Step 31 — Open cart without adding products.
      await test.step(
        'Step 31 — Open cart without adding products.',
        async () => {
          // Traceability: ER-06
          await inventoryPage.clickCartIcon();
          await expect(page).toHaveURL(cartUrlPattern);

          // Traceability: ER-06
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await expect(
            sauceDemoCartPage.getCartItemsLocator(),
          ).toHaveCount(0);
        },
      );
    },
  );

  test(
    '[TC-ACG-RU-017][SCR-ACG-RU-017] Empty first name',
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
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 32 — Add product to cart.
      await test.step('Step 32 — Add product to cart.', async () => {
        // Traceability: ER-07
        await sauceDemoLoginPage.login(
          validLoginData.username,
          validLoginData.password,
        );
        await inventoryPage.clickAddToCartByIndex(0);
      });

      // Step 33 — Open Checkout page.
      await test.step('Step 33 — Open Checkout page.', async () => {
        // Traceability: ER-07
        await inventoryPage.clickCartIcon();
        await sauceDemoCartPage.clickCheckout();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);
      });

      // Step 34 — Leave First Name empty.
      await test.step('Step 34 — Leave First Name empty.', async () => {
        // Traceability: ER-07
        await checkoutInfoPage.enterFirstName('');
      });

      // Step 35 — Enter Last Name and Postal Code.
      await test.step(
        'Step 35 — Enter Last Name and Postal Code.',
        async () => {
          // Traceability: ER-07
          await checkoutInfoPage.enterLastName(checkoutData.lastName);
          await checkoutInfoPage.enterPostalCode(checkoutData.postalCode);
        },
      );

      // Step 36 — Click Continue.
      await test.step('Step 36 — Click Continue.', async () => {
        // Traceability: ER-07
        await checkoutInfoPage.clickContinue();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);

        // Traceability: ER-07
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(checkoutInfoPage.getErrorLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-018][SCR-ACG-RU-018] Empty last name',
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
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 37 — Add product to cart.
      await test.step('Step 37 — Add product to cart.', async () => {
        // Traceability: ER-08
        await sauceDemoLoginPage.login(
          validLoginData.username,
          validLoginData.password,
        );
        await inventoryPage.clickAddToCartByIndex(0);
      });

      // Step 38 — Open Checkout page.
      await test.step('Step 38 — Open Checkout page.', async () => {
        // Traceability: ER-08
        await inventoryPage.clickCartIcon();
        await sauceDemoCartPage.clickCheckout();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);
      });

      // Step 39 — Enter First Name.
      await test.step('Step 39 — Enter First Name.', async () => {
        // Traceability: ER-08
        await checkoutInfoPage.enterFirstName(checkoutData.firstName);
      });

      // Step 40 — Leave Last Name empty.
      await test.step('Step 40 — Leave Last Name empty.', async () => {
        // Traceability: ER-08
        await checkoutInfoPage.enterLastName('');
      });

      // Step 41 — Enter Postal Code.
      await test.step('Step 41 — Enter Postal Code.', async () => {
        // Traceability: ER-08
        await checkoutInfoPage.enterPostalCode(checkoutData.postalCode);
      });

      // Step 42 — Click Continue.
      await test.step('Step 42 — Click Continue.', async () => {
        // Traceability: ER-08
        await checkoutInfoPage.clickContinue();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);

        // Traceability: ER-08
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(checkoutInfoPage.getErrorLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-019][SCR-ACG-RU-019] Empty postal code',
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
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 43 — Add product to cart.
      await test.step('Step 43 — Add product to cart.', async () => {
        // Traceability: ER-09
        await sauceDemoLoginPage.login(
          validLoginData.username,
          validLoginData.password,
        );
        await inventoryPage.clickAddToCartByIndex(0);
      });

      // Step 44 — Open Checkout page.
      await test.step('Step 44 — Open Checkout page.', async () => {
        // Traceability: ER-09
        await inventoryPage.clickCartIcon();
        await sauceDemoCartPage.clickCheckout();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);
      });

      // Step 45 — Enter First Name.
      await test.step('Step 45 — Enter First Name.', async () => {
        // Traceability: ER-09
        await checkoutInfoPage.enterFirstName(checkoutData.firstName);
      });

      // Step 46 — Enter Last Name.
      await test.step('Step 46 — Enter Last Name.', async () => {
        // Traceability: ER-09
        await checkoutInfoPage.enterLastName(checkoutData.lastName);
      });

      // Step 47 — Leave Postal Code empty.
      await test.step('Step 47 — Leave Postal Code empty.', async () => {
        // Traceability: ER-09
        await checkoutInfoPage.enterPostalCode('');
      });

      // Step 48 — Click Continue.
      await test.step('Step 48 — Click Continue.', async () => {
        // Traceability: ER-09
        await checkoutInfoPage.clickContinue();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);

        // Traceability: ER-09
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(checkoutInfoPage.getErrorLocator()).toContainText(
          'Postal Code is required',
        );
      });
    },
  );

  test(
    '[TC-ACG-RU-020][SCR-ACG-RU-020] All checkout fields empty',
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
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 49 — Add item to cart.
      await test.step('Step 49 — Add item to cart.', async () => {
        // Traceability: ER-10
        await sauceDemoLoginPage.login(
          validLoginData.username,
          validLoginData.password,
        );
        await inventoryPage.clickAddToCartByIndex(0);
      });

      // Step 50 — Click Checkout.
      await test.step('Step 50 — Click Checkout.', async () => {
        // Traceability: ER-10
        await inventoryPage.clickCartIcon();
        await sauceDemoCartPage.clickCheckout();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);
      });

      // Step 51 — Leave all fields empty.
      await test.step('Step 51 — Leave all fields empty.', async () => {
        // Traceability: ER-10
        await checkoutInfoPage.fillCheckoutInfo('', '', '');
      });

      // Step 52 — Click Continue.
      await test.step('Step 52 — Click Continue.', async () => {
        // Traceability: ER-10
        await checkoutInfoPage.clickContinue();
        await expect(page).toHaveURL(checkoutStepOneUrlPattern);

        // Traceability: ER-10
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(checkoutInfoPage.getErrorLocator()).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-021][SCR-ACG-RU-021] Empty-cart checkout',
    async ({
      page,
      sauceDemoLoginPage,
      inventoryPage,
      sauceDemoCartPage,
    }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-021
      // script_id    : SCR-ACG-RU-021
      // acg_run_id   : ACG-RUN-20261011-007
      // ─────────────────────────────────────────────────────────

      // Step 53 — Login.
      await test.step('Step 53 — Login.', async () => {
        // Traceability: ER-11
        await sauceDemoLoginPage.login(
          validLoginData.username,
          validLoginData.password,
        );
        await expect(page).toHaveURL(inventoryUrlPattern);
      });

      // Step 54 — Open cart without products.
      await test.step(
        'Step 54 — Open cart without products.',
        async () => {
          // Traceability: ER-11
          await inventoryPage.clickCartIcon();
          await expect(page).toHaveURL(cartUrlPattern);

          // Traceability: ER-11
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await expect(
            sauceDemoCartPage.getCartItemsLocator(),
          ).toHaveCount(0);
        },
      );
    },
  );
});