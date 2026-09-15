/**
 * WishlistPage — playwright-typescript framework
 *
 * Page Object for the PracticeSoftwareTesting.com Wishlist / Favorites page.
 * Handles: product visibility, removal, count assertion.
 *
 * Traceability:
 *   Requirement: REQ-PST-004
 *   Framework:   playwright-typescript
 *   Rule refs:   PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class WishlistPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly wishlistContainer: Locator;
  private readonly wishlistHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.wishlistContainer = this.page.locator('.wishlists, [data-test="wishlist-container"]');
    this.wishlistHeader    = this.page.locator('h1, h2').first();
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.wishlistHeader);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  /**
   * Removes a product from the wishlist by clicking the remove/delete icon
   * adjacent to the product name.
   * @param productName - Name of the product to remove
   */
  async removeProduct(productName: string): Promise<void> {
    const removeButton = this.page.locator(
      `[data-test="wishlist-item"]:has-text("${productName}") [data-test="remove-item"]`
    ).first();
    await this.clickWhenReady(removeButton);
  }

  // ── Getters / Assertions ──────────────────────────────────────────────────────

  /**
   * Returns a locator for a specific wishlist product by name.
   * @param productName - Product name to locate
   */
  getProductLocator(productName: string): Locator {
    return this.page.locator(`[data-test="wishlist-item"]:has-text("${productName}")`).first();
  }

  getWishlistContainerLocator(): Locator { return this.wishlistContainer; }
}
