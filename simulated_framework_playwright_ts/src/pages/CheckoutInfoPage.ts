/**
 * CheckoutInfoPage — playwright-typescript framework
 *
 * Page Object for the SauceDemo Checkout Step One page (customer info form).
 * Handles: first name, last name, postal code entry, continue, cancel, error validation.
 *
 * Traceability:
 *   Requirements: FR-07, ER-07, ER-08, ER-09, ER-10
 *   Framework:    playwright-typescript
 *   Rule refs:    PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutInfoPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly postalCodeField: Locator;
  private readonly continueButton: Locator;
  private readonly cancelButton: Locator;
  private readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameField  = this.page.locator('[data-test="firstName"]');
    this.lastNameField   = this.page.locator('[data-test="lastName"]');
    this.postalCodeField = this.page.locator('[data-test="postalCode"]');
    this.continueButton  = this.page.locator('[data-test="continue"]');
    this.cancelButton    = this.page.locator('[data-test="cancel"]');
    this.errorMessage    = this.page.locator('[data-test="error"]');
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.firstNameField);
      await this.waitForVisible(this.continueButton);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  /**
   * Enters a first name into the First Name field.
   * @param value - First name string
   */
  async enterFirstName(value: string): Promise<void> {
    await this.fillField(this.firstNameField, value);
  }

  /**
   * Enters a last name into the Last Name field.
   * @param value - Last name string
   */
  async enterLastName(value: string): Promise<void> {
    await this.fillField(this.lastNameField, value);
  }

  /**
   * Enters a postal code into the Postal Code field.
   * @param value - Postal code string
   */
  async enterPostalCode(value: string): Promise<void> {
    await this.fillField(this.postalCodeField, value);
  }

  /**
   * Fills all checkout info fields in a single call.
   * @param firstName  - First name
   * @param lastName   - Last name
   * @param postalCode - Postal code
   */
  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterPostalCode(postalCode);
  }

  /**
   * Clicks the Continue button to proceed to Checkout Step Two.
   */
  async clickContinue(): Promise<void> {
    await this.clickWhenReady(this.continueButton);
  }

  /**
   * Clicks the Cancel button to return to the cart.
   */
  async clickCancel(): Promise<void> {
    await this.clickWhenReady(this.cancelButton);
  }

  // ── Getters ───────────────────────────────────────────────────────────────────

  /**
   * Returns the error message locator for direct assertions in tests.
   */
  getErrorLocator(): Locator { return this.errorMessage; }
}
