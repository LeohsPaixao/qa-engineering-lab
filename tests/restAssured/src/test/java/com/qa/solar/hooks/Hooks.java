package com.qa.solar.hooks;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.atomic.AtomicInteger;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.qa.solar.config.RestAssuredConfig;
import com.qa.solar.support.TestContext;

import io.cucumber.java.After;
import io.cucumber.java.AfterAll;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;

/**
 * Hooks do Cucumber para configuração e relatório de execução.
 *
 * @author Leonardo Paixao
 * @version 2.0
 * @since 2026-01-17
 */
public class Hooks {

    private static final Logger LOG = LoggerFactory.getLogger(Hooks.class);
    private static final RestAssuredConfig REST_ASSURED_CONFIG = new RestAssuredConfig();
    private static boolean initialized = false;

    private static final AtomicInteger passedCount = new AtomicInteger(0);
    private static final AtomicInteger failedCount = new AtomicInteger(0);
    private static final AtomicInteger skippedCount = new AtomicInteger(0);
    private static LocalDateTime startTime;

    private static final String BOX_TOP = "╔════════════════════════════════════════╗";
    private static final String BOX_MID = "╠════════════════════════════════════════╣";
    private static final String BOX_BOT = "╚════════════════════════════════════════╝";
    private static final String BOX_SEP = "║────────────────────────────────────────║";
    private static final int BOX_WIDTH = 42;

    @Before(order = 0)
    public void beforeAllScenarios() {
        if (!initialized) {
            REST_ASSURED_CONFIG.config();
            initialized = true;
            startTime = LocalDateTime.now();
            LOG.info("Iniciando execução dos testes...");
        }
    }

    @Before(order = 1)
    public void beforeScenario(Scenario scenario) {
        LOG.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        LOG.info("▶ Cenário: {}", scenario.getName());
        LOG.info("  ID: {}", scenario.getId());
    }

    @After(order = 0)
    public void afterScenario(Scenario scenario) {
        TestContext.reset();

        String status = scenario.getStatus() != null ? scenario.getStatus().toString() : "UNKNOWN";

        switch (status) {
            case "PASSED" -> passedCount.incrementAndGet();
            case "FAILED" -> failedCount.incrementAndGet();
            case "SKIPPED" -> skippedCount.incrementAndGet();
            default -> { }
        }

        String icon = status.equals("PASSED") ? "✓" : status.equals("FAILED") ? "✗" : "○";
        LOG.info("  Status: {} {}", icon, status);
        LOG.info("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    @AfterAll
    public static void afterAllScenarios() {
        if (startTime == null) {
            return;
        }

        Duration duration = Duration.between(startTime, LocalDateTime.now());
        String durationStr = formatDuration(duration);
        int total = passedCount.get() + failedCount.get() + skippedCount.get();

        LOG.info("");
        LOG.info(BOX_TOP);
        LOG.info(formatLine("RESUMO DA EXECUÇÃO"));
        LOG.info(BOX_MID);
        LOG.info(formatLine("✓ Passed:  " + passedCount.get()));
        LOG.info(formatLine("✗ Failed:  " + failedCount.get()));
        LOG.info(formatLine("○ Skipped: " + skippedCount.get()));
        LOG.info(BOX_SEP);
        LOG.info(formatLine("Total: " + total + " | Duração: " + durationStr));
        LOG.info(BOX_MID);

        if (failedCount.get() == 0) {
            LOG.info(formatLine("✓ Todos os testes passaram!"));
        } else {
            LOG.info(formatLine("✗ " + failedCount.get() + " teste(s) falharam"));
        }
        LOG.info(BOX_BOT);
        LOG.info("");
    }

    /**
     * Formata uma linha para caber no box com bordas.
     */
    private static String formatLine(String content) {
        int contentWidth = BOX_WIDTH - 4;
        String padded = String.format("%-" + contentWidth + "s", content);
        if (padded.length() > contentWidth) {
            padded = padded.substring(0, contentWidth);
        }
        return "║ " + padded + " ║";
    }

    /**
     * Formata a duração em formato legível.
     */
    private static String formatDuration(Duration duration) {
        long totalMillis = duration.toMillis();
        long seconds = totalMillis / 1000;
        long millis = totalMillis % 1000;

        if (seconds > 0) {
            return seconds + "." + String.format("%03d", millis) + "s";
        }
        return millis + "ms";
    }
}
