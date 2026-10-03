// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// TARGET_BROWSER  → set TARGET_BROWSER in .env (assumed: framework primary browser)
// LIVE_AUT_ACCESSIBLE → set LIVE_AUT_ACCESSIBLE in .env (assumed: false)
// ════════════════════════════════════════════════════

import { test as baseTest, expect } from '../fixtures';
import type { Page } from '@playwright/test';
import { BankingLoginPage } from '../pages/BankingLoginPage';
import { BankingDashboardPage } from '../pages/BankingDashboardPage';

type BankingSessionFixtures = {
  isolatedPage: Page;
  isolatedBankingLoginPage: BankingLoginPage;
  isolatedBankingDashboardPage: BankingDashboardPage;
};

const test = baseTest.extend<BankingSessionFixtures>({
  isolatedPage: async ({ browser }, use) => {
    const isolatedContext = await browser.newContext({
      storageState: undefined,
    });
    const isolatedPage = await isolatedContext.newPage();

    try {
      await use(isolatedPage);
    } finally {
      await isolatedPage.close();
      await isolatedContext.close();
    }
  },

  isolatedBankingLoginPage: async ({ isolatedPage }, use) => {
    await use(new BankingLoginPage(isolatedPage));
  },

  isolatedBankingDashboardPage: async ({ isolatedPage }, use) => {
    await use(new BankingDashboardPage(isolatedPage));
  },
});

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';

const loginPath =
  process.env.BANK_LOGIN_PATH ??
  // STUB: BANK_LOGIN_PATH not confirmed — using /
  '/';

const dashboardPath = '/dashboard';

const validUsername = requiredEnv('BANK_VALID_USER');
const validPassword = requiredEnv('BANK_VALID_PASS');
const invalidUsername = requiredEnv('BANK_INVALID_USER');

const invalidCredentialsMessage = 'Invalid username or password';
const usernameRequiredMessage = 'Username required';
const passwordRequiredMessage = 'Password required';
const expectedWelcomeMessage = `Welcome, ${validUsername}`;

test.describe(
  'REQ-BSP-01 to REQ-BSP-05 — Banking Session Protection',
  () => {
    test.beforeEach(async ({ bankingLoginPage }) => {
      // LOCATOR_UNCONFIRMED — not in AUT KB
      await bankingLoginPage.navigateTo(loginPath);
    });

    test.afterEach(async ({ page }, testInfo) => {
      if (testInfo.status !== testInfo.expectedStatus) {
        await page.screenshot({
          path: testInfo.outputPath('screenshot-on-failure.png'),
        });
      }
    });

    test(
      '[TC-ACG-RU-001][SCR-ACG-RU-001] Login with valid username and password',
      async ({ bankingLoginPage, bankingDashboardPage }) => {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-ACG-RU-001
        // script_id    : SCR-ACG-RU-001
        // acg_run_id   : ACG-RUN-20261003-002
        // ─────────────────────────────────────────────────────────

        // Step 1 — Open the login page
        await test.step('Step 1 — Open the login page', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const isLoginPageLoaded = await bankingLoginPage.validate();

          // Traceability: TC_BSP_001 | REQ-BSP-01
          await expect(isLoginPageLoaded).toBe(true);
          // Traceability: TC_BSP_001 | REQ-BSP-01
          await expect(
            bankingLoginPage.getLoginButtonLocator(),
          ).toBeVisible();
        });

        // Step 2 — Enter username john.doe@bank.com
        await test.step(
          'Step 2 — Enter username john.doe@bank.com',
          async () => {
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await bankingLoginPage.enterUsername(validUsername);
          },
        );

        // Step 3 — Enter password SecurePass123!
        await test.step(
          'Step 3 — Enter password SecurePass123!',
          async () => {
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await bankingLoginPage.enterPassword(validPassword);
          },
        );

        // Step 4 — Click Sign In
        await test.step('Step 4 — Click Sign In', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await bankingLoginPage.clickLoginButton();

          // Traceability: TC_BSP_001 | REQ-BSP-01
          await expect(
            bankingDashboardPage.getAccountSummaryLocator(),
          ).toBeVisible();
          // Traceability: TC_BSP_001 | REQ-BSP-01
          await expect(
            bankingDashboardPage.getWelcomeMessageLocator(),
          ).toHaveText(expectedWelcomeMessage);
        });
      },
    );

    test(
      '[TC-ACG-RU-002][SCR-ACG-RU-002] Login rejected for an unregistered username',
      async ({ page, bankingLoginPage }) => {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-ACG-RU-002
        // script_id    : SCR-ACG-RU-002
        // acg_run_id   : ACG-RUN-20261003-002
        // ─────────────────────────────────────────────────────────

        // Step 5 — Open the login page
        await test.step('Step 5 — Open the login page', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const isLoginPageLoaded = await bankingLoginPage.validate();

          // Traceability: TC_BSP_002 | REQ-BSP-02
          await expect(isLoginPageLoaded).toBe(true);
        });

        // Step 6 — Enter username nonexistent.user@bank.com
        await test.step(
          'Step 6 — Enter username nonexistent.user@bank.com',
          async () => {
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await bankingLoginPage.enterUsername(invalidUsername);
          },
        );

        // Step 7 — Enter password SecurePass123!
        await test.step(
          'Step 7 — Enter password SecurePass123!',
          async () => {
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await bankingLoginPage.enterPassword(validPassword);
          },
        );

        // Step 8 — Click Sign In
        await test.step('Step 8 — Click Sign In', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await bankingLoginPage.clickLoginButton();

          // Traceability: TC_BSP_002 | REQ-BSP-02
          await expect(
          page.getByRole('heading', { name: 'Banking Login' }),
          ).toBeVisible();
          // Traceability: TC_BSP_002 | REQ-BSP-02
          await expect(
            bankingLoginPage.getErrorBannerLocator(),
          ).toHaveText(invalidCredentialsMessage);
          // Traceability: TC_BSP_002 | REQ-BSP-02
          await expect(page).not.toHaveURL(
            new RegExp(`${dashboardPath.replace('/', '\\/')}(?:$|[/?])`),
          );
        });
      },
    );

    test(
      '[TC-ACG-RU-003][SCR-ACG-RU-003] Inline validation when both fields are empty',
      async ({ page, bankingLoginPage }) => {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-ACG-RU-003
        // script_id    : SCR-ACG-RU-003
        // acg_run_id   : ACG-RUN-20261003-002
        // ─────────────────────────────────────────────────────────

        // Step 9 — Open the login page
        await test.step('Step 9 — Open the login page', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const isLoginPageLoaded = await bankingLoginPage.validate();

          // Traceability: TC_BSP_003 | REQ-BSP-03
          await expect(isLoginPageLoaded).toBe(true);
        });

        // Step 10 — Leave username and password empty
        await test.step(
          'Step 10 — Leave username and password empty',
          async () => {
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await bankingLoginPage.clearUsername();
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await bankingLoginPage.clearPassword();
          },
        );

        // Step 11 — Click Sign In
        await test.step('Step 11 — Click Sign In', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await bankingLoginPage.clickLoginButton();

          // Traceability: TC_BSP_003 | REQ-BSP-03
          await expect(
            bankingLoginPage.getUsernameValidationLocator(),
          ).toHaveText(usernameRequiredMessage);
          // Traceability: TC_BSP_003 | REQ-BSP-03
          await expect(
            bankingLoginPage.getPasswordValidationLocator(),
          ).toHaveText(passwordRequiredMessage);
          // Traceability: TC_BSP_003 | REQ-BSP-03
          await expect(page).toHaveURL(
            new URL(loginPath, baseUrl).toString(),
          );
        });
      },
    );

    test(
      '[TC-ACG-RU-004][SCR-ACG-RU-004] Direct access to dashboard without signing in',
      async ({
        isolatedPage,
        isolatedBankingLoginPage,
        isolatedBankingDashboardPage,
      }) => {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-ACG-RU-004
        // script_id    : SCR-ACG-RU-004
        // acg_run_id   : ACG-RUN-20261003-002
        // ─────────────────────────────────────────────────────────

        // Step 12 — Start a new browser session in which no user has signed in
        await test.step(
          'Step 12 — Start a new browser session in which no user has signed in',
          async () => {
            // Traceability: TC_BSP_004 | REQ-BSP-04
            await isolatedPage.goto(new URL(loginPath, baseUrl).toString());
          },
        );

        // Step 13 — Navigate directly to the dashboard path "/dashboard"
        await test.step(
          'Step 13 — Navigate directly to the dashboard path "/dashboard"',
          async () => {
            // Traceability: TC_BSP_004 | REQ-BSP-04
            await isolatedPage.goto(`${baseUrl}${dashboardPath}`);
          },
        );

        // Step 14 — Read the current page URL
        await test.step('Step 14 — Read the current page URL', async () => {
          // Traceability: TC_BSP_004 | REQ-BSP-04
          await expect(isolatedPage).toHaveURL(
            new URL(loginPath, baseUrl).toString(),
          );
          // Traceability: TC_BSP_004 | REQ-BSP-04
          await expect(
            isolatedBankingLoginPage.getLoginHeadingLocator(),
          ).toBeVisible();
          // Traceability: TC_BSP_004 | REQ-BSP-04
          await expect(
            isolatedBankingDashboardPage.getWelcomeMessageLocator(),
          ).not.toBeVisible();
        });
      },
    );

    test(
      '[TC-ACG-RU-005][SCR-ACG-RU-005] Logout returns the user to the login page',
      async ({ bankingLoginPage, bankingDashboardPage }) => {
        // ── PDT Traceability ──────────────────────────────────────
        // test_case_id : TC-ACG-RU-005
        // script_id    : SCR-ACG-RU-005
        // acg_run_id   : ACG-RUN-20261003-002
        // ─────────────────────────────────────────────────────────

        // Step 15 — Open the login page
        await test.step('Step 15 — Open the login page', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          const isLoginPageLoaded = await bankingLoginPage.validate();

          // Traceability: TC_BSP_005 | REQ-BSP-05
          await expect(isLoginPageLoaded).toBe(true);
        });

        // Step 16 — Sign in with username john.doe@bank.com and password SecurePass123!
        await test.step(
          'Step 16 — Sign in with username john.doe@bank.com and password SecurePass123!',
          async () => {
            // LOCATOR_UNCONFIRMED — not in AUT KB
            await bankingLoginPage.login(validUsername, validPassword);
          },
        );

        // Step 17 — Verify the Banking Dashboard is displayed
        await test.step(
          'Step 17 — Verify the Banking Dashboard is displayed',
          async () => {
            const isDashboardLoaded = await bankingDashboardPage.validate();

            // Traceability: TC_BSP_005 | REQ-BSP-05
            await expect(isDashboardLoaded).toBe(true);
            // Traceability: TC_BSP_005 | REQ-BSP-05
            await expect(
              bankingDashboardPage.getAccountSummaryLocator(),
            ).toBeVisible();
          },
        );

        // Step 18 — Click Logout
        await test.step('Step 18 — Click Logout', async () => {
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await bankingDashboardPage.clickLogout();

          // Traceability: TC_BSP_005 | REQ-BSP-05
          await expect(
            bankingLoginPage.getLoginHeadingLocator(),
          ).toBeVisible();
          // Traceability: TC_BSP_005 | REQ-BSP-05
          await expect(
            bankingLoginPage.getLoginButtonLocator(),
          ).toBeVisible();
        });
      },
    );
  },
);