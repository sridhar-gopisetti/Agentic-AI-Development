/**
 * BankingLoginPage — playwright-typescript framework
 *
 * Page Object for the Banking Application Login page.
 * Requirement: REQ-BANK-AUTH-001
 *
 * Traceability:
 *   Requirement: REQ-BANK-AUTH-001
 *   Test Cases:  TC_001 – TC_008 (Banking_Login_TC_1.pdf)
 *   Framework:   playwright-typescript
 *   Rule refs:   PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BankingLoginPage extends BasePage {
  // ── Locators ─────────────────────────────────────────────────────────────────
  private readonly pageTitle: Locator;
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly errorBanner: Locator;
  private readonly usernameValidationMsg: Locator;
  private readonly passwordValidationMsg: Locator;
  private readonly otpField: Locator;
  private readonly submitOtpButton: Locator;
  private readonly otpPage: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly rememberDeviceCheckbox: Locator;
  private readonly sessionExpiredBanner: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle              = this.page.locator('h1.banking-login-title');
    this.usernameField          = this.page.locator('#bankingUsername');
    this.passwordField          = this.page.locator('#bankingPassword');
    this.loginButton            = this.page.locator('#bankingLoginBtn');
    this.errorBanner            = this.page.locator('div.login-error-banner');
    // Inline field-level validation messages (TC_006, TC_007, TC_008)
    this.usernameValidationMsg  = this.page.locator('#bankingUsername ~ span.field-error, #bankingUsername-error');
    this.passwordValidationMsg  = this.page.locator('#bankingPassword ~ span.field-error, #bankingPassword-error');
    // OTP page elements (TC_002)
    this.otpField               = this.page.locator('#otpInput');
    this.submitOtpButton        = this.page.locator('#submitOtpBtn');
    this.otpPage                = this.page.locator('div.otp-verification-page');
    this.forgotPasswordLink     = this.page.locator("a[data-testid='forgot-password']");
    this.rememberDeviceCheckbox = this.page.locator('#rememberDevice');
    this.sessionExpiredBanner   = this.page.locator('div.session-expired-banner');
  }

  // ── Validation ───────────────────────────────────────────────────────────────

  /**
   * Validates that the Banking Login page is displayed.
   */
  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.usernameField);
      await this.waitForVisible(this.loginButton);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Validates that the OTP verification page is displayed after first-factor login.
   * Used by TC_002.
   */
  async validateOtpPage(): Promise<boolean> {
    try {
      await this.waitForVisible(this.otpPage);
      await this.waitForVisible(this.otpField);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  async enterUsername(username: string): Promise<void> {
    await this.fillField(this.usernameField, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fillField(this.passwordField, password);
  }

  async clickLoginButton(): Promise<void> {
    await this.clickWhenReady(this.loginButton);
  }

  /**
   * Clears the username field without entering any value, then moves focus away.
   * Used by TC_006 (empty username) and TC_008 (both fields empty).
   */
  async clearUsername(): Promise<void> {
    await this.waitForVisible(this.usernameField);
    await this.usernameField.clear();
  }

  /**
   * Clears the password field without entering any value, then moves focus away.
   * Used by TC_007 (empty password) and TC_008 (both fields empty).
   */
  async clearPassword(): Promise<void> {
    await this.waitForVisible(this.passwordField);
    await this.passwordField.clear();
  }

  /**
   * Performs a complete banking login (first factor only).
   * @param username - Account username / customer ID
   * @param password - Account password
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Enters valid first-factor credentials then clicks Login — used as the
   * precondition step for OTP flow in TC_002.
   */
  async loginFirstFactor(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Submits the OTP code for two-factor authentication (TC_002).
   * @param otp - One-time passcode
   */
  async submitOtp(otp: string): Promise<void> {
    await this.fillField(this.otpField, otp);
    await this.clickWhenReady(this.submitOtpButton);
  }

  async clickForgotPasswordLink(): Promise<void> {
    await this.clickWhenReady(this.forgotPasswordLink);
  }

  async checkRememberDevice(): Promise<void> {
    await this.waitForVisible(this.rememberDeviceCheckbox);
    const checked = await this.rememberDeviceCheckbox.isChecked();
    if (!checked) {
      await this.rememberDeviceCheckbox.check();
    }
  }

  // ── Getters / Verifiers ──────────────────────────────────────────────────────

  async getErrorBannerText(): Promise<string> {
    await this.waitForVisible(this.errorBanner);
    return this.getText(this.errorBanner);
  }

  /**
   * Returns the inline validation message text for the username field.
   * Used by TC_006 and TC_008.
   */
  async getUsernameValidationText(): Promise<string> {
    await this.waitForVisible(this.usernameValidationMsg);
    return this.getText(this.usernameValidationMsg);
  }

  /**
   * Returns the inline validation message text for the password field.
   * Used by TC_007 and TC_008.
   */
  async getPasswordValidationText(): Promise<string> {
    await this.waitForVisible(this.passwordValidationMsg);
    return this.getText(this.passwordValidationMsg);
  }

  async isSessionExpiredBannerVisible(): Promise<boolean> {
    try {
      await this.waitForVisible(this.sessionExpiredBanner, 3_000);
      return true;
    } catch {
      return false;
    }
  }

  // ── Locator accessors for direct assertions ───────────────────────────────────
  getErrorBannerLocator(): Locator          { return this.errorBanner; }
  getLoginButtonLocator(): Locator          { return this.loginButton; }
  getUsernameFieldLocator(): Locator        { return this.usernameField; }
  getPasswordFieldLocator(): Locator        { return this.passwordField; }
  getUsernameValidationLocator(): Locator   { return this.usernameValidationMsg; }
  getPasswordValidationLocator(): Locator   { return this.passwordValidationMsg; }
  getOtpFieldLocator(): Locator             { return this.otpField; }
  getOtpPageLocator(): Locator              { return this.otpPage; }
}
