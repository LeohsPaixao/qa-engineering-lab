@api
Feature: Get My Profile
  As a user of the QA Solar System
  I want to access my own data

  Scenario: Get my data when authenticated
    Given I am authenticated
    When I send a GET request to "/users/me"
    Then the response status code should be 200
    And the response should match the "user/me/get-me-success" schema

  Scenario: Should not retrieve my data without authentication
    When I send a GET request to "/users/me"
    Then the response status code should be 401
    And the response should match the "user/me/get-me-failure" schema
    And the response message should be "Unauthorized"