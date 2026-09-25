# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: functional\practicesoftwaretesting\TC4_SearchWishlist.spec.ts >> TC-4: Product Search, Sorting & Wishlist Functionality >> TC-4: Product Search, Sorting & Wishlist Functionality
- Location: src\tests\functional\practicesoftwaretesting\TC4_SearchWishlist.spec.ts:39:7

# Error details

```
Error: page.goto: net::ERR_ABORTED at https://practicesoftwaretesting.com/
Call log:
  - navigating to "https://practicesoftwaretesting.com/", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=f3e2]:
  - generic [ref=f3e3]:
    - text: View the
    - link "Documentation" [ref=f3e4] [cursor=pointer]:
      - /url: https://testsmith-io.github.io/practice-software-testing/#/
    - text: for this application.
  - generic [ref=f3e5]:
    - generic [ref=f3e7]:
      - generic [ref=f3e8]: Practice Black Box Testing & Bug Hunting
      - button "Testing Guide" [ref=f3e9] [cursor=pointer]
      - button "🐛 Bug Hunting" [ref=f3e10] [cursor=pointer]
    - navigation [ref=f3e11]:
      - generic [ref=f3e12]:
        - link "Practice Software Testing - Toolshop" [ref=f3e13] [cursor=pointer]:
          - /url: /
        - generic [ref=f3e32]:
          - menubar "Main menu" [ref=f3e33]:
            - menuitem [ref=f3e34]:
              - link "Home" [ref=f3e35] [cursor=pointer]:
                - /url: /
            - menuitem [ref=f3e36]:
              - button "Categories" [ref=f3e37] [cursor=pointer]
            - menuitem [ref=f3e38]:
              - link "Contact" [ref=f3e39] [cursor=pointer]:
                - /url: /contact
            - menuitem [ref=f3e40]:
              - button "Jane Doe" [ref=f3e41] [cursor=pointer]
          - button "Select language" [ref=f3e43] [cursor=pointer]: EN
  - generic [ref=f3e48]:
    - heading "My account" [level=1] [ref=f3e49]
    - paragraph [ref=f3e50]: Here you can manage your profile, favorites and orders.
    - generic [ref=f3e51]:
      - button [ref=f3e52] [cursor=pointer]
      - button [ref=f3e56] [cursor=pointer]
      - button [ref=f3e60] [cursor=pointer]
      - button [ref=f3e64] [cursor=pointer]
  - contentinfo [ref=f3e69]:
    - generic [ref=f3e71]:
      - generic [ref=f3e72]: Learn & Explore
      - generic [ref=f3e73]:
        - link "Learn Test Automation Hands-on courses for Playwright, Robot Framework, APIs and more" [ref=f3e75] [cursor=pointer]:
          - /url: https://onlinecourses.testsmith.io
          - generic [ref=f3e78]:
            - generic [ref=f3e79]: Learn Test Automation
            - text: Hands-on courses for Playwright, Robot Framework, APIs and more
        - link "API Spector Open-source API testing, mocking and contract testing" [ref=f3e81] [cursor=pointer]:
          - /url: https://api-spector.dev
          - generic [ref=f3e84]:
            - generic [ref=f3e85]: API Spector
            - text: Open-source API testing, mocking and contract testing
        - link "GitHub Source code, issues and contributions" [ref=f3e87] [cursor=pointer]:
          - /url: https://github.com/testsmith-io/practice-software-testing
          - generic [ref=f3e90]:
            - generic [ref=f3e91]: GitHub
            - text: Source code, issues and contributions
    - generic [ref=f3e92]:
      - generic [ref=f3e93]:
        - text: This is a DEMO application, used for software testing training purpose. |
        - link "Privacy Policy" [ref=f3e94] [cursor=pointer]:
          - /url: /privacy
        - text: "| Banner photo by"
        - link "Barn Images" [ref=f3e95] [cursor=pointer]:
          - /url: https://unsplash.com/@barnimages
        - text: "on"
        - link "Unsplash" [ref=f3e96] [cursor=pointer]:
          - /url: https://unsplash.com/photos/t5YUoHW6zRo
        - text: .
      - generic [ref=f3e97]: v2.5 | Built 2026-09-09 | Angular 20.0.5
  - button "Open chat" [ref=f3e99] [cursor=pointer]
  - button "Show live shop activity" [ref=f3e103] [cursor=pointer]
```

# Test source

```ts
  1  | /**
  2  |  * BasePage — playwright-typescript framework
  3  |  *
  4  |  * Abstract base class for all Page Object Model classes.
  5  |  * Wraps Playwright Page, providing smart locator helpers that
  6  |  * comply with the AETHER playwright-typescript compliance rules
  7  |  * (PT-005, PT-006 — no raw waitForTimeout, all ops awaited).
  8  |  *
  9  |  * Traceability:
  10 |  *   Framework: playwright-typescript
  11 |  *   Rule refs:  PT-004, PT-005, PT-006, PT-008
  12 |  */
  13 | 
  14 | import { Page, Locator } from '@playwright/test';
  15 | 
  16 | export abstract class BasePage {
  17 |   protected readonly page: Page;
  18 | 
  19 |   constructor(page: Page) {
  20 |     this.page = page;
  21 |   }
  22 | 
  23 |   // ── Locator factory ─────────────────────────────────────────────────────────
  24 | 
  25 |   protected locator(selector: string): Locator {
  26 |     return this.page.locator(selector);
  27 |   }
  28 | 
  29 |   protected getByTestId(testId: string): Locator {
  30 |     return this.page.getByTestId(testId);
  31 |   }
  32 | 
  33 |   protected getByRole(role: Parameters<Page['getByRole']>[0], options?: Parameters<Page['getByRole']>[1]): Locator {
  34 |     return this.page.getByRole(role, options);
  35 |   }
  36 | 
  37 |   protected getByText(text: string): Locator {
  38 |     return this.page.getByText(text);
  39 |   }
  40 | 
  41 |   // ── Wait helpers (compliant: no waitForTimeout) ──────────────────────────────
  42 | 
  43 |   protected async waitForVisible(locator: Locator, timeoutMs = 10_000): Promise<void> {
  44 |     await locator.waitFor({ state: 'visible', timeout: timeoutMs });
  45 |   }
  46 | 
  47 |   protected async waitForHidden(locator: Locator, timeoutMs = 15_000): Promise<void> {
  48 |     await locator.waitFor({ state: 'hidden', timeout: timeoutMs });
  49 |   }
  50 | 
  51 |   protected async waitForAttached(locator: Locator, timeoutMs = 10_000): Promise<void> {
  52 |     await locator.waitFor({ state: 'attached', timeout: timeoutMs });
  53 |   }
  54 | 
  55 |   // ── Interaction helpers ──────────────────────────────────────────────────────
  56 | 
  57 |   protected async clickWhenReady(locator: Locator): Promise<void> {
  58 |     await this.waitForVisible(locator);
  59 |     await locator.click();
  60 |   }
  61 | 
  62 |   protected async fillField(locator: Locator, value: string): Promise<void> {
  63 |     await this.waitForVisible(locator);
  64 |     await locator.clear();
  65 |     await locator.fill(value);
  66 |   }
  67 | 
  68 |   protected async getText(locator: Locator): Promise<string> {
  69 |     await this.waitForVisible(locator);
  70 |     return (await locator.textContent()) ?? '';
  71 |   }
  72 | 
  73 |   protected async isChecked(locator: Locator): Promise<boolean> {
  74 |     await this.waitForAttached(locator);
  75 |     return locator.isChecked();
  76 |   }
  77 | 
  78 |   // ── Navigation ──────────────────────────────────────────────────────────────
  79 | 
  80 |   async navigateTo(path: string): Promise<void> {
  81 |     const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
> 82 |     await this.page.goto(`${baseUrl}${path}`);
     |                     ^ Error: page.goto: net::ERR_ABORTED at https://practicesoftwaretesting.com/
  83 |   }
  84 | 
  85 |   async getCurrentUrl(): Promise<string> {
  86 |     return this.page.url();
  87 |   }
  88 | 
  89 |   // ── Abstract contract ────────────────────────────────────────────────────────
  90 | 
  91 |   /**
  92 |    * Validates that the page is fully loaded and the expected key element is visible.
  93 |    * Every Page Object MUST implement this method (mirrors LoadablePage.validate()).
  94 |    */
  95 |   abstract validate(): Promise<boolean>;
  96 | }
  97 | 
```