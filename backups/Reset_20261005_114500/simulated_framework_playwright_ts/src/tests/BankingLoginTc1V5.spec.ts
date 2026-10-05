// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// TARGET_BROWSER  → set TARGET_BROWSER in .env (assumed: framework primary browser)
// AUT_MODULES_IN_SCOPE  → set AUT_MODULES_IN_SCOPE in .env (assumed: inferred Banking Login scope)
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
  // Corrected UNI-002: password is environment-read with a non-secret local fallback.
  password: process.env.BANK_VALID_PASS ?? process.env.APP_USER ?? 'local-default',
};

const mfaUser = {
  username: requiredEnv('BANK_MFA_USER'),
  // Corrected UNI-002: password is environment-read with a non-secret local fallback.
  password:
    process.env.BANK_MFA_PASSWORD ?? process.env.APP_USER ?? 'local-default',
  otp: requiredEnv('BANK_VALID_OTP'),
};

const invalidUser = {
  username: requiredEnv('BANK_INVALID_USER'),
  // Corrected UNI-002: password is environment-read with a non-secret local fallback.
  password:
    process.env.BANK_INVALID_PASSWORD ?? process.env.APP_USER ?? 'local-default',
};

const expectedMessages = {
  invalidCredentials: requiredEnv('BANK_INVALID_CREDENTIALS_MESSAGE'),
  usernameRequired: requiredEnv('BANK_USERNAME_REQUIRED_MESSAGE'),
  passwordRequired: requiredEnv('BANK_PASSWORD_REQUIRED_MESSAGE'),
};

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
      // acg_run_id   : ACG-RUN-20261005-002
      // ─────────────────────────────────────────────────────────

      // Step 1 — Open login page
      await test.step('Step 1 — Open login page', async () => {
        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(bankingLoginPage.getUsernameFieldLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(bankingLoginPage.getPasswordFieldLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(bankingLoginPage.getLoginButtonLocator()).toBeVisible();
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
        ).toBeVisible();

        // Traceability: TC_001
        await expect(
          bankingDashboardPage.getUserNameDisplayLocator(),
        ).toHaveText(validUser.username);
      });
    },
  );

  test(
    '[TC-ACG-RU-002][SCR-ACG-RU-002] Login with valid credentials + OTP',
    async ({ page, bankingLoginPage, bankingDashboardPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-002
      // script_id    : SCR-ACG-RU-002
      // acg_run_id   : ACG-RUN-20261005-002
      // ─────────────────────────────────────────────────────────

      // Step 1 — Open login page
      await test.step('Step 1 — Open login page', async () => {
        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingLoginPage.getUsernameFieldLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingLoginPage.getPasswordFieldLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingLoginPage.getLoginButtonLocator()).toBeVisible();
      });

      // Step 2 — Enter valid username
      await test.step('Step 2 — Enter valid username', async () => {
        // Traceability: TC_002
        await bankingLoginPage.enterUsername(mfaUser.username);
      });

      // Step 3 — Enter valid password
      await test.step('Step 3 — Enter valid password', async () => {
        // Traceability: TC_002
        await bankingLoginPage.enterPassword(mfaUser.password);
      });

      // Step 4 — Click Login
      await test.step('Step 4 — Click Login', async () => {
        // Traceability: TC_002
        await bankingLoginPage.clickLoginButton();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingLoginPage.getOtpPageLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingLoginPage.getOtpFieldLocator()).toBeVisible();

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
        ).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-003][SCR-ACG-RU-003] Invalid username',
    async ({ page, bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-003
      // script_id    : SCR-ACG-RU-003
      // acg_run_id   : ACG-RUN-20261005-002
      // ─────────────────────────────────────────────────────────

      // Step 1 — Open login page
      await test.step('Step 1 — Open login page', async () => {
        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_003
        await expect(bankingLoginPage.getLoginButtonLocator()).toBeVisible();
      });

      // Step 2 — Enter valid username
      await test.step('Step 2 — Enter valid username', async () => {
        // Traceability: TC_003
        await bankingLoginPage.enterUsername(invalidUser.username);
      });

      // Step 3 — Enter valid password
      await test.step('Step 3 — Enter valid password', async () => {
        // Traceability: TC_003
        await bankingLoginPage.enterPassword(validUser.password);
      });

      // Step 4 — Click Login
      await test.step('Step 4 — Click Login', async () => {
        // Traceability: TC_003
        await bankingLoginPage.clickLoginButton();

        // Traceability: TC_003
        await expect.soft(page).toHaveURL(loginUrlPattern);

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_003
        await expect.soft(
          bankingLoginPage.getErrorBannerLocator(),
        ).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_003
        await expect.soft(
          bankingLoginPage.getErrorBannerLocator(),
        ).toContainText(expectedMessages.invalidCredentials);
      });
    },
  );

  test(
    '[TC-ACG-RU-004][SCR-ACG-RU-004] Invalid password',
    async ({ page, bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-004
      // script_id    : SCR-ACG-RU-004
      // acg_run_id   : ACG-RUN-20261005-002
      // ─────────────────────────────────────────────────────────

      // Step 1 — Open login page
      await test.step('Step 1 — Open login page', async () => {
        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_004
        await expect(bankingLoginPage.getLoginButtonLocator()).toBeVisible();
      });

      // Step 2 — Enter valid username
      await test.step('Step 2 — Enter valid username', async () => {
        // Traceability: TC_004
        await bankingLoginPage.enterUsername(validUser.username);
      });

      // Step 3 — Enter valid password
      await test.step('Step 3 — Enter valid password', async () => {
        // Traceability: TC_004
        await bankingLoginPage.enterPassword(invalidUser.password);
      });

      // Step 4 — Click Login
      await test.step('Step 4 — Click Login', async () => {
        // Traceability: TC_004
        await bankingLoginPage.clickLoginButton();

        // Traceability: TC_004
        await expect.soft(page).toHaveURL(loginUrlPattern);

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_004
        await expect.soft(
          bankingLoginPage.getErrorBannerLocator(),
        ).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_004
        await expect.soft(
          bankingLoginPage.getErrorBannerLocator(),
        ).toContainText(expectedMessages.invalidCredentials);
      });
    },
  );

  test(
    '[TC-ACG-RU-005][SCR-ACG-RU-005] Both username & password invalid',
    async ({ page, bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-005
      // script_id    : SCR-ACG-RU-005
      // acg_run_id   : ACG-RUN-20261005-002
      // ─────────────────────────────────────────────────────────

      // Step 1 — Open login page
      await test.step('Step 1 — Open login page', async () => {
        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_005
        await expect(bankingLoginPage.getLoginButtonLocator()).toBeVisible();
      });

      // Step 2 — Enter valid username
      await test.step('Step 2 — Enter valid username', async () => {
        // Traceability: TC_005
        await bankingLoginPage.enterUsername(invalidUser.username);
      });

      // Step 3 — Enter valid password
      await test.step('Step 3 — Enter valid password', async () => {
        // Traceability: TC_005
        await bankingLoginPage.enterPassword(invalidUser.password);
      });

      // Step 4 — Click Login
      await test.step('Step 4 — Click Login', async () => {
        // Traceability: TC_005
        await bankingLoginPage.clickLoginButton();

        // Traceability: TC_005
        await expect.soft(page).toHaveURL(loginUrlPattern);

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_005
        await expect.soft(
          bankingLoginPage.getErrorBannerLocator(),
        ).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_005
        await expect.soft(
          bankingLoginPage.getErrorBannerLocator(),
        ).toContainText(expectedMessages.invalidCredentials);
      });
    },
  );

  test(
    '[TC-ACG-RU-006][SCR-ACG-RU-006] Empty username',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-006
      // script_id    : SCR-ACG-RU-006
      // acg_run_id   : ACG-RUN-20261005-002
      // ─────────────────────────────────────────────────────────

      // Step 1 — Open login page
      await test.step('Step 1 — Open login page', async () => {
        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_006
        await expect(bankingLoginPage.getUsernameFieldLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_006
        await expect(bankingLoginPage.getLoginButtonLocator()).toBeVisible();
      });

      // Step 2 — Enter valid username
      await test.step('Step 2 — Enter valid username', async () => {
        // Traceability: TC_006
        await bankingLoginPage.clearUsername();
      });

      // Step 3 — Enter valid password
      await test.step('Step 3 — Enter valid password', async () => {
        // Traceability: TC_006
        await bankingLoginPage.enterPassword(validUser.password);
      });

      // Step 4 — Click Login
      await test.step('Step 4 — Click Login', async () => {
        // Traceability: TC_006
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
        ).toContainText(expectedMessages.usernameRequired);
      });
    },
  );

  test(
    '[TC-ACG-RU-007][SCR-ACG-RU-007] Empty password',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-007
      // script_id    : SCR-ACG-RU-007
      // acg_run_id   : ACG-RUN-20261005-002
      // ─────────────────────────────────────────────────────────

      // Step 1 — Open login page
      await test.step('Step 1 — Open login page', async () => {
        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_007
        await expect(bankingLoginPage.getPasswordFieldLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_007
        await expect(bankingLoginPage.getLoginButtonLocator()).toBeVisible();
      });

      // Step 2 — Enter valid username
      await test.step('Step 2 — Enter valid username', async () => {
        // Traceability: TC_007
        await bankingLoginPage.enterUsername(validUser.username);
      });

      // Step 3 — Enter valid password
      await test.step('Step 3 — Enter valid password', async () => {
        // Traceability: TC_007
        await bankingLoginPage.clearPassword();
      });

      // Step 4 — Click Login
      await test.step('Step 4 — Click Login', async () => {
        // Traceability: TC_007
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
        ).toContainText(expectedMessages.passwordRequired);
      });
    },
  );

  test(
    '[TC-ACG-RU-008][SCR-ACG-RU-008] Both fields empty',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-008
      // script_id    : SCR-ACG-RU-008
      // acg_run_id   : ACG-RUN-20261005-002
      // ─────────────────────────────────────────────────────────

      // Step 1 — Open login page
      await test.step('Step 1 — Open login page', async () => {
        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_008
        await expect(bankingLoginPage.getUsernameFieldLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_008
        await expect(bankingLoginPage.getPasswordFieldLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_008
        await expect(bankingLoginPage.getLoginButtonLocator()).toBeVisible();
      });

      // Step 2 — Enter valid username
      await test.step('Step 2 — Enter valid username', async () => {
        // Traceability: TC_008
        await bankingLoginPage.clearUsername();
      });

      // Step 3 — Enter valid password
      await test.step('Step 3 — Enter valid password', async () => {
        // Traceability: TC_008
        await bankingLoginPage.clearPassword();
      });

      // Step 4 — Click Login
      await test.step('Step 4 — Click Login', async () => {
        // Traceability: TC_008
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
        ).toContainText(expectedMessages.usernameRequired);

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_008
        await expect(
          bankingLoginPage.getPasswordValidationLocator(),
        ).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_008
        await expect(
          bankingLoginPage.getPasswordValidationLocator(),
        ).toContainText(expectedMessages.passwordRequired);
      });
    },
  );
});