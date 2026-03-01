package com.qa.engineering.lab.steps;

import static io.restassured.module.jsv.JsonSchemaValidator.matchesJsonSchemaInClasspath;

import org.junit.jupiter.api.Assertions;

import com.qa.engineering.lab.support.TestConstants;
import com.qa.engineering.lab.support.TestContext;
import com.qa.engineering.lab.utils.RequestHelper;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import io.restassured.response.Response;

/**
 * Steps comuns utilizados em todas as features.
 * Contém definições genéricas reutilizáveis para requisições e validações.
 *
 * @author Leonardo Paixao
 * @version 2.0
 * @since 2026-01-17
 */
public class StepsDefinitions {

    private final TestContext context = TestContext.getInstance();

    // ==================== GIVEN ====================

    /**
     * Realiza autenticação com usuário padrão e armazena o token no contexto.
     */
    @Given("I am authenticated")
    public void iAmAuthenticated() {
        String body = """
                {
                  "email": "%s",
                  "password": "%s"
                }
                """.formatted(
                TestConstants.DEFAULT_USER_EMAIL,
                TestConstants.DEFAULT_PASSWORD);

        Response response = RequestHelper.post(TestConstants.AUTH_LOGIN_ENDPOINT, body);
        String token = response.jsonPath().getString("token");

        context.setAuthToken(token);
    }

    /**
     * Armazena um email no contexto para uso posterior.
     */
    @Given("there is a user email {string}")
    public void thereIsAUserEmail(String email) {
        context.setUserEmail(email);
    }

    // ==================== WHEN ====================

    /**
     * Envia requisição POST com body JSON para o endpoint especificado.
     */
    @When("I send a POST request for {string} with the following body:")
    public void iSendAPostRequestWithBody(String endpoint, String body) {
        context.setResponse(RequestHelper.post(endpoint, body));
    }

    /**
     * Envia requisição POST sem body para o endpoint especificado.
     */
    @When("I send a POST request for {string} without body")
    public void iSendAPostRequestWithoutBody(String endpoint) {
        context.setResponse(RequestHelper.postWithoutBody(endpoint));
    }

    /**
     * Envia requisição GET para o endpoint especificado.
     */
    @When("I send a GET request to {string}")
    public void iSendAGetRequestTo(String endpoint) {
        context.setResponse(RequestHelper.get(endpoint));
    }

    /**
     * Envia requisição POST com email armazenado no contexto.
     */
    @When("I send a POST request for {string} with email")
    public void iSendAPostRequestWithEmail(String endpoint) {
        String email = context.getUserEmail();

        String body = """
                {"email": "%s"}
                """.formatted(email);

        context.setResponse(RequestHelper.post(endpoint, body));
    }

    // ==================== THEN ====================

    /**
     * Valida se o status code da resposta é igual ao esperado.
     */
    @Then("the response status code should be {int}")
    public void theResponseStatusCodeShouldBe(int expectedStatusCode) {
        Response response = context.getResponse();
        int actualStatusCode = response.getStatusCode();

        Assertions.assertEquals(
                expectedStatusCode,
                actualStatusCode,
                String.format("Status code esperado: %d, mas foi: %d", expectedStatusCode, actualStatusCode));
    }

    // ==================== AND ====================

    /**
     * Valida se a resposta corresponde ao schema JSON especificado.
     *
     * @param schemaPath caminho do schema relativo a resources/schemas/
     */
    @And("the response should match the {string} schema")
    public void theResponseShouldMatchTheSchema(String schemaPath) {
        Response response = context.getResponse();
        String fullSchemaPath = TestConstants.SCHEMA_BASE_PATH + schemaPath + TestConstants.SCHEMA_EXTENSION;

        response.then()
                .assertThat()
                .body(matchesJsonSchemaInClasspath(fullSchemaPath));
    }

    /**
     * Valida se o body da resposta contém a mensagem esperada.
     */
    @And("the response message should be {string}")
    public void theResponseMessageShouldBe(String expectedMessage) {
        Response response = context.getResponse();
        String responseBody = response.getBody().asString();

        Assertions.assertTrue(
                responseBody.contains(expectedMessage),
                String.format("Resposta não contém a mensagem esperada: '%s'. Body: %s",
                        expectedMessage, responseBody));
    }

    /**
     * Valida se o body da resposta contém o texto especificado (DocString).
     */
    @And("the response body should contain the following:")
    public void theResponseBodyShouldContain(String expectedContent) {
        Response response = context.getResponse();
        String responseBody = response.getBody().asString();

        Assertions.assertTrue(
                responseBody.contains(expectedContent.trim()),
                String.format("Resposta não contém o conteúdo esperado: '%s'. Body: %s",
                        expectedContent, responseBody));
    }
}
