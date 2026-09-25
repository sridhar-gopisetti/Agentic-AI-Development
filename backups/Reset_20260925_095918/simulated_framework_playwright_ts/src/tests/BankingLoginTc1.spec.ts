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

import { test, expect } from '../../../fixtures';

const loginPath =
  process.env.AUT_LOGIN_PATH ??
  // STUB: AUT_LOGIN_PATH not confirmed — using /login
  '/login';

const validUser = {
  username:
    process.env.BANK_VALID_USER ??
    process.env.AUT_USER_EMAIL ??
    // STUB: AUT_USER_EMAIL not confirmed — using an empty value
    '',
  password:
    process.env.BANK_VALID_PASS ??
    process.env.AUT_USER_PASSWORD ??
    // STUB: AUT_USER_PASSWORD not confirmed — using an empty value
    '',
};

const mfaUser = {
  username:
    process.env.BANK_MFA_USER ??
    // STUB: BANK_MFA_USER not confirmed — using an empty value
    '',
  password:
    process.env.BANK_MFA_PASSWORD ??
    // STUB: BANK_MFA_PASSWORD not confirmed — using an empty value
    '',
  otp:
    process.env.BANK_VALID_OTP ??
    // STUB: BANK_VALID_OTP not confirmed — using an empty value
    '',
};

const invalidUsername =
  process.env.BANK_INVALID_USER ??
  // STUB: BANK_INVALID_USER not confirmed — using an empty value
  '';

const invalidPassword =
  process.env.BANK_INVALID_PASSWORD ??
  // STUB: BANK_INVALID_PASSWORD not confirmed — using an empty value
  '';

const invalidCredentialsMessage =
  process.env.BANK_INVALID_CREDENTIALS_MESSAGE ??
  // STUB: BANK_INVALID_CREDENTIALS_MESSAGE not confirmed — using an empty value
  '';

const invalidPasswordMessage =
  process.env.BANK_INVALID_PASSWORD_MESSAGE ??
  // STUB: BANK_INVALID_PASSWORD_MESSAGE not confirmed — using an empty value
  '';

const deniedMessage =
  process.env.BANK_DENIED_MESSAGE ??
  // STUB: BANK_DENIED_MESSAGE not confirmed — using an empty value
  '';

const usernameRequiredMessage =
  process.env.BANK_USERNAME_REQUIRED_MESSAGE ??
  // STUB: BANK_USERNAME_REQUIRED_MESSAGE not confirmed — using an empty value
  '';

const passwordRequiredMessage =
  process.env.BANK_PASSWORD_REQUIRED_MESSAGE ??
  // STUB: BANK_PASSWORD_REQUIRED_MESSAGE not confirmed — using an empty value
  '';

const dashboardUrlPattern =
  process.env.BANK_DASHBOARD_URL_PATTERN ??
  // STUB: BANK_DASHBOARD_URL_PATTERN not confirmed — using dashboard
  'dashboard';

const dashboardUrl = new RegExp(dashboardUrlPattern);

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
    '[TC-6B54EF-001][SCR-6B54EF-001] Login with valid username & password',
    async ({ page, bankingLoginPage, bankingDashboardPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-6B54EF-001
      // script_id    : SCR-6B54EF-001
      // acg_run_id   : 6b54ef33-591e-4583-91b7-ce5f3bbe8be1
      // ─────────────────────────────────────────────────────────

      // Manual Step 1: Open login page
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

      // Manual Step 2: Enter valid username
      await test.step('Step 2 — Enter valid username', async () => {
        await bankingLoginPage.enterUsername(validUser.username);
      });

      // Manual Step 3: Enter valid password
      await test.step('Step 3 — Enter valid password', async () => {
        await bankingLoginPage.enterPassword(validUser.password);
      });

      // Manual Step 4: Click Login
      await test.step('Step 4 — Click Login', async () => {
        await bankingLoginPage.clickLoginButton();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(bankingDashboardPage.getWelcomeMessageLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(bankingDashboardPage.getAccountSummaryLocator()).toBeVisible();

        // Traceability: TC_001
        await expect(page).toHaveURL(dashboardUrl);
      });
    },
  );

  test(
    '[TC-6B54EF-002][SCR-6B54EF-002] Login with valid credentials + OTP',
    async ({ page, bankingLoginPage, bankingDashboardPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-6B54EF-002
      // script_id    : SCR-6B54EF-002
      // acg_run_id   : 6b54ef33-591e-4583-91b7-ce5f3bbe8be1
      // ─────────────────────────────────────────────────────────

      // Manual Step 5: Enter valid credentials
      await test.step('Step 5 — Enter valid credentials', async () => {
        await bankingLoginPage.enterUsername(mfaUser.username);
        await bankingLoginPage.enterPassword(mfaUser.password);
      });

      // Manual Step 6: Click Login
      await test.step('Step 6 — Click Login', async () => {
        await bankingLoginPage.clickLoginButton();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingLoginPage.getOtpPageLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingLoginPage.getOtpFieldLocator()).toBeVisible();
      });

      // Manual Step 7: Enter valid OTP
      await test.step('Step 7 — Enter valid OTP', async () => {
        await bankingLoginPage.submitOtp(mfaUser.otp);
      });

      // Manual Step 8: Submit
      await test.step('Step 8 — Submit', async () => {
        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingDashboardPage.getWelcomeMessageLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingDashboardPage.getAccountSummaryLocator()).toBeVisible();

        // Traceability: TC_002
        await expect(page).toHaveURL(dashboardUrl);
      });
    },
  );

  test(
    '[TC-6B54EF-003][SCR-6B54EF-003] Invalid username',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-6B54EF-003
      // script_id    : SCR-6B54EF-003
      // acg_run_id   : 6b54ef33-591e-4583-91b7-ce5f3bbe8be1
      // ─────────────────────────────────────────────────────────

      // Manual Step 9: Enter invalid username + valid password
      await test.step(
        'Step 9 — Enter invalid username and valid password',
        async () => {
          await bankingLoginPage.enterUsername(invalidUsername);
          await bankingLoginPage.enterPassword(validUser.password);
          await bankingLoginPage.clickLoginButton();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_003
          await expect(bankingLoginPage.getErrorBannerLocator()).toBeVisible();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_003
          await expect(
            bankingLoginPage.getErrorBannerLocator(),
          ).toContainText(invalidCredentialsMessage);
        },
      );
    },
  );

  test(
    '[TC-6B54EF-004][SCR-6B54EF-004] Invalid password',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-6B54EF-004
      // script_id    : SCR-6B54EF-004
      // acg_run_id   : 6b54ef33-591e-4583-91b7-ce5f3bbe8be1
      // ─────────────────────────────────────────────────────────

      // Manual Step 10: Enter valid username + invalid password
      await test.step(
        'Step 10 — Enter valid username and invalid password',
        async () => {
          await bankingLoginPage.enterUsername(validUser.username);
          await bankingLoginPage.enterPassword(invalidPassword);
          await bankingLoginPage.clickLoginButton();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_004
          await expect(bankingLoginPage.getErrorBannerLocator()).toBeVisible();

          // LOCATOR_UNCONFIRMED — not in AUT KB
          // Traceability: TC_004
          await expect(
            bankingLoginPage.getErrorBannerLocator(),
          ).toContainText(invalidPasswordMessage);
        },
      );
    },
  );

  test(
    '[TC-6B54EF-005][SCR-6B54EF-005] Both username & password invalid',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-6B54EF-005
      // script_id    : SCR-6B54EF-005
      // acg_run_id   : 6b54ef33-591e-4583-91b7-ce5f3bbe8be1
      // ─────────────────────────────────────────────────────────

      // Manual Step 11: Enter invalid credentials
      await test.step('Step 11 — Enter invalid credentials', async () => {
        await bankingLoginPage.enterUsername(invalidUsername);
        await bankingLoginPage.enterPassword(invalidPassword);
        await bankingLoginPage.clickLoginButton();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_005
        await expect(bankingLoginPage.getErrorBannerLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_005
        await expect(
          bankingLoginPage.getErrorBannerLocator(),
        ).toContainText(deniedMessage);
      });
    },
  );

  test(
    '[TC-6B54EF-006][SCR-6B54EF-006] Empty username',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-6B54EF-006
      // script_id    : SCR-6B54EF-006
      // acg_run_id   : 6b54ef33-591e-4583-91b7-ce5f3bbe8be1
      // ─────────────────────────────────────────────────────────

      // Manual Step 12: Leave username blank
      await test.step('Step 12 — Leave username blank', async () => {
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
      });
    },
  );

  test(
    '[TC-6B54EF-007][SCR-6B54EF-007] Empty password',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-6B54EF-007
      // script_id    : SCR-6B54EF-007
      // acg_run_id   : 6b54ef33-591e-4583-91b7-ce5f3bbe8be1
      // ─────────────────────────────────────────────────────────

      // Manual Step 13: Leave password blank
      await test.step('Step 13 — Leave password blank', async () => {
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
      });
    },
  );

  test(
    '[TC-6B54EF-008][SCR-6B54EF-008] Both fields empty',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-6B54EF-008
      // script_id    : SCR-6B54EF-008
      // acg_run_id   : 6b54ef33-591e-4583-91b7-ce5f3bbe8be1
      // ─────────────────────────────────────────────────────────

      // Manual Step 14: Click login without input
      await test.step('Step 14 — Click login without input', async () => {
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
          bankingLoginPage.getPasswordValidationLocator(),
        ).toBeVisible();
      });
    },
  );
});