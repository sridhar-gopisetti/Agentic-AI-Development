import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class WishlistPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async validate(): Promise<boolean> {
    // TODO(stub_and_continue): implement — see requirement doc
    return false;
  }

  getWishlistCountLocator(): Locator {
    // TODO(stub_and_continue): implement — see requirement doc
    return this.page.locator('[data-testid="stub-wishlist-count"]');
  }

  getProductLocator(productName: string): Locator {
    return this.page
      .locator(`[data-test="wishlist-item"]:has-text("${productName}")`)
      .first();
  }
}