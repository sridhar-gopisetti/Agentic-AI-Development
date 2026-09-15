/**
 * CustomerProfilePage — playwright-typescript framework
 *
 * Page Object for the Customer Profile page.
 * Requirement: REQ-UC013C-001
 *
 * Traceability:
 *   Requirement: REQ-UC013C-001
 *   Test Case:   UC013C-B01-01
 *   Framework:   playwright-typescript
 *   Rule refs:   PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class CustomerProfilePage extends BasePage {
  // ── Locators ─────────────────────────────────────────────────────────────────
  private readonly pageHeader: Locator;
  private readonly loadingSpinner: Locator;

  // Customer Information
  private readonly customerName: Locator;
  private readonly customerType: Locator;
  private readonly location: Locator;

  // Contact Information
  private readonly mainPhone: Locator;
  private readonly faxNumber: Locator;
  private readonly emailAddress: Locator;
  private readonly mainContactPerson: Locator;

  // Preferences
  private readonly language: Locator;
  private readonly timeZone: Locator;

  // Status Flags
  private readonly testClinicFlag: Locator;
  private readonly merlinOnDemandFlag: Locator;

  // Secure Communication Controls
  private readonly directAlertSecureComm: Locator;
  private readonly contactColleagueSecureComm: Locator;
  private readonly unpairedTransmitterSecureComm: Locator;
  private readonly allMessagesSecureComm: Locator;

  constructor(page: Page) {
    super(page);

    this.pageHeader    = this.page.locator("h1:has-text('Customer Profile')");
    this.loadingSpinner = this.page.locator('div.loading-spinner');

    this.customerName       = this.page.locator('#customerName');
    this.customerType       = this.page.locator('#customerType');
    this.location           = this.page.locator('#location');

    this.mainPhone          = this.page.locator('#mainPhone');
    this.faxNumber          = this.page.locator('#faxNumber');
    this.emailAddress       = this.page.locator('#emailAddress');
    this.mainContactPerson  = this.page.locator('#mainContactPerson');

    this.language           = this.page.locator('#language');
    this.timeZone           = this.page.locator('#timeZone');

    this.testClinicFlag     = this.page.locator('#testClinicFlag');
    this.merlinOnDemandFlag = this.page.locator('#merlinOnDemandFlag');

    this.directAlertSecureComm         = this.page.locator('#directAlertSecureComm');
    this.contactColleagueSecureComm    = this.page.locator('#contactColleagueSecureComm');
    this.unpairedTransmitterSecureComm = this.page.locator('#unpairedTransmitterSecureComm');
    this.allMessagesSecureComm         = this.page.locator('#allMessagesSecureComm');
  }

  // ── Validation ───────────────────────────────────────────────────────────────

  /**
   * Validates that the Customer Profile page has fully loaded.
   * Waits for the loading spinner to disappear, then checks the header.
   */
  async validate(): Promise<boolean> {
    try {
      await this.waitForHidden(this.loadingSpinner);
      await this.waitForVisible(this.pageHeader);
      return true;
    } catch {
      return false;
    }
  }

  // ── Customer Information getters ─────────────────────────────────────────────

  async getCustomerName(): Promise<string> {
    return this.getText(this.customerName);
  }

  async getCustomerType(): Promise<string> {
    return this.getText(this.customerType);
  }

  async getLocation(): Promise<string> {
    return this.getText(this.location);
  }

  // ── Contact Information getters ──────────────────────────────────────────────

  async getMainPhone(): Promise<string> {
    return this.getText(this.mainPhone);
  }

  async getFaxNumber(): Promise<string> {
    return this.getText(this.faxNumber);
  }

  async getEmailAddress(): Promise<string> {
    return this.getText(this.emailAddress);
  }

  async getMainContactPerson(): Promise<string> {
    return this.getText(this.mainContactPerson);
  }

  // ── Preference getters ───────────────────────────────────────────────────────

  async getLanguage(): Promise<string> {
    return this.getText(this.language);
  }

  async getTimeZone(): Promise<string> {
    return this.getText(this.timeZone);
  }

  // ── Status Flag verifiers ────────────────────────────────────────────────────

  async isTestClinicFlagDisplayed(): Promise<boolean> {
    try {
      await this.waitForVisible(this.testClinicFlag);
      return true;
    } catch {
      return false;
    }
  }

  async isMerlinOnDemandFlagDisplayed(): Promise<boolean> {
    try {
      await this.waitForVisible(this.merlinOnDemandFlag);
      return true;
    } catch {
      return false;
    }
  }

  // ── Secure Communication verifiers ──────────────────────────────────────────

  async isDirectAlertSecureCommEnabled(): Promise<boolean> {
    return this.isChecked(this.directAlertSecureComm);
  }

  async isContactColleagueSecureCommEnabled(): Promise<boolean> {
    return this.isChecked(this.contactColleagueSecureComm);
  }

  async isUnpairedTransmitterSecureCommEnabled(): Promise<boolean> {
    return this.isChecked(this.unpairedTransmitterSecureComm);
  }

  async isAllMessagesSecureCommEnabled(): Promise<boolean> {
    return this.isChecked(this.allMessagesSecureComm);
  }

  // ── Locator accessors for direct assertions ──────────────────────────────────

  getPageHeaderLocator(): Locator { return this.pageHeader; }
  getCustomerNameLocator(): Locator { return this.customerName; }
  getCustomerTypeLocator(): Locator { return this.customerType; }
  getLocationLocator(): Locator { return this.location; }
  getEmailAddressLocator(): Locator { return this.emailAddress; }
  getLanguageLocator(): Locator { return this.language; }
  getTimeZoneLocator(): Locator { return this.timeZone; }
}
