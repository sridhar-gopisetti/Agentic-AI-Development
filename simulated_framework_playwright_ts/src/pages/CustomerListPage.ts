/**
 * CustomerListPage — playwright-typescript framework
 *
 * Page Object for the Customer List page.
 * Requirement: REQ-UC013C-001
 *
 * Traceability:
 *   Requirement: REQ-UC013C-001
 *   Test Case:   UC013C-B01-01
 *   Framework:   playwright-typescript
 *   Rule refs:   PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CustomerListPage extends BasePage {
  // ── Locators ─────────────────────────────────────────────────────────────────
  private readonly pageHeader: Locator;
  private readonly searchField: Locator;
  private readonly searchButton: Locator;
  private readonly loadingSpinner: Locator;

  constructor(page: Page) {
    super(page);
    this.pageHeader    = this.page.locator("h1:has-text('Customer List')");
    this.searchField   = this.page.locator('#customerSearchField');
    this.searchButton  = this.page.locator('#searchButton');
    this.loadingSpinner = this.page.locator('div.loading-spinner');
  }

  // ── Validation ───────────────────────────────────────────────────────────────

  /**
   * Validates that the Customer List page header is visible.
   */
  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.pageHeader);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  /**
   * Searches for a customer by name using the search field.
   * Waits for the loading spinner to disappear before returning.
   * @param customerName - Name to search
   */
  async searchCustomer(customerName: string): Promise<void> {
    await this.fillField(this.searchField, customerName);
    await this.clickWhenReady(this.searchButton);
    await this.waitForHidden(this.loadingSpinner);
  }

  /**
   * Clicks the customer name link to navigate to the customer profile.
   * @param customerName - Customer name to click
   */
  async clickCustomerNameLink(customerName: string): Promise<void> {
    const customerLink = this.getCustomerLinkLocator(customerName);
    await this.clickWhenReady(customerLink);
    await this.waitForHidden(this.loadingSpinner);
  }

  // ── Getters / Verifiers ──────────────────────────────────────────────────────

  /**
   * Returns whether a given customer name appears in the results list.
   * @param customerName - Name to verify
   */
  async isCustomerDisplayed(customerName: string): Promise<boolean> {
    try {
      const customerLink = this.getCustomerLinkLocator(customerName);
      await this.waitForVisible(customerLink);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Returns a locator scoped to a specific customer name link.
   * Exposed so callers can compose further assertions.
   * @param customerName - Customer name
   */
  getCustomerLinkLocator(customerName: string): Locator {
    return this.page.locator(
      `a.customer-name-link:has-text('${customerName}')`
    );
  }

  /** Returns the page header locator for direct assertions. */
  getPageHeaderLocator(): Locator {
    return this.pageHeader;
  }
}
