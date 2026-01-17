package com.qa.solar.hooks;

import java.util.logging.Logger;

import com.qa.solar.config.RestAssuredConfig;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.Scenario;

/**
 * Hooks do Cucumber para configuração do RestAssured
 * 
 * @author Leonardo Paixão
 * @version 1.0
 * @since 2026-01-17
 */
public class Hooks {

    private static final Logger LOG = Logger.getLogger(Hooks.class.getName());
    private static RestAssuredConfig restAssuredConfig = new RestAssuredConfig();
    private static boolean initialized = false;

    @Before(order = 0)
    public void beforeScenario(Scenario scenario) {
        if (!initialized) {
            restAssuredConfig.config();
            initialized = true;
        }
        LOG.info("*****************************************************************************************");
		LOG.info("	Scenario: "+scenario.getName());
		LOG.info("	Tags: "+scenario.getSourceTagNames());
		LOG.info("*****************************************************************************************");
    }

    @After(order = 0)
    public void afterScenario() {
    }

    @After(order = Integer.MAX_VALUE)
    public void afterAllScenarios() {
    }
}
