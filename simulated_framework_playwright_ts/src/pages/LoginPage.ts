// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// AUT_MODULES_IN_SCOPE → set AUT_MODULES_IN_SCOPE in .env (assumed: inferred from test case document titles/tags)
// LIVE_AUT_ACCESSIBLE → set LIVE_AUT_ACCESSIBLE in .env (assumed: false)
// ════════════════════════════════════════════════════
/**
 * LoginPage — playwright-typescript framework
 *
 * Page Object for the application Login page.
 *
 * Traceability:
 *   Requirement: REQ-AUTH-001
 *   Framework:   playwright-typescript
 *   Rule refs:   PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // ── Locators ─────────────────────────────────────────────────────────────────
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly forgotPasswordLink: Locator;
  private readonly errorMessage: Locator;
  private readonly rememberMeCheckbox: Locator;
  private readonly signUpLink: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField     = this.page.locator('#username');
    this.passwordField     = this.page.locator('#password');
    this.loginButton       = this.page.locator('#loginButton');
    this.forgotPasswordLink = this.page.locator("a[id='forgotPassword']");
    this.errorMessage      = this.page.locator("div.error-message");
    this.rememberMeCheckbox = this.page.locator('#rememberMe');
    this.signUpLink        = this.page.locator("a[id='signupLink']");
  }

  // ── Validation ───────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.usernameField);
      await this.waitForVisible(this.passwordField);
      await this.waitForVisible(this.loginButton);
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

  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  async loginWithRememberMe(username: string, password: string, rememberMe: boolean): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    if (rememberMe) {
      await this.clickRememberMeCheckbox();
    }
    await this.clickLoginButton();
  }

  async clickForgotPasswordLink(): Promise<void> {
    await this.clickWhenReady(this.forgotPasswordLink);
  }

  async clickSignUpLink(): Promise<void> {
    await this.clickWhenReady(this.signUpLink);
  }

  async clickRememberMeCheckbox(): Promise<void> {
    await this.waitForVisible(this.rememberMeCheckbox);
    const checked = await this.rememberMeCheckbox.isChecked();
    if (!checked) {
      await this.rememberMeCheckbox.check();
    }
  }

  // ── Getters / Verifiers ──────────────────────────────────────────────────────

  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return this.getText(this.errorMessage);
  }

  getErrorMessageLocator(): Locator {
    return this.errorMessage;
  }

  getLoginButtonLocator(): Locator {
    return this.loginButton;
  }

  /**
   * STUB: getUsernameFieldLocator was approved for stubbing on stub_and_continue.
   * LOCATOR_UNCONFIRMED — not in AUT KB.
   */
  getUsernameFieldLocator(): Locator {
    // STUB: LoginPage.getUsernameFieldLocator not implemented — stubbed on stub_and_continue
    // LOCATOR_UNCONFIRMED — not in AUT KB
    return this.page.locator(
      process.env.LOGIN_USERNAME_SELECTOR ??
        '__LOCATOR_UNCONFIRMED_LOGIN_USERNAME__',
    );
  }

  /**
   * STUB: getPasswordFieldLocator was approved for stubbing on stub_and_continue.
   * LOCATOR_UNCONFIRMED — not in AUT KB.
   */
  getPasswordFieldLocator(): Locator {
    // STUB: LoginPage.getPasswordFieldLocator not implemented — stubbed on stub_and_continue
    // LOCATOR_UNCONFIRMED — not in AUT KB
    return this.page.locator(
      process.env.LOGIN_PASSWORD_SELECTOR ??
        '__LOCATOR_UNCONFIRMED_LOGIN_PASSWORD__',
    );
  }

  async navigateTo(path: string): Promise<void> {
    await super.navigateTo(path);
  }

  async getCurrentUrl(): Promise<string> {
    return super.getCurrentUrl();
  }
}