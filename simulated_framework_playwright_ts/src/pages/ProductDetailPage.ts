/**
 * ProductDetailPage — playwright-typescript framework
 *
 * Page Object for the SauceDemo Product Detail page.
 * Handles: product info display, add to cart from detail view, back navigation.
 *
 * Traceability:
 *   Requirements: FR-04 (product detail add-to-cart path)
 *   Framework:    playwright-typescript
 *   Rule refs:    PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductDetailPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly productName: Locator;
  private readonly productDescription: Locator;
  private readonly productPrice: Locator;
  private readonly addToCartButton: Locator;
  private readonly backToProductsLink: Locator;

  constructor(page: Page) {
    super(page);
    this.productName         = this.page.locator('.inventory_details_name');
    this.productDescription  = this.page.locator('.inventory_details_desc');
    this.productPrice        = this.page.locator('.inventory_details_price');
    this.addToCartButton     = this.page.locator('[data-test="add-to-cart"]');
    this.backToProductsLink  = this.page.locator('[data-test="back-to-products"]');
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.productName);
      await this.waitForVisible(this.addToCartButton);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  /**
   * Clicks the Add to Cart button on the product detail page.
   */
  async clickAddToCart(): Promise<void> {
    await this.clickWhenReady(this.addToCartButton);
  }

  /**
   * Navigates back to the products listing page.
   */
  async clickBackToProducts(): Promise<void> {
    await this.clickWhenReady(this.backToProductsLink);
  }

  // ── Getters ───────────────────────────────────────────────────────────────────

  getProductNameLocator(): Locator { return this.productName; }
  getProductDescriptionLocator(): Locator { return this.productDescription; }
  getProductPriceLocator(): Locator { return this.productPrice; }
}
