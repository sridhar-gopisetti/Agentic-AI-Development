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
  /* STUB: AUT_LOGIN_PATH not confirmed — using /login */
  '/login';

const validUser = {
  username:
    process.env.AUT_USER_EMAIL ??
    /* STUB: AUT_USER_EMAIL not confirmed — using an empty value */
    '',
  password:
    process.env.AUT_USER_PASSWORD ??
    /* STUB: AUT_USER_PASSWORD not confirmed — using an empty value */
    '',
};

const mfaUser = {
  username:
    process.env.BANK_MFA_USER ??
    /* STUB: BANK_MFA_USER not confirmed — using an empty value */
    '',
  password:
    process.env.BANK_MFA_PASSWORD ??
    /* STUB: BANK_MFA_PASSWORD not confirmed — using an empty value */
    '',
  otp:
    process.env.BANK_VALID_OTP ??
    /* STUB: BANK_VALID_OTP not confirmed — using an empty value */
    '',
};

const invalidUser =
  process.env.BANK_INVALID_USER ??
  /* STUB: BANK_INVALID_USER not confirmed — using an empty value */
  '';

const invalidPassword =
  process.env.BANK_INVALID_PASSWORD ??
  /* STUB: BANK_INVALID_PASSWORD not confirmed — using an empty value */
  '';

const invalidCredentialsMessage =
  process.env.BANK_INVALID_CREDENTIALS_MESSAGE ??
  /* STUB: BANK_INVALID_CREDENTIALS_MESSAGE not confirmed — using an empty value */
  '';

const invalidPasswordMessage =
  process.env.BANK_INVALID_PASSWORD_MESSAGE ??
  /* STUB: BANK_INVALID_PASSWORD_MESSAGE not confirmed — using an empty value */
  '';

const deniedMessage =
  process.env.BANK_DENIED_MESSAGE ??
  /* STUB: BANK_DENIED_MESSAGE not confirmed — using an empty value */
  '';

const usernameRequiredMessage =
  process.env.BANK_USERNAME_REQUIRED_MESSAGE ??
  /* STUB: BANK_USERNAME_REQUIRED_MESSAGE not confirmed — using an empty value */
  '';

const passwordRequiredMessage =
  process.env.BANK_PASSWORD_REQUIRED_MESSAGE ??
  /* STUB: BANK_PASSWORD_REQUIRED_MESSAGE not confirmed — using an empty value */
  '';

const dashboardUrlPattern =
  process.env.BANK_DASHBOARD_URL_PATTERN ??
  /* STUB: BANK_DASHBOARD_URL_PATTERN not confirmed — using dashboard */
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
    '[TC-0C424D-001][SCR-0C424D-001] Valid login — username and password',
    async ({ page, bankingLoginPage, bankingDashboardPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-0C424D-001
      // script_id    : SCR-0C424D-001
      // acg_run_id   : 0c424d30-fdac-45e0-8feb-69115dd0783e
      // ─────────────────────────────────────────────────────────

      // Traceability: TC_001 | Manual Step 1: Open login page
      await test.step('Step 1 — Open login page', async () => {
        // LOCATOR_UNCONFIRMED — page readiness selectors are not confirmed in AUT KB
        const loaded = await bankingLoginPage.validate();
        // Traceability: TC_001
        await expect(bankingLoginPage.getUsernameFieldLocator()).toBeVisible();
        // Traceability: TC_001
        await expect(bankingLoginPage.getPasswordFieldLocator()).toBeVisible();
        // Traceability: TC_001
        await expect(bankingLoginPage.getLoginButtonLocator()).toBeVisible();
        void loaded;
      });

      // Traceability: TC_001 | Manual Step 2: Enter valid username
      await test.step('Step 2 — Enter valid username', async () => {
        await bankingLoginPage.enterUsername(validUser.username);
      });

      // Traceability: TC_001 | Manual Step 3: Enter valid password
      await test.step('Step 3 — Enter valid password', async () => {
        await bankingLoginPage.enterPassword(validUser.password);
      });

      // Traceability: TC_001 | Manual Step 4: Click Login
      await test.step('Step 4 — Click Login', async () => {
        await bankingLoginPage.clickLoginButton();
      });

      // Traceability: TC_001 | Expected dashboard state
      await test.step('Verify successful dashboard authentication', async () => {
        // Traceability: TC_001
        await expect(bankingDashboardPage.getWelcomeMessageLocator()).toBeVisible();
        // Traceability: TC_001
        await expect(bankingDashboardPage.getAccountSummaryLocator()).toBeVisible();
        // Traceability: TC_001
        await expect(page).toHaveURL(dashboardUrl);
      });
    },
  );

  test(
    '[TC-0C424D-002][SCR-0C424D-002] Valid login — credentials and OTP',
    async ({ page, bankingLoginPage, bankingDashboardPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-0C424D-002
      // script_id    : SCR-0C424D-002
      // acg_run_id   : 0c424d30-fdac-45e0-8feb-69115dd0783e
      // ─────────────────────────────────────────────────────────

      // Traceability: TC_002 | Manual Step 5: Enter valid credentials
      await test.step('Step 5 — Enter valid credentials', async () => {
        await bankingLoginPage.enterUsername(mfaUser.username);
        await bankingLoginPage.enterPassword(mfaUser.password);
      });

      // Traceability: TC_002 | Manual Step 6: Click Login
      await test.step('Step 6 — Click Login', async () => {
        await bankingLoginPage.clickLoginButton();
      });

      await test.step('Verify OTP page is displayed', async () => {
        // LOCATOR_UNCONFIRMED — OTP selectors are not confirmed in AUT KB
        // Traceability: TC_002
        await expect(bankingLoginPage.getOtpPageLocator()).toBeVisible();
        // Traceability: TC_002
        await expect(bankingLoginPage.getOtpFieldLocator()).toBeVisible();
      });

      // Traceability: TC_002 | Manual Step 7: Enter valid OTP
      await test.step('Step 7 — Enter valid OTP', async () => {
        // The confirmed Page Object combines OTP entry and submission.
        await bankingLoginPage.submitOtp(mfaUser.otp);
      });

      // Traceability: TC_002 | Manual Step 8: Submit
      await test.step('Step 8 — Submit', async () => {
        // Submission is performed by the confirmed submitOtp() Page Object method.
        // Traceability: TC_002
        await expect(bankingDashboardPage.getWelcomeMessageLocator()).toBeVisible();
      });

      await test.step('Verify authenticated dashboard state', async () => {
        // Traceability: TC_002
        await expect(bankingDashboardPage.getAccountSummaryLocator()).toBeVisible();
        // Traceability: TC_002
        await expect(page).toHaveURL(dashboardUrl);
      });
    },
  );

  test(
    '[TC-0C424D-003][SCR-0C424D-003] Invalid login — invalid username',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-0C424D-003
      // script_id    : SCR-0C424D-003
      // acg_run_id   : 0c424d30-fdac-45e0-8feb-69115dd0783e
      // ─────────────────────────────────────────────────────────

      // Traceability: TC_003 | Manual Step 9: Enter invalid username + valid password
      await test.step('Step 9 — Enter invalid username and valid password', async () => {
        await bankingLoginPage.enterUsername(invalidUser);
        await bankingLoginPage.enterPassword(validUser.password);
        await bankingLoginPage.clickLoginButton();
      });

      await test.step('Verify invalid-username error', async () => {
        // LOCATOR_UNCONFIRMED — error selector is not confirmed in AUT KB
        // Traceability: TC_003
        await expect(bankingLoginPage.getErrorBannerLocator()).toBeVisible();
        // Traceability: TC_003
        await expect(bankingLoginPage.getErrorBannerLocator()).toContainText(
          invalidCredentialsMessage,
        );
      });
    },
  );

  test(
    '[TC-0C424D-004][SCR-0C424D-004] Invalid login — invalid password',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-0C424D-004
      // script_id    : SCR-0C424D-004
      // acg_run_id   : 0c424d30-fdac-45e0-8feb-69115dd0783e
      // ─────────────────────────────────────────────────────────

      // Traceability: TC_004 | Manual Step 10: Enter valid username + invalid password
      await test.step('Step 10 — Enter valid username and invalid password', async () => {
        await bankingLoginPage.enterUsername(validUser.username);
        await bankingLoginPage.enterPassword(invalidPassword);
        await bankingLoginPage.clickLoginButton();
      });

      await test.step('Verify invalid-password error', async () => {
        // Traceability: TC_004
        await expect(bankingLoginPage.getErrorBannerLocator()).toBeVisible();
        // Traceability: TC_004
        await expect(bankingLoginPage.getErrorBannerLocator()).toContainText(
          invalidPasswordMessage,
        );
      });
    },
  );

  test(
    '[TC-0C424D-005][SCR-0C424D-005] Invalid login — both credentials invalid',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-0C424D-005
      // script_id    : SCR-0C424D-005
      // acg_run_id   : 0c424d30-fdac-45e0-8feb-69115dd0783e
      // ─────────────────────────────────────────────────────────

      // Traceability: TC_005 | Manual Step 11: Enter invalid credentials
      await test.step('Step 11 — Enter invalid credentials', async () => {
        await bankingLoginPage.enterUsername(invalidUser);
        await bankingLoginPage.enterPassword(invalidPassword);
        await bankingLoginPage.clickLoginButton();
      });

      await test.step('Verify denied-login error', async () => {
        // Traceability: TC_005
        await expect(bankingLoginPage.getErrorBannerLocator()).toBeVisible();
        // Traceability: TC_005
        await expect(bankingLoginPage.getErrorBannerLocator()).toContainText(deniedMessage);
      });
    },
  );

  test(
    '[TC-0C424D-006][SCR-0C424D-006] Empty username validation',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-0C424D-006
      // script_id    : SCR-0C424D-006
      // acg_run_id   : 0c424d30-fdac-45e0-8feb-69115dd0783e
      // ─────────────────────────────────────────────────────────

      // Traceability: TC_006 | Manual Step 12: Leave username blank
      await test.step('Step 12 — Leave username blank', async () => {
        await bankingLoginPage.clearUsername();
        await bankingLoginPage.enterPassword(validUser.password);
        await bankingLoginPage.clickLoginButton();
      });

      await test.step('Verify username validation', async () => {
        // LOCATOR_UNCONFIRMED — username validation selector is not confirmed in AUT KB
        // Traceability: TC_006
        await expect(bankingLoginPage.getUsernameValidationLocator()).toBeVisible();
        // Traceability: TC_006
        await expect(bankingLoginPage.getUsernameValidationLocator()).toContainText(
          usernameRequiredMessage,
        );
      });
    },
  );

  test(
    '[TC-0C424D-007][SCR-0C424D-007] Empty password validation',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-0C424D-007
      // script_id    : SCR-0C424D-007
      // acg_run_id   : 0c424d30-fdac-45e0-8feb-69115dd0783e
      // ─────────────────────────────────────────────────────────

      // Traceability: TC_007 | Manual Step 13: Leave password blank
      await test.step('Step 13 — Leave password blank', async () => {
        await bankingLoginPage.enterUsername(validUser.username);
        await bankingLoginPage.clearPassword();
        await bankingLoginPage.clickLoginButton();
      });

      await test.step('Verify password validation', async () => {
        // LOCATOR_UNCONFIRMED — password validation selector is not confirmed in AUT KB
        // Traceability: TC_007
        await expect(bankingLoginPage.getPasswordValidationLocator()).toBeVisible();
        // Traceability: TC_007
        await expect(bankingLoginPage.getPasswordValidationLocator()).toContainText(
          passwordRequiredMessage,
        );
      });
    },
  );

  test(
    '[TC-0C424D-008][SCR-0C424D-008] Empty username and password validation',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-0C424D-008
      // script_id    : SCR-0C424D-008
      // acg_run_id   : 0c424d30-fdac-45e0-8feb-69115dd0783e
      // ─────────────────────────────────────────────────────────

      // Traceability: TC_008 | Manual Step 14: Click login without input
      await test.step('Step 14 — Click login without input', async () => {
        await bankingLoginPage.clearUsername();
        await bankingLoginPage.clearPassword();
        await bankingLoginPage.clickLoginButton();
      });

      await test.step('Verify both field validations', async () => {
        // LOCATOR_UNCONFIRMED — username validation selector is not confirmed in AUT KB
        // Traceability: TC_008
        await expect(bankingLoginPage.getUsernameValidationLocator()).toBeVisible();
        // Traceability: TC_008
        await expect(bankingLoginPage.getUsernameValidationLocator()).toContainText(
          usernameRequiredMessage,
        );
        // LOCATOR_UNCONFIRMED — password validation selector is not confirmed in AUT KB
        // Traceability: TC_008
        await expect(bankingLoginPage.getPasswordValidationLocator()).toBeVisible();
        // Traceability: TC_008
        await expect(bankingLoginPage.getPasswordValidationLocator()).toContainText(
          passwordRequiredMessage,
        );
      });
    },
  );
});