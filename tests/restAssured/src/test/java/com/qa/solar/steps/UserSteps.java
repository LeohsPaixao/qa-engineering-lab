package com.qa.solar.steps;

import org.junit.jupiter.api.Assertions;

import com.qa.solar.support.FakeDataFactory;
import com.qa.solar.support.GenerateValidCPF;
import com.qa.solar.support.TestContext;
import com.qa.solar.utils.RequestHelper;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.response.Response;

/**
 * Steps para usuário
 */
public class UserSteps {
  private TestContext context = TestContext.getInstance();

  @Given("I am authenticated")
  public void iWasAuthenticated() {

    String body = """
        {
          "email": "generic@example.com",
          "password": "123456"
        }
        """;

    Response response = RequestHelper.post("/auth/login", body);
    String token = response.jsonPath().getString("token");

    context.setAuthToken(token);
  }

  @Given("I am authenticated as a user")
  public void iAmAuthenticatedAsAUser() {
    Response response = RequestHelper.get("users/me");
    String userId = response.jsonPath().getString("id");

    context.setUserId(userId);
  }

  @Given("there is a user with email {string}")
  public void thereIsAUserWithEmail(String email) {

    String body = """
        {
          "email": "%s",
          "password": "%s",
          "full_name": "%s",
          "doc_type": "cpf",
          "document": "%s"
        }
        """.formatted(
        email,
        FakeDataFactory.randomPassword(),
        FakeDataFactory.randomFullName(),
        GenerateValidCPF.generateValidCPF());

    context.setResponse(RequestHelper.post("/users", body));
  }

  @Given("there is a user with document {string}")
  public void thereIsAUserWithDocument(String document) {

    String body = """
        {
          "email": "%s",
          "password": "%s",
          "full_name": "%s",
          "doc_type": "cpf",
          "document": "%s"
        }
        """.formatted(
        FakeDataFactory.randomEmail(),
        FakeDataFactory.randomPassword(),
        FakeDataFactory.randomFullName(),
        document);

    context.setResponse(RequestHelper.post("/users", body));
  }

  @When("I create a user with valid data")
  public void iCreateAUserWithValidData() {

    String body = """
        {
          "email": "%s",
          "password": "%s",
          "full_name": "%s",
          "doc_type": "cpf",
          "document": "%s"
        }
        """.formatted(
        FakeDataFactory.randomEmail(),
        FakeDataFactory.randomPassword(),
        FakeDataFactory.randomFullName(),
        GenerateValidCPF.generateValidCPF());

    context.setResponse(RequestHelper.post("/users", body));
  }

  @When("I try send a POST request for {string} with email")
  public void iTrySendAPostRequestForWithEmail(String endpoint) {

    String body = """
        {
          "email": "duplicated@example.com",
          "password": "%s",
          "full_name": "%s",
          "doc_type": "cpf",
          "document": "%s"
        }
        """.formatted(
        FakeDataFactory.randomPassword(),
        FakeDataFactory.randomFullName(),
        GenerateValidCPF.generateValidCPF());

    context.setResponse(RequestHelper.post(endpoint, body));
  }

  @When("I send a POST request for {string} with document")
  public void iTrySendAPostRequestForWithDocument(String endpoint) {

    String body = """
        {
          "email": "%s",
          "password": "%s",
          "full_name": "%s",
          "doc_type": "cpf",
          "document": "449.324.480-15"
        }
        """.formatted(
        FakeDataFactory.randomEmail(),
        FakeDataFactory.randomPassword(),
        FakeDataFactory.randomFullName());

    context.setResponse(RequestHelper.post(endpoint, body));
  }

  @When("there is a user to be deleted")
  public void thereIsAUserToBeDeleted() {
    String body = """
        {
          "email": "%s",
          "password": "%s",
          "full_name": "%s",
          "doc_type": "cpf",
          "document": "%s"
        }
        """.formatted(
        FakeDataFactory.randomEmail(),
        FakeDataFactory.randomPassword(),
        FakeDataFactory.randomFullName(),
        GenerateValidCPF.generateValidCPF());

    Response response = RequestHelper.post("/users", body);

    context.setUserId(response.jsonPath().getString("user.id"));
    context.setResponse(response);
  }

  @When("I try to delete the logged user")
  public void iTryDeleteTheLoggedUser() {
    String userId = context.getUserId();

    String body = """
        { "ids": [%s]}
        """.formatted(userId);

    context.setResponse(RequestHelper.delete("/users/delete", body));
  }

  @When("I try to delete users without providing ids")
  public void iTryToDeleteUsersWithoutProvidingIds() {

    String body = """
        { "ids": [] }
         """;

    context.setResponse(RequestHelper.delete("/users/delete", body));
  }

  @When("I send a GET request to {string}")
  public void iSendAGetRequestTo(String endpoint) {
    context.setResponse(RequestHelper.get(endpoint));
  }

  @When("I send a PATCH request to {string}")
  public void iSendAPatchRequestTo(String endpoint) {
    String body = """
        { "full_name": "%s", "social_name": "%s", "phone": "%s"}
        """.formatted(
        FakeDataFactory.randomFullName(),
        FakeDataFactory.randomSocialName(),
        FakeDataFactory.randomPhone());

    context.setResponse(RequestHelper.patch(endpoint, body));
  }

  @And("I delete the user")
  public void iDeleteTheUser() {
    String userId = context.getUserId();

    String body = """
        { "ids": [%s] }
        """.formatted(userId);

    context.setResponse(RequestHelper.delete("/users/delete", body));
  }

  @And("the response message should be {string}")
  public void theResponseMessageShouldBe(String expectedBody) {
    Response response = context.getResponse();
    Assertions.assertTrue(
        response.getBody().asString().contains(expectedBody),
        "Resposta não contém a mensagem esperada");
  }
}
