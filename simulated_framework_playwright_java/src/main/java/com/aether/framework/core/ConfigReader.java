package com.aether.framework.core;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * ConfigReader — centralised configuration access.
 *
 * Priority (highest → lowest):
 *   1. JVM system property (-D)
 *   2. Environment variable
 *   3. src/main/resources/config.properties
 *   4. Supplied default
 */
public class ConfigReader {

    private static final Properties props = new Properties();

    static {
        try (InputStream is = ConfigReader.class.getClassLoader()
                .getResourceAsStream("config.properties")) {
            if (is != null) {
                props.load(is);
            }
        } catch (IOException e) {
            System.err.println("[ConfigReader] WARNING: config.properties not found on classpath — defaults will be used.");
        }
    }

    /** Returns the value for key, or null if absent. */
    public static String get(String key) {
        return get(key, null);
    }

    /** Returns the value for key, falling back to defaultValue. */
    public static String get(String key, String defaultValue) {
        // 1. JVM system property
        String val = System.getProperty(key);
        if (val != null && !val.isBlank()) return val;
        // 2. Environment variable (dots → underscores, upper-case)
        val = System.getenv(key.replace('.', '_').toUpperCase());
        if (val != null && !val.isBlank()) return val;
        // 3. config.properties
        val = props.getProperty(key);
        if (val != null && !val.isBlank()) return val;
        return defaultValue;
    }

    /** Convenience — base URL of AUT. */
    public static String getBaseUrl() {
        return get("base.url", "http://localhost:3000");
    }

    /** Explicit wait in seconds. */
    public static int getExplicitWait() {
        try {
            return Integer.parseInt(get("explicit.wait.seconds", "10"));
        } catch (NumberFormatException e) {
            return 10;
        }
    }

    /** Whether to capture screenshot on failure. */
    public static boolean screenshotOnFailure() {
        return Boolean.parseBoolean(get("screenshot.on.failure", "true"));
    }
}
