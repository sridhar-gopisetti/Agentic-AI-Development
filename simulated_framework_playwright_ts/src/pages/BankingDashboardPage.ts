/**
 * BankingDashboardPage — playwright-typescript framework
 *
 * Page Object for the Banking Application Dashboard page.
 * Requirement: REQ-BANK-AUTH-001
 *
 * Traceability:
 *   Requirement: REQ-BANK-AUTH-001
 *   Test Case:   Banking_Login_TC_1
 *   Framework:   playwright-typescript
 *   Rule refs:   PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class BankingDashboardPage extends BasePage {
  // ── Locators ─────────────────────────────────────────────────────────────────
  private readonly welcomeMessage: Locator;
  private readonly accountSummaryPanel: Locator;
  private readonly userNameDisplay: Locator;
  private readonly logoutButton: Locator;
  private readonly navigationMenu: Locator;
  private readonly accountBalanceSection: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage       = this.page.locator('h1.welcome-message');
    this.accountSummaryPanel  = this.page.locator('div.account-summary-panel');
    this.userNameDisplay      = this.page.locator('span.logged-in-username');
    this.logoutButton         = this.page.locator("button[data-testid='logout-btn']");
    this.navigationMenu       = this.page.locator('nav.banking-nav');
    this.accountBalanceSection = this.page.locator('section.account-balance');
  }

  // ── Validation ───────────────────────────────────────────────────────────────

  /**
   * Validates that the Banking Dashboard has loaded after successful login.
   */
  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.welcomeMessage);
      await this.waitForVisible(this.accountSummaryPanel);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  async clickLogout(): Promise<void> {
    await this.clickWhenReady(this.logoutButton);
  }

  // ── Getters / Verifiers ──────────────────────────────────────────────────────

  async getWelcomeMessageText(): Promise<string> {
    return this.getText(this.welcomeMessage);
  }

  async getLoggedInUsername(): Promise<string> {
    return this.getText(this.userNameDisplay);
  }

  async isAccountBalanceSectionVisible(): Promise<boolean> {
    try {
      await this.waitForVisible(this.accountBalanceSection);
      return true;
    } catch {
      return false;
    }
  }

  // Locator accessors for direct assertions
  getWelcomeMessageLocator(): Locator { return this.welcomeMessage; }
  getAccountSummaryLocator(): Locator { return this.accountSummaryPanel; }
  getUserNameDisplayLocator(): Locator { return this.userNameDisplay; }
  getNavigationMenuLocator(): Locator { return this.navigationMenu; }
}
