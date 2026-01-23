@api
Feature: Recover Password
  As a authenticated user
  I want to recover password in the QA Solar System

  Scenario: Should be able to recover password
    Given there is a user email "generic@example.com"
    When I send a POST request for "/password-recovery/forgot-password" with email
    Then the response status code should be 200
    And the response should match the "password/password-recover-success" schema
    And the response message should be "Um e-mail foi enviado com instruções para recuperar a senha."

  Scenario: Should not recover password with email invalid
    Given there is a user email "invalid@invalid.com"
    When I send a POST request for "/password-recovery/forgot-password" with email
    Then the response status code should be 404
    And the response should match the "password/password-recover-failure" schema
    And the response message should be "Usuário não encontrado."
