/**
 * HomePage — playwright-typescript framework
 *
 * Page Object for the PracticeSoftwareTesting.com Homepage.
 * Handles: category navigation, product search, cart badge.
 *
 * Traceability:
 *   Requirements: REQ-PST-001, REQ-PST-004
 *   Framework:    playwright-typescript
 *   Rule refs:    PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly cartBadge: Locator;
  private readonly searchInput: Locator;
  private readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartBadge    = this.page.locator('[data-test="cart-quantity"]');
    this.searchInput  = this.page.locator('[data-test="search-query"]');
    this.searchButton = this.page.locator('[data-test="search-submit"]');
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.searchInput);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  /**
   * Navigates to a category via direct URL (Angular SPA route navigation).
   * FIX-001 (FIARA TEW-RUN-20260802-002): PST AUT category links are Angular dropdown items
   * hidden until parent nav is expanded. Hover and force:true did not overcome Angular's CSS
   * visibility (display:none — Playwright treats as genuinely invisible, cannot click even with force).
   * FIX-001-R3 (FIARA TEW-RUN-20260802-002): Use page.goto() with the category URL path directly.
   * This is the most resilient strategy and is not subject to nav animation state.
   * @param categoryName - e.g. 'Hand Tools', 'Power Tools'
   */
  async clickCategory(categoryName: string): Promise<void> {
    // Map category display names to PST AUT URL path slugs
    const categoryUrlMap: Record<string, string> = {
      'Hand Tools':  '/category/hand-tools',
      'Power Tools': '/category/power-tools',
      'Other':       '/category/other',
    };
    const urlPath = categoryUrlMap[categoryName];
    const baseUrl = process.env.BASE_URL ?? 'https://practicesoftwaretesting.com';
    if (urlPath) {
      await this.page.goto(`${baseUrl}${urlPath}`);
    } else {
      // Fallback: attempt direct click for unmapped categories
      const categoryLink = this.page.locator(`a:has-text("${categoryName}")`).first();
      await categoryLink.waitFor({ state: 'attached', timeout: 10_000 });
      await categoryLink.click({ force: true });
    }
  }

  /**
   * Searches for a product by keyword.
   * @param keyword - search term, e.g. 'Drill'
   */
  async searchProduct(keyword: string): Promise<void> {
    await this.fillField(this.searchInput, keyword);
    await this.clickWhenReady(this.searchButton);
  }

  /**
   * Clicks the first product in the current product listing.
   */
  async clickFirstProduct(): Promise<void> {
    const firstProduct = this.page.locator('.card').first();
    await this.clickWhenReady(firstProduct);
  }

  /**
   * Returns the sort dropdown locator (for selectOption calls in tests).
   */
  getSortDropdownLocator(): Locator {
    return this.page.locator('[data-test="sort"]');
  }

  // ── Getters / Assertions ──────────────────────────────────────────────────────

  async getCartBadgeCount(): Promise<string> {
    await this.waitForVisible(this.cartBadge);
    return this.getText(this.cartBadge);
  }

  getCartBadgeLocator(): Locator { return this.cartBadge; }
  getSearchInputLocator(): Locator { return this.searchInput; }
  getSearchResultsLocator(): Locator {
    return this.page.locator('[data-test="product-name"]');
  }
  /**
   * Returns the category page title locator.
   * FIX-003-TEW-008: PST AUT category pages render [data-test="page-title"] (an <h2>)
   * instead of the homepage search bar. Used to assert category page has loaded.
   */
  getCategoryPageTitleLocator(): Locator {
    return this.page.locator('[data-test="page-title"]');
  }
}
