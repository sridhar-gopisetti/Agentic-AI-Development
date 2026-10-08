// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// TARGET_BROWSER  → set TARGET_BROWSER in .env (assumed: framework primary browser)
// AUT_MODULES_IN_SCOPE  → set AUT_MODULES_IN_SCOPE in .env (assumed: inferred banking login scope)
// LIVE_AUT_ACCESSIBLE  → set LIVE_AUT_ACCESSIBLE in .env (assumed: false)
// ════════════════════════════════════════════════════

import { test, expect } from '../fixtures';

const readiness = {
  targetBrowser:
    process.env.TARGET_BROWSER ??
    // STUB: TARGET_BROWSER not confirmed — using framework primary browser
    'chromium',
  modulesInScope:
    process.env.AUT_MODULES_IN_SCOPE ??
    // STUB: AUT_MODULES_IN_SCOPE not confirmed — using inferred banking login scope
    'Banking Login',
  liveAutAccessible:
    process.env.LIVE_AUT_ACCESSIBLE ??
    // STUB: LIVE_AUT_ACCESSIBLE not confirmed — using false
    'false',
};

const loginPath =
  process.env.BANK_LOGIN_PATH ??
  process.env.AUT_LOGIN_PATH ??
  // STUB: BANK_LOGIN_PATH/AUT_LOGIN_PATH not confirmed — using /login
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

const invalidUser = {
  username: process.env.BANK_INVALID_USER,
  password: process.env.BANK_INVALID_PASSWORD,
};

const expectedMessages = {
  invalidCredentials: process.env.BANK_INVALID_CREDENTIALS_MESSAGE,
  invalidPassword: process.env.BANK_INVALID_PASSWORD_MESSAGE,
  usernameRequired: process.env.BANK_USERNAME_REQUIRED_MESSAGE,
  passwordRequired: process.env.BANK_PASSWORD_REQUIRED_MESSAGE,
};

const dashboardUrlPattern = process.env.BANK_DASHBOARD_URL_PATTERN;

function requiredValue(
  value: string | undefined,
  variableNames: string,
): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${variableNames}`);
  }

  return value;
}

function requireCommonTestData(): void {
  requiredValue(validUser.username, 'BANK_VALID_USER or AUT_USER_EMAIL');
  requiredValue(validUser.password, 'BANK_VALID_PASS or AUT_USER_PASSWORD');
  requiredValue(
    dashboardUrlPattern,
    'BANK_DASHBOARD_URL_PATTERN',
  );
}

function requireMfaTestData(): void {
  requireCommonTestData();
  requiredValue(mfaUser.username, 'BANK_MFA_USER');
  requiredValue(mfaUser.password, 'BANK_MFA_PASSWORD');
  requiredValue(mfaUser.otp, 'BANK_VALID_OTP');
}

function requireInvalidCredentialData(): void {
  requireCommonTestData();
  requiredValue(invalidUser.username, 'BANK_INVALID_USER');
  requiredValue(invalidUser.password, 'BANK_INVALID_PASSWORD');
}

function requireInvalidCredentialsMessage(): string {
  return requiredValue(
    expectedMessages.invalidCredentials,
    'BANK_INVALID_CREDENTIALS_MESSAGE',
  );
}

function requireInvalidPasswordMessage(): string {
  return requiredValue(
    expectedMessages.invalidPassword,
    'BANK_INVALID_PASSWORD_MESSAGE',
  );
}

function requireUsernameRequiredMessage(): string {
  return requiredValue(
    expectedMessages.usernameRequired,
    'BANK_USERNAME_REQUIRED_MESSAGE',
  );
}

function requirePasswordRequiredMessage(): string {
  return requiredValue(
    expectedMessages.passwordRequired,
    'BANK_PASSWORD_REQUIRED_MESSAGE',
  );
}

void readiness;

test.describe('Banking Authentication — TC_001 to TC_008', () => {
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
    '[TC-ACG-RU-001][SCR-ACG-RU-001] TC_001: Login with valid username & password',
    async ({ page, bankingLoginPage, bankingDashboardPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-001
      // script_id    : SCR-ACG-RU-001
      // acg_run_id   : ACG-RUN-20261007-002
      // ─────────────────────────────────────────────────────────

      requireCommonTestData();

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
        await bankingLoginPage.enterUsername(
          requiredValue(validUser.username, 'BANK_VALID_USER or AUT_USER_EMAIL'),
        );
      });

      // Step 3 — Enter valid password
      await test.step('Step 3 — Enter valid password', async () => {
        // Traceability: TC_001
        await bankingLoginPage.enterPassword(
          requiredValue(validUser.password, 'BANK_VALID_PASS or AUT_USER_PASSWORD'),
        );
      });

      // Step 4 — Click Login
      await test.step('Step 4 — Click Login', async () => {
        // Traceability: TC_001
        await bankingLoginPage.clickLoginButton();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(bankingDashboardPage.getWelcomeMessageLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(bankingDashboardPage.getAccountSummaryLocator()).toBeVisible();

        // Traceability: TC_001
        await expect(page).toHaveURL(
          new RegExp(
            requiredValue(
              dashboardUrlPattern,
              'BANK_DASHBOARD_URL_PATTERN',
            ),
          ),
        );
      });
    },
  );

  test(
    '[TC-ACG-RU-002][SCR-ACG-RU-002] TC_002: Login with valid credentials + OTP',
    async ({ page, bankingLoginPage, bankingDashboardPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-002
      // script_id    : SCR-ACG-RU-002
      // acg_run_id   : ACG-RUN-20261007-002
      // ─────────────────────────────────────────────────────────

      requireMfaTestData();

      // Step 5 — Enter valid OTP
      await test.step('Step 5 — Enter valid OTP', async () => {
        // Traceability: TC_002
        // STUB: enterOtp not implemented — approved stub_and_continue method
        await bankingLoginPage.enterOtp(
          requiredValue(mfaUser.otp, 'BANK_VALID_OTP'),
        );
      });

      // Step 6 — Submit
      await test.step('Step 6 — Submit', async () => {
        // Traceability: TC_002
        await bankingLoginPage.submitOtp(
          requiredValue(mfaUser.otp, 'BANK_VALID_OTP'),
        );

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingLoginPage.getOtpPageLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingDashboardPage.getWelcomeMessageLocator()).toBeVisible();

        // Traceability: TC_002
        await expect(page).toHaveURL(
          new RegExp(
            requiredValue(
              dashboardUrlPattern,
              'BANK_DASHBOARD_URL_PATTERN',
            ),
          ),
        );
      });
    },
  );

  test(
    '[TC-ACG-RU-003][SCR-ACG-RU-003] TC_003: Invalid username',
    async ({ page, bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-003
      // script_id    : SCR-ACG-RU-003
      // acg_run_id   : ACG-RUN-20261007-002
      // ─────────────────────────────────────────────────────────

      requireInvalidCredentialData();
      const invalidCredentialsMessage = requireInvalidCredentialsMessage();

      // Step 7 — Enter invalid username + valid password
      await test.step(
        'Step 7 — Enter invalid username + valid password',
        async () => {
          // Traceability: TC_003
          await bankingLoginPage.enterUsername(
            requiredValue(invalidUser.username, 'BANK_INVALID_USER'),
          );
          await bankingLoginPage.enterPassword(
            requiredValue(validUser.password, 'BANK_VALID_PASS or AUT_USER_PASSWORD'),
          );
          await bankingLoginPage.clickLoginButton();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_003
          await expect(bankingLoginPage.getErrorBannerLocator()).toBeVisible();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_003
          await expect(
            bankingLoginPage.getErrorBannerLocator(),
          ).toContainText(invalidCredentialsMessage);

          // Traceability: TC_003
          await expect(page).not.toHaveURL(
            new RegExp(
              requiredValue(
                dashboardUrlPattern,
                'BANK_DASHBOARD_URL_PATTERN',
              ),
            ),
          );
        },
      );
    },
  );

  test(
    '[TC-ACG-RU-004][SCR-ACG-RU-004] TC_004: Invalid password',
    async ({ page, bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-004
      // script_id    : SCR-ACG-RU-004
      // acg_run_id   : ACG-RUN-20261007-002
      // ─────────────────────────────────────────────────────────

      requireInvalidCredentialData();
      const invalidPasswordMessage = requireInvalidPasswordMessage();

      // Step 8 — Enter valid username + invalid password
      await test.step(
        'Step 8 — Enter valid username + invalid password',
        async () => {
          // Traceability: TC_004
          await bankingLoginPage.enterUsername(
            requiredValue(validUser.username, 'BANK_VALID_USER or AUT_USER_EMAIL'),
          );
          await bankingLoginPage.enterPassword(
            requiredValue(invalidUser.password, 'BANK_INVALID_PASSWORD'),
          );
          await bankingLoginPage.clickLoginButton();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_004
          await expect(bankingLoginPage.getErrorBannerLocator()).toBeVisible();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_004
          await expect(
            bankingLoginPage.getErrorBannerLocator(),
          ).toContainText(invalidPasswordMessage);

          // Traceability: TC_004
          await expect(page).not.toHaveURL(
            new RegExp(
              requiredValue(
                dashboardUrlPattern,
                'BANK_DASHBOARD_URL_PATTERN',
              ),
            ),
          );
        },
      );
    },
  );

  test(
    '[TC-ACG-RU-005][SCR-ACG-RU-005] TC_005: Both username & password invalid',
    async ({ page, bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-005
      // script_id    : SCR-ACG-RU-005
      // acg_run_id   : ACG-RUN-20261007-002
      // ─────────────────────────────────────────────────────────

      requireInvalidCredentialData();
      const invalidCredentialsMessage = requireInvalidCredentialsMessage();

      // Step 9 — Enter invalid credentials
      await test.step('Step 9 — Enter invalid credentials', async () => {
        // Traceability: TC_005
        await bankingLoginPage.enterUsername(
          requiredValue(invalidUser.username, 'BANK_INVALID_USER'),
        );
        await bankingLoginPage.enterPassword(
          requiredValue(invalidUser.password, 'BANK_INVALID_PASSWORD'),
        );
        await bankingLoginPage.clickLoginButton();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_005
        await expect(bankingLoginPage.getErrorBannerLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_005
        await expect(
          bankingLoginPage.getErrorBannerLocator(),
        ).toContainText(invalidCredentialsMessage);

        // Traceability: TC_005
        await expect(page).not.toHaveURL(
          new RegExp(
            requiredValue(
              dashboardUrlPattern,
              'BANK_DASHBOARD_URL_PATTERN',
            ),
          ),
        );
      });
    },
  );

  test(
    '[TC-ACG-RU-006][SCR-ACG-RU-006] TC_006: Empty username',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-006
      // script_id    : SCR-ACG-RU-006
      // acg_run_id   : ACG-RUN-20261007-002
      // ─────────────────────────────────────────────────────────

      requireCommonTestData();
      const usernameRequiredMessage = requireUsernameRequiredMessage();

      // Step 10 — Leave username blank
      await test.step('Step 10 — Leave username blank', async () => {
        // Traceability: TC_006
        await bankingLoginPage.clearUsername();
        await bankingLoginPage.enterPassword(
          requiredValue(validUser.password, 'BANK_VALID_PASS or AUT_USER_PASSWORD'),
        );
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
      });
    },
  );

  test(
    '[TC-ACG-RU-007][SCR-ACG-RU-007] TC_007: Empty password',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-007
      // script_id    : SCR-ACG-RU-007
      // acg_run_id   : ACG-RUN-20261007-002
      // ─────────────────────────────────────────────────────────

      requireCommonTestData();
      const passwordRequiredMessage = requirePasswordRequiredMessage();

      // Step 11 — Leave password blank
      await test.step('Step 11 — Leave password blank', async () => {
        // Traceability: TC_007
        await bankingLoginPage.enterUsername(
          requiredValue(validUser.username, 'BANK_VALID_USER or AUT_USER_EMAIL'),
        );
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
      });
    },
  );

  test(
    '[TC-ACG-RU-008][SCR-ACG-RU-008] TC_008: Both fields empty',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-008
      // script_id    : SCR-ACG-RU-008
      // acg_run_id   : ACG-RUN-20261007-002
      // ─────────────────────────────────────────────────────────

      requireCommonTestData();
      const usernameRequiredMessage = requireUsernameRequiredMessage();
      const passwordRequiredMessage = requirePasswordRequiredMessage();

      // Step 12 — Click login without input
      await test.step('Step 12 — Click login without input', async () => {
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
      });
    },
  );
});