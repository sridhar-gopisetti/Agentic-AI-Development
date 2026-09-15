/**
 * SauceDemoLoginPage — playwright-typescript framework
 *
 * Page Object for the SauceDemo (https://www.saucedemo.com) Login page.
 * Handles: valid login, error handling for empty/invalid credentials.
 *
 * Traceability:
 *   Requirements: FR-01, ER-01, ER-02, ER-03, ER-04, ER-05
 *   Framework:    playwright-typescript
 *   Rule refs:    PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SauceDemoLoginPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly usernameField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameField = this.page.locator('#user-name');
    this.passwordField = this.page.locator('#password');
    this.loginButton   = this.page.locator('#login-button');
    this.errorMessage  = this.page.locator('[data-test="error"]');
  }

  // ── Validation ────────────────────────────────────────────────────────────────

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

  // ── Actions ───────────────────────────────────────────────────────────────────

  /**
   * Enters a username into the username field.
   * @param username - Username string
   */
  async enterUsername(username: string): Promise<void> {
    await this.fillField(this.usernameField, username);
  }

  /**
   * Enters a password into the password field.
   * @param password - Password string (NOT logged)
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

  // ── Getters / Verifiers ──────────────────────────────────────────────────────

  /**
   * Returns the error message locator for direct assertions in tests.
   */
  getErrorMessageLocator(): Locator {
    return this.errorMessage;
  }

  /**
   * Returns the login button locator for direct assertions in tests.
   */
  getLoginButtonLocator(): Locator {
    return this.loginButton;
  }
}
