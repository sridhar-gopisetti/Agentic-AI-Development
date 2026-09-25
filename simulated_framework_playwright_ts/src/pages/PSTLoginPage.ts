/**
 * PSTLoginPage — playwright-typescript framework
 *
 * Page Object for the PracticeSoftwareTesting.com Login page.
 * Requirement: REQ-PST-001, REQ-PST-004 (pre-condition: user logged in)
 *
 * Traceability:
 *   Requirements: REQ-PST-001, REQ-PST-002, REQ-PST-004
 *   Framework:    playwright-typescript
 *   Rule refs:    PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class PSTLoginPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly emailField: Locator;
  private readonly passwordField: Locator;
  private readonly loginButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailField    = this.page.locator('[data-test="email"]');
    this.passwordField = this.page.locator('[data-test="password"]');
    this.loginButton   = this.page.locator('[data-test="login-submit"]');
    this.errorMessage  = this.page.locator('[data-test="login-error"]');
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.emailField);
      await this.waitForVisible(this.loginButton);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  async enterEmail(email: string): Promise<void> {
    await this.fillField(this.emailField, email);
  }

  async enterPassword(password: string): Promise<void> {
    await this.fillField(this.passwordField, password);
  }

  async clickLoginButton(): Promise<void> {
    // FIX-002 (FIARA TEW-RUN-20260802-002): Firefox slow-click timeout on live PST AUT.
    // The login-submit button was found visible/enabled/stable but the click action exceeded
    // 120s test timeout in Firefox. Using { force: true } bypasses actionability re-checks
    // and fires the click immediately once the element is visible.
    // FIX-TEW-TC4: Also wait for network-idle after the forced click so the auth session
    // cookie is persisted before the next page.goto() call (TC-4 Step 500 was landing on
    // the login page because the cookie had not been written yet).
    await this.waitForVisible(this.loginButton);
    await Promise.all([
      this.page.waitForLoadState('networkidle').catch(() => {/* timeout is fine */}),
      this.loginButton.click({ force: true }),
    ]);
  }

  /**
   * Performs a complete PST login flow.
   * @param email    - User email
   * @param password - User password
   */
  async login(email: string, password: string): Promise<void> {
    await this.enterEmail(email);
    await this.enterPassword(password);
    await this.clickLoginButton();
  }

  // ── Getters / Locator accessors ───────────────────────────────────────────────

  async getErrorMessage(): Promise<string> {
    await this.waitForVisible(this.errorMessage);
    return this.getText(this.errorMessage);
  }

  getErrorLocator(): Locator { return this.errorMessage; }
  getLoginButtonLocator(): Locator { return this.loginButton; }
}
