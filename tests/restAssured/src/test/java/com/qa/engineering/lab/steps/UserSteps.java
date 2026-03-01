package com.qa.engineering.lab.steps;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.qa.engineering.lab.support.FakeDataFactory;
import com.qa.engineering.lab.support.GenerateValidCPF;
import com.qa.engineering.lab.support.TestConstants;
import com.qa.engineering.lab.support.TestContext;
import com.qa.engineering.lab.utils.RequestHelper;

import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.When;
import io.restassured.response.Response;

/**
 * Steps específicos para funcionalidades de gerenciamento de usuários.
 * Contém definições para criação, atualização e exclusão de usuários.
 *
 * @author Leonardo Paixao
 * @version 2.0
 * @since 2026-01-17
 */
public class UserSteps {

    private static final Logger LOG = LoggerFactory.getLogger(UserSteps.class);

    private final TestContext context = TestContext.getInstance();

    // ==================== GIVEN ====================

    /**
     * Obtém os dados do usuário autenticado e armazena o ID no contexto.
     */
    @Given("I am authenticated as a user")
    public void iAmAuthenticatedAsAUser() {
        Response response = RequestHelper.get(TestConstants.USERS_ME_ENDPOINT);
        String userId = response.jsonPath().getString("id");

        context.setUserId(userId);
        LOG.debug("Usuário autenticado com ID: {}", userId);
    }

    /**
     * Cria um usuário com o email especificado e armazena no contexto.
     */
    @Given("there is a user with email {string}")
    public void thereIsAUserWithEmail(String email) {
        String body = buildUserBody(
                email,
                FakeDataFactory.defaultPassword(),
                FakeDataFactory.randomFullName(),
                GenerateValidCPF.generateValidCPF());

        context.setResponse(RequestHelper.post(TestConstants.USERS_ENDPOINT, body));
        context.setUserEmail(email);
        LOG.debug("Usuário criado com email: {}", email);
    }

    /**
     * Cria um usuário com o documento (CPF) especificado.
     */
    @Given("there is a user with document {string}")
    public void thereIsAUserWithDocument(String document) {
        String body = buildUserBody(
                FakeDataFactory.randomEmail(),
                FakeDataFactory.defaultPassword(),
                FakeDataFactory.randomFullName(),
                document);

        context.setResponse(RequestHelper.post(TestConstants.USERS_ENDPOINT, body));
        context.setUserDocument(document);
        LOG.debug("Usuário criado com documento: {}", document);
    }

    // ==================== WHEN ====================

    /**
     * Cria um novo usuário com dados válidos gerados aleatoriamente.
     */
    @When("I create a user with valid data")
    public void iCreateAUserWithValidData() {
        String body = buildUserBody(
                FakeDataFactory.randomEmail(),
                FakeDataFactory.defaultPassword(),
                FakeDataFactory.randomFullName(),
                GenerateValidCPF.generateValidCPF());

        context.setResponse(RequestHelper.post(TestConstants.USERS_ENDPOINT, body));
    }

    /**
     * Envia POST para criar usuário usando o email armazenado no contexto.
     */
    @When("I send a POST request for {string} with email for create a new user")
    public void iSendPostRequestWithEmailToCreateUser(String endpoint) {
        String email = context.getUserEmail();

        String body = buildUserBody(
                email,
                FakeDataFactory.defaultPassword(),
                FakeDataFactory.randomFullName(),
                GenerateValidCPF.generateValidCPF());

        LOG.debug("Criando usuário com email duplicado: {}", email);
        context.setResponse(RequestHelper.post(endpoint, body));
    }

    /**
     * Envia POST para criar usuário usando o documento armazenado no contexto.
     */
    @When("I send a POST request for {string} with document for create a new user")
    public void iSendPostRequestWithDocumentToCreateUser(String endpoint) {
        String document = context.getUserDocument();

        String body = buildUserBody(
                FakeDataFactory.randomEmail(),
                FakeDataFactory.defaultPassword(),
                FakeDataFactory.randomFullName(),
                document);

        LOG.debug("Criando usuário com documento duplicado: {}", document);
        context.setResponse(RequestHelper.post(endpoint, body));
    }

    /**
     * Cria um usuário para ser usado em cenários de exclusão.
     */
    @When("there is a user to be deleted")
    public void thereIsAUserToBeDeleted() {
        String body = buildUserBody(
                FakeDataFactory.randomEmail(),
                FakeDataFactory.defaultPassword(),
                FakeDataFactory.randomFullName(),
                GenerateValidCPF.generateValidCPF());

        Response response = RequestHelper.post(TestConstants.USERS_ENDPOINT, body);
        String userId = response.jsonPath().getString("user.id");

        context.setUserId(userId);
        context.setResponse(response);
        LOG.debug("Usuário criado para exclusão com ID: {}", userId);
    }

    /**
     * Tenta excluir o próprio usuário logado (cenário de erro).
     */
    @When("I try to delete the logged user")
    public void iTryToDeleteTheLoggedUser() {
        String userId = context.getUserId();

        String body = """
                { "ids": [%s] }
                """.formatted(userId);

        context.setResponse(RequestHelper.delete(TestConstants.USERS_DELETE_ENDPOINT, body));
    }

    /**
     * Tenta excluir usuários sem fornecer IDs (cenário de erro).
     */
    @When("I try to delete users without providing ids")
    public void iTryToDeleteUsersWithoutProvidingIds() {
        String body = """
                { "ids": [] }
                """;

        context.setResponse(RequestHelper.delete(TestConstants.USERS_DELETE_ENDPOINT, body));
    }

    /**
     * Envia requisição PATCH para atualizar dados do usuário.
     */
    @When("I send a PATCH request to {string}")
    public void iSendAPatchRequestTo(String endpoint) {
        String body = """
                {
                  "full_name": "%s",
                  "social_name": "%s",
                  "phone": "%s"
                }
                """.formatted(
                FakeDataFactory.randomFullName(),
                FakeDataFactory.randomSocialName(),
                FakeDataFactory.randomPhone());

        context.setResponse(RequestHelper.patch(endpoint, body));
    }

    // ==================== AND ====================

    /**
     * Exclui o usuário cujo ID está armazenado no contexto.
     */
    @And("I delete the user")
    public void iDeleteTheUser() {
        String userId = context.getUserId();

        String body = """
                { "ids": [%s] }
                """.formatted(userId);

        context.setResponse(RequestHelper.delete(TestConstants.USERS_DELETE_ENDPOINT, body));
        LOG.debug("Usuário excluído com ID: {}", userId);
    }

    // ==================== HELPERS ====================

    /**
     * Constrói o body JSON para criação de usuário.
     *
     * @param email    email do usuário
     * @param password senha do usuário
     * @param fullName nome completo
     * @param document CPF ou CNPJ
     * @return JSON formatado
     */
    private String buildUserBody(String email, String password, String fullName, String document) {
        return """
                {
                  "email": "%s",
                  "password": "%s",
                  "full_name": "%s",
                  "doc_type": "%s",
                  "document": "%s"
                }
                """.formatted(email, password, fullName, TestConstants.DOC_TYPE_CPF, document);
    }
}
