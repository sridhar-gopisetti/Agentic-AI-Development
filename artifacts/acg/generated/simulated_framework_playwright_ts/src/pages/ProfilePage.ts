import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import type { RegistrationData } from './RegisterPage';

export class ProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async validate(): Promise<boolean> {
    // TODO(stub_and_continue): implement — see requirement doc
    return false;
  }

  async assertPersistedValues(data: RegistrationData): Promise<void> {
    // TODO(stub_and_continue): implement — see requirement doc
  }

  getAddressLocator(): Locator {
    return this.page.locator('[data-test="address"]');
  }

  getCityLocator(): Locator {
    return this.page.locator('[data-test="city"]');
  }

  getPhoneLocator(): Locator {
    return this.page.locator('[data-test="phone"]');
  }

  getPostcodeLocator(): Locator {
    return this.page.locator('[data-test="postcode"]');
  }

  getPageHeaderLocator(): Locator {
    return this.page.locator('h1, h2').first();
  }
}