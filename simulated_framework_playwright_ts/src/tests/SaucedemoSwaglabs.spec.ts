// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// TARGET_BROWSER  → set TARGET_BROWSER in .env (assumed: framework primary browser)
// AUT_MODULES_IN_SCOPE  → set AUT_MODULES_IN_SCOPE in .env (assumed: inferred SauceDemo scope)
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

const emptyUsernameMessage = requiredEnv('SD_EMPTY_USERNAME_MESSAGE');
const emptyPasswordMessage = requiredEnv('SD_EMPTY_PASSWORD_MESSAGE');
const invalidCredentialsMessage = requiredEnv('SD_INVALID_CREDENTIALS_MESSAGE');
const postalCodeRequiredMessage = requiredEnv(
  'SD_POSTAL_CODE_REQUIRED_MESSAGE',
);

void readiness;

test.describe(
  'TC-ACG-RU-001 — SauceDemo Swag Labs functional and error-handling coverage',
  () => {
    test.beforeEach(async ({ page, sauceDemoLoginPage }) => {
      await page.goto(baseUrl);

      // Traceability: [tag N/A]
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
      '[TC-ACG-RU-001][SCR-ACG-RU-001] SauceDemo Swag Labs ordered workflow',
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
        // acg_run_id   : ACG-RUN-20261012-004
        // ─────────────────────────────────────────────────────────

        // Step 1 — Enter username.
        await test.step('Step 1 — Enter username.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.enterUsername(validLoginData.username);
        });

        // Step 2 — Enter password.
        await test.step('Step 2 — Enter password.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.enterPassword(validLoginData.password);
        });

        // Step 3 — Click Login button.
        await test.step('Step 3 — Click Login button.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.clickLoginButton();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(inventoryUrlPattern);
          // Traceability: [tag N/A]
          await expect(inventoryPage.getInventoryListLocator()).toBeVisible();
        });

        // Step 4 — Click Add to Cart for a product.
        await test.step('Step 4 — Click Add to Cart for a product.', async () => {
          // Traceability: [tag N/A]
          await inventoryPage.clickAddToCartByIndex(0);
          // Traceability: [tag N/A]
          await expect(inventoryPage.getCartBadgeLocator()).toHaveText('1');
        });

        // Step 5 — Click Remove button.
        await test.step('Step 5 — Click Remove button.', async () => {
          // Traceability: [tag N/A]
          await inventoryPage.clickRemoveFromCartByIndex(0);
          // Traceability: [tag N/A]
          await expect(inventoryPage.getCartBadgeLocator()).not.toBeVisible();
        });

        // Step 6 — Click Cart icon.
        await test.step('Step 6 — Click Cart icon.', async () => {
          // Traceability: [tag N/A]
          await inventoryPage.clickCartIcon();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(cartUrlPattern);
        });

        // Step 7 — Open Cart.
        await test.step('Step 7 — Open Cart.', async () => {
          // Traceability: [tag N/A]
          const isCartLoaded = await sauceDemoCartPage.validate();
          // Traceability: [tag N/A]
          await expect(sauceDemoCartPage.getCartListLocator()).toBeVisible();
          // PT-005 correction: assertion is explicitly awaited.
          await expect(isCartLoaded).toBe(true);
        });

        // Step 8 — Click Checkout.
        await test.step('Step 8 — Click Checkout.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoCartPage.clickCheckout();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(checkoutStepOneUrlPattern);
        });

        // Step 9 — Enter: First Name, Last Name, Postal Code.
        await test.step(
          'Step 9 — Enter: First Name, Last Name, Postal Code.',
          async () => {
            // Traceability: [tag N/A]
            await checkoutInfoPage.fillCheckoutInfo(
              checkoutData.firstName,
              checkoutData.lastName,
              checkoutData.postalCode,
            );
          },
        );

        // Step 10 — Click Continue.
        await test.step('Step 10 — Click Continue.', async () => {
          // Traceability: [tag N/A]
          await checkoutInfoPage.clickContinue();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(checkoutStepTwoUrlPattern);
        });

        // Step 11 — Review order details.
        await test.step('Step 11 — Review order details.', async () => {
          // Traceability: [tag N/A]
          await expect(
            checkoutOverviewPage.getOrderSummaryLocator(),
          ).toBeVisible();
          // Traceability: [tag N/A]
          await expect(
            checkoutOverviewPage.getCartItemsLocator(),
          ).toBeVisible();
        });

        // Step 12 — Click Finish.
        await test.step('Step 12 — Click Finish.', async () => {
          // Traceability: [tag N/A]
          await checkoutOverviewPage.clickFinish();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(completeUrlPattern);
          // Traceability: [tag N/A]
          await expect(
            checkoutCompletePage.getCompleteContainerLocator(),
          ).toBeVisible();
          // Traceability: [tag N/A]
          await expect(
            checkoutCompletePage.getSuccessHeaderLocator(),
          ).toBeVisible();
        });

        // Step 13 — Open menu.
        await test.step('Step 13 — Open menu.', async () => {
          // Traceability: [tag N/A]
          await page.goto(baseUrl);
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.login(
            validLoginData.username,
            validLoginData.password,
          );
          // Traceability: [tag N/A]
          await inventoryPage.openMenu();
        });

        // Step 14 — Click Logout.
        await test.step('Step 14 — Click Logout.', async () => {
          // Traceability: [tag N/A]
          await inventoryPage.clickLogout();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(loginUrlPattern);
          // Traceability: [tag N/A]
          await expect(
            sauceDemoLoginPage.getLoginButtonLocator(),
          ).toBeVisible();
        });

        // Step 15 — Leave Username blank.
        await test.step('Step 15 — Leave Username blank.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.enterUsername('');
        });

        // Step 16 — Enter valid Password.
        await test.step('Step 16 — Enter valid Password.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.enterPassword(validLoginData.password);
        });

        // Step 17 — Click Login.
        await test.step('Step 17 — Click Login.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.clickLoginButton();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(loginUrlPattern);
          // Traceability: [tag N/A]
          await expect(
            sauceDemoLoginPage.getErrorMessageLocator(),
          ).toContainText(emptyUsernameMessage);
        });

        // Step 18 — Enter valid Username.
        await test.step('Step 18 — Enter valid Username.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.enterUsername(validLoginData.username);
        });

        // Step 19 — Leave Password blank.
        await test.step('Step 19 — Leave Password blank.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.enterPassword('');
        });

        // Step 20 — Click Login.
        await test.step('Step 20 — Click Login.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.clickLoginButton();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(loginUrlPattern);
          // Traceability: [tag N/A]
          await expect(
            sauceDemoLoginPage.getErrorMessageLocator(),
          ).toContainText(emptyPasswordMessage);
        });

        // Step 21 — Leave Username blank.
        await test.step('Step 21 — Leave Username blank.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.enterUsername('');
        });

        // Step 22 — Leave Password blank.
        await test.step('Step 22 — Leave Password blank.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.enterPassword('');
        });

        // Step 23 — Click Login.
        await test.step('Step 23 — Click Login.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.clickLoginButton();
          // Traceability: [tag N/A]
          await expect(
            sauceDemoLoginPage.getErrorMessageLocator(),
          ).toContainText(emptyUsernameMessage);
        });

        // Step 24 — Enter invalid username.
        await test.step('Step 24 — Enter invalid username.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.enterUsername(invalidLoginData.username);
        });

        // Step 25 — Enter valid password.
        await test.step('Step 25 — Enter valid password.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.enterPassword(validLoginData.password);
        });

        // Step 26 — Click Login.
        await test.step('Step 26 — Click Login.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.clickLoginButton();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(loginUrlPattern);
          // Traceability: [tag N/A]
          await expect(
            sauceDemoLoginPage.getErrorMessageLocator(),
          ).toContainText(invalidCredentialsMessage);
        });

        // Step 27 — Enter valid username.
        await test.step('Step 27 — Enter valid username.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.enterUsername(validLoginData.username);
        });

        // Step 28 — Enter invalid password.
        await test.step('Step 28 — Enter invalid password.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.enterPassword(invalidLoginData.password);
        });

        // Step 29 — Click Login.
        await test.step('Step 29 — Click Login.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.clickLoginButton();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(loginUrlPattern);
          // Traceability: [tag N/A]
          await expect(
            sauceDemoLoginPage.getErrorMessageLocator(),
          ).toContainText(invalidCredentialsMessage);
        });

        // Step 30 — Login successfully.
        await test.step('Step 30 — Login successfully.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.login(
            validLoginData.username,
            validLoginData.password,
          );
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(inventoryUrlPattern);
        });

        // Step 31 — Open cart without adding products.
        await test.step(
          'Step 31 — Open cart without adding products.',
          async () => {
            // Traceability: [tag N/A]
            await inventoryPage.clickCartIcon();
            // Traceability: [tag N/A]
            await expect(page).toHaveURL(cartUrlPattern);
            // Traceability: [tag N/A]
            await expect(
              sauceDemoCartPage.getCartItemsLocator(),
            ).toHaveCount(0);
          },
        );

        // Step 32 — Add product to cart.
        await test.step('Step 32 — Add product to cart.', async () => {
          // Traceability: [tag N/A]
          await sauceDemoCartPage.clickContinueShopping();
          // Traceability: [tag N/A]
          await inventoryPage.clickAddToCartByIndex(0);
        });

        // Step 33 — Open Checkout page.
        await test.step('Step 33 — Open Checkout page.', async () => {
          // Traceability: [tag N/A]
          await inventoryPage.clickCartIcon();
          // Traceability: [tag N/A]
          await sauceDemoCartPage.clickCheckout();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(checkoutStepOneUrlPattern);
        });

        // Step 34 — Leave First Name empty.
        await test.step('Step 34 — Leave First Name empty.', async () => {
          // Traceability: [tag N/A]
          await checkoutInfoPage.enterFirstName('');
        });

        // Step 35 — Enter Last Name and Postal Code.
        await test.step(
          'Step 35 — Enter Last Name and Postal Code.',
          async () => {
            // Traceability: [tag N/A]
            await checkoutInfoPage.enterLastName(checkoutData.lastName);
            // Traceability: [tag N/A]
            await checkoutInfoPage.enterPostalCode(checkoutData.postalCode);
          },
        );

        // Step 36 — Click Continue.
        await test.step('Step 36 — Click Continue.', async () => {
          // Traceability: [tag N/A]
          await checkoutInfoPage.clickContinue();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(checkoutStepOneUrlPattern);
          // Traceability: [tag N/A]
          await expect(checkoutInfoPage.getErrorLocator()).toBeVisible();
        });

        // Step 37 — Add product to cart.
        await test.step('Step 37 — Add product to cart.', async () => {
          // Traceability: [tag N/A]
          await page.goto(baseUrl);
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.login(
            validLoginData.username,
            validLoginData.password,
          );
          // Traceability: [tag N/A]
          await inventoryPage.clickAddToCartByIndex(0);
        });

        // Step 38 — Open Checkout page.
        await test.step('Step 38 — Open Checkout page.', async () => {
          // Traceability: [tag N/A]
          await inventoryPage.clickCartIcon();
          // Traceability: [tag N/A]
          await sauceDemoCartPage.clickCheckout();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(checkoutStepOneUrlPattern);
        });

        // Step 39 — Enter First Name.
        await test.step('Step 39 — Enter First Name.', async () => {
          // Traceability: [tag N/A]
          await checkoutInfoPage.enterFirstName(checkoutData.firstName);
        });

        // Step 40 — Leave Last Name empty.
        await test.step('Step 40 — Leave Last Name empty.', async () => {
          // Traceability: [tag N/A]
          await checkoutInfoPage.enterLastName('');
        });

        // Step 41 — Enter Postal Code.
        await test.step('Step 41 — Enter Postal Code.', async () => {
          // Traceability: [tag N/A]
          await checkoutInfoPage.enterPostalCode(checkoutData.postalCode);
        });

        // Step 42 — Click Continue.
        await test.step('Step 42 — Click Continue.', async () => {
          // Traceability: [tag N/A]
          await checkoutInfoPage.clickContinue();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(checkoutStepOneUrlPattern);
          // Traceability: [tag N/A]
          await expect(checkoutInfoPage.getErrorLocator()).toBeVisible();
        });

        // Step 43 — Add product to cart.
        await test.step('Step 43 — Add product to cart.', async () => {
          // Traceability: [tag N/A]
          await page.goto(baseUrl);
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.login(
            validLoginData.username,
            validLoginData.password,
          );
          // Traceability: [tag N/A]
          await inventoryPage.clickAddToCartByIndex(0);
        });

        // Step 44 — Open Checkout page.
        await test.step('Step 44 — Open Checkout page.', async () => {
          // Traceability: [tag N/A]
          await inventoryPage.clickCartIcon();
          // Traceability: [tag N/A]
          await sauceDemoCartPage.clickCheckout();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(checkoutStepOneUrlPattern);
        });

        // Step 45 — Enter First Name.
        await test.step('Step 45 — Enter First Name.', async () => {
          // Traceability: [tag N/A]
          await checkoutInfoPage.enterFirstName(checkoutData.firstName);
        });

        // Step 46 — Enter Last Name.
        await test.step('Step 46 — Enter Last Name.', async () => {
          // Traceability: [tag N/A]
          await checkoutInfoPage.enterLastName(checkoutData.lastName);
        });

        // Step 47 — Leave Postal Code empty.
        await test.step('Step 47 — Leave Postal Code empty.', async () => {
          // Traceability: [tag N/A]
          await checkoutInfoPage.enterPostalCode('');
        });

        // Step 48 — Click Continue.
        await test.step('Step 48 — Click Continue.', async () => {
          // Traceability: [tag N/A]
          await checkoutInfoPage.clickContinue();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(checkoutStepOneUrlPattern);
          // Traceability: [tag N/A]
          await expect(checkoutInfoPage.getErrorLocator()).toContainText(
            postalCodeRequiredMessage,
          );
        });

        // Step 49 — Add item to cart.
        await test.step('Step 49 — Add item to cart.', async () => {
          // Traceability: [tag N/A]
          await page.goto(baseUrl);
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.login(
            validLoginData.username,
            validLoginData.password,
          );
          // Traceability: [tag N/A]
          await inventoryPage.clickAddToCartByIndex(0);
        });

        // Step 50 — Click Checkout.
        await test.step('Step 50 — Click Checkout.', async () => {
          // Traceability: [tag N/A]
          await inventoryPage.clickCartIcon();
          // Traceability: [tag N/A]
          await sauceDemoCartPage.clickCheckout();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(checkoutStepOneUrlPattern);
        });

        // Step 51 — Leave all fields empty.
        await test.step('Step 51 — Leave all fields empty.', async () => {
          // Traceability: [tag N/A]
          await checkoutInfoPage.fillCheckoutInfo('', '', '');
        });

        // Step 52 — Click Continue.
        await test.step('Step 52 — Click Continue.', async () => {
          // Traceability: [tag N/A]
          await checkoutInfoPage.clickContinue();
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(checkoutStepOneUrlPattern);
          // Traceability: [tag N/A]
          await expect(checkoutInfoPage.getErrorLocator()).toBeVisible();
        });

        // Step 53 — Login.
        await test.step('Step 53 — Login.', async () => {
          // Traceability: [tag N/A]
          await page.goto(baseUrl);
          // Traceability: [tag N/A]
          await sauceDemoLoginPage.login(
            validLoginData.username,
            validLoginData.password,
          );
          // Traceability: [tag N/A]
          await expect(page).toHaveURL(inventoryUrlPattern);
        });

        // Step 54 — Open cart without products.
        await test.step(
          'Step 54 — Open cart without products.',
          async () => {
            // Traceability: [tag N/A]
            await inventoryPage.clickCartIcon();
            // Traceability: [tag N/A]
            await expect(page).toHaveURL(cartUrlPattern);
            // Traceability: [tag N/A]
            await expect(
              sauceDemoCartPage.getCartItemsLocator(),
            ).toHaveCount(0);
          },
        );
      },
    );
  },
);