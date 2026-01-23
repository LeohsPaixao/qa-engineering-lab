@api
Feature: Get List of Users
  As an authenticated user
  I want to list users

  Scenario: Get list of users when authenticated
    Given I am authenticated
    When I send a GET request to "/users"
    Then the response status code should be 200
    And the response should match the "user/list_user/list-users-success" schema

  Scenario: Should not retrieve the list of users without authentication
    When I send a GET request to "/users"
    Then the response status code should be 401
    And the response should match the "user/list_user/list-users-failure" schema
    And the response message should be "Unauthorized"
