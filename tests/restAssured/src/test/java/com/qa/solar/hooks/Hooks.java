package com.qa.solar.hooks;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
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
 * Hooks do Cucumber para configuração do RestAssured
 */
public class Hooks {

    private static final Logger LOG = LoggerFactory.getLogger(Hooks.class);
    private static RestAssuredConfig restAssuredConfig = new RestAssuredConfig();
    private static boolean initialized = false;

    private static final AtomicInteger passedCount = new AtomicInteger(0);
    private static final AtomicInteger failedCount = new AtomicInteger(0);
    private static final AtomicInteger skippedCount = new AtomicInteger(0);
    private static final List<TestResult> results = new ArrayList<>();
    private static LocalDateTime startTime;

    private static class TestResult {
        final String name;
        final String status;

        TestResult(String id, String name, String status) {
            this.name = name;
            this.status = status;
        }
    }

    @Before(order = 0)
    public void beforeAllScenarios() {
        if (!initialized) {
            restAssuredConfig.config();
            initialized = true;
            startTime = LocalDateTime.now();
        }
    }

    @Before(order = 1)
    public void beforeScenario(Scenario scenario) {
        LOG.info("***************************************************************");
        LOG.info("ID: " + scenario.getId());
        LOG.info("Scenario: " + scenario.getName());
        LOG.info("***************************************************************");
    }

    @After(order = 0)
    public void afterScenario(Scenario scenario) {
        TestContext.reset();

        String status = scenario.getStatus() != null ? scenario.getStatus().toString() : "UNKNOWN";
        String name = scenario.getName();
        String id = scenario.getId();

        TestResult result = new TestResult(id, name, status);
        results.add(result);

        switch (status) {
            case "PASSED":
                passedCount.incrementAndGet();
                break;
            case "FAILED":
                failedCount.incrementAndGet();
                break;
            case "SKIPPED":
                skippedCount.incrementAndGet();
                break;
            default:
                break;
        }

        LOG.info("***************************************************************");
        LOG.info("Status: " + status);
        LOG.info("***************************************************************");
    }

    @AfterAll
    public static void afterAllScenarios() {
        if (startTime == null) {
            return;
        }

        LocalDateTime endTime = LocalDateTime.now();
        Duration duration = Duration.between(startTime, endTime);
        long seconds = duration.getSeconds();
        long millis = duration.toMillis() % 1000;
        
        int total = passedCount.get() + failedCount.get() + skippedCount.get();
        
        System.out.println();
        System.out.println("╔════════════════════════════════════════════════════════════════╗");
        System.out.println("║                    RESUMO DA EXECUÇÃO                          ║");
        System.out.println("╠════════════════════════════════════════════════════════════════╣");
        System.out.println();
        
        // Estatísticas principais
        System.out.printf("  ✓ %-15s %d%n", "Passed:", passedCount.get());
        System.out.printf("  ✗ %-15s %d%n", "Failed:", failedCount.get());
        System.out.printf("  ○ %-15s %d%n", "Skipped:", skippedCount.get());
        System.out.println();
        System.out.printf("  Total: %d teste(s) | Duração: %d.%03ds%n", total, seconds, millis);
        System.out.println();
        
        // Lista de testes com status
        if (!results.isEmpty()) {
            System.out.println("  ──────────────────────────────────────────────────────────────");
            System.out.println("  Testes executados:");
            System.out.println();
            
            for (TestResult result : results) {
                String statusIcon = result.status.equals("PASSED") ? "✓" :
                                   result.status.equals("FAILED") ? "✗" : "○";
                System.out.printf("    %s %s - %s%n", statusIcon, result.name, result.status);
            }
            System.out.println();
        }
        
        // Resultado final
        System.out.println("╠════════════════════════════════════════════════════════════════╣");
        if (failedCount.get() == 0) {
            System.out.println("║  ✓ Todos os testes passaram!                                   ║");
        } else {
            System.out.printf("║  ✗ %d teste(s) falharam                                         ║%n", failedCount.get());
        }
        System.out.println("╚════════════════════════════════════════════════════════════════╝");
        System.out.println();
    }

}
