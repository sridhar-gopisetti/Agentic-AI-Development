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
    this.pageHeader    = this.page.locator('h1, h2').first();
    this.firstNameField = this.page.locator('[data-test="first-name"]');
    this.lastNameField  = this.page.locator('[data-test="last-name"]');
    this.addressField  = this.page.locator('[data-test="address"]');
    this.cityField     = this.page.locator('[data-test="city"]');
    this.phoneField    = this.page.locator('[data-test="phone"]');
    this.postcodeField = this.page.locator('[data-test="postcode"]');
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

  getAddressLocator(): Locator  { return this.addressField; }
  getCityLocator(): Locator     { return this.cityField; }
  getPhoneLocator(): Locator    { return this.phoneField; }
  getPostcodeLocator(): Locator { return this.postcodeField; }
  getPageHeaderLocator(): Locator { return this.pageHeader; }
}
