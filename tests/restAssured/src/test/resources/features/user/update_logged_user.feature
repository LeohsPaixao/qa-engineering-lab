@api
Feature: Update Users Logged
  As an authenticated user
  I want to update my data users

  Scenario: Update data when authenticated
    Given I am authenticated
    When I send a PATCH request to "/users/me"
    Then the response status code should be 200
    And the response should match the "user/update_user/update-user-success" schema
    And the response message should be "Usuário alterado com sucesso!"

  Scenario: Should not retrieve the list of users without authentication
    When I send a PATCH request to "/users/me"
    Then the response status code should be 401
    And the response should match the "user/update_user/update-user-failure" schema
    And the response message should be "Unauthorized"
