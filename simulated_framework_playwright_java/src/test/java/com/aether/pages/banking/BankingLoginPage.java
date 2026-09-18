package com.aether.pages.banking;

import com.aether.framework.core.BasePage;
import com.microsoft.playwright.Page;

/**
 * Provisional stub-bearing Page Object methods approved under
 * the human decision: stub_and_continue.
 */
public class BankingLoginPage extends BasePage {

    public BankingLoginPage(Page page) {
        super(page);
    }

    public boolean assertLockedAccountMessage() {
        // TODO(stub_and_continue): implement — verify "Account locked, contact support"
        return false;
    }

    public boolean assertDisabledAccountMessage() {
        // TODO(stub_and_continue): implement — verify "Account disabled, contact support"
        return false;
    }

    public boolean assertOtpFormat(String otp) {
        // TODO(stub_and_continue): implement — verify exactly six numeric digits
        return false;
    }

    public void submitExpiredOtp(String otp) {
        // TODO(stub_and_continue): implement — submit controlled expired OTP
    }

    public void submitIncorrectOtpAttempts(String otp) {
        // TODO(stub_and_continue): implement — perform three incorrect OTP attempts
    }

    public String providePreviouslyUsedOtp(String otp) {
        // TODO(stub_and_continue): implement — provide previously accepted OTP
        return "";
    }

    public boolean assertHttpsPageLoad() {
        // TODO(stub_and_continue): implement — verify current page URL uses https://
        return false;
    }
}