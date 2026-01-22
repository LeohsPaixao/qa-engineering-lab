@api
Feature: Auth
  In order to authenticate the user in the system
  As a user of the QA Solar system
  I want to be able to do the authentication processes

  Scenario Outline: Login validation
    When I send a POST request for "/auth/login" with the following body:
      """
      { "email": "<email>", "password": "<password>" }
      """
    Then the response status code should be <statusCode>
    And the response should match the "<schema>" schema
    And the response body should contain the following:
      """
      <message>
      """

    Examples:
      | email               | password | statusCode | message                      | schema              |
      | generic@example.com |   123456 |        200 | Login realizado com sucesso! | auth/login-success  |
      | invalid@example.com |   123456 |        404 | Usuário não encontrado.      | auth/login-failure  |
      | generic@example.com |  1234567 |        401 | A senha não confere.         | auth/password-wrong |

  Scenario: Logout with success
    When I send a POST request for "/auth/logout" without body
    Then the response status code should be 200
    And the response body should contain the following:
      """
      O usuário foi deslogado com sucesso!
      """
