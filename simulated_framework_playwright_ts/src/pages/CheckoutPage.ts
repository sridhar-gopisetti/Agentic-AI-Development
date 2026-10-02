// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// TARGET_BROWSER  → set TARGET_BROWSER in .env (assumed: framework primary browser)
// AUT_MODULES_IN_SCOPE → set AUT_MODULES_IN_SCOPE in .env (assumed: inferred from test case document titles/tags)
// LIVE_AUT_ACCESSIBLE → set LIVE_AUT_ACCESSIBLE in .env (assumed: false)
// ════════════════════════════════════════════════════
import { Page, Locator } from '@playwright/test';
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
  private readonly streetField: Locator;
  private readonly cityField: Locator;
  private readonly stateField: Locator;
  private readonly countryDropdown: Locator;
  private readonly postcodeField: Locator;
  private readonly houseNumberField: Locator;
  private readonly proceedStep2Button: Locator;
  private readonly proceedBillingButton: Locator;
  private readonly paymentMethodSelect: Locator;
  private readonly cardNumberField: Locator;
  private readonly expiryField: Locator;
  private readonly cvvField: Locator;
  private readonly cardHolderField: Locator;
  private readonly confirmButton: Locator;
  private readonly orderSuccessMsg: Locator;

  constructor(page: Page) {
    super(page);
    this.streetField = this.page.locator('[data-test="street"]');
    this.cityField = this.page.locator('[data-test="city"]');
    this.stateField = this.page.locator('[data-test="state"]');
    this.countryDropdown = this.page.locator('[data-test="country"]');
    this.postcodeField = this.page.locator('[data-test="postal_code"]');
    this.houseNumberField = this.page.locator('[data-test="house_number"]');
    this.proceedStep2Button = this.page.locator('[data-test="proceed-2"]');
    this.proceedBillingButton = this.page.locator('[data-test="proceed-3"]');
    this.paymentMethodSelect = this.page.locator('[data-test="payment-method"]');
    this.cardNumberField = this.page.locator('[data-test="credit_card_number"]');
    this.expiryField = this.page.locator('[data-test="expiration_date"]');
    this.cvvField = this.page.locator('[data-test="cvv"]');
    this.cardHolderField = this.page.locator('[data-test="card_holder_name"]');
    this.confirmButton = this.page.locator('[data-test="finish"]');
    this.orderSuccessMsg = this.page.locator('[data-test="payment-success-message"]');
  }

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.paymentMethodSelect);
      return true;
    } catch {
      return false;
    }
  }

  async clickProceedStep2(): Promise<void> {
    const proceed2Visible = await this.proceedStep2Button
      .waitFor({ state: 'visible', timeout: 3000 })
      .then(() => true)
      .catch(() => false);

    if (!proceed2Visible) {
      const email = process.env.PST_EMAIL ?? '';
      const password = process.env.PST_PASSWORD ?? '';

      await this.fillField(this.page.locator('[data-test="email"]'), email);
      await this.fillField(this.page.locator('[data-test="password"]'), password);
      await this.page.locator('[data-test="login-submit"]').click({ force: true });
      await this.waitForVisible(this.proceedStep2Button);
    }

    await this.clickWhenReady(this.proceedStep2Button);
  }

  async fillBillingAddress(address: BillingAddress): Promise<void> {
    await this.fillField(this.streetField, address.street);
    await this.fillField(this.cityField, address.city);
    await this.fillField(this.stateField, address.state);
    await this.countryDropdown.selectOption(address.country);
    await this.countryDropdown.dispatchEvent('change');
    await this.fillField(this.postcodeField, address.postcode);

    if (address.houseNumber) {
      await this.fillField(this.houseNumberField, address.houseNumber);
    }
  }

  async clickProceedCheckout(): Promise<void> {
    await this.clickWhenReady(this.proceedBillingButton);
  }

  async selectCreditCard(): Promise<void> {
    await this.waitForVisible(this.paymentMethodSelect);
    await this.paymentMethodSelect.selectOption('credit-card');
  }

  async fillCardDetails(card: CardDetails): Promise<void> {
    await this.fillField(this.cardNumberField, card.number);
    await this.fillField(this.expiryField, card.expiry);
    await this.fillField(this.cvvField, card.cvv);
    await this.fillField(this.cardHolderField, card.holder);
  }

  async clickConfirm(): Promise<void> {
    await this.clickWhenReady(this.confirmButton);
  }

  getOrderSuccessLocator(): Locator {
    return this.orderSuccessMsg;
  }

  async enterPromoCode(code: string): Promise<void> {
    // STUB: enterPromoCode not implemented — stubbed on stub_and_continue
  }

  async applyPromoCode(): Promise<void> {
    // STUB: applyPromoCode not implemented — stubbed on stub_and_continue
  }

  getDiscountLocator(): Locator {
    // STUB: getDiscountLocator not implemented — stubbed on stub_and_continue
    return this.page.locator('[data-stub="discount"]');
  }

  async getOrderId(): Promise<string> {
    // STUB: getOrderId not implemented — stubbed on stub_and_continue
    return '';
  }
}