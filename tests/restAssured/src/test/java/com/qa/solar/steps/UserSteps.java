package com.qa.solar.steps;

import com.qa.solar.support.FakeDataFactory;
import com.qa.solar.support.GenerateValidCPF;
import com.qa.solar.support.TestContext;
import com.qa.solar.utils.requestHelper;

import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;

/**
 * Steps para usuário
 * 
 * @author Leonardo Paixão
 * @version 1.0
 * @since 2026-01-18
 */
public class UserSteps {
  private TestContext context = TestContext.getInstance();

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

    context.setResponse(requestHelper.post("/users", body));
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

    context.setResponse(requestHelper.post("/users", body));
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

    context.setResponse(requestHelper.post("/users", body));
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

    context.setResponse(requestHelper.post(endpoint, body));
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

    context.setResponse(requestHelper.post(endpoint, body));
  }
}
