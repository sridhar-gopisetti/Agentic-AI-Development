/**
 * TC3_ContactForm.spec.ts
 * ACG-RUN-20260801-007 — playwright-typescript
 *
 * Test Case 3: Contact Form Customer Support Attachment Flow (Bug Trigger)
 * Requirement: REQ-PST-003
 * AUT: https://practicesoftwaretesting.com
 *
 * INTENTIONAL DEFECT NOTE:
 *   TC-3 Step 5 (Step 500) is a documented CRITICAL DEMO TRAP.
 *   The contact form submission is expected to FAIL — the confirmation
 *   message never appears (form hangs or parser lag). The test assertion
 *   at Step 500 WILL FAIL. This is the intended behaviour — the failure
 *   is the defect evidence for MEGA-47.
 *   DO NOT suppress, skip, or soft-assert this step.
 *
 * Traceability:
 *   Requirement:  REQ-PST-003
 *   Framework:    playwright-typescript v1.1.0
 *   DNA:          PT-TS-1.1.0-POM-FIXTURE-STRICT
 *   Rule refs:    PT-001, PT-002, PT-003, PT-004, PT-005, PT-006, PT-007, PT-008
 *                 UNI-001, UNI-002, UNI-003, UNI-004, UNI-005
 */

import { test, expect } from '../../../fixtures';
import * as path from 'path';

// ── Test Data ─────────────────────────────────────────────────────────────────
const attachmentPath = path.resolve(__dirname, '../../../fixtures/test_log.txt');

// ── Test Suite ─────────────────────────────────────────────────────────────────
test.describe('TC-3: Contact Form Customer Support Attachment Flow (Bug Trigger)', () => {

  test.beforeEach(async ({ page }) => {
    // Pre-condition: User is on the homepage
    await page.goto(process.env.BASE_URL ?? 'https://practicesoftwaretesting.com');
  });

  test.afterEach(async ({ page }, testInfo) => {
    // Traceability: TEARDOWN
    if (testInfo.status !== testInfo.expectedStatus) {
      await page.screenshot({ path: testInfo.outputPath('screenshot-on-failure.png') });
    }
  });

  test('TC-3: Contact Form Customer Support Attachment Flow (Bug Trigger)', async ({
    page,
    contactPage,
  }) => {

    await test.step('Step 100 — Click Contact in top navigation menu', async () => {
      // Traceability: REQ-PST-003-TC3-STEP100
      await page.locator('[data-test="nav-contact"]').click();
      const loaded = await contactPage.validate();
      expect(loaded).toBe(true);
      await expect(page).toHaveURL(/contact/);
    });

    await test.step('Step 200 — Select Customer Service from Subject dropdown', async () => {
      // Traceability: REQ-PST-003-TC3-STEP200
      await contactPage.selectSubject('Customer Service');
      await expect(contactPage.getSendButtonLocator()).toBeVisible();
    });

    await test.step('Step 300 — Fill Name, Email, and Message fields', async () => {
      // Traceability: REQ-PST-003-TC3-STEP300
      await contactPage.fillName('QA Tester');
      await contactPage.fillEmail('qa.tester@example.com');
      await contactPage.fillMessage('This is a diagnostic support request with attachment for defect detection testing.');
    });

    await test.step('Step 400 — Attach test log file', async () => {
      // Traceability: REQ-PST-003-TC3-STEP400
      await contactPage.attachFile(attachmentPath);
      await expect(contactPage.getSendButtonLocator()).toBeVisible();
    });

    await test.step('Step 500 — Click Send and assert confirmation message (INTENTIONAL DEFECT)', async () => {
      // Traceability: REQ-PST-003-TC3-STEP500
      // INTENTIONAL DEFECT: This assertion WILL FAIL — form submission hangs (MEGA-47).
      // The failure is the expected defect-detection outcome. Do not modify.
      await contactPage.clickSend();
      await expect(contactPage.getConfirmationLocator()).toBeVisible({ timeout: 5_000 });
    });

  });

});
