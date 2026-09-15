/**
 * CheckoutPage — playwright-typescript framework
 *
 * Page Object for the PracticeSoftwareTesting.com multi-step Checkout page.
 * Handles: cart confirmation, billing address, credit card payment, order confirmation.
 *
 * PST AUT v5.0 checkout is a 4-step accordion at /checkout:
 *   Step 1 (CART):            proceed-1 button
 *   Step 2 (SIGN IN):         proceed-2 button  ← pass-through for logged-in users
 *   Step 3 (BILLING ADDRESS): street/city/state/postal_code/house_number/country + proceed-3
 *   Step 4 (PAYMENT):         payment-method select → card fields + finish button
 *
 * FIX-005-TEW-008 changes vs original:
 *   - postcodeField: [data-test="postcode"] → [data-test="postal_code"]
 *   - houseNumberField: added [data-test="house_number"]
 *   - proceedStep2Button: added [data-test="proceed-2"]
 *   - proceedBillingButton: added [data-test="proceed-3"]
 *   - proceedCheckoutButton ([data-test="proceed-1"]): retained for cart step only
 *   - creditCardRadio → paymentMethodSelect ([data-test="payment-method"])
 *   - selectCreditCard(): uses selectOption('credit-card') on payment-method select
 *   - MEGA-51: coupon-code / apply-coupon-btn / discount-percentage removed from AUT v5.0
 * FIX-001-TEW-003 (FIARA TEW-RUN-20260802-003):
 *   - clickProceedCheckout(): added waitFor enabled state before click on proceed-3.
 *     WebKit Angular form validation marks proceed-3 disabled until all required fields
 *     pass client-side validation. Waiting for enabled state resolves the 120s timeout.
 *
 * Traceability:
 *   Requirement: REQ-PST-001
 *   Framework:   playwright-typescript
 *   Rule refs:   PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface BillingAddress {
  street:      string;
  city:        string;
  state:       string;
  country:     string;
  postcode:    string;
  houseNumber?: string;
}

export interface CardDetails {
  number:  string;  // format: 0000-0000-0000-0000
  expiry:  string;  // format: MM/YYYY
  cvv:     string;
  holder:  string;
}

export class CheckoutPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly streetField:          Locator;
  private readonly cityField:            Locator;
  private readonly stateField:           Locator;
  private readonly countryDropdown:      Locator;
  private readonly postcodeField:        Locator;
  private readonly houseNumberField:     Locator;
  private readonly proceedStep2Button:   Locator;  // sign-in pass-through → reveals billing
  private readonly proceedBillingButton: Locator;  // billing submit → payment step
  private readonly paymentMethodSelect:  Locator;
  private readonly cardNumberField:      Locator;
  private readonly expiryField:          Locator;
  private readonly cvvField:             Locator;
  private readonly cardHolderField:      Locator;
  private readonly confirmButton:        Locator;
  private readonly orderSuccessMsg:      Locator;

  constructor(page: Page) {
    super(page);
    this.streetField          = this.page.locator('[data-test="street"]');
    this.cityField            = this.page.locator('[data-test="city"]');
    this.stateField           = this.page.locator('[data-test="state"]');
    this.countryDropdown      = this.page.locator('[data-test="country"]');
    this.postcodeField        = this.page.locator('[data-test="postal_code"]');
    this.houseNumberField     = this.page.locator('[data-test="house_number"]');
    this.proceedStep2Button   = this.page.locator('[data-test="proceed-2"]');
    this.proceedBillingButton = this.page.locator('[data-test="proceed-3"]');
    this.paymentMethodSelect  = this.page.locator('[data-test="payment-method"]');
    this.cardNumberField      = this.page.locator('[data-test="credit_card_number"]');
    this.expiryField          = this.page.locator('[data-test="expiration_date"]');
    this.cvvField             = this.page.locator('[data-test="cvv"]');
    this.cardHolderField      = this.page.locator('[data-test="card_holder_name"]');
    this.confirmButton        = this.page.locator('[data-test="finish"]');
    this.orderSuccessMsg      = this.page.locator('[data-test="payment-success-message"]');
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.paymentMethodSelect);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  /**
   * Advances through the checkout sign-in step (Step 2).
   * Must be called after cartPage.clickProceedToCheckout() (proceed-1).
   *
   * PST AUT v5.0 checkout sign-in step behaviour:
   *   - Logged-in users with valid checkout session: proceed-2 button is immediately visible.
   *   - Users whose checkout session requires re-authentication: a Login form is shown.
   *     In that case we submit credentials, then proceed-2 becomes visible.
   * After this call the billing address fields become visible.
   */
  async clickProceedStep2(): Promise<void> {
    // First wait briefly for proceed-2 — fast path for already-authenticated sessions
    const proceed2Visible = await this.proceedStep2Button
      .waitFor({ state: 'visible', timeout: 3000 })
      .then(() => true)
      .catch(() => false);

    if (!proceed2Visible) {
      // Slow path: checkout login form is presented — fill credentials and submit
      const email    = process.env.PST_EMAIL    ?? 'customer@practicesoftwaretesting.com';
      const password = process.env.PST_PASSWORD ?? 'welcome01';
      await this.fillField(this.page.locator('[data-test="email"]'), email);
      await this.fillField(this.page.locator('[data-test="password"]'), password);
      await this.page.locator('[data-test="login-submit"]').click({ force: true });
      // Now wait for proceed-2 to appear after login
      await this.waitForVisible(this.proceedStep2Button);
    }

    await this.clickWhenReady(this.proceedStep2Button);
  }

  /**
   * Fills the billing address form.
   * Must be called AFTER clickProceedStep2() — fields are hidden before that.
   * @param address - BillingAddress data object
   */
  async fillBillingAddress(address: BillingAddress): Promise<void> {
    await this.fillField(this.streetField, address.street);
    await this.fillField(this.cityField, address.city);
    await this.fillField(this.stateField, address.state);
    await this.countryDropdown.selectOption(address.country);
    await this.fillField(this.postcodeField, address.postcode);
    if (address.houseNumber) {
      await this.fillField(this.houseNumberField, address.houseNumber);
    }
  }

  /**
   * Submits the billing address form (proceed-3).
   * After this call the payment-method select becomes visible.
   *
   * FIX-001-TEW-003: Wait for proceed-3 to be both visible AND enabled before clicking.
   * WebKit Angular form validation keeps proceed-3 disabled until all required fields
   * pass validation. Chromium/Firefox both pass without this wait; WebKit requires it
   * because Angular's ChangeDetectorRef triggers are delayed in the WebKit rendering engine.
   * Using waitFor({ state: 'visible' }) followed by expect().toBeEnabled() poll loop.
   */
  async clickProceedCheckout(): Promise<void> {
    await this.waitForVisible(this.proceedBillingButton);
    // FIX-001-TEW-003: Poll for enabled state before clicking (WebKit Angular validation delay)
    await this.proceedBillingButton.waitFor({ state: 'visible', timeout: 10_000 });
    // Wait until the button is no longer disabled — Angular validation must complete
    await this.page.waitForFunction(
      () => {
        const btn = document.querySelector('[data-test="proceed-3"]') as HTMLButtonElement | null;
        return btn !== null && !btn.disabled;
      },
      { timeout: 15_000 }
    );
    await this.proceedBillingButton.click();
  }

  /**
   * Selects Credit Card as the payment method via the payment-method dropdown.
   * Must be called after clickProceedCheckout() — payment-method is hidden before that.
   */
  async selectCreditCard(): Promise<void> {
    await this.waitForVisible(this.paymentMethodSelect);
    await this.paymentMethodSelect.selectOption('credit-card');
  }

  /**
   * Fills all credit card fields.
   * Must be called after selectCreditCard() — card fields are hidden before that.
   * @param card - CardDetails data object
   *   card.number format: 0000-0000-0000-0000 (hyphens required by AUT v5.0)
   *   card.expiry format:  MM/YYYY             (4-digit year required by AUT v5.0)
   */
  async fillCardDetails(card: CardDetails): Promise<void> {
    await this.fillField(this.cardNumberField, card.number);
    await this.fillField(this.expiryField, card.expiry);
    await this.fillField(this.cvvField, card.cvv);
    await this.fillField(this.cardHolderField, card.holder);
  }

  async clickConfirm(): Promise<void> {
    await this.clickWhenReady(this.confirmButton);
  }

  // ── Getters / Assertions ──────────────────────────────────────────────────────

  getOrderSuccessLocator(): Locator { return this.orderSuccessMsg; }
}
