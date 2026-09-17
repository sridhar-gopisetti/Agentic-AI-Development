package com.aether.framework.core;

import com.microsoft.playwright.*;
// T2.3 — WaitForSelectorState lives in the `options` sub-package, and a `*` import of
// `com.microsoft.playwright` does not reach into it. Without this line the three
// waitFor* helpers below fail to compile with "cannot find symbol", which is six of the
// project's six compile errors.
//
// Nothing had noticed because until Phase 2 nothing in AETHER ever ran `mvn` against this
// tree: svc-tew's image carried no toolchain, so TEEA returned SKIPPED without attempting
// a build. Found by the first real execution through svc-runner. See ADR §6.29 and the
// note in pom.xml, which had to change for the same reason.
import com.microsoft.playwright.options.WaitForSelectorState;

import java.time.Duration;

/**
 * BasePage — abstract base for all Playwright-Java Page Object classes.
 *
 * Provides:
 *  - Smart waits (no Thread.sleep)
 *  - Safe element interactions (fill, click, getText, isVisible)
 *  - Navigation helpers
 *  - A mandatory validate() contract
 *
 * Rule compliance:
 *   PJ-004  Page Object Model — every page extends BasePage
 *   PJ-005  Locators expressed as CSS strings / getByRole / getByTestId
 *   PJ-006  Explicit waits via Playwright's built-in auto-waiting
 *   PJ-008  validate() must be implemented in every page
 */
public abstract class BasePage {

    protected final Page page;
    protected final int  timeoutMs;

    protected BasePage(Page page) {
        this.page      = page;
        this.timeoutMs = ConfigReader.getExplicitWait() * 1_000;
    }

    // ── Contract ─────────────────────────────────────────────────────────────

    /**
     * Confirms the page is fully loaded and its key identifier element is visible.
     * @return true if valid, false otherwise
     */
    public abstract boolean validate();

    // ── Wait helpers ─────────────────────────────────────────────────────────

    /** Waits for a locator to be visible. */
    protected Locator waitForVisible(Locator locator) {
        locator.waitFor(new Locator.WaitForOptions()
                .setState(WaitForSelectorState.VISIBLE)
                .setTimeout(timeoutMs));
        return locator;
    }

    /** Waits up to the given timeout ms for a locator to be visible. */
    protected Locator waitForVisible(Locator locator, int customTimeoutMs) {
        locator.waitFor(new Locator.WaitForOptions()
                .setState(WaitForSelectorState.VISIBLE)
                .setTimeout(customTimeoutMs));
        return locator;
    }

    /** Waits for a locator to be hidden. */
    protected void waitForHidden(Locator locator) {
        locator.waitFor(new Locator.WaitForOptions()
                .setState(WaitForSelectorState.HIDDEN)
                .setTimeout(timeoutMs));
    }

    /** Returns true if the locator is currently visible without waiting. */
    protected boolean isVisible(Locator locator) {
        try {
            return locator.isVisible();
        } catch (PlaywrightException e) {
            return false;
        }
    }

    // ── Interaction helpers ───────────────────────────────────────────────────

    /**
     * Clears then fills the field with text.
     * Playwright's fill() replaces the entire value atomically.
     */
    protected void fillField(Locator locator, String text) {
        waitForVisible(locator);
        locator.fill(text);
    }

    /**
     * Waits for the element to be enabled then clicks it.
     */
    protected void clickWhenReady(Locator locator) {
        waitForVisible(locator);
        locator.click();
    }

    /**
     * Returns the trimmed text content of the element.
     */
    protected String getText(Locator locator) {
        waitForVisible(locator);
        return locator.textContent().trim();
    }

    /**
     * Returns the trimmed input value of a form field.
     */
    protected String getValue(Locator locator) {
        waitForVisible(locator);
        return locator.inputValue().trim();
    }

    // ── Navigation ────────────────────────────────────────────────────────────

    /**
     * Navigates to the given path relative to the configured base URL.
     */
    protected void navigateTo(String path) {
        page.navigate(ConfigReader.getBaseUrl() + path);
    }

    /**
     * Returns the current page URL.
     */
    public String getCurrentUrl() {
        return page.url();
    }
}
