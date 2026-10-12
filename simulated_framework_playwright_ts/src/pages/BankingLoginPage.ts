// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// ════════════════════════════════════════════════════
import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BankingLoginPage extends BasePage {
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
    this.pageTitle = this.page.locator(
      process.env.BANK_LOGIN_HEADING_SELECTOR ?? '',
    );
    this.usernameField = this.page.locator(
      process.env.BANK_USERNAME_SELECTOR ?? '',
    );
    this.passwordField = this.page.locator(
      process.env.BANK_PASSWORD_SELECTOR ?? '',
    );
    this.loginButton = this.page.locator(
      process.env.BANK_LOGIN_BUTTON_SELECTOR ?? '',
    );
    this.errorBanner = this.page.locator(
      process.env.BANK_ERROR_BANNER_SELECTOR ?? '',
    );
    this.usernameValidationMsg = this.page.locator(
      process.env.BANK_USERNAME_VALIDATION_SELECTOR ?? '',
    );
    this.passwordValidationMsg = this.page.locator(
      process.env.BANK_PASSWORD_VALIDATION_SELECTOR ?? '',
    );
    this.otpField = this.page.locator(
      process.env.BANK_OTP_SELECTOR ?? '',
    );
    this.submitOtpButton = this.page.locator(
      process.env.BANK_OTP_SUBMIT_SELECTOR ?? '',
    );
    this.otpPage = this.page.locator(
      process.env.BANK_OTP_PAGE_SELECTOR ?? '',
    );
    this.forgotPasswordLink = this.page.locator(
      process.env.BANK_FORGOT_PASSWORD_SELECTOR ?? '',
    );
    this.rememberDeviceCheckbox = this.page.locator(
      process.env.BANK_REMEMBER_DEVICE_SELECTOR ?? '',
    );
    this.sessionExpiredBanner = this.page.locator(
      process.env.BANK_SESSION_EXPIRED_SELECTOR ?? '',
    );
  }

  async navigateTo(path: string): Promise<void> {
    await super.navigateTo(path);
  }

  async navigateToLogin(path: string): Promise<void> {
    // STUB: navigateToLogin not implemented — stubbed on stub_and_continue
    await super.navigateTo(path);
  }

  async getCurrentUrl(): Promise<string> {
    return super.getCurrentUrl();
  }

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.usernameField);
      await this.waitForVisible(this.loginButton);
      return true;
    } catch {
      return false;
    }
  }

  async validateOtpPage(): Promise<boolean> {
    try {
      await this.waitForVisible(this.otpPage);
      await this.waitForVisible(this.otpField);
      return true;
    } catch {
      return false;
    }
  }

  async enterUsername(username: string): Promise<void> {
    await this.fillField(this.usernameField, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fillField(this.passwordField, password);
  }

  async enterOtp(otp: string): Promise<void> {
    // STUB: enterOtp not implemented — stubbed on stub_and_continue
    // LOCATOR_UNCONFIRMED — not in AUT KB
  }

  async clickLoginButton(): Promise<void> {
    await this.clickWhenReady(this.loginButton);
  }

  async clearUsername(): Promise<void> {
    await this.waitForVisible(this.usernameField);
    await this.usernameField.clear();
  }

  async clearPassword(): Promise<void> {
    await this.waitForVisible(this.passwordField);
    await this.passwordField.clear();
  }

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async loginFirstFactor(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

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

  async getErrorBannerText(): Promise<string> {
    await this.waitForVisible(this.errorBanner);
    return this.getText(this.errorBanner);
  }

  async getUsernameValidationText(): Promise<string> {
    await this.waitForVisible(this.usernameValidationMsg);
    return this.getText(this.usernameValidationMsg);
  }

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

  confirmedUsernameLocator(): Locator {
    // LOCATOR_UNCONFIRMED — not in AUT KB
    return this.page.locator(
      process.env.BANK_USERNAME_SELECTOR ?? '',
    );
  }

  confirmedPasswordLocator(): Locator {
    // LOCATOR_UNCONFIRMED — not in AUT KB
    return this.page.locator(
      process.env.BANK_PASSWORD_SELECTOR ?? '',
    );
  }

  confirmedOtpSubmitLocator(): Locator {
    // LOCATOR_UNCONFIRMED — not in AUT KB
    return this.page.locator(
      process.env.BANK_OTP_SUBMIT_SELECTOR ?? '',
    );
  }

  getErrorBannerLocator(): Locator {
    return this.errorBanner;
  }

  getLoginButtonLocator(): Locator {
    return this.loginButton;
  }

  getUsernameFieldLocator(): Locator {
    return this.usernameField;
  }

  getPasswordFieldLocator(): Locator {
    return this.passwordField;
  }

  getUsernameValidationLocator(): Locator {
    return this.usernameValidationMsg;
  }

  getPasswordValidationLocator(): Locator {
    return this.passwordValidationMsg;
  }

  getOtpFieldLocator(): Locator {
    return this.otpField;
  }

  getOtpPageLocator(): Locator {
    return this.otpPage;
  }

  getLoginHeadingLocator(): Locator {
    // LOCATOR_UNCONFIRMED — not in AUT KB
    return this.pageTitle;
  }

  getInvalidPasswordErrorLocator(): Locator {
    // STUB: getInvalidPasswordErrorLocator not implemented — stubbed on stub_and_continue
    // LOCATOR_UNCONFIRMED — not in AUT KB
    return this.page.locator(
      process.env.BANK_INVALID_PASSWORD_ERROR_SELECTOR ?? '',
    );
  }

  getLoginDeniedLocator(): Locator {
    // STUB: getLoginDeniedLocator not implemented — stubbed on stub_and_continue
    // LOCATOR_UNCONFIRMED — not in AUT KB
    return this.page.locator(
      process.env.BANK_LOGIN_DENIED_SELECTOR ?? '',
    );
  }

  getRequiredFieldsValidationLocator(): Locator {
    // STUB: getRequiredFieldsValidationLocator not implemented — stubbed on stub_and_continue
    // LOCATOR_UNCONFIRMED — not in AUT KB
    return this.page.locator(
      process.env.BANK_REQUIRED_FIELDS_VALIDATION_SELECTOR ?? '',
    );
  }
}