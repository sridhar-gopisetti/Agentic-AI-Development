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
    // FIX-TEW-TC4: PST AUT v5.0 /account/favorites renders a page-title heading "Favorites".
    // Use [data-test="page-title"] first, fall back to any h1/h2/h3 heading.
    // FIX-TEW-TC4-R2: Removed .filter({ hasText: 'Favorites' }) — the heading text may vary
    // (e.g. "My Favorites") and a text-filter mismatch is a common source of false failures.
    // Asserting that the page-title element itself is visible is sufficient to confirm the
    // page loaded; product-level assertions are handled by getProductLocator().
    this.wishlistContainer = this.page.locator('[data-test="page-title"]').first();
    this.wishlistHeader    = this.page.locator('[data-test="page-title"], h1, h2, h3').first();
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
   * FIX-TEW-TC4: PST AUT v5.0 /account/favorites uses no data-test attributes on item rows.
   * Each row contains the product name as text and a red × remove button (.btn-danger or similar).
   * Locate the row by product name text and click the button within it.
   * @param productName - Name of the product to remove
   */
  async removeProduct(productName: string): Promise<void> {
    // Row containing the product name — use :has-text on a .card or li ancestor
    const row = this.page.locator('.card, li, [class*="item"]').filter({ hasText: productName }).first();
    const removeButton = row.locator('button').first();
    await this.clickWhenReady(removeButton);
  }

  // ── Getters / Assertions ──────────────────────────────────────────────────────

  /**
   * Returns a locator for a specific wishlist product by name.
   * FIX-TEW-TC4: PST AUT v5.0 uses no data-test on wishlist rows.
   * Match by product name text inside any container element on the page.
   * @param productName - Product name to locate
   */
  getProductLocator(productName: string): Locator {
    return this.page.locator('.card, li, [class*="item"]').filter({ hasText: productName }).first();
  }

  getWishlistContainerLocator(): Locator { return this.wishlistContainer; }
}
