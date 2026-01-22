package com.qa.solar.utils;

import com.qa.solar.support.TestContext;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

/**
 * Helper criado para facilitar chamadas HTTP
 */
public class RequestHelper {

  private static RequestSpecification baseRequest() {

    RequestSpecification request = RestAssured.given()
        .contentType("application/json");

    String token = TestContext.getInstance().getAuthToken();

    if (token != null) {
      request.header("Authorization", "Bearer " + token);
    }

    return request;
  }

  public static Response get(String endpoint) {
    return baseRequest()
        .get(endpoint)
        .then()
        .extract()
        .response();
  }

  public static Response post(String endpoint, String body) {
    return baseRequest()
        .body(body)
        .post(endpoint)
        .then()
        .extract()
        .response();
  }

  public static Response postWithoutBody(String endpoint) {
    return baseRequest()
        .post(endpoint)
        .then()
        .extract()
        .response();
  }

  public static Response patch(String endpoint, String body) {
    return baseRequest()
        .body(body)
        .patch(endpoint)
        .then()
        .extract()
        .response();
  }

  public static Response delete(String endpoint, String body) {
    return baseRequest()
        .body(body)
        .delete(endpoint)
        .then()
        .extract()
        .response();
  }
}
