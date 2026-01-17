package com.qa.solar.steps;

import org.junit.jupiter.api.Assertions;

import com.qa.solar.support.TestContext;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.RestAssured;
import io.restassured.response.Response;

/**
 * Steps para autenticação
 * 
 * @author Leonardo Paixão
 * @version 1.0
 * @since 2026-01-17
 */
public class AuthSteps {

    private TestContext context = TestContext.getInstance();

    @When("I send a POST request for {string} with the following body:")
    public void iSendAPostRequestForWithTheFollowingBody(String endpoint, String body) {
        Response response = RestAssured.given()
                .contentType("application/json")
                .body(body)
                .when()
                .post(endpoint)
                .then()
                .extract()
                .response();

        context.setResponse(response);
    }

    @When("I send a POST request for {string} without body")
    public void iSendAPostRequestForWithoutBody(String endpoint) {
        Response response = RestAssured.given()
                .contentType("application/json")
                .when()
                .post(endpoint)
                .then()
                .extract()
                .response();

        context.setResponse(response);
    }

    @Then("the response status code should be {int}")
    public void theResponseStatusCodeShouldBe(int expectedStatusCode) {
        Response response = context.getResponse();
        Assertions.assertEquals(expectedStatusCode, response.getStatusCode(),
                "Status code esperado: " + expectedStatusCode + ", mas foi: " + response.getStatusCode());
    }

    @And("the response body should contain the following:")
    public void theResponseBodyShouldContainTheFollowing(String expectedBody) {
        Response response = context.getResponse();
        Assertions.assertTrue(
            response.getBody().asString().contains(expectedBody),
            "Resposta não contém a mensagem esperada"
        );
    }
}
