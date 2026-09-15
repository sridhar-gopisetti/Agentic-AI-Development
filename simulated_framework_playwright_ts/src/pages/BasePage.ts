/**
 * BasePage — playwright-typescript framework
 *
 * Abstract base class for all Page Object Model classes.
 * Wraps Playwright Page, providing smart locator helpers that
 * comply with the AETHER playwright-typescript compliance rules
 * (PT-005, PT-006 — no raw waitForTimeout, all ops awaited).
 *
 * Traceability:
 *   Framework: playwright-typescript
 *   Rule refs:  PT-004, PT-005, PT-006, PT-008
 */

import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // ── Locator factory ─────────────────────────────────────────────────────────

  protected locator(selector: string): Locator {
    return this.page.locator(selector);
  }

  protected getByTestId(testId: string): Locator {
    return this.page.getByTestId(testId);
  }

  protected getByRole(role: Parameters<Page['getByRole']>[0], options?: Parameters<Page['getByRole']>[1]): Locator {
    return this.page.getByRole(role, options);
  }

  protected getByText(text: string): Locator {
    return this.page.getByText(text);
  }

  // ── Wait helpers (compliant: no waitForTimeout) ──────────────────────────────

  protected async waitForVisible(locator: Locator, timeoutMs = 10_000): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout: timeoutMs });
  }

  protected async waitForHidden(locator: Locator, timeoutMs = 15_000): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout: timeoutMs });
  }

  protected async waitForAttached(locator: Locator, timeoutMs = 10_000): Promise<void> {
    await locator.waitFor({ state: 'attached', timeout: timeoutMs });
  }

  // ── Interaction helpers ──────────────────────────────────────────────────────

  protected async clickWhenReady(locator: Locator): Promise<void> {
    await this.waitForVisible(locator);
    await locator.click();
  }

  protected async fillField(locator: Locator, value: string): Promise<void> {
    await this.waitForVisible(locator);
    await locator.clear();
    await locator.fill(value);
  }

  protected async getText(locator: Locator): Promise<string> {
    await this.waitForVisible(locator);
    return (await locator.textContent()) ?? '';
  }

  protected async isChecked(locator: Locator): Promise<boolean> {
    await this.waitForAttached(locator);
    return locator.isChecked();
  }

  // ── Navigation ──────────────────────────────────────────────────────────────

  async navigateTo(path: string): Promise<void> {
    const baseUrl = process.env.BASE_URL ?? 'http://localhost:3000';
    await this.page.goto(`${baseUrl}${path}`);
  }

  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  // ── Abstract contract ────────────────────────────────────────────────────────

  /**
   * Validates that the page is fully loaded and the expected key element is visible.
   * Every Page Object MUST implement this method (mirrors LoadablePage.validate()).
   */
  abstract validate(): Promise<boolean>;
}
