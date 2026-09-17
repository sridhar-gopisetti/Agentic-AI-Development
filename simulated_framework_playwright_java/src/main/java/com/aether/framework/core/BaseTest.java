package com.aether.framework.core;

import com.microsoft.playwright.Page;
import org.testng.ITestResult;
import org.testng.annotations.AfterClass;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeMethod;

/**
 * BaseTest — abstract base for all TestNG test classes in the Playwright-Java framework.
 *
 * Handles:
 *  - Playwright + Browser lifecycle (one browser per test class)
 *  - BrowserContext + Page per test method (clean state)
 *  - ExtentReports initialisation and teardown
 *  - Automatic screenshot capture on test failure
 *
 * Rule compliance:
 *   PJ-001  Single Playwright instance per thread
 *   PJ-002  BrowserContext per test method
 *   PJ-003  Page per test method
 *   PJ-009  Extends BaseTest in every test class
 *   PJ-010  BeforeMethod / AfterMethod lifecycle
 */
public abstract class BaseTest {

    protected Page   page;
    protected String baseUrl;

    // ── Class-level lifecycle ─────────────────────────────────────────────────

    @BeforeClass(alwaysRun = true)
    public void setUpClass() {
        TestReporter.initReporter();
        baseUrl = ConfigReader.getBaseUrl();
        PlaywrightManager.initBrowser();
    }

    @AfterClass(alwaysRun = true)
    public void tearDownClass() {
        PlaywrightManager.quitBrowser();
        TestReporter.flushReport();
    }

    // ── Method-level lifecycle ────────────────────────────────────────────────

    @BeforeMethod(alwaysRun = true)
    public void openPage() {
        PlaywrightManager.openContext();
        page = PlaywrightManager.getPage();
    }

    @AfterMethod(alwaysRun = true)
    public void closePage(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            if (ConfigReader.screenshotOnFailure()) {
                TestReporter.captureScreenshot(page, result.getName());
            }
        }
        PlaywrightManager.closeContext();
    }
}
