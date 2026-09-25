// ════════════════════════════════════════════════════
// SCRIPT READINESS: PARTIAL
// This script is structurally complete but contains
// placeholders for the following missing values.
// Supply these before executing:
//
// AUT_LOGIN_PATH  → set AUT_LOGIN_PATH in .env (assumed: /login)
// AUT_USER_EMAIL  → set AUT_USER_EMAIL in .env (assumed: process.env.AUT_USER_EMAIL)
// AUT_USER_PASSWORD → set AUT_USER_PASSWORD in .env (assumed: process.env.AUT_USER_PASSWORD)
// TARGET_BROWSER  → set TARGET_BROWSER in .env (assumed: framework primary browser)
// AUT_MODULES_IN_SCOPE → set AUT_MODULES_IN_SCOPE in .env (assumed: inferred from test case document titles/tags)
// LIVE_AUT_ACCESSIBLE → set LIVE_AUT_ACCESSIBLE in .env (assumed: false)
// ════════════════════════════════════════════════════
package com.aether.pages.banking;

import com.aether.framework.core.BasePage;
import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;

public class BankingLoginPage extends BasePage {

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
        this.usernameError          = page.locator("#bankingUsername-error, #bankingUsername ~ span.field-error");
        this.passwordError          = page.locator("#bankingPassword-error, #bankingPassword ~ span.field-error");
        this.otpField               = page.locator("#otpInput");
        this.submitOtpButton        = page.locator("#submitOtpBtn");
        this.otpPage                = page.locator("div.otp-verification-page, h2:has-text('Verify'), h2:has-text('OTP')").first();
        this.forgotPasswordLink     = page.locator("a[data-testid='forgot-password']");
        this.rememberDeviceCheckbox = page.locator("#rememberDevice");
        this.sessionExpiredBanner   = page.locator("div.session-expired-banner");
    }

    public boolean validate() {
        try {
            waitForVisible(usernameField);
            waitForVisible(loginButton);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public boolean isStillOnLoginPage() {
        return validate();
    }

    public boolean validateOtpPage() {
        try {
            waitForVisible(otpPage);
            waitForVisible(otpField);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public void enterUsername(String username) {
        fillField(usernameField, username);
    }

    public void enterPassword(String password) {
        fillField(passwordField, password);
    }

    public void clickLoginButton() {
        clickWhenReady(loginButton);
    }

    public void clearUsername() {
        waitForVisible(usernameField).clear();
    }

    public void clearPassword() {
        waitForVisible(passwordField).clear();
    }

    public void login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        clickLoginButton();
    }

    public void loginFirstFactor(String username, String password) {
        login(username, password);
    }

    public void submitOtp(String otp) {
        fillField(otpField, otp);
        clickWhenReady(submitOtpButton);
    }

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
        try {
            return getText(usernameError);
        } catch (Exception e) {
            return "";
        }
    }

    public String getPasswordErrorText() {
        try {
            return getText(passwordError);
        } catch (Exception e) {
            return "";
        }
    }

    public boolean isSessionExpiredBannerVisible() {
        try {
            waitForVisible(sessionExpiredBanner, 3_000);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public Locator getUsernameFieldLocator() {
        return usernameField;
    }

    public Locator getPasswordFieldLocator() {
        return passwordField;
    }

    public Locator getLoginButtonLocator() {
        return loginButton;
    }

    public Locator getErrorBannerLocator() {
        return errorBanner;
    }

    public Locator getUsernameErrorLocator() {
        return usernameError;
    }

    public Locator getPasswordErrorLocator() {
        return passwordError;
    }

    public Locator getOtpFieldLocator() {
        return otpField;
    }

    public Locator getOtpPageLocator() {
        return otpPage;
    }

    public void openLoginPage() {
        // TODO(stub_and_continue): implement — resolve AUT_LOGIN_PATH and navigation strategy.
    }
}