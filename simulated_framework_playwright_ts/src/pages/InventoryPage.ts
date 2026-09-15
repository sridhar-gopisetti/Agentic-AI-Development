/**
 * InventoryPage — playwright-typescript framework
 *
 * Page Object for the SauceDemo Inventory / Product Listing page.
 * Handles: product display, sorting, add/remove to cart, cart icon, menu, logout.
 *
 * Traceability:
 *   Requirements: FR-02, FR-03, FR-04, FR-05, FR-06, FR-10
 *   Framework:    playwright-typescript
 *   Rule refs:    PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class InventoryPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly inventoryList: Locator;
  private readonly sortContainer: Locator;
  private readonly cartBadge: Locator;
  private readonly cartLink: Locator;
  private readonly burgerMenuButton: Locator;
  private readonly logoutLink: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryList    = this.page.locator('.inventory_list');
    this.sortContainer    = this.page.locator('[data-test="product-sort-container"]');
    this.cartBadge        = this.page.locator('.shopping_cart_badge');
    this.cartLink         = this.page.locator('.shopping_cart_link');
    this.burgerMenuButton = this.page.locator('#react-burger-menu-btn');
    this.logoutLink       = this.page.locator('#logout_sidebar_link');
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.inventoryList);
      return true;
    } catch {
      return false;
    }
  }

  // ── Product Locators ──────────────────────────────────────────────────────────

  /**
   * Returns the inventory list container locator.
   */
  getInventoryListLocator(): Locator {
    return this.inventoryList;
  }

  /**
   * Returns the name locator of the first product card.
   */
  getFirstProductNameLocator(): Locator {
    return this.page.locator('.inventory_item_name').first();
  }

  /**
   * Returns the description locator of the first product card.
   */
  getFirstProductDescLocator(): Locator {
    return this.page.locator('.inventory_item_desc').first();
  }

  /**
   * Returns the price locator of the first product card.
   */
  getFirstProductPriceLocator(): Locator {
    return this.page.locator('.inventory_item_price').first();
  }

  /**
   * Returns the image locator of the first product card.
   */
  getFirstProductImageLocator(): Locator {
    return this.page.locator('.inventory_item_img img').first();
  }

  /**
   * Returns all product name locators (for order validation in sort tests).
   */
  getAllProductNamesLocator(): Locator {
    return this.page.locator('.inventory_item_name');
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  /**
   * Selects a sort option from the sort dropdown.
   * @param value - Sort value: 'az' | 'za' | 'lohi' | 'hilo'
   */
  async selectSortOption(value: 'az' | 'za' | 'lohi' | 'hilo'): Promise<void> {
    await this.waitForVisible(this.sortContainer);
    await this.sortContainer.selectOption(value);
  }

  /**
   * Clicks the Add to Cart button for a product at the given index (0-based).
   * @param index - Zero-based product index on the inventory page
   */
  async clickAddToCartByIndex(index: number): Promise<void> {
    const addButtons = this.page.locator('[data-test^="add-to-cart"]');
    await this.waitForVisible(addButtons.nth(index));
    await addButtons.nth(index).click();
  }

  /**
   * Clicks the Remove button for a product at the given index (0-based).
   * @param index - Zero-based product index on the inventory page
   */
  async clickRemoveFromCartByIndex(index: number): Promise<void> {
    const removeButtons = this.page.locator('[data-test^="remove"]');
    await this.waitForVisible(removeButtons.nth(index));
    await removeButtons.nth(index).click();
  }

  /**
   * Clicks the Shopping Cart icon to navigate to the cart.
   */
  async clickCartIcon(): Promise<void> {
    await this.clickWhenReady(this.cartLink);
  }

  /**
   * Opens the hamburger navigation menu.
   */
  async openMenu(): Promise<void> {
    await this.clickWhenReady(this.burgerMenuButton);
    await this.waitForVisible(this.logoutLink);
  }

  /**
   * Clicks the Logout link in the navigation menu.
   * Call `openMenu()` first to ensure the menu is open.
   */
  async clickLogout(): Promise<void> {
    await this.clickWhenReady(this.logoutLink);
  }

  // ── Getters ───────────────────────────────────────────────────────────────────

  getCartBadgeLocator(): Locator { return this.cartBadge; }
  getSortContainerLocator(): Locator { return this.sortContainer; }
}
