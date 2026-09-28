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

const dashboardUrlPattern = new RegExp(
  process.env.BANK_DASHBOARD_URL_PATTERN ??
  // STUB: BANK_DASHBOARD_URL_PATTERN not confirmed — using an empty pattern
  '',
);

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
    '[TC-9E4935-001][SCR-9E4935-001] Login with valid username & password',
    async ({ page, bankingLoginPage, bankingDashboardPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-9E4935-001
      // script_id    : SCR-9E4935-001
      // acg_run_id   : 9e493516-ee38-41b9-8bec-b2801abfe52c
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
        await bankingLoginPage.enterUsername(validUser.username);
      });

      // Step 3 — Enter valid password
      await test.step('Step 3 — Enter valid password', async () => {
        await bankingLoginPage.enterPassword(validUser.password);
      });

      // Step 4 — Click Login
      await test.step('Step 4 — Click Login', async () => {
        await bankingLoginPage.clickLoginButton();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(bankingDashboardPage.getWelcomeMessageLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_001
        await expect(bankingDashboardPage.getAccountSummaryLocator()).toBeVisible();

        // Traceability: TC_001
        await expect(page).toHaveURL(dashboardUrlPattern);
      });
    },
  );

  test(
    '[TC-9E4935-002][SCR-9E4935-002] Login with valid credentials + OTP',
    async ({ page, bankingLoginPage, bankingDashboardPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-9E4935-002
      // script_id    : SCR-9E4935-002
      // acg_run_id   : 9e493516-ee38-41b9-8bec-b2801abfe52c
      // ─────────────────────────────────────────────────────────

      // Step 5 — Enter valid credentials
      await test.step('Step 5 — Enter valid credentials', async () => {
        await bankingLoginPage.enterUsername(mfaUser.username);
        await bankingLoginPage.enterPassword(mfaUser.password);
      });

      // Step 6 — Click Login
      await test.step('Step 6 — Click Login', async () => {
        await bankingLoginPage.clickLoginButton();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingLoginPage.getOtpPageLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingLoginPage.getOtpFieldLocator()).toBeVisible();
      });

      // Step 7 — Enter valid OTP
      await test.step('Step 7 — Enter valid OTP', async () => {
        await bankingLoginPage.submitOtp(mfaUser.otp);
      });

      // Step 8 — Submit
      await test.step('Step 8 — Submit', async () => {
        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingDashboardPage.getWelcomeMessageLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_002
        await expect(bankingDashboardPage.getAccountSummaryLocator()).toBeVisible();

        // Traceability: TC_002
        await expect(page).toHaveURL(dashboardUrlPattern);
      });
    },
  );

  test(
    '[TC-9E4935-003][SCR-9E4935-003] Invalid username',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-9E4935-003
      // script_id    : SCR-9E4935-003
      // acg_run_id   : 9e493516-ee38-41b9-8bec-b2801abfe52c
      // ─────────────────────────────────────────────────────────

      // Step 9 — Enter invalid username and valid password
      await test.step(
        'Step 9 — Enter invalid username and valid password',
        async () => {
          await bankingLoginPage.enterUsername(invalidUsername);
          await bankingLoginPage.enterPassword(validUser.password);
        },
      );

      // Step 10 — Submit login and verify invalid-credential error
      await test.step(
        'Step 10 — Submit login and verify invalid-credential error',
        async () => {
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
    '[TC-9E4935-004][SCR-9E4935-004] Invalid password',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-9E4935-004
      // script_id    : SCR-9E4935-004
      // acg_run_id   : 9e493516-ee38-41b9-8bec-b2801abfe52c
      // ─────────────────────────────────────────────────────────

      // Step 11 — Enter valid username and invalid password
      await test.step(
        'Step 11 — Enter valid username and invalid password',
        async () => {
          await bankingLoginPage.enterUsername(validUser.username);
          await bankingLoginPage.enterPassword(invalidPassword);
        },
      );

      // Step 12 — Submit login and verify invalid-password error
      await test.step(
        'Step 12 — Submit login and verify invalid-password error',
        async () => {
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
    '[TC-9E4935-005][SCR-9E4935-005] Both username & password invalid',
    async ({ page, bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-9E4935-005
      // script_id    : SCR-9E4935-005
      // acg_run_id   : 9e493516-ee38-41b9-8bec-b2801abfe52c
      // ─────────────────────────────────────────────────────────

      // Step 13 — Enter invalid credentials
      await test.step('Step 13 — Enter invalid credentials', async () => {
        await bankingLoginPage.enterUsername(invalidUsername);
        await bankingLoginPage.enterPassword(invalidPassword);
      });

      // Step 14 — Submit login and verify denial
      await test.step('Step 14 — Submit login and verify denial', async () => {
        await bankingLoginPage.clickLoginButton();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_005
        await expect(bankingLoginPage.getErrorBannerLocator()).toBeVisible();

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_005
        await expect(
          bankingLoginPage.getErrorBannerLocator(),
        ).toContainText(deniedMessage);

        // Traceability: TC_005
        await expect(page).not.toHaveURL(dashboardUrlPattern);
      });
    },
  );

  test(
    '[TC-9E4935-006][SCR-9E4935-006] Empty username',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-9E4935-006
      // script_id    : SCR-9E4935-006
      // acg_run_id   : 9e493516-ee38-41b9-8bec-b2801abfe52c
      // ─────────────────────────────────────────────────────────

      // Step 15 — Leave username blank and submit with valid password
      await test.step(
        'Step 15 — Leave username blank and submit with valid password',
        async () => {
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
    '[TC-9E4935-007][SCR-9E4935-007] Empty password',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-9E4935-007
      // script_id    : SCR-9E4935-007
      // acg_run_id   : 9e493516-ee38-41b9-8bec-b2801abfe52c
      // ─────────────────────────────────────────────────────────

      // Step 16 — Leave password blank and submit with valid username
      await test.step(
        'Step 16 — Leave password blank and submit with valid username',
        async () => {
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
    '[TC-9E4935-008][SCR-9E4935-008] Both fields empty',
    async ({ bankingLoginPage }) => {
      // ── PDT Traceability ──────────────────────────────────────
      // test_case_id : TC-9E4935-008
      // script_id    : SCR-9E4935-008
      // acg_run_id   : 9e493516-ee38-41b9-8bec-b2801abfe52c
      // ─────────────────────────────────────────────────────────

      // Step 17 — Submit empty login form
      await test.step('Step 17 — Submit empty login form', async () => {
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

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_008
        await expect(
          bankingLoginPage.getUsernameValidationLocator(),
        ).toContainText(usernameRequiredMessage);

        // LOCATOR_UNCONFIRMED — not in AUT KB
        // Traceability: TC_008
        await expect(
          bankingLoginPage.getPasswordValidationLocator(),
        ).toContainText(passwordRequiredMessage);
      });
    },
  );
});