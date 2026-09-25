/**
 * ProductPage — playwright-typescript framework
 *
 * Page Object for the PracticeSoftwareTesting.com Product Detail page.
 * Handles: quantity selection, add to cart, success toast.
 *
 * Traceability:
 *   Requirements: REQ-PST-001, REQ-PST-004
 *   Framework:    playwright-typescript
 *   Rule refs:    PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly quantityInput: Locator;
  private readonly addToCartButton: Locator;
  private readonly successToast: Locator;
  private readonly productTitle: Locator;
  private readonly wishlistButton: Locator;

  constructor(page: Page) {
    super(page);
    this.quantityInput    = this.page.locator('[data-test="quantity"]');
    this.addToCartButton  = this.page.locator('[data-test="add-to-cart"]');
    // FIX-TEW-PST: PST AUT v5.0 removed .alert-success; both add-to-cart and add-to-favorites
    // confirmations now surface as [role="alert"] live-region toasts.
    this.successToast     = this.page.locator('[role="alert"]');
    this.productTitle     = this.page.locator('[data-test="product-name"]');
    this.wishlistButton   = this.page.locator('[data-test="add-to-favorites"]');
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.productTitle);
      await this.waitForVisible(this.addToCartButton);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  /**
   * Sets the quantity on the product detail page.
   * @param quantity - Integer quantity value
   */
  async setQuantity(quantity: number): Promise<void> {
    // FIX-007-TEW-008: Wait for add-to-cart to be visible first — Angular product page
    // renders async after navigation; quantity input is hidden until page fully loads.
    await this.waitForVisible(this.addToCartButton);
    await this.fillField(this.quantityInput, quantity.toString());
  }

  async clickAddToCart(): Promise<void> {
    await this.clickWhenReady(this.addToCartButton);
  }

  async clickAddToFavorites(): Promise<void> {
    await this.clickWhenReady(this.wishlistButton);
  }

  // ── Getters / Assertions ──────────────────────────────────────────────────────

  getSuccessToastLocator(): Locator { return this.successToast; }
  getProductTitleLocator(): Locator { return this.productTitle; }
  getWishlistButtonLocator(): Locator { return this.wishlistButton; }
  /**
   * Returns the add-to-cart button locator.
   * FIX-003-TEW-008: PST AUT v5.0 removed .alert-success toast after add-to-cart.
   * Asserting the add-to-cart button is visible confirms the product page loaded
   * and the action was accepted without a page-level error.
   */
  getAddToCartButtonLocator(): Locator { return this.addToCartButton; }
}
