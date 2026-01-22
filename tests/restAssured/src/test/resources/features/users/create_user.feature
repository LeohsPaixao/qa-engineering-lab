@api
Feature: User
  As an authenticated user
  I should be able to create users

  Scenario: Should be able to create a new user
    When I create a user with valid data
    Then the response status code should be 201
    And the response body should contain the following:
      """
      Usuário criado com sucesso!
      """

  Scenario: Should return error when email is duplicated
    Given there is a user with email "duplicated@example.com"
    When I try send a POST request for "/users" with email
    Then the response status code should be 409
    And the response body should contain the following:
      """
      E-mail já está em uso.
      """

  Scenario: Should return error when document is duplicated
    Given there is a user with document "449.324.480-15"
    When I send a POST request for "/users" with document
    Then the response status code should be 409
    And the response body should contain the following:
      """
      CPF ou CNPJ já está em uso.
      """
