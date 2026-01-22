package com.qa.solar.steps;

import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

import org.junit.jupiter.api.Assertions;

import com.qa.solar.support.TestContext;
import com.qa.solar.utils.requestHelper;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
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
        context.setResponse(requestHelper.post(endpoint, body));
    }

    @When("I send a POST request for {string} without body")
    public void iSendAPostRequestForWithoutBody(String endpoint) {
        context.setResponse(requestHelper.postWithoutBody(endpoint));
    }

    @Then("the response status code should be {int}")
    public void theResponseStatusCodeShouldBe(int expectedStatusCode) {
        Response response = context.getResponse();
        Assertions.assertEquals(expectedStatusCode, response.getStatusCode(),
                "Status code esperado: " + expectedStatusCode + ", mas foi: " + response.getStatusCode());
    }

    @And("the response should match the {string} schema")
    public void theResponseShouldMatchATheSchema(String schemaPath) {
        Response response = context.getResponse();
        response.then()
            .assertThat()
            .body(matchesJsonSchemaInClasspath("schemas/" + schemaPath + ".schema.json"));
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
