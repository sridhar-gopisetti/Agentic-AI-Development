/**
 * SauceDemoCartPage — playwright-typescript framework
 *
 * Page Object for the SauceDemo Shopping Cart page.
 * Handles: viewing cart items, proceeding to checkout, continuing shopping.
 *
 * Traceability:
 *   Requirements: FR-05, FR-06, FR-07, ER-06
 *   Framework:    playwright-typescript
 *   Rule refs:    PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class SauceDemoCartPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly cartList: Locator;
  private readonly cartItems: Locator;
  private readonly checkoutButton: Locator;
  private readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartList              = this.page.locator('.cart_list');
    this.cartItems             = this.page.locator('.cart_item');
    this.checkoutButton        = this.page.locator('[data-test="checkout"]');
    this.continueShoppingButton = this.page.locator('[data-test="continue-shopping"]');
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.cartList);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  /**
   * Clicks the Checkout button to proceed to checkout step one.
   */
  async clickCheckout(): Promise<void> {
    await this.clickWhenReady(this.checkoutButton);
  }

  /**
   * Clicks Continue Shopping to return to the inventory page.
   */
  async clickContinueShopping(): Promise<void> {
    await this.clickWhenReady(this.continueShoppingButton);
  }

  // ── Getters ───────────────────────────────────────────────────────────────────

  /**
   * Returns the cart items locator for count/visibility assertions.
   */
  getCartItemsLocator(): Locator { return this.cartItems; }

  /**
   * Returns the cart list container locator.
   */
  getCartListLocator(): Locator { return this.cartList; }

  /**
   * Returns the checkout button locator.
   */
  getCheckoutButtonLocator(): Locator { return this.checkoutButton; }
}
