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

  /**
   * Validates that the Login page is fully rendered.
   * Mirrors LoadablePage.validate() from the Java MITE framework.
   */
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

  /**
   * Enters a username into the username field.
   * @param username - Username string
   */
  async enterUsername(username: string): Promise<void> {
    await this.fillField(this.usernameField, username);
  }

  /**
   * Enters a password into the password field.
   * @param password - Password string (value is NOT logged)
   */
  async enterPassword(password: string): Promise<void> {
    await this.fillField(this.passwordField, password);
  }

  /**
   * Clicks the Login button.
   */
  async clickLoginButton(): Promise<void> {
    await this.clickWhenReady(this.loginButton);
  }

  /**
   * Performs a complete login flow.
   * @param username - Username
   * @param password - Password
   */
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  /**
   * Performs login with the "Remember Me" checkbox optionally ticked.
   * @param username   - Username
   * @param password   - Password
   * @param rememberMe - Whether to tick the Remember Me checkbox
   */
  async loginWithRememberMe(username: string, password: string, rememberMe: boolean): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    if (rememberMe) {
      await this.clickRememberMeCheckbox();
    }
    await this.clickLoginButton();
  }

  /**
   * Clicks the Forgot Password link.
   */
  async clickForgotPasswordLink(): Promise<void> {
    await this.clickWhenReady(this.forgotPasswordLink);
  }

  /**
   * Clicks the Sign Up link.
   */
  async clickSignUpLink(): Promise<void> {
    await this.clickWhenReady(this.signUpLink);
  }

  /**
   * Ticks the Remember Me checkbox if not already selected.
   */
  async clickRememberMeCheckbox(): Promise<void> {
    await this.waitForVisible(this.rememberMeCheckbox);
    const checked = await this.rememberMeCheckbox.isChecked();
    if (!checked) {
      await this.rememberMeCheckbox.check();
    }
  }

  // ── Getters / Verifiers ──────────────────────────────────────────────────────

  /**
   * Returns the error message text currently displayed on the page.
   */
  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return this.getText(this.errorMessage);
  }

  /**
   * Returns the error message locator (for direct assertions in tests).
   */
  getErrorMessageLocator(): Locator {
    return this.errorMessage;
  }

  /**
   * Returns the login button locator (for direct assertions in tests).
   */
  getLoginButtonLocator(): Locator {
    return this.loginButton;
  }
}
