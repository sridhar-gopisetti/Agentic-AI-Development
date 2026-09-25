/**
 * RegisterPage — playwright-typescript framework
 *
 * Page Object for the PracticeSoftwareTesting.com Registration page.
 * Handles: user registration form fill and submission.
 *
 * Traceability:
 *   Requirement: REQ-PST-002
 *   Framework:   playwright-typescript
 *   Rule refs:   PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export interface RegistrationData {
  firstName:   string;
  lastName:    string;
  dob:         string;  // format: YYYY-MM-DD (PST AUT v5.0)
  address:     string;  // maps to "Street" label in PST AUT v5.0
  houseNumber: string;  // PST AUT v5.0 requires a separate house-number field
  city:        string;
  state:       string;
  country:     string;
  postcode:    string;
  phone:       string;
  email:       string;
  password:    string;
}

export class RegisterPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly firstNameField:   Locator;
  private readonly lastNameField:    Locator;
  private readonly dobField:         Locator;
  private readonly streetField:      Locator;  // FIX-TEW-TC2: was 'addressField'
  private readonly houseNumberField: Locator;  // FIX-TEW-TC2: new field
  private readonly cityField:        Locator;
  private readonly stateField:       Locator;
  private readonly countryDropdown:  Locator;
  private readonly postcodeField:    Locator;
  private readonly phoneField:       Locator;
  private readonly emailField:       Locator;
  private readonly passwordField:    Locator;
  private readonly registerButton:   Locator;

  constructor(page: Page) {
    super(page);
    // FIX-002: Live AUT registration page uses label-based fields, not data-test attributes.
    // Using getByLabel() for form fields (ARIA-accessible) and getByRole for the submit button.
    // FIX-TEW-TC2: PST AUT v5.0 address section: "Street" + "House number" (separate fields).
    this.firstNameField   = this.page.getByLabel('First name');
    this.lastNameField    = this.page.getByLabel('Last name');
    this.dobField         = this.page.getByLabel('Date of Birth');
    this.streetField      = this.page.getByLabel('Street');
    this.houseNumberField = this.page.getByLabel('House number');
    this.cityField        = this.page.getByLabel('City');
    this.stateField       = this.page.getByLabel('State');
    this.countryDropdown  = this.page.getByLabel('Country');
    this.postcodeField    = this.page.getByLabel('Postal code');
    this.phoneField       = this.page.getByLabel('Phone');
    this.emailField       = this.page.getByLabel('Email address');
    this.passwordField    = this.page.getByLabel('Password');
    this.registerButton   = this.page.getByRole('button', { name: 'Register' });
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.firstNameField);
      await this.waitForVisible(this.registerButton);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  /**
   * Fills all required registration form fields.
   * @param data - RegistrationData — all credentials via env or test object
   */
  async fillRegistrationForm(data: RegistrationData): Promise<void> {
    await this.fillField(this.firstNameField, data.firstName);
    await this.fillField(this.lastNameField,  data.lastName);
    // FIX-TEW-TC2: PST AUT v5.0 Date of Birth expects YYYY-MM-DD format.
    await this.fillField(this.dobField,       data.dob);
    // FIX-TEW-TC2: PST AUT v5.0 address uses Country → Postal code → House number → Street auto-fill.
    // Fill country first, then postcode, then house number; Street/City/State auto-populate.
    await this.countryDropdown.selectOption(data.country);
    await this.countryDropdown.dispatchEvent('change');
    await this.fillField(this.postcodeField,    data.postcode);
    await this.fillField(this.houseNumberField, data.houseNumber);
    // Street, City, State may auto-fill from postcode lookup; also fill explicitly as fallback.
    await this.fillField(this.streetField, data.address);
    await this.fillField(this.cityField,   data.city);
    await this.fillField(this.stateField,  data.state);
    await this.fillField(this.phoneField,  data.phone);
    await this.fillField(this.emailField,  data.email);
    // FIX-TEW-TC2: PST AUT v5.0 password field uses Angular reactive forms with a strength
    // validator that listens to keypress events. locator.fill() sets the value but does not
    // fire individual keystroke events, leaving the Angular control invalid (all hints hollow).
    // pressSequentially() types character-by-character, firing input events Angular needs.
    await this.waitForVisible(this.passwordField);
    await this.passwordField.clear();
    await this.passwordField.pressSequentially(data.password, { delay: 30 });
  }

  async clickRegister(): Promise<void> {
    await this.clickWhenReady(this.registerButton);
  }

  // ── Getters ───────────────────────────────────────────────────────────────────

  getRegisterButtonLocator(): Locator { return this.registerButton; }
}
