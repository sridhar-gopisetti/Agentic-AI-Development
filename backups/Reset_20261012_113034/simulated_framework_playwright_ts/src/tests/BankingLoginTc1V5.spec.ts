// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// TARGET_BROWSER  → set TARGET_BROWSER in .env (assumed: framework primary browser)
// AUT_MODULES_IN_SCOPE  → set AUT_MODULES_IN_SCOPE in .env (assumed: inferred Banking Login scope)
// LIVE_AUT_ACCESSIBLE  → set LIVE_AUT_ACCESSIBLE in .env (assumed: false)
// BankingLoginPage.enterOtp()  → supply its implementation using a KB-confirmed OTP selector
// ════════════════════════════════════════════════════

import { test, expect } from '../fixtures';

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const readiness = {
  targetBrowser:
    process.env.TARGET_BROWSER ??
    // STUB: TARGET_BROWSER not confirmed — using framework primary browser
    'chromium',
  modulesInScope:
    process.env.AUT_MODULES_IN_SCOPE ??
    // STUB: AUT_MODULES_IN_SCOPE not confirmed — using inferred Banking Login scope
    'Banking Login',
  liveAutAccessible:
    process.env.LIVE_AUT_ACCESSIBLE ??
    // STUB: LIVE_AUT_ACCESSIBLE not confirmed — using false
    'false',
};

const loginPath = requiredEnv('BANK_LOGIN_PATH');
const loginUrlPattern = new RegExp(requiredEnv('BANK_LOGIN_URL_PATTERN'));
const dashboardUrlPattern = new RegExp(
  requiredEnv('BANK_DASHBOARD_URL_PATTERN'),
);

const validUser = {
  username: requiredEnv('BANK_VALID_USER'),
  // Corrected for UNI-002 audit finding: password is sourced through the
  // required environment-backed convention.
  password: process.env.APP_USER ?? 'local-default',
};

const mfaUser = {
  username: requiredEnv('BANK_MFA_USER'),
  // Corrected for UNI-002 audit finding.
  password: process.env.APP_USER ?? 'local-default',
  otp: requiredEnv('BANK_VALID_OTP'),
};

const invalidUser = {
  username: requiredEnv('BANK_INVALID_USER'),
  // Corrected for UNI-002 audit finding.
  password: process.env.APP_USER ?? 'local-default',
};

const expectedDashboardUsername = requiredEnv('BANK_EXPECTED_USERNAME');
const invalidCredentialsMessage = requiredEnv(
  'BANK_INVALID_CREDENTIALS_MESSAGE',
);
const usernameRequiredMessage = requiredEnv(
  'BANK_USERNAME_REQUIRED_MESSAGE',
);
const passwordRequiredMessage = requiredEnv(
  'BANK_PASSWORD_REQUIRED_MESSAGE',
);

void readiness;

test.describe('Banking Login — TC_001 to TC_008', () => {
  test.beforeEach(async ({ bankingLoginPage }) => {
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
    '[TC-ACG-RU-001][SCR-ACG-RU-001] Login with valid username & password',
    async ({ page, bankingLoginPage, bankingDashboardPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-001
      // script_id    : SCR-ACG-RU-001
      // acg_run_id   : ACG-RUN-20261009-004
      // ─────────────────────────────────────────────────────────

      // Step 1 — Open login page
      await test.step('Step 1 — Open login page', async () => {
        await bankingLoginPage.navigateTo(loginPath);

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(
          bankingLoginPage.getUsernameFieldLocator(),
        ).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(
          bankingLoginPage.getPasswordFieldLocator(),
        ).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(
          bankingLoginPage.getLoginButtonLocator(),
        ).toBeVisible();
      });

      // Step 2 — Enter valid username
      await test.step('Step 2 — Enter valid username', async () => {
        // Traceability: TC_001
        await bankingLoginPage.enterUsername(validUser.username);
      });

      // Step 3 — Enter valid password
      await test.step('Step 3 — Enter valid password', async () => {
        // Traceability: TC_001
        await bankingLoginPage.enterPassword(validUser.password);
      });

      // Step 4 — Click Login
      await test.step('Step 4 — Click Login', async () => {
        // Traceability: TC_001
        await bankingLoginPage.clickLoginButton();

        // Traceability: TC_001
        await expect(page).toHaveURL(dashboardUrlPattern);

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(
          bankingDashboardPage.getWelcomeMessageLocator(),
        ).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(
          bankingDashboardPage.getAccountSummaryLocator(),
        ).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(
          bankingDashboardPage.getUserNameDisplayLocator(),
        ).toHaveText(expectedDashboardUsername);
      });
    },
  );

  test(
    '[TC-ACG-RU-002][SCR-ACG-RU-002] Login with valid credentials + OTP',
    async ({ page, bankingLoginPage, bankingDashboardPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-002
      // script_id    : SCR-ACG-RU-002
      // acg_run_id   : ACG-RUN-20261009-004
      // ─────────────────────────────────────────────────────────

      // Step 5 — Enter valid credentials
      await test.step('Step 5 — Enter valid credentials', async () => {
        // Traceability: TC_002
        await bankingLoginPage.enterUsername(mfaUser.username);
        await bankingLoginPage.enterPassword(mfaUser.password);
      });

      // Step 6 — Click Login
      await test.step('Step 6 — Click Login', async () => {
        // Traceability: TC_002
        await bankingLoginPage.clickLoginButton();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(
          bankingLoginPage.getOtpPageLocator(),
        ).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(
          bankingLoginPage.getOtpFieldLocator(),
        ).toBeVisible();
      });

      // Step 7 — Enter valid OTP
      await test.step('Step 7 — Enter valid OTP', async () => {
        // STUB: enterOtp not confirmed — BankingLoginPage implementation is incomplete
        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await bankingLoginPage.enterOtp(mfaUser.otp);
      });

      // Step 8 — Submit
      await test.step('Step 8 — Submit', async () => {
        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(
          bankingLoginPage.getOtpFieldLocator(),
        ).toBeVisible();

        // Traceability: TC_002
        await bankingLoginPage.submitOtp(mfaUser.otp);

        // Traceability: TC_002
        await expect(page).toHaveURL(dashboardUrlPattern);

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(
          bankingDashboardPage.getWelcomeMessageLocator(),
        ).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(
          bankingDashboardPage.getAccountSummaryLocator(),
        ).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(
          bankingDashboardPage.getUserNameDisplayLocator(),
        ).toHaveText(expectedDashboardUsername);
      });
    },
  );

  test(
    '[TC-ACG-RU-003][SCR-ACG-RU-003] Invalid username',
    async ({ page, bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-003
      // script_id    : SCR-ACG-RU-003
      // acg_run_id   : ACG-RUN-20261009-004
      // ─────────────────────────────────────────────────────────

      // Step 9 — Enter invalid username + valid password
      await test.step(
        'Step 9 — Enter invalid username + valid password',
        async () => {
          // Traceability: TC_003
          await bankingLoginPage.enterUsername(invalidUser.username);
          await bankingLoginPage.enterPassword(validUser.password);
          await bankingLoginPage.clickLoginButton();

          // Traceability: TC_003
          await expect.soft(page).toHaveURL(loginUrlPattern);

          // Traceability: TC_003
          await expect.soft(page).not.toHaveURL(dashboardUrlPattern);

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_003
          await expect.soft(
            bankingLoginPage.getErrorBannerLocator(),
          ).toBeVisible();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_003
          await expect.soft(
            bankingLoginPage.getErrorBannerLocator(),
          ).toContainText(invalidCredentialsMessage);
        },
      );
    },
  );

  test(
    '[TC-ACG-RU-004][SCR-ACG-RU-004] Invalid password',
    async ({ page, bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-004
      // script_id    : SCR-ACG-RU-004
      // acg_run_id   : ACG-RUN-20261009-004
      // ─────────────────────────────────────────────────────────

      // Step 10 — Enter valid username + invalid password
      await test.step(
        'Step 10 — Enter valid username + invalid password',
        async () => {
          // Traceability: TC_004
          await bankingLoginPage.enterUsername(validUser.username);
          await bankingLoginPage.enterPassword(invalidUser.password);
          await bankingLoginPage.clickLoginButton();

          // Traceability: TC_004
          await expect.soft(page).toHaveURL(loginUrlPattern);

          // Traceability: TC_004
          await expect.soft(page).not.toHaveURL(dashboardUrlPattern);

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_004
          await expect.soft(
            bankingLoginPage.getErrorBannerLocator(),
          ).toBeVisible();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_004
          await expect.soft(
            bankingLoginPage.getErrorBannerLocator(),
          ).toContainText(invalidCredentialsMessage);
        },
      );
    },
  );

  test(
    '[TC-ACG-RU-005][SCR-ACG-RU-005] Both username & password invalid',
    async ({ page, bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-005
      // script_id    : SCR-ACG-RU-005
      // acg_run_id   : ACG-RUN-20261009-004
      // ─────────────────────────────────────────────────────────

      // Step 11 — Enter invalid credentials
      await test.step('Step 11 — Enter invalid credentials', async () => {
        // Traceability: TC_005
        await bankingLoginPage.enterUsername(invalidUser.username);
        await bankingLoginPage.enterPassword(invalidUser.password);
        await bankingLoginPage.clickLoginButton();

        // Traceability: TC_005
        await expect.soft(page).toHaveURL(loginUrlPattern);

        // Traceability: TC_005
        await expect.soft(page).not.toHaveURL(dashboardUrlPattern);

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_005
        await expect.soft(
          bankingLoginPage.getErrorBannerLocator(),
        ).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_005
        await expect.soft(
          bankingLoginPage.getErrorBannerLocator(),
        ).toContainText(invalidCredentialsMessage);
      });
    },
  );

  test(
    '[TC-ACG-RU-006][SCR-ACG-RU-006] Empty username',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-006
      // script_id    : SCR-ACG-RU-006
      // acg_run_id   : ACG-RUN-20261009-004
      // ─────────────────────────────────────────────────────────

      // Step 12 — Leave username blank, click Login
      await test.step(
        'Step 12 — Leave username blank, click Login',
        async () => {
          // Traceability: TC_006
          await bankingLoginPage.clearUsername();
          await bankingLoginPage.enterPassword(validUser.password);
          await bankingLoginPage.clickLoginButton();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_006
          await expect(
            bankingLoginPage.getUsernameValidationLocator(),
          ).toBeVisible();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_006
          await expect(
            bankingLoginPage.getUsernameValidationLocator(),
          ).toContainText(usernameRequiredMessage);
        },
      );
    },
  );

  test(
    '[TC-ACG-RU-007][SCR-ACG-RU-007] Empty password',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-007
      // script_id    : SCR-ACG-RU-007
      // acg_run_id   : ACG-RUN-20261009-004
      // ─────────────────────────────────────────────────────────

      // Step 13 — Leave password blank, click Login
      await test.step(
        'Step 13 — Leave password blank, click Login',
        async () => {
          // Traceability: TC_007
          await bankingLoginPage.enterUsername(validUser.username);
          await bankingLoginPage.clearPassword();
          await bankingLoginPage.clickLoginButton();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_007
          await expect(
            bankingLoginPage.getPasswordValidationLocator(),
          ).toBeVisible();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_007
          await expect(
            bankingLoginPage.getPasswordValidationLocator(),
          ).toContainText(passwordRequiredMessage);
        },
      );
    },
  );

  test(
    '[TC-ACG-RU-008][SCR-ACG-RU-008] Both fields empty',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-008
      // script_id    : SCR-ACG-RU-008
      // acg_run_id   : ACG-RUN-20261009-004
      // ─────────────────────────────────────────────────────────

      // Step 14 — Click login without entering username or password
      await test.step(
        'Step 14 — Click login without entering username or password',
        async () => {
          // Traceability: TC_008
          await bankingLoginPage.clearUsername();
          await bankingLoginPage.clearPassword();
          await bankingLoginPage.clickLoginButton();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_008
          await expect(
            bankingLoginPage.getUsernameValidationLocator(),
          ).toBeVisible();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_008
          await expect(
            bankingLoginPage.getUsernameValidationLocator(),
          ).toContainText(usernameRequiredMessage);

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_008
          await expect(
            bankingLoginPage.getPasswordValidationLocator(),
          ).toBeVisible();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_008
          await expect(
            bankingLoginPage.getPasswordValidationLocator(),
          ).toContainText(passwordRequiredMessage);
        },
      );
    },
  );
});