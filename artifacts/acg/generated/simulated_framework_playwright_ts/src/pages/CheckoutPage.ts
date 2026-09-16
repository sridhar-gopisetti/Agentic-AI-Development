import { Locator, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  houseNumber?: string;
}

export interface CardDetails {
  number: string;
  expiry: string;
  cvv: string;
  holder: string;
}

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async validate(): Promise<boolean> {
    // TODO(stub_and_continue): implement — see requirement doc
    return false;
  }

  async enterPromoCode(code: string): Promise<void> {
    // TODO(stub_and_continue): implement — see requirement doc
  }

  async applyPromoCode(): Promise<void> {
    // TODO(stub_and_continue): implement — see requirement doc
  }

  getDiscountMessageLocator(): Locator {
    // TODO(stub_and_continue): implement — see requirement doc
    return this.page.locator('[data-testid="stub-discount-message"]');
  }
}