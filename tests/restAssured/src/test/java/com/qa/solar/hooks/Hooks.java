package com.qa.solar.hooks;

import com.qa.solar.config.RestAssuredConfig;

import io.cucumber.java.After;
import io.cucumber.java.Before;

/**
 * Hooks do Cucumber para configuração do RestAssured
 * 
 * @author Leonardo Paixão
 * @version 1.0
 * @since 2026-01-17
 */
public class Hooks {

    private static RestAssuredConfig restAssuredConfig = new RestAssuredConfig();
    private static boolean initialized = false;

    @Before(order = 0)
    public void beforeScenario() {
        if (!initialized) {
            restAssuredConfig.config();
            initialized = true;
        }
        
    }

    @After(order = 0)
    public void afterScenario() {
    }

    @After(order = Integer.MAX_VALUE)
    public void afterAllScenarios() {
    }
}
