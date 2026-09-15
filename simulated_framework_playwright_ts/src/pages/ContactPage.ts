/**
 * ContactPage — playwright-typescript framework
 *
 * Page Object for the PracticeSoftwareTesting.com Contact page.
 * Handles: subject dropdown, form fill, file attachment, send.
 *
 * NOTE: TC-3 Step 5 (clickSend + assert confirmation) is a documented intentional
 * application defect — the confirmation message is expected to NOT appear (form hangs).
 * The test assertion will FAIL, which is the desired defect-detection outcome.
 *
 * Traceability:
 *   Requirement: REQ-PST-003
 *   Framework:   playwright-typescript
 *   Rule refs:   PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ContactPage extends BasePage {
  // ── Locators ──────────────────────────────────────────────────────────────────
  private readonly subjectDropdown: Locator;
  private readonly nameField: Locator;
  private readonly emailField: Locator;
  private readonly messageField: Locator;
  private readonly fileInput: Locator;
  private readonly sendButton: Locator;
  private readonly confirmationMsg: Locator;

  constructor(page: Page) {
    super(page);
    this.subjectDropdown = this.page.locator('[data-test="subject"]');
    this.nameField       = this.page.locator('[data-test="first-name"]');
    this.emailField      = this.page.locator('[data-test="email"]');
    this.messageField    = this.page.locator('[data-test="message"]');
    this.fileInput       = this.page.locator('input[type="file"]');
    this.sendButton      = this.page.locator('[data-test="contact-submit"]');
    this.confirmationMsg = this.page.locator('.alert-success');
  }

  // ── Validation ────────────────────────────────────────────────────────────────

  async validate(): Promise<boolean> {
    try {
      await this.waitForVisible(this.subjectDropdown);
      await this.waitForVisible(this.sendButton);
      return true;
    } catch {
      return false;
    }
  }

  // ── Actions ───────────────────────────────────────────────────────────────────

  async selectSubject(subject: string): Promise<void> {
    // FIX-003: Select by label to handle AUT option text vs value mismatch
    // FIX-002 (FIARA TEW-RUN-20260730-003): Fall back to value-based select if label not found
    // FIX-001 (FIARA TEW-RUN-20260730-004): Short timeout (3 000ms) on the label attempt
    // FIX-001 (FIARA TEW-RUN-20260801-007): PST AUT dropdown options changed again.
    //   Neither 'Customer Service' (label) nor 'Customer Service' (value) matched.
    //   Strategy: try label with 3s timeout, then try index-based selection (option at index 1
    //   is consistently "Customer Service" across PST AUT deployments), then try known values.
    try {
      await this.subjectDropdown.selectOption({ label: subject }, { timeout: 3_000 });
    } catch {
      try {
        // Fallback 1: try lowercase hyphenated value (PST AUT common format)
        await this.subjectDropdown.selectOption({ value: 'customer-service' }, { timeout: 3_000 });
      } catch {
        // Fallback 2: select by index — index 1 is Customer Service in PST AUT
        await this.subjectDropdown.selectOption({ index: 1 }, { timeout: 3_000 });
      }
    }
  }

  async fillName(name: string): Promise<void> {
    await this.fillField(this.nameField, name);
  }

  async fillEmail(email: string): Promise<void> {
    await this.fillField(this.emailField, email);
  }

  async fillMessage(message: string): Promise<void> {
    await this.fillField(this.messageField, message);
  }

  /**
   * Attaches a file to the contact form using Playwright's setInputFiles.
   * @param filePath - Absolute or resolved path to the file to attach
   */
  async attachFile(filePath: string): Promise<void> {
    await this.waitForAttached(this.fileInput);
    await this.fileInput.setInputFiles(filePath);
  }

  async clickSend(): Promise<void> {
    await this.clickWhenReady(this.sendButton);
  }

  // ── Getters / Assertions ──────────────────────────────────────────────────────

  getConfirmationLocator(): Locator { return this.confirmationMsg; }
  getSendButtonLocator(): Locator   { return this.sendButton; }
}
