package com.aether.pages.banking;

import com.aether.framework.core.BasePage;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

/**
 * BankingLoginPage — Playwright-Java Page Object for the Banking Login page.
 *
 * AUT route: GET / (root — banking login form)
 *
 * Locator IDs match the mock AUT HTML:
 *   #bankingUsername, #bankingPassword, #bankingLoginBtn,
 *   div.login-error-banner, #bankingUsername-error, #bankingPassword-error
 *
 * Requirement: REQ-BANK-AUTH-001
 * Test Cases:  TC_001 – TC_008 (Banking_Login_TC_1.pdf)
 *
 * Rule compliance:
 *   PJ-004  Page Object Model
 *   PJ-005  CSS / ID locators
 *   PJ-006  Explicit waits via waitForVisible()
 *   PJ-008  validate() implemented
 */
public class BankingLoginPage extends BasePage {

    // ── Locators ──────────────────────────────────────────────────────────────
    private final Locator pageTitle;
    private final Locator usernameField;
    private final Locator passwordField;
    private final Locator loginButton;
    private final Locator errorBanner;
    private final Locator usernameError;
    private final Locator passwordError;
    private final Locator otpField;
    private final Locator submitOtpButton;
    private final Locator otpPage;
    private final Locator forgotPasswordLink;
    private final Locator rememberDeviceCheckbox;
    private final Locator sessionExpiredBanner;

    public BankingLoginPage(Page page) {
        super(page);
        this.pageTitle              = page.locator("h1.banking-login-title");
        this.usernameField          = page.locator("#bankingUsername");
        this.passwordField          = page.locator("#bankingPassword");
        this.loginButton            = page.locator("#bankingLoginBtn");
        this.errorBanner            = page.locator("div.login-error-banner");
        // Inline field-level validation messages (TC_006, TC_007, TC_008)
        this.usernameError          = page.locator("#bankingUsername-error, #bankingUsername ~ span.field-error");
        this.passwordError          = page.locator("#bankingPassword-error, #bankingPassword ~ span.field-error");
        // OTP page elements (TC_002)
        this.otpField               = page.locator("#otpInput");
        this.submitOtpButton        = page.locator("#submitOtpBtn");
        // `.first()` is load-bearing. Playwright's Locator API is **strict**: `waitFor`
        // throws a strict-mode violation when the locator resolves to more than one
        // element, and on mock_aut's /otp page two of these three alternatives match
        // different elements — `div.otp-verification-page` and the `<h2>OTP
        // Verification</h2>` that `h2:has-text('OTP')` reaches. `validateOtpPage` catches
        // the exception and returns false, so TC_002 failed with "OTP verification page
        // must appear after first-factor login" while the page was on screen.
        //
        // The two fallback alternatives are kept rather than deleted: the intent is "the
        // OTP page, by any of these signals", which is right for a page object that may
        // meet more than one implementation. `.first()` keeps the intent and drops only
        // the strictness. Note the sibling locators above are *not* affected — a CSS
        // alternation that resolves to the same element counts once, which is why
        // `usernameError` works and TC_006 passed.
        //
        // Nobody had seen this: until ADR §6.27 closed, TC_002 never got past `setUp`.
        this.otpPage                = page.locator("div.otp-verification-page, h2:has-text('Verify'), h2:has-text('OTP')").first();
        this.forgotPasswordLink     = page.locator("a[data-testid='forgot-password']");
        this.rememberDeviceCheckbox = page.locator("#rememberDevice");
        this.sessionExpiredBanner   = page.locator("div.session-expired-banner");
    }

    // ── Validation ────────────────────────────────────────────────────────────

    /**
     * Validates that the Banking Login page is fully displayed.
     * Used as the @BeforeMethod pre-condition guard.
     */
    @Override
    public boolean validate() {
        try {
            waitForVisible(usernameField);
            waitForVisible(loginButton);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Validates that the OTP verification page is displayed.
     * Used as post-login pre-condition for TC_002.
     */
    public boolean validateOtpPage() {
        try {
            waitForVisible(otpPage);
            waitForVisible(otpField);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ── Actions ───────────────────────────────────────────────────────────────

    public void enterUsername(String username) {
        fillField(usernameField, username);
    }

    public boolean isSecureRedirect() { ... }


    public void enterPassword(String password) {
        fillField(passwordField, password);
    }

    public void clickLoginButton() {
        clickWhenReady(loginButton);
    }

    /** Clears the username field — used by TC_006, TC_008. */
    public void clearUsername() {
        waitForVisible(usernameField).clear();
    }

    /** Clears the password field — used by TC_007, TC_008. */
    public void clearPassword() {
        waitForVisible(passwordField).clear();
    }

    /**
     * Full single-factor login.
     */
    public void login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLoginButton();
    }

    /**
     * First-factor login for TC_002 OTP flow.
     */
    public void loginFirstFactor(String username, String password) {
        login(username, password);
    }

    /**
     * Submits OTP for two-factor login (TC_002).
     */
    public void submitOtp(String otp) {
        fillField(otpField, otp);
        clickWhenReady(submitOtpButton);
    }

    // ── Getters / Verifiers ───────────────────────────────────────────────────

    public boolean isErrorBannerDisplayed() {
        try {
            waitForVisible(errorBanner, 5_000);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getErrorBannerText() {
        return getText(errorBanner);
    }

    public boolean isUsernameErrorDisplayed() {
        return isVisible(usernameError);
    }

    public boolean isPasswordErrorDisplayed() {
        return isVisible(passwordError);
    }

    public String getUsernameErrorText() {
        try { return getText(usernameError); }
        catch (Exception e) { return ""; }
    }

    public String getPasswordErrorText() {
        try { return getText(passwordError); }
        catch (Exception e) { return ""; }
    }

    public boolean isSessionExpiredBannerVisible() {
        try {
            waitForVisible(sessionExpiredBanner, 3_000);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // ── Locator accessors ─────────────────────────────────────────────────────
    public Locator getUsernameFieldLocator()   { return usernameField; }
    public Locator getPasswordFieldLocator()   { return passwordField; }
    public Locator getLoginButtonLocator()     { return loginButton; }
    public Locator getErrorBannerLocator()     { return errorBanner; }
    public Locator getUsernameErrorLocator()   { return usernameError; }
    public Locator getPasswordErrorLocator()   { return passwordError; }
    public Locator getOtpFieldLocator()        { return otpField; }
    public Locator getOtpPageLocator()         { return otpPage; }
}
