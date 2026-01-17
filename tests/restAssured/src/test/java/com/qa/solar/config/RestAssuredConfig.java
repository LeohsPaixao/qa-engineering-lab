package com.qa.solar.config;

import io.github.cdimascio.dotenv.Dotenv;
import io.restassured.RestAssured;
import io.restassured.config.LogConfig;

/**
 * Configuração base para os testes RestAssured
 * 
 * @author Leonardo Paixão
 * @version 1.0
 * @since 2026-01-17
 */
public class RestAssuredConfig {
  private static Dotenv dotenv;
  private static boolean configured = false;

  public void config() {
    if (configured) {
      return;
    }

    try {
      dotenv = Dotenv.configure()
          .ignoreIfMissing()
          .load();
    } catch (Exception e) {
      dotenv = null;
    }

    String baseURI = getEnv("REST_ASSURED_BASE_URL", "http://localhost:3001");
    String basePath = getEnv("REST_ASSURED_BASE_PATH", "/api");

    RestAssured.baseURI = baseURI;
    RestAssured.basePath = basePath;
    RestAssured.enableLoggingOfRequestAndResponseIfValidationFails();
    RestAssured.config = io.restassured.config.RestAssuredConfig.config()
        .logConfig(LogConfig.logConfig().enableLoggingOfRequestAndResponseIfValidationFails());

    configured = true;
  }

  private String getEnv(String key, String defaultValue) {
    if (dotenv != null) {
      String value = dotenv.get(key);
      if (value != null && !value.isEmpty()) {
        return value;
      }
    }
    String systemValue = System.getenv(key);
    if (systemValue != null && !systemValue.isEmpty()) {
      return systemValue;
    }
    return defaultValue;
  }

  public static void reset() {
    configured = false;
    RestAssured.reset();
  }
}
