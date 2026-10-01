// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// AUT_LOGIN_PATH  → set AUT_LOGIN_PATH in .env (assumed: /login)
// AUT_USER_EMAIL  → set AUT_USER_EMAIL in .env
// AUT_USER_PASSWORD  → set AUT_USER_PASSWORD in .env
// TARGET_BROWSER  → set TARGET_BROWSER in .env
// AUT_MODULES_IN_SCOPE  → set AUT_MODULES_IN_SCOPE in .env
// LIVE_AUT_ACCESSIBLE  → set LIVE_AUT_ACCESSIBLE in .env
// BANK_VALID_USER  → set BANK_VALID_USER in .env
// BANK_VALID_PASS  → set BANK_VALID_PASS in .env
// BANK_MFA_USER  → set BANK_MFA_USER in .env
// BANK_MFA_PASSWORD  → set BANK_MFA_PASSWORD in .env
// BANK_VALID_OTP  → set BANK_VALID_OTP in .env
// BANK_INVALID_USER  → set BANK_INVALID_USER in .env
// BANK_INVALID_PASSWORD  → set BANK_INVALID_PASSWORD in .env
// BANK_INVALID_CREDENTIALS_MESSAGE  → set BANK_INVALID_CREDENTIALS_MESSAGE in .env
// BANK_INVALID_PASSWORD_MESSAGE  → set BANK_INVALID_PASSWORD_MESSAGE in .env
// BANK_DENIED_MESSAGE  → set BANK_DENIED_MESSAGE in .env
// BANK_USERNAME_REQUIRED_MESSAGE  → set BANK_USERNAME_REQUIRED_MESSAGE in .env
// BANK_PASSWORD_REQUIRED_MESSAGE  → set BANK_PASSWORD_REQUIRED_MESSAGE in .env
// BANK_DASHBOARD_URL_PATTERN  → set BANK_DASHBOARD_URL_PATTERN in .env
// ════════════════════════════════════════════════════

import { test, expect } from '../fixtures';

function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const loginPath =
  process.env.AUT_LOGIN_PATH ??
  // STUB: AUT_LOGIN_PATH not confirmed — using /login
  '/login';

const validUser = {
  username: process.env.BANK_VALID_USER ?? process.env.AUT_USER_EMAIL,
  password: process.env.BANK_VALID_PASS ?? process.env.AUT_USER_PASSWORD,
};

const mfaUser = {
  username: process.env.BANK_MFA_USER,
  password: process.env.BANK_MFA_PASSWORD,
  otp: process.env.BANK_VALID_OTP,
};

const invalidUsername = process.env.BANK_INVALID_USER;
const invalidPassword = process.env.BANK_INVALID_PASSWORD;

const expectedMessages = {
  invalidCredentials: process.env.BANK_INVALID_CREDENTIALS_MESSAGE,
  invalidPassword: process.env.BANK_INVALID_PASSWORD_MESSAGE,
  denied: process.env.BANK_DENIED_MESSAGE,
  usernameRequired: process.env.BANK_USERNAME_REQUIRED_MESSAGE,
  passwordRequired: process.env.BANK_PASSWORD_REQUIRED_MESSAGE,
};

const dashboardUrlPattern = new RegExp(
  requiredEnv('BANK_DASHBOARD_URL_PATTERN'),
);

function requireTestData(): void {
  if (!validUser.username) {
    throw new Error(
      'Missing BANK_VALID_USER or AUT_USER_EMAIL environment variable',
    );
  }

  if (!validUser.password) {
    throw new Error(
      'Missing BANK_VALID_PASS or AUT_USER_PASSWORD environment variable',
    );
  }

  if (!mfaUser.username) {
    throw new Error('Missing BANK_MFA_USER environment variable');
  }

  if (!mfaUser.password) {
    throw new Error('Missing BANK_MFA_PASSWORD environment variable');
  }

  if (!mfaUser.otp) {
    throw new Error('Missing BANK_VALID_OTP environment variable');
  }

  if (!invalidUsername) {
    throw new Error('Missing BANK_INVALID_USER environment variable');
  }

  if (!invalidPassword) {
    throw new Error('Missing BANK_INVALID_PASSWORD environment variable');
  }

  if (!expectedMessages.invalidCredentials) {
    throw new Error(
      'Missing BANK_INVALID_CREDENTIALS_MESSAGE environment variable',
    );
  }

  if (!expectedMessages.invalidPassword) {
    throw new Error(
      'Missing BANK_INVALID_PASSWORD_MESSAGE environment variable',
    );
  }

  if (!expectedMessages.denied) {
    throw new Error('Missing BANK_DENIED_MESSAGE environment variable');
  }

  if (!expectedMessages.usernameRequired) {
    throw new Error(
      'Missing BANK_USERNAME_REQUIRED_MESSAGE environment variable',
    );
  }

  if (!expectedMessages.passwordRequired) {
    throw new Error(
      'Missing BANK_PASSWORD_REQUIRED_MESSAGE environment variable',
    );
  }
}

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
    '[TC-ACG-RU-001][SCR-ACG-RU-001] Login with valid username and password',
    async ({ page, bankingLoginPage, bankingDashboardPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-001
      // script_id    : SCR-ACG-RU-001
      // acg_run_id   : ACG-RUN-20261001-005
      // ─────────────────────────────────────────────────────────

      requireTestData();

      // Step 1 — Open login page
      await test.step('Step 1 — Open login page', async () => {
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
        await bankingLoginPage.enterUsername(validUser.username as string);
      });

      // Step 3 — Enter valid password
      await test.step('Step 3 — Enter valid password', async () => {
        await bankingLoginPage.enterPassword(validUser.password as string);
      });

      // Step 4 — Click Login
      await test.step('Step 4 — Click Login', async () => {
        await bankingLoginPage.clickLoginButton();

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

        // Traceability: TC_001
        await expect(page).toHaveURL(dashboardUrlPattern);
      });
    },
  );

  test(
    '[TC-ACG-RU-002][SCR-ACG-RU-002] Login with valid credentials and OTP',
    async ({ page, bankingLoginPage, bankingDashboardPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-002
      // script_id    : SCR-ACG-RU-002
      // acg_run_id   : ACG-RUN-20261001-005
      // ─────────────────────────────────────────────────────────

      requireTestData();

      // Step 5 — Enter valid credentials
      await test.step('Step 5 — Enter valid credentials', async () => {
        await bankingLoginPage.enterUsername(mfaUser.username as string);
        await bankingLoginPage.enterPassword(mfaUser.password as string);
        await bankingLoginPage.clickLoginButton();
      });

      // Step 6 — Enter valid OTP
      await test.step('Step 6 — Enter valid OTP', async () => {
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

        await bankingLoginPage.submitOtp(mfaUser.otp as string);
      });

      // Step 7 — Submit
      await test.step('Step 7 — Submit', async () => {
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

        // Traceability: TC_002
        await expect(page).toHaveURL(dashboardUrlPattern);
      });
    },
  );

  test(
    '[TC-ACG-RU-003][SCR-ACG-RU-003] Invalid username',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-003
      // script_id    : SCR-ACG-RU-003
      // acg_run_id   : ACG-RUN-20261001-005
      // ─────────────────────────────────────────────────────────

      requireTestData();

      // Step 8 — Enter invalid username + valid password
      await test.step(
        'Step 8 — Enter invalid username + valid password',
        async () => {
          await bankingLoginPage.enterUsername(invalidUsername as string);
          await bankingLoginPage.enterPassword(validUser.password as string);
          await bankingLoginPage.clickLoginButton();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_003
          await expect(
            bankingLoginPage.getErrorBannerLocator(),
          ).toBeVisible();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_003
          await expect(
            bankingLoginPage.getErrorBannerLocator(),
          ).toContainText(expectedMessages.invalidCredentials as string);
        },
      );
    },
  );

  test(
    '[TC-ACG-RU-004][SCR-ACG-RU-004] Invalid password',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-004
      // script_id    : SCR-ACG-RU-004
      // acg_run_id   : ACG-RUN-20261001-005
      // ─────────────────────────────────────────────────────────

      requireTestData();

      // Step 9 — Enter valid username + invalid password
      await test.step(
        'Step 9 — Enter valid username + invalid password',
        async () => {
          await bankingLoginPage.enterUsername(validUser.username as string);
          await bankingLoginPage.enterPassword(invalidPassword as string);
          await bankingLoginPage.clickLoginButton();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_004
          await expect(
            bankingLoginPage.getErrorBannerLocator(),
          ).toBeVisible();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_004
          await expect(
            bankingLoginPage.getErrorBannerLocator(),
          ).toContainText(expectedMessages.invalidPassword as string);
        },
      );
    },
  );

  test(
    '[TC-ACG-RU-005][SCR-ACG-RU-005] Both username and password invalid',
    async ({ page, bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-005
      // script_id    : SCR-ACG-RU-005
      // acg_run_id   : ACG-RUN-20261001-005
      // ─────────────────────────────────────────────────────────

      requireTestData();

      // Step 10 — Enter invalid credentials
      await test.step('Step 10 — Enter invalid credentials', async () => {
        await bankingLoginPage.enterUsername(invalidUsername as string);
        await bankingLoginPage.enterPassword(invalidPassword as string);
        await bankingLoginPage.clickLoginButton();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_005
        await expect(
          bankingLoginPage.getErrorBannerLocator(),
        ).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_005
        await expect(
        bankingLoginPage.getErrorBannerLocator(),
        ).toContainText(expectedMessages.invalidCredentials as string);

        // Traceability: TC_005
        await expect(page).not.toHaveURL(dashboardUrlPattern);
      });
    },
  );

  test(
    '[TC-ACG-RU-006][SCR-ACG-RU-006] Empty username',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-006
      // script_id    : SCR-ACG-RU-006
      // acg_run_id   : ACG-RUN-20261001-005
      // ─────────────────────────────────────────────────────────

      requireTestData();

      // Step 11 — Leave username blank
      await test.step('Step 11 — Leave username blank', async () => {
        await bankingLoginPage.clearUsername();
        await bankingLoginPage.enterPassword(validUser.password as string);
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
        ).toContainText(expectedMessages.usernameRequired as string);
      });
    },
  );

  test(
    '[TC-ACG-RU-007][SCR-ACG-RU-007] Empty password',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-007
      // script_id    : SCR-ACG-RU-007
      // acg_run_id   : ACG-RUN-20261001-005
      // ─────────────────────────────────────────────────────────

      requireTestData();

      // Step 12 — Leave password blank
      await test.step('Step 12 — Leave password blank', async () => {
        await bankingLoginPage.enterUsername(validUser.username as string);
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
        ).toContainText(expectedMessages.passwordRequired as string);
      });
    },
  );

  test(
    '[TC-ACG-RU-008][SCR-ACG-RU-008] Both fields empty',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-008
      // script_id    : SCR-ACG-RU-008
      // acg_run_id   : ACG-RUN-20261001-005
      // ─────────────────────────────────────────────────────────

      requireTestData();

      // Step 13 — Click login without input
      await test.step('Step 13 — Click login without input', async () => {
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
        ).toContainText(expectedMessages.usernameRequired as string);

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_008
        await expect(
          bankingLoginPage.getPasswordValidationLocator(),
        ).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_008
        await expect(
          bankingLoginPage.getPasswordValidationLocator(),
        ).toContainText(expectedMessages.passwordRequired as string);
      });
    },
  );
});