package com.aether.framework.core;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.Status;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.microsoft.playwright.Page;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

/**
 * TestReporter — thin wrapper around ExtentReports for Playwright-Java tests.
 *
 * Provides:
 *  - initReporter() / flushReport()
 *  - startTest() / step() / pass() / fail() / info()
 *  - assertCondition() — logs outcome and returns the condition (for use in Assert.assertTrue)
 *  - captureScreenshot() — Playwright Page screenshot → Base64 embed in report
 *
 * Rule compliance:
 *   PJ-011  All assertions logged via TestReporter
 *   PJ-012  Traceability tags on every assertion
 */
public class TestReporter {

    private static ExtentReports        extent;
    private static ThreadLocal<ExtentTest> testNode = new ThreadLocal<>();
    private static final String REPORT_DIR = "target/surefire-reports";

    // ── Init / Flush ──────────────────────────────────────────────────────────

    public static void initReporter() {
        if (extent == null) {
            String timestamp = LocalDateTime.now()
                    .format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
            String reportPath = REPORT_DIR + "/AETHER-Playwright-Java-Report-" + timestamp + ".html";
            try {
                Files.createDirectories(Paths.get(REPORT_DIR));
            } catch (Exception ignored) {}

            ExtentSparkReporter spark = new ExtentSparkReporter(reportPath);
            spark.config().setDocumentTitle("AETHER Playwright Java Test Report");
            spark.config().setReportName("Banking Login — TC_001 to TC_008");

            extent = new ExtentReports();
            extent.attachReporter(spark);
            extent.setSystemInfo("Framework",   "playwright-java");
            extent.setSystemInfo("AUT",         ConfigReader.getBaseUrl());
            extent.setSystemInfo("Requirement", "REQ-BANK-AUTH-001");
            extent.setSystemInfo("Source",      "Banking_Login_TC_1.pdf");
        }
    }

    public static void flushReport() {
        if (extent != null) {
            extent.flush();
        }
    }

    // ── Test lifecycle ────────────────────────────────────────────────────────

    public static void startTest(String testName, String description) {
        ExtentTest test = extent.createTest(testName, description);
        testNode.set(test);
    }

    public static void step(int stepNumber, String message) {
        log(Status.INFO, "[Step " + stepNumber + "] " + message);
    }

    public static void pass(String message) {
        log(Status.PASS, message);
    }

    public static void fail(String message) {
        log(Status.FAIL, message);
    }

    public static void info(String message) {
        log(Status.INFO, message);
    }

    private static void log(Status status, String message) {
        ExtentTest test = testNode.get();
        if (test != null) {
            test.log(status, message);
        }
    }

    // ── Assertion helper ──────────────────────────────────────────────────────

    /**
     * Logs the pass/fail message, then returns the condition for use in Assert.assertTrue().
     *
     * @param condition   the boolean result of the assertion
     * @param passMessage logged when condition is true
     * @param failMessage logged when condition is false
     * @return the original condition value
     */
    public static boolean assertCondition(boolean condition, String passMessage, String failMessage) {
        if (condition) {
            pass(passMessage);
        } else {
            fail(failMessage);
        }
        return condition;
    }

    // ── Screenshot ────────────────────────────────────────────────────────────

    /**
     * Captures a full-page screenshot via the Playwright Page and embeds it in the report.
     */
    public static void captureScreenshot(Page page, String testName) {
        try {
            String safe = testName.replaceAll("[^a-zA-Z0-9_-]", "_");
            Path   dir  = Paths.get(REPORT_DIR, "screenshots");
            Files.createDirectories(dir);
            Path   path = dir.resolve(safe + ".png");
            byte[] screenshot = page.screenshot(
                    new Page.ScreenshotOptions().setFullPage(true).setPath(path));
            String b64   = Base64.getEncoder().encodeToString(screenshot);
            String label = "Screenshot on failure: " + testName;
            ExtentTest test = testNode.get();
            if (test != null) {
                test.fail(label);
                test.addScreenCaptureFromBase64String(b64, label);
            }
        } catch (Exception e) {
            System.err.println("[TestReporter] Screenshot capture failed: " + e.getMessage());
        }
    }
}
