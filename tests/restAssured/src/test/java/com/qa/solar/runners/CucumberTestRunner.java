package com.qa.solar.runners;

import org.junit.platform.suite.api.ConfigurationParameter;
import org.junit.platform.suite.api.IncludeEngines;
import org.junit.platform.suite.api.SelectClasspathResource;
import org.junit.platform.suite.api.Suite;

import static io.cucumber.junit.platform.engine.Constants.GLUE_PROPERTY_NAME;
import static io.cucumber.junit.platform.engine.Constants.PLUGIN_PROPERTY_NAME;
import static io.cucumber.junit.platform.engine.Constants.FILTER_TAGS_PROPERTY_NAME;

/**
 * Runner para executar os testes Cucumber com JUnit Platform
 * 
 * @author Leonardo Paixão
 * @version 1.0
 * @since 2026-01-17
 */
@Suite
@IncludeEngines("cucumber")
@SelectClasspathResource("features")
@ConfigurationParameter(key = GLUE_PROPERTY_NAME, value = "com.qa.solar.steps,com.qa.solar.hooks")
@ConfigurationParameter(key = FILTER_TAGS_PROPERTY_NAME, value = "@api")
@ConfigurationParameter(key = PLUGIN_PROPERTY_NAME, value = "pretty,html:build/cucumber-reports/cucumber.html,json:build/cucumber-reports/cucumber.json,junit:build/cucumber-reports/cucumber.xml")
public class CucumberTestRunner {
}