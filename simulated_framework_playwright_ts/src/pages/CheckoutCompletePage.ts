/**
 * CheckoutCompletePage — playwright-typescript framework
 *
 * Page Object for the SauceDemo Checkout Complete page (order confirmation).
 * Handles: success confirmation display, back to products navigation.
 *
 * Traceability:
 *   Requirements: FR-08
 *   Framework:    playwright-typescript
 *   Rule refs:    PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutCompletePage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly completeContainer: Locator;
  private readonly successHeader: Locator;
  private readonly backToProductsButton: Locator;

  constructor(page: Page) {
    super(page);
    this.completeContainer    = this.page.locator('[data-test="checkout-complete-container"]');
    this.successHeader        = this.page.locator('.complete-header');
    this.backToProductsButton = this.page.locator('[data-test="back-to-products"]');
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.completeContainer);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  /**
   * Clicks the Back to Products button.
   */
  async clickBackToProducts(): Promise<void> {
    await this.clickWhenReady(this.backToProductsButton);
  }

  // ── Getters ───────────────────────────────────────────────────────────────────

  getSuccessHeaderLocator(): Locator    { return this.successHeader; }
  getCompleteContainerLocator(): Locator { return this.completeContainer; }
}
