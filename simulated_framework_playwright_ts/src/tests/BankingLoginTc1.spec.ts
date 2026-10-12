// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// TARGET_BROWSER  → set TARGET_BROWSER in .env (assumed: framework primary browser)
// AUT_MODULES_IN_SCOPE  → set AUT_MODULES_IN_SCOPE in .env (assumed: inferred Banking Login scope)
// LIVE_AUT_ACCESSIBLE  → set LIVE_AUT_ACCESSIBLE in .env (assumed: false)
// BankingLoginPage.enterOtp()  → implement or confirm the Page Object method
// Banking Login selectors  → confirm selectors through the AUT KB
// ════════════════════════════════════════════════════

import { test, expect } from '../fixtures';

function requiredValue(value: string | undefined, variableName: string): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${variableName}`);
  }

  return value;
}

function requiredPattern(value: string | undefined, variableName: string): RegExp {
  return new RegExp(requiredValue(value, variableName));
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

const baseUrl = requiredValue(process.env.BASE_URL, 'BASE_URL');
const loginPath = requiredValue(
  process.env.BANK_LOGIN_PATH,
  'BANK_LOGIN_PATH',
);
const loginUrlPattern = requiredPattern(
  process.env.BANK_LOGIN_URL_PATTERN,
  'BANK_LOGIN_URL_PATTERN',
);
const dashboardUrlPattern = requiredPattern(
  process.env.BANK_DASHBOARD_URL_PATTERN,
  'BANK_DASHBOARD_URL_PATTERN',
);

const validUser = {
  username: requiredValue(
    process.env.BANK_VALID_USER,
    'BANK_VALID_USER',
  ),
  password: requiredValue(
    process.env.BANK_VALID_PASS,
    'BANK_VALID_PASS',
  ),
};

const mfaUser = {
  username: requiredValue(
    process.env.BANK_MFA_USER,
    'BANK_MFA_USER',
  ),
  password: requiredValue(
    process.env.BANK_MFA_PASS,
    'BANK_MFA_PASS',
  ),
  otp: requiredValue(
    process.env.BANK_VALID_OTP,
    'BANK_VALID_OTP',
  ),
};

const invalidUser = {
  username: requiredValue(
    process.env.BANK_INVALID_USER,
    'BANK_INVALID_USER',
  ),
  password: requiredValue(
    process.env.BANK_INVALID_PASS,
    'BANK_INVALID_PASS',
  ),
};

const expectedMessages = {
  invalidCredentials: requiredValue(
    process.env.BANK_INVALID_CREDENTIALS_MESSAGE,
    'BANK_INVALID_CREDENTIALS_MESSAGE',
  ),
  invalidPassword: requiredValue(
    process.env.BANK_INVALID_PASSWORD_MESSAGE,
    'BANK_INVALID_PASSWORD_MESSAGE',
  ),
  usernameRequired: requiredValue(
    process.env.BANK_USERNAME_REQUIRED_MESSAGE,
    'BANK_USERNAME_REQUIRED_MESSAGE',
  ),
  passwordRequired: requiredValue(
    process.env.BANK_PASSWORD_REQUIRED_MESSAGE,
    'BANK_PASSWORD_REQUIRED_MESSAGE',
  ),
};

void baseUrl;
void readiness;

test.describe('RIARA-REQ-001–RIARA-REQ-008 — Banking Login', () => {
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
      // acg_run_id   : ACG-RUN-20261012-005
      // ─────────────────────────────────────────────────────────

      // Step 1 — Open login page
      await test.step('Step 1 — Open login page', async () => {
        // Traceability: TC_001
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingLoginPage.getUsernameFieldLocator(),
        ).toBeVisible();

        // Traceability: TC_001
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingLoginPage.getPasswordFieldLocator(),
        ).toBeVisible();

        // Traceability: TC_001
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingLoginPage.getLoginButtonLocator(),
        ).toBeVisible();
      });

      // Step 2 — Enter valid username
      await test.step('Step 2 — Enter valid username', async () => {
        // Traceability: TC_001
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.enterUsername(validUser.username);
      });

      // Step 3 — Enter valid password
      await test.step('Step 3 — Enter valid password', async () => {
        // Traceability: TC_001
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.enterPassword(validUser.password);
      });

      // Step 4 — Click Login
      await test.step('Step 4 — Click Login', async () => {
        // Traceability: TC_001
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.clickLoginButton();

        // Traceability: TC_001
        await expect(page).toHaveURL(dashboardUrlPattern);

        // Traceability: TC_001
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingDashboardPage.getWelcomeMessageLocator(),
        ).toBeVisible();

        // Traceability: TC_001
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingDashboardPage.getAccountSummaryLocator(),
        ).toBeVisible();
      });
    },
  );

  test(
    '[TC-ACG-RU-002][SCR-ACG-RU-002] Login with valid credentials + OTP',
    async ({ page, bankingLoginPage, bankingDashboardPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-002
      // script_id    : SCR-ACG-RU-002
      // acg_run_id   : ACG-RUN-20261012-005
      // ─────────────────────────────────────────────────────────

      // Step 5 — Enter valid OTP
      await test.step('Step 5 — Enter valid OTP', async () => {
        // Traceability: TC_002
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingLoginPage.getOtpPageLocator(),
        ).toBeVisible();

        // Traceability: TC_002
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingLoginPage.getOtpFieldLocator(),
        ).toBeVisible();

        // STUB: enterOtp not confirmed — BankingLoginPage implementation is incomplete
        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await bankingLoginPage.enterOtp(mfaUser.otp);
      });

      // Step 6 — Submit
      await test.step('Step 6 — Submit', async () => {
        // Traceability: TC_002
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.submitOtp(mfaUser.otp);

        // Traceability: TC_002
        await expect(page).toHaveURL(dashboardUrlPattern);

        // Traceability: TC_002
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingDashboardPage.getWelcomeMessageLocator(),
        ).toBeVisible();

        // Traceability: TC_002
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingDashboardPage.getAccountSummaryLocator(),
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
      // acg_run_id   : ACG-RUN-20261012-005
      // ─────────────────────────────────────────────────────────

      // Step 7 — Enter invalid username + valid password
      await test.step(
        'Step 7 — Enter invalid username + valid password',
        async () => {
          // Traceability: TC_003
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await bankingLoginPage.enterUsername(invalidUser.username);

          // Traceability: TC_003
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await bankingLoginPage.enterPassword(validUser.password);

          // Traceability: TC_003
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await bankingLoginPage.clickLoginButton();

          // Traceability: TC_003
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await expect(
            bankingLoginPage.getErrorBannerLocator(),
          ).toBeVisible();

          // Traceability: TC_003
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await expect(
            bankingLoginPage.getErrorBannerLocator(),
          ).toContainText(expectedMessages.invalidCredentials);

          // Traceability: TC_003
          await expect(page).toHaveURL(loginUrlPattern);

          // Traceability: TC_003
          await expect(page).not.toHaveURL(dashboardUrlPattern);
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
      // acg_run_id   : ACG-RUN-20261012-005
      // ─────────────────────────────────────────────────────────

      // Step 8 — Enter valid username + invalid password
      await test.step(
        'Step 8 — Enter valid username + invalid password',
        async () => {
          // Traceability: TC_004
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await bankingLoginPage.enterUsername(validUser.username);

          // Traceability: TC_004
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await bankingLoginPage.enterPassword(invalidUser.password);

          // Traceability: TC_004
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await bankingLoginPage.clickLoginButton();

          // Traceability: TC_004
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await expect(
            bankingLoginPage.getErrorBannerLocator(),
          ).toBeVisible();

          // Traceability: TC_004
          // LOCATOR_UNCONFIRMED — not in AUT KB
          await expect(
            bankingLoginPage.getErrorBannerLocator(),
          ).toContainText(expectedMessages.invalidPassword);

          // Traceability: TC_004
          await expect(page).toHaveURL(loginUrlPattern);

          // Traceability: TC_004
          await expect(page).not.toHaveURL(dashboardUrlPattern);
        },
      );
    },
  );

  test(
    '[TC-ACG-RU-005][SCR-ACG-RU-005] Both credentials invalid',
    async ({ page, bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-005
      // script_id    : SCR-ACG-RU-005
      // acg_run_id   : ACG-RUN-20261012-005
      // ─────────────────────────────────────────────────────────

      // Step 9 — Enter invalid credentials
      await test.step('Step 9 — Enter invalid credentials', async () => {
        // Traceability: TC_005
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.enterUsername(invalidUser.username);

        // Traceability: TC_005
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.enterPassword(invalidUser.password);

        // Traceability: TC_005
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.clickLoginButton();

        // Traceability: TC_005
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingLoginPage.getErrorBannerLocator(),
        ).toBeVisible();

        // Traceability: TC_005
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingLoginPage.getErrorBannerLocator(),
        ).toContainText(expectedMessages.invalidCredentials);

        // Traceability: TC_005
        await expect(page).toHaveURL(loginUrlPattern);

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
      // acg_run_id   : ACG-RUN-20261012-005
      // ─────────────────────────────────────────────────────────

      // Step 10 — Leave username blank
      await test.step('Step 10 — Leave username blank', async () => {
        // Traceability: TC_006
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.clearUsername();

        // Traceability: TC_006
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.enterPassword(validUser.password);

        // Traceability: TC_006
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.clickLoginButton();

        // Traceability: TC_006
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingLoginPage.getUsernameValidationLocator(),
        ).toBeVisible();

        // Traceability: TC_006
        // LOCATOR_UNCONFIRMED — not in AUT KB
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
      // acg_run_id   : ACG-RUN-20261012-005
      // ─────────────────────────────────────────────────────────

      // Step 11 — Leave password blank
      await test.step('Step 11 — Leave password blank', async () => {
        // Traceability: TC_007
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.enterUsername(validUser.username);

        // Traceability: TC_007
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.clearPassword();

        // Traceability: TC_007
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.clickLoginButton();

        // Traceability: TC_007
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingLoginPage.getPasswordValidationLocator(),
        ).toBeVisible();

        // Traceability: TC_007
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingLoginPage.getPasswordValidationLocator(),
        ).toContainText(expectedMessages.passwordRequired);
      });
    },
  );

  test(
    '[TC-ACG-RU-008][SCR-ACG-RU-008] Both fields empty',
    async ({ page, bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-ACG-RU-008
      // script_id    : SCR-ACG-RU-008
      // acg_run_id   : ACG-RUN-20261012-005
      // ─────────────────────────────────────────────────────────

      // Step 12 — Click login without input
      await test.step('Step 12 — Click login without input', async () => {
        // Traceability: TC_008
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.clearUsername();

        // Traceability: TC_008
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.clearPassword();

        // Traceability: TC_008
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await bankingLoginPage.clickLoginButton();

        // Traceability: TC_008
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingLoginPage.getUsernameValidationLocator(),
        ).toBeVisible();

        // Traceability: TC_008
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingLoginPage.getUsernameValidationLocator(),
        ).toContainText(expectedMessages.usernameRequired);

        // Traceability: TC_008
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingLoginPage.getPasswordValidationLocator(),
        ).toBeVisible();

        // Traceability: TC_008
        // LOCATOR_UNCONFIRMED — not in AUT KB
        await expect(
          bankingLoginPage.getPasswordValidationLocator(),
        ).toContainText(expectedMessages.passwordRequired);

        // Traceability: TC_008
        await expect(page).not.toHaveURL(dashboardUrlPattern);
      });
    },
  );
});