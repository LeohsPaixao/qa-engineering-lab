@api
Feature: User
  As an authenticated user
  I should be able to create users

  Scenario: Should be able to create a new user
    When I create a user with valid data
    Then the response status code should be 201
    And the response should match the "user/create_user/create-user-success" schema
    And the response message should be "Usuário criado com sucesso!"

  Scenario: Should return error when email is duplicated
    Given there is a user with email "duplicated@example.com"
    When I send a POST request for "/users" with email for create a new user
    Then the response status code should be 409
    And the response should match the "user/create_user/email-duplicated" schema
    And the response message should be "E-mail já está em uso."

  Scenario: Should return error when document is duplicated
    Given there is a user with document "449.324.480-15"
    When I send a POST request for "/users" with document for create a new user
    Then the response status code should be 409
    And the response should match the "user/create_user/document-duplicated" schema
    And the response message should be "CPF ou CNPJ já está em uso."
