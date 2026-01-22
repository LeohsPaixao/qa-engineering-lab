package com.qa.solar.utils;

import io.restassured.RestAssured;
import io.restassured.response.Response;

/**
 * Helper criado para facilitar chamadas HTTP
 */
public class requestHelper {

  public static Response get(String endpoint) {
    return RestAssured.given()
        .contentType("application/json")
        .post(endpoint)
        .then()
        .extract()
        .response();
  }

  public static Response post(String endpoint, String body) {
    return RestAssured.given()
        .contentType("application/json")
        .body(body)
        .post(endpoint)
        .then()
        .extract()
        .response();
  }

  public static Response postWithoutBody(String endpoint) {
    return RestAssured.given()
        .contentType("application/json")
        .post(endpoint)
        .then()
        .extract()
        .response();
  }

  public static Response patch(String endpoint, String body) {
    return RestAssured.given()
        .contentType("application/json")
        .body(body)
        .patch(endpoint)
        .then()
        .extract()
        .response();
  }

  public static Response delete(String endpoint, String body) {
    return RestAssured.given()
        .contentType("application/json")
        .body(body)
        .delete(endpoint)
        .then()
        .extract()
        .response();
  }
}
