/**
 * CartPage — playwright-typescript framework
 *
 * Page Object for the PracticeSoftwareTesting.com Shopping Cart page.
 * Handles: product listing, quantities, line totals, checkout navigation.
 *
 * Traceability:
 *   Requirement: REQ-PST-001
 *   Framework:   playwright-typescript
 *   Rule refs:   PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly cartTable: Locator;
  private readonly proceedToCheckoutButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartTable               = this.page.locator('.table');
    this.proceedToCheckoutButton = this.page.locator('[data-test="proceed-1"]');
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.cartTable);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  async clickProceedToCheckout(): Promise<void> {
    await this.clickWhenReady(this.proceedToCheckoutButton);
  }

  // ── Getters / Assertions ──────────────────────────────────────────────────────

  /**
   * Returns a locator for a specific product row by product name text.
   * @param productName - Product name as displayed in the cart
   */
  getProductRowLocator(productName: string): Locator {
    // FIX-004-TEW-008: PST AUT v5.0 replaced td:has-text with [data-test="product-title"] span
    return this.page.locator(`[data-test="product-title"]:has-text("${productName}")`).first();
  }

  getCartTableLocator(): Locator { return this.cartTable; }
  getProceedButtonLocator(): Locator { return this.proceedToCheckoutButton; }
}
