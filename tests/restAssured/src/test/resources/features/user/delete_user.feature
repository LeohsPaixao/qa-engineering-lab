@api
Feature: Delete User
  As an authenticated user
  I should be able to remove users

  Background:
    Given I am authenticated

  Scenario: Should delete users successfully
    When there is a user to be deleted
    And I delete the user
    Then the response status code should be 200
    And the response should match the "user/delete_users/delete-user-success" schema
    And the response message should be "1 usuário(s) excluído(s) com sucesso!"

  Scenario: Should not delete the logged user
    Given I am authenticated as a user
    When I try to delete the logged user
    Then the response status code should be 400
    And the response should match the "user/delete_users/delete-user-logged" schema
    And the response message should be "Você não pode excluir o usuário logado."

  Scenario: Should return error when no users are found
    When I try to delete users without providing ids
    Then the response status code should be 404
    And the response should match the "user/delete_users/no-provide-ids" schema
    And the response message should be "Nenhum usuário encontrado para excluir"
