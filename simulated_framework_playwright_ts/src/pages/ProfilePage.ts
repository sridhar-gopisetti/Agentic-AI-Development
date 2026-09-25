/**
 * ProfilePage — playwright-typescript framework
 *
 * Page Object for the PracticeSoftwareTesting.com User Profile page.
 * Handles: profile field verification for persistence test.
 *
 * Traceability:
 *   Requirement: REQ-PST-002
 *   Framework:   playwright-typescript
 *   Rule refs:   PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProfilePage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly pageHeader: Locator;
  private readonly firstNameField: Locator;
  private readonly lastNameField: Locator;
  private readonly addressField: Locator;
  private readonly cityField: Locator;
  private readonly phoneField: Locator;
  private readonly postcodeField: Locator;

  constructor(page: Page) {
    super(page);
    // FIX-TEW-TC2: PST AUT v5.0 profile page uses label-bound textboxes, not data-test attrs.
    this.pageHeader     = this.page.locator('h1, h2, h3').first();
    this.firstNameField = this.page.getByLabel('First name');
    this.lastNameField  = this.page.getByLabel('Last name');
    this.addressField   = this.page.getByLabel('Street');
    this.cityField      = this.page.getByLabel('City');
    this.phoneField     = this.page.getByLabel('Phone');
    this.postcodeField  = this.page.getByLabel('Postal code');
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.firstNameField);
      return true;
    } catch {
      return false;
    }
  }

  // ── Getters / Assertions ──────────────────────────────────────────────────────

  async getAddress(): Promise<string>  { return this.getText(this.addressField); }
  async getCity(): Promise<string>     { return this.getText(this.cityField); }
  async getPhone(): Promise<string>    { return this.getText(this.phoneField); }
  async getPostcode(): Promise<string> { return this.getText(this.postcodeField); }

  getFirstNameLocator(): Locator  { return this.firstNameField; }
  getAddressLocator(): Locator  { return this.addressField; }
  getCityLocator(): Locator     { return this.cityField; }
  getPhoneLocator(): Locator    { return this.phoneField; }
  getPostcodeLocator(): Locator { return this.postcodeField; }
  getPageHeaderLocator(): Locator { return this.pageHeader; }
}
