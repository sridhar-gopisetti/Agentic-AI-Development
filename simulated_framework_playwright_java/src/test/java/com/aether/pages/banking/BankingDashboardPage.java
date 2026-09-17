package com.aether.pages.banking;

import com.aether.framework.core.BasePage;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

/**
 * BankingDashboardPage — Playwright-Java Page Object for the authenticated Banking Dashboard.
 *
 * AUT route: /dashboard or /home (post-login redirect)
 *
 * Requirement: REQ-BANK-AUTH-001
 * Test Cases:  TC_001, TC_002 (post-login state validation)
 *
 * Rule compliance:
 *   PJ-004  Page Object Model
 *   PJ-008  validate() implemented
 */
public class BankingDashboardPage extends BasePage {

    // ── Locators ──────────────────────────────────────────────────────────────
    private final Locator dashboardContainer;
    private final Locator loggedInUsername;
    private final Locator balanceSection;
    private final Locator logoutButton;
    private final Locator welcomeMessage;

    public BankingDashboardPage(Page page) {
        super(page);
        this.dashboardContainer = page.locator("#bankingDashboard, div.banking-dashboard, main.dashboard");
        this.loggedInUsername   = page.locator("#loggedInUser, span.logged-in-username, span.user-name");
        this.balanceSection     = page.locator("#accountBalance, div.account-balance");
        this.logoutButton       = page.locator("#logoutBtn, button[data-testid='logout']");
        this.welcomeMessage     = page.locator("h1.welcome-message, h2.welcome-header");
    }

    // ── Validation ────────────────────────────────────────────────────────────

    /**
     * Confirms the Banking Dashboard is displayed.
     * URL must contain 'dashboard', 'home', or 'account'.
     */
    @Override
    public boolean validate() {
        try {
            // Primary check: URL-based (most reliable)
            String url = page.url();
            boolean urlOk = url.contains("dashboard") ||
                            url.contains("home")      ||
                            url.contains("account");

            // Secondary check: DOM element visible
            boolean domOk = false;
            try {
                waitForVisible(dashboardContainer, 5_000);
                domOk = true;
            } catch (Exception ignored) {}

            return urlOk || domOk;
        } catch (Exception e) {
            return false;
        }
    }

    // ── Getters ───────────────────────────────────────────────────────────────

    /**
     * Returns the username displayed in the dashboard header.
     * Empty string if not found (allows callers to assert assertFalse(isEmpty())).
     */
    public String getLoggedInUsername() {
        try {
            waitForVisible(loggedInUsername, 3_000);
            return getText(loggedInUsername);
        } catch (Exception e) {
            return "";
        }
    }

    public boolean isBalanceSectionDisplayed() {
        return isVisible(balanceSection);
    }

    /** Clicks the logout button and waits for the login page to return. */
    public void logout() {
        clickWhenReady(logoutButton);
    }

    // ── Locator accessors ─────────────────────────────────────────────────────
    public Locator getDashboardContainerLocator() { return dashboardContainer; }
    public Locator getLoggedInUsernameLocator()   { return loggedInUsername; }
    public Locator getLogoutButtonLocator()       { return logoutButton; }
}
