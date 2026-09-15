/**
 * CheckoutOverviewPage — playwright-typescript framework
 *
 * Page Object for the SauceDemo Checkout Step Two page (order overview).
 * Handles: order summary display, finish order, cancel.
 *
 * Traceability:
 *   Requirements: FR-08, FR-09
 *   Framework:    playwright-typescript
 *   Rule refs:    PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutOverviewPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly summaryContainer: Locator;
  private readonly cartItems: Locator;
  private readonly finishButton: Locator;
  private readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);
    this.summaryContainer = this.page.locator('.checkout_summary_container');
    this.cartItems        = this.page.locator('.cart_item');
    this.finishButton     = this.page.locator('[data-test="finish"]');
    this.cancelButton     = this.page.locator('[data-test="cancel"]');
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.summaryContainer);
      await this.waitForVisible(this.finishButton);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  /**
   * Clicks the Finish button to complete the order.
   */
  async clickFinish(): Promise<void> {
    await this.clickWhenReady(this.finishButton);
  }

  /**
   * Clicks the Cancel button to return to the inventory page.
   */
  async clickCancel(): Promise<void> {
    await this.clickWhenReady(this.cancelButton);
  }

  // ── Getters ───────────────────────────────────────────────────────────────────

  getOrderSummaryLocator(): Locator { return this.summaryContainer; }
  getCartItemsLocator(): Locator    { return this.cartItems; }
  getFinishButtonLocator(): Locator { return this.finishButton; }
}
