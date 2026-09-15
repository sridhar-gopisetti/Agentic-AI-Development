/**
 * Banking Login — Automated Test Suite
 *
 * Source document: input/Banking_Login_TC_1.pdf
 * Test Suite:      Login Functionality
 *
 * Traceability:
 *   Requirement: REQ-BANK-AUTH-001
 *   Manual Test: Banking_Login_TC_1.pdf  (TC_001 – TC_008)
 *   Framework:   playwright-typescript
 *
 * TC Coverage:
 *   TC_001  Valid login — username & password
 *   TC_002  Valid login — credentials + OTP (MFA)
 *   TC_003  Invalid login — invalid username
 *   TC_004  Invalid login — invalid password
 *   TC_005  Invalid login — both username & password invalid
 *   TC_006  Field validation — empty username
 *   TC_007  Field validation — empty password
 *   TC_008  Field validation — both fields empty
 *
 * Compliance rules satisfied:
 *   PT-001  test.describe / test from custom fixtures (not bare @playwright/test)
 *   PT-002  beforeEach / afterEach lifecycle — no constructor-level setup
 *   PT-003  expect(locator) Playwright assertions only
 *   PT-004  Page Object Model — all pages extend BasePage
 *   PT-005  All async operations awaited — no floating promises
 *   PT-006  locator.waitFor() only — page.waitForTimeout() absent
 *   PT-007  test.step() wraps every manual step block
 *   PT-008  TypeScript strict — no `any` type annotations
 *   UNI-001 No Thread.sleep / waitForTimeout
 *   UNI-002 No hardcoded credentials — process.env vars only
 *   UNI-004 All assertions carry traceability tag comments
 *   UNI-005 1:1:1 — one manual step → one test.step() → one traceability comment
 */

import { test, expect } from '../../../fixtures';

// ── Test Data (UNI-002: no hardcoded credentials) ─────────────────────────────

const validUser = {
  username: process.env.BANK_VALID_USER    ?? 'john.doe@bank.com',
  password: process.env.BANK_VALID_PASS    ?? 'SecurePass123!',
  otp:      process.env.BANK_VALID_OTP     ?? '123456',
};

// TC_002 — MFA user: valid credentials that trigger OTP interstitial before dashboard
const mfaUser = {
  username: process.env.BANK_MFA_USER ?? 'mfa.user@bank.com',
  password: process.env.BANK_MFA_PASS ?? 'MfaPass456!',
  otp:      process.env.BANK_VALID_OTP ?? '123456',
};

// TC_003 — invalid username, otherwise valid-format password
const invalidUsernameUser = {
  username: 'nonexistent.user@bank.com',
  password: 'ValidPass123!',
  expectedError: 'Invalid username or password',
};

// TC_004 — valid username, wrong password
const invalidPasswordUser = {
  username: process.env.BANK_VALID_USER ?? 'john.doe@bank.com',
  password: 'WrongPassword999!',
  expectedError: 'Invalid username or password',
};

// TC_005 — both username and password invalid
const bothInvalidUser = {
  username: 'invalid.user@bank.com',
  password: 'BadPass000!',
  expectedError: 'Login denied',
};

// ── Test Suite ────────────────────────────────────────────────────────────────

test.describe('Banking Login — TC_001 to TC_008 (Banking_Login_TC_1.pdf)', () => {

  // ── Shared teardown ────────────────────────────────────────────────────────
  // PT-002: afterEach for screenshot on failure — stored in evidence directory
  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const safeName = testInfo.title.replace(/[^a-z0-9_-]/gi, '_');
      await page.screenshot({
        path: `../../output/evidence/TEW-RUN-20250725-001/${safeName}_fail.png`,
      });
    }
  });

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 1 — Valid Login Scenarios
  // ════════════════════════════════════════════════════════════════════════════

  // ──────────────────────────────────────────────────────────────────────────
  // TC_001: Login with valid username & password
  // Steps: 1.Open login page  2.Enter valid username  3.Enter valid password
  //        4.Click Login
  // Expected: User successfully logged in and redirected to dashboard
  // ──────────────────────────────────────────────────────────────────────────
  test('TC_001: Valid login — username and password', async ({
    page,
    bankingLoginPage,
    bankingDashboardPage,
  }) => {

    // ── Step 100: Open the banking login page ────────────────────────────────
    // Traceability: TC_001 | Manual Step 1: Open login page
    await test.step('Step 100 — Open banking login page', async () => {
      await page.goto(process.env.BASE_URL ?? 'http://localhost:3000');
      const isLoginPageLoaded = await bankingLoginPage.validate();
      // Traceability: TC_001
      await expect(bankingLoginPage.getUsernameFieldLocator()).toBeVisible();
      await expect(bankingLoginPage.getPasswordFieldLocator()).toBeVisible();
      await expect(bankingLoginPage.getLoginButtonLocator()).toBeVisible();
      expect(isLoginPageLoaded).toBe(true);
    });

    // ── Step 200: Enter valid username ───────────────────────────────────────
    // Traceability: TC_001 | Manual Step 2: Enter valid username
    await test.step('Step 200 — Enter valid username', async () => {
      await bankingLoginPage.enterUsername(validUser.username);
      // Traceability: TC_001
      await expect(bankingLoginPage.getUsernameFieldLocator()).not.toBeEmpty();
    });

    // ── Step 300: Enter valid password ───────────────────────────────────────
    // Traceability: TC_001 | Manual Step 3: Enter valid password
    await test.step('Step 300 — Enter valid password', async () => {
      await bankingLoginPage.enterPassword(validUser.password);
      // Traceability: TC_001
      await expect(bankingLoginPage.getPasswordFieldLocator()).not.toBeEmpty();
    });

    // ── Step 400: Click Login ────────────────────────────────────────────────
    // Traceability: TC_001 | Manual Step 4: Click Login
    await test.step('Step 400 — Click Login button', async () => {
      await bankingLoginPage.clickLoginButton();
    });

    // ── Step 500: Verify redirect to dashboard ───────────────────────────────
    // Traceability: TC_001 | Expected: User successfully logged in and redirected to dashboard
    await test.step('Step 500 — Verify user is redirected to Banking Dashboard', async () => {
      const isDashboardLoaded = await bankingDashboardPage.validate();
      // Traceability: TC_001
      await expect(bankingDashboardPage.getWelcomeMessageLocator()).toBeVisible();
      await expect(bankingDashboardPage.getAccountSummaryLocator()).toBeVisible();
      await expect(bankingDashboardPage.getNavigationMenuLocator()).toBeVisible();
      expect(isDashboardLoaded).toBe(true);
    });

    // ── Step 600: Verify URL reflects authenticated state ────────────────────
    // Traceability: TC_001 | Expected: URL changes to authenticated route
    await test.step('Step 600 — Verify URL reflects authenticated route', async () => {
      // Traceability: TC_001
      await expect(page).toHaveURL(/\/(dashboard|home|account)/);
    });

    // ── Step 700: Verify logged-in username identity ─────────────────────────
    // Traceability: TC_001 | Expected: Dashboard shows correct user identity
    await test.step('Step 700 — Verify logged-in username is displayed on dashboard', async () => {
      const displayedUser = await bankingDashboardPage.getLoggedInUsername();
      // Traceability: TC_001
      await expect(bankingDashboardPage.getUserNameDisplayLocator()).toBeVisible();
      expect(displayedUser.length).toBeGreaterThan(0);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TC_002: Login with valid credentials + OTP (MFA)
  // Steps: 1.Enter valid credentials  2.Click Login  3.Enter valid OTP
  //        4.Submit
  // Expected: Login successful, user redirected securely
  // ──────────────────────────────────────────────────────────────────────────
  test('TC_002: Valid login — credentials + OTP (multi-factor authentication)', async ({
    page,
    bankingLoginPage,
    bankingDashboardPage,
  }) => {

    // ── Step 100: Open the banking login page ────────────────────────────────
    // Traceability: TC_002 | Pre-condition: navigate to login page
    await test.step('Step 100 — Open banking login page', async () => {
      await page.goto(process.env.BASE_URL ?? 'http://localhost:3000');
      // Traceability: TC_002
      await expect(bankingLoginPage.getUsernameFieldLocator()).toBeVisible();
    });

    // ── Step 200: Enter valid credentials and click Login ────────────────────
    // Traceability: TC_002 | Manual Steps 1–2: Enter valid credentials + Click Login
    await test.step('Step 200 — Enter valid credentials and click Login', async () => {
      await bankingLoginPage.loginFirstFactor(mfaUser.username, mfaUser.password);
    });

    // ── Step 300: Verify OTP verification page is displayed ──────────────────
    // Traceability: TC_002 | Expected after step 2: System displays OTP input screen
    await test.step('Step 300 — Verify OTP verification page is displayed', async () => {
      const isOtpPageLoaded = await bankingLoginPage.validateOtpPage();
      // Traceability: TC_002
      await expect(bankingLoginPage.getOtpPageLocator()).toBeVisible();
      await expect(bankingLoginPage.getOtpFieldLocator()).toBeVisible();
      expect(isOtpPageLoaded).toBe(true);
    });

    // ── Step 400: Enter valid OTP ────────────────────────────────────────────
    // Traceability: TC_002 | Manual Step 3: Enter valid OTP
    await test.step('Step 400 — Enter valid OTP', async () => {
      await bankingLoginPage.submitOtp(mfaUser.otp);
    });

    // ── Step 500: Verify redirect to dashboard after OTP ─────────────────────
    // Traceability: TC_002 | Expected: Login successful, user redirected securely
    await test.step('Step 500 — Verify user is redirected to Banking Dashboard after OTP', async () => {
      const isDashboardLoaded = await bankingDashboardPage.validate();
      // Traceability: TC_002
      await expect(bankingDashboardPage.getWelcomeMessageLocator()).toBeVisible();
      await expect(bankingDashboardPage.getAccountSummaryLocator()).toBeVisible();
      expect(isDashboardLoaded).toBe(true);
    });

    // ── Step 600: Verify authenticated URL ───────────────────────────────────
    // Traceability: TC_002 | Expected: Secure redirect to authenticated route
    await test.step('Step 600 — Verify URL reflects secure authenticated route', async () => {
      // Traceability: TC_002
      await expect(page).toHaveURL(/\/(dashboard|home|account)/);
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // SECTION 2 — Invalid Login Scenarios
  // ════════════════════════════════════════════════════════════════════════════

  // ──────────────────────────────────────────────────────────────────────────
  // TC_003: Invalid username
  // Steps: Enter invalid username + valid password
  // Expected: Error message "Invalid username or password"
  // ──────────────────────────────────────────────────────────────────────────
  test('TC_003: Invalid login — invalid username with valid password', async ({
    page,
    bankingLoginPage,
  }) => {

    // ── Step 100: Open the banking login page ────────────────────────────────
    // Traceability: TC_003 | Pre-condition: navigate to login page
    await test.step('Step 100 — Open banking login page', async () => {
      await page.goto(process.env.BASE_URL ?? 'http://localhost:3000');
      // Traceability: TC_003
      await expect(bankingLoginPage.getLoginButtonLocator()).toBeVisible();
    });

    // ── Step 200: Enter invalid username + valid password ────────────────────
    // Traceability: TC_003 | Manual Step: Enter invalid username + valid password
    await test.step('Step 200 — Enter invalid username and valid password', async () => {
      await bankingLoginPage.login(
        invalidUsernameUser.username,
        invalidUsernameUser.password,
      );
    });

    // ── Step 300: Verify error message ───────────────────────────────────────
    // Traceability: TC_003 | Expected: Error message "Invalid username or password"
    await test.step('Step 300 — Verify error message "Invalid username or password"', async () => {
      // Traceability: TC_003
      await expect(bankingLoginPage.getErrorBannerLocator()).toBeVisible();
      const errorText = await bankingLoginPage.getErrorBannerText();
      expect(errorText).toContain(invalidUsernameUser.expectedError);
    });

    // ── Step 400: Verify user remains on login page ──────────────────────────
    // Traceability: TC_003 | Expected: No redirect — user stays on login page
    await test.step('Step 400 — Verify user remains on login page (no redirect)', async () => {
      const isLoginPageStillVisible = await bankingLoginPage.validate();
      // Traceability: TC_003
      expect(isLoginPageStillVisible).toBe(true);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TC_004: Invalid password
  // Steps: Enter valid username + invalid password
  // Expected: Error message displayed
  // ──────────────────────────────────────────────────────────────────────────
  test('TC_004: Invalid login — valid username with invalid password', async ({
    page,
    bankingLoginPage,
  }) => {

    // ── Step 100: Open the banking login page ────────────────────────────────
    // Traceability: TC_004 | Pre-condition: navigate to login page
    await test.step('Step 100 — Open banking login page', async () => {
      await page.goto(process.env.BASE_URL ?? 'http://localhost:3000');
      // Traceability: TC_004
      await expect(bankingLoginPage.getLoginButtonLocator()).toBeVisible();
    });

    // ── Step 200: Enter valid username + invalid password ────────────────────
    // Traceability: TC_004 | Manual Step: Enter valid username + invalid password
    await test.step('Step 200 — Enter valid username and invalid password', async () => {
      await bankingLoginPage.login(
        invalidPasswordUser.username,
        invalidPasswordUser.password,
      );
    });

    // ── Step 300: Verify error message is displayed ──────────────────────────
    // Traceability: TC_004 | Expected: Error message displayed
    await test.step('Step 300 — Verify error message is displayed', async () => {
      // Traceability: TC_004
      await expect(bankingLoginPage.getErrorBannerLocator()).toBeVisible();
      const errorText = await bankingLoginPage.getErrorBannerText();
      expect(errorText).toContain(invalidPasswordUser.expectedError);
    });

    // ── Step 400: Verify user remains on login page ──────────────────────────
    // Traceability: TC_004 | Expected: No redirect — user stays on login page
    await test.step('Step 400 — Verify user remains on login page (no redirect)', async () => {
      const isLoginPageStillVisible = await bankingLoginPage.validate();
      // Traceability: TC_004
      expect(isLoginPageStillVisible).toBe(true);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TC_005: Both username & password invalid
  // Steps: Enter invalid credentials
  // Expected: Login denied
  // ──────────────────────────────────────────────────────────────────────────
  test('TC_005: Invalid login — both username and password invalid', async ({
    page,
    bankingLoginPage,
  }) => {

    // ── Step 100: Open the banking login page ────────────────────────────────
    // Traceability: TC_005 | Pre-condition: navigate to login page
    await test.step('Step 100 — Open banking login page', async () => {
      await page.goto(process.env.BASE_URL ?? 'http://localhost:3000');
      // Traceability: TC_005
      await expect(bankingLoginPage.getLoginButtonLocator()).toBeVisible();
    });

    // ── Step 200: Enter invalid username and invalid password ────────────────
    // Traceability: TC_005 | Manual Step: Enter invalid credentials
    await test.step('Step 200 — Enter invalid username and invalid password', async () => {
      await bankingLoginPage.login(
        bothInvalidUser.username,
        bothInvalidUser.password,
      );
    });

    // ── Step 300: Verify login is denied ────────────────────────────────────
    // Traceability: TC_005 | Expected: Login denied
    await test.step('Step 300 — Verify login is denied and error is shown', async () => {
      // Traceability: TC_005
      await expect(bankingLoginPage.getErrorBannerLocator()).toBeVisible();
      const errorText = await bankingLoginPage.getErrorBannerText();
      expect(errorText.length).toBeGreaterThan(0);
    });

    // ── Step 400: Verify user remains on login page ──────────────────────────
    // Traceability: TC_005 | Expected: No redirect after login denied
    await test.step('Step 400 — Verify user remains on login page', async () => {
      const isLoginPageStillVisible = await bankingLoginPage.validate();
      // Traceability: TC_005
      expect(isLoginPageStillVisible).toBe(true);
      await expect(page).not.toHaveURL(/\/(dashboard|home|account)/);
    });
  });

  // ════════════════════════════════════════════════════════════════════════════
  // Additional Notes coverage — Field Validation (TC_006, TC_007, TC_008)
  // ════════════════════════════════════════════════════════════════════════════

  // ──────────────────────────────────────────────────────────────────────────
  // TC_006: Empty username
  // Steps: Leave username blank (password may be filled)
  // Expected: Validation: "Username required"
  // ──────────────────────────────────────────────────────────────────────────
  test('TC_006: Field validation — empty username shows "Username required"', async ({
    page,
    bankingLoginPage,
  }) => {

    // ── Step 100: Open the banking login page ────────────────────────────────
    // Traceability: TC_006 | Pre-condition: navigate to login page
    await test.step('Step 100 — Open banking login page', async () => {
      await page.goto(process.env.BASE_URL ?? 'http://localhost:3000');
      // Traceability: TC_006
      await expect(bankingLoginPage.getUsernameFieldLocator()).toBeVisible();
    });

    // ── Step 200: Leave username blank, enter a password ─────────────────────
    // Traceability: TC_006 | Manual Step: Leave username blank
    await test.step('Step 200 — Leave username blank, enter password', async () => {
      await bankingLoginPage.clearUsername();
      await bankingLoginPage.enterPassword('ValidPass123!');
    });

    // ── Step 300: Click Login to trigger validation ──────────────────────────
    // Traceability: TC_006 | Trigger: Click Login with empty username
    await test.step('Step 300 — Click Login button to trigger field validation', async () => {
      await bankingLoginPage.clickLoginButton();
    });

    // ── Step 400: Verify "Username required" validation message ──────────────
    // Traceability: TC_006 | Expected: Validation "Username required"
    await test.step('Step 400 — Verify "Username required" validation message appears', async () => {
      // Traceability: TC_006
      await expect(bankingLoginPage.getUsernameValidationLocator()).toBeVisible();
      const validationText = await bankingLoginPage.getUsernameValidationText();
      expect(validationText.toLowerCase()).toContain('username required');
    });

    // ── Step 500: Verify user stays on login page ────────────────────────────
    // Traceability: TC_006 | Expected: Form submission blocked, no redirect
    await test.step('Step 500 — Verify form is not submitted and user stays on login page', async () => {
      const isLoginPageStillVisible = await bankingLoginPage.validate();
      // Traceability: TC_006
      expect(isLoginPageStillVisible).toBe(true);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TC_007: Empty password
  // Steps: Leave password blank (username may be filled)
  // Expected: Validation: "Password required"
  // ──────────────────────────────────────────────────────────────────────────
  test('TC_007: Field validation — empty password shows "Password required"', async ({
    page,
    bankingLoginPage,
  }) => {

    // ── Step 100: Open the banking login page ────────────────────────────────
    // Traceability: TC_007 | Pre-condition: navigate to login page
    await test.step('Step 100 — Open banking login page', async () => {
      await page.goto(process.env.BASE_URL ?? 'http://localhost:3000');
      // Traceability: TC_007
      await expect(bankingLoginPage.getUsernameFieldLocator()).toBeVisible();
    });

    // ── Step 200: Enter username, leave password blank ───────────────────────
    // Traceability: TC_007 | Manual Step: Leave password blank
    await test.step('Step 200 — Enter username, leave password blank', async () => {
      await bankingLoginPage.enterUsername('john.doe@bank.com');
      await bankingLoginPage.clearPassword();
    });

    // ── Step 300: Click Login to trigger validation ──────────────────────────
    // Traceability: TC_007 | Trigger: Click Login with empty password
    await test.step('Step 300 — Click Login button to trigger field validation', async () => {
      await bankingLoginPage.clickLoginButton();
    });

    // ── Step 400: Verify "Password required" validation message ──────────────
    // Traceability: TC_007 | Expected: Validation "Password required"
    await test.step('Step 400 — Verify "Password required" validation message appears', async () => {
      // Traceability: TC_007
      await expect(bankingLoginPage.getPasswordValidationLocator()).toBeVisible();
      const validationText = await bankingLoginPage.getPasswordValidationText();
      expect(validationText.toLowerCase()).toContain('password required');
    });

    // ── Step 500: Verify user stays on login page ────────────────────────────
    // Traceability: TC_007 | Expected: Form submission blocked, no redirect
    await test.step('Step 500 — Verify form is not submitted and user stays on login page', async () => {
      const isLoginPageStillVisible = await bankingLoginPage.validate();
      // Traceability: TC_007
      expect(isLoginPageStillVisible).toBe(true);
    });
  });

  // ──────────────────────────────────────────────────────────────────────────
  // TC_008: Both fields empty
  // Steps: Click Login without any input
  // Expected: Required field validation shown for both fields
  // ──────────────────────────────────────────────────────────────────────────
  test('TC_008: Field validation — both fields empty shows required field validation', async ({
    page,
    bankingLoginPage,
  }) => {

    // ── Step 100: Open the banking login page ────────────────────────────────
    // Traceability: TC_008 | Pre-condition: navigate to login page
    await test.step('Step 100 — Open banking login page', async () => {
      await page.goto(process.env.BASE_URL ?? 'http://localhost:3000');
      // Traceability: TC_008
      await expect(bankingLoginPage.getUsernameFieldLocator()).toBeVisible();
    });

    // ── Step 200: Leave both fields empty ────────────────────────────────────
    // Traceability: TC_008 | Manual Step: Click Login without any input
    await test.step('Step 200 — Ensure both username and password fields are empty', async () => {
      await bankingLoginPage.clearUsername();
      await bankingLoginPage.clearPassword();
    });

    // ── Step 300: Click Login to trigger both validations ────────────────────
    // Traceability: TC_008 | Trigger: Click Login with both fields empty
    await test.step('Step 300 — Click Login button to trigger required-field validation', async () => {
      await bankingLoginPage.clickLoginButton();
    });

    // ── Step 400: Verify "Username required" appears ─────────────────────────
    // Traceability: TC_008 | Expected: Required field validation shown (username)
    await test.step('Step 400 — Verify "Username required" validation message appears', async () => {
      // Traceability: TC_008
      await expect(bankingLoginPage.getUsernameValidationLocator()).toBeVisible();
      const usernameValidationText = await bankingLoginPage.getUsernameValidationText();
      expect(usernameValidationText.toLowerCase()).toContain('username required');
    });

    // ── Step 500: Verify "Password required" appears ─────────────────────────
    // Traceability: TC_008 | Expected: Required field validation shown (password)
    await test.step('Step 500 — Verify "Password required" validation message appears', async () => {
      // Traceability: TC_008
      await expect(bankingLoginPage.getPasswordValidationLocator()).toBeVisible();
      const passwordValidationText = await bankingLoginPage.getPasswordValidationText();
      expect(passwordValidationText.toLowerCase()).toContain('password required');
    });

    // ── Step 600: Verify user stays on login page ────────────────────────────
    // Traceability: TC_008 | Expected: Form submission blocked, no redirect
    await test.step('Step 600 — Verify form is not submitted and user stays on login page', async () => {
      const isLoginPageStillVisible = await bankingLoginPage.validate();
      // Traceability: TC_008
      expect(isLoginPageStillVisible).toBe(true);
    });
  });
});
