import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async validate(): Promise<boolean> {
    // TODO(stub_and_continue): implement — see requirement doc
    return false;
  }

  async assertAscendingPrices(): Promise<void> {
    // TODO(stub_and_continue): implement — see requirement doc
  }

  getSortDropdownLocator(): Locator {
    return this.page.locator('[data-test="sort"]');
  }

  getSearchResultsLocator(): Locator {
    return this.page.locator('[data-test="product-name"]');
  }
}