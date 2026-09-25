# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: functional\practicesoftwaretesting\TC3_ContactForm.spec.ts >> TC-3: Contact Form Customer Support Attachment Flow (Bug Trigger) >> TC-3: Contact Form Customer Support Attachment Flow (Bug Trigger)
- Location: src\tests\functional\practicesoftwaretesting\TC3_ContactForm.spec.ts:46:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.alert-success')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" locator('.alert-success') with timeout 5000ms
  - waiting for locator('.alert-success')

```

```yaml
- text: View the
- link "Documentation":
  - /url: https://testsmith-io.github.io/practice-software-testing/#/
- text: for this application. Practice Black Box Testing & Bug Hunting
- button "Testing Guide"
- button "🐛 Bug Hunting"
- navigation:
  - link "Practice Software Testing - Toolshop":
    - /url: /
    - img
  - menubar "Main menu":
    - menuitem "Home":
      - link "Home":
        - /url: /
    - menuitem "Categories":
      - button "Categories"
    - menuitem "Contact":
      - link "Contact":
        - /url: /contact
    - menuitem "Sign in":
      - link "Sign in":
        - /url: /auth/login
  - button "Select language": EN
- heading "Contact" [level=3]
- text: First name
- textbox "First name":
  - /placeholder: Your first name *
  - text: QA Tester
- text: Last name
- textbox "Last name":
  - /placeholder: Your last name *
- alert: Last name is required
- text: Email address
- textbox "Email address":
  - /placeholder: Your email *
  - text: qa.tester@example.com
- text: Subject
- combobox "Subject":
  - option "Customer service" [selected]
  - option "Webmaster"
  - option "Return"
  - option "Payments"
  - option "Warranty"
  - option "Status of my order"
- text: Message *
- textbox "Message *": This is a diagnostic support request with attachment for defect detection testing.
- text: Attachment
- button "Attachment"
- text: Only files with the
- strong: txt
- text: extension are allowed, and files must be 0kb.
- alert: File should be empty.
- button "Send"
- contentinfo:
  - text: Learn & Explore
  - link "Learn Test Automation Hands-on courses for Playwright, Robot Framework, APIs and more":
    - /url: https://onlinecourses.testsmith.io
  - link "API Spector Open-source API testing, mocking and contract testing":
    - /url: https://api-spector.dev
  - link "GitHub Source code, issues and contributions":
    - /url: https://github.com/testsmith-io/practice-software-testing
  - text: This is a DEMO application, used for software testing training purpose. |
  - link "Privacy Policy":
    - /url: /privacy
  - text: "| Banner photo by"
  - link "Barn Images":
    - /url: https://unsplash.com/@barnimages
  - text: "on"
  - link "Unsplash":
    - /url: https://unsplash.com/photos/t5YUoHW6zRo
  - text: . v2.5 | Built 2026-09-09 | Angular 20.0.5
- button "Open chat":
  - img
- button "Show live shop activity"
```

# Test source

```ts
  1  | /**
  2  |  * TC3_ContactForm.spec.ts
  3  |  * ACG-RUN-20260801-007 — playwright-typescript
  4  |  *
  5  |  * Test Case 3: Contact Form Customer Support Attachment Flow (Bug Trigger)
  6  |  * Requirement: REQ-PST-003
  7  |  * AUT: https://practicesoftwaretesting.com
  8  |  *
  9  |  * INTENTIONAL DEFECT NOTE:
  10 |  *   TC-3 Step 5 (Step 500) is a documented CRITICAL DEMO TRAP.
  11 |  *   The contact form submission is expected to FAIL — the confirmation
  12 |  *   message never appears (form hangs or parser lag). The test assertion
  13 |  *   at Step 500 WILL FAIL. This is the intended behaviour — the failure
  14 |  *   is the defect evidence for MEGA-47.
  15 |  *   DO NOT suppress, skip, or soft-assert this step.
  16 |  *
  17 |  * Traceability:
  18 |  *   Requirement:  REQ-PST-003
  19 |  *   Framework:    playwright-typescript v1.1.0
  20 |  *   DNA:          PT-TS-1.1.0-POM-FIXTURE-STRICT
  21 |  *   Rule refs:    PT-001, PT-002, PT-003, PT-004, PT-005, PT-006, PT-007, PT-008
  22 |  *                 UNI-001, UNI-002, UNI-003, UNI-004, UNI-005
  23 |  */
  24 | 
  25 | import { test, expect } from '../../../fixtures';
  26 | import * as path from 'path';
  27 | 
  28 | // ── Test Data ─────────────────────────────────────────────────────────────────
  29 | const attachmentPath = path.resolve(__dirname, '../../../fixtures/test_log.txt');
  30 | 
  31 | // ── Test Suite ─────────────────────────────────────────────────────────────────
  32 | test.describe('TC-3: Contact Form Customer Support Attachment Flow (Bug Trigger)', () => {
  33 | 
  34 |   test.beforeEach(async ({ page }) => {
  35 |     // Pre-condition: User is on the homepage
  36 |     await page.goto(process.env.BASE_URL ?? 'https://practicesoftwaretesting.com');
  37 |   });
  38 | 
  39 |   test.afterEach(async ({ page }, testInfo) => {
  40 |     // Traceability: TEARDOWN
  41 |     if (testInfo.status !== testInfo.expectedStatus) {
  42 |       await page.screenshot({ path: testInfo.outputPath('screenshot-on-failure.png') });
  43 |     }
  44 |   });
  45 | 
  46 |   test('TC-3: Contact Form Customer Support Attachment Flow (Bug Trigger)', async ({
  47 |     page,
  48 |     contactPage,
  49 |   }) => {
  50 | 
  51 |     await test.step('Step 100 — Click Contact in top navigation menu', async () => {
  52 |       // Traceability: REQ-PST-003-TC3-STEP100
  53 |       // FIX-002-TEW-009 (FIARA): Firefox click on nav-contact timed out at 120s waiting for
  54 |       // Angular router navigation to complete — element was actionable but post-click nav
  55 |       // stalled on live PST AUT. { force: true } bypasses the post-click navigation wait,
  56 |       // same pattern as FIX-002-TEW-008 for login-submit. MEGA-47 remains the terminal failure.
  57 |       await page.locator('[data-test="nav-contact"]').click({ force: true });
  58 |       const loaded = await contactPage.validate();
  59 |       expect(loaded).toBe(true);
  60 |       await expect(page).toHaveURL(/contact/);
  61 |     });
  62 | 
  63 |     await test.step('Step 200 — Select Customer Service from Subject dropdown', async () => {
  64 |       // Traceability: REQ-PST-003-TC3-STEP200
  65 |       await contactPage.selectSubject('Customer Service');
  66 |       await expect(contactPage.getSendButtonLocator()).toBeVisible();
  67 |     });
  68 | 
  69 |     await test.step('Step 300 — Fill Name, Email, and Message fields', async () => {
  70 |       // Traceability: REQ-PST-003-TC3-STEP300
  71 |       await contactPage.fillName('QA Tester');
  72 |       await contactPage.fillEmail('qa.tester@example.com');
  73 |       await contactPage.fillMessage('This is a diagnostic support request with attachment for defect detection testing.');
  74 |     });
  75 | 
  76 |     await test.step('Step 400 — Attach test log file', async () => {
  77 |       // Traceability: REQ-PST-003-TC3-STEP400
  78 |       await contactPage.attachFile(attachmentPath);
  79 |       await expect(contactPage.getSendButtonLocator()).toBeVisible();
  80 |     });
  81 | 
  82 |     await test.step('Step 500 — Click Send and assert confirmation message (INTENTIONAL DEFECT)', async () => {
  83 |       // Traceability: REQ-PST-003-TC3-STEP500
  84 |       // INTENTIONAL DEFECT: This assertion WILL FAIL — form submission hangs (MEGA-47).
  85 |       // The failure is the expected defect-detection outcome. Do not modify.
  86 |       await contactPage.clickSend();
> 87 |       await expect(contactPage.getConfirmationLocator()).toBeVisible({ timeout: 5_000 });
     |                                                          ^ Error: expect(locator).toBeVisible() failed
  88 |     });
  89 | 
  90 |   });
  91 | 
  92 | });
  93 | 
```