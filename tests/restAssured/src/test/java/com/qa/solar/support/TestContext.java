package com.qa.solar.support;

import io.restassured.response.Response;

/**
 * Contexto compartilhado entre os steps do Cucumber.
 * Utiliza ThreadLocal para garantir isolamento entre execuções paralelas.
 * Armazena o estado da requisição e resposta para validações.
 *
 * @author Leonardo Paixao
 * @version 2.0
 * @since 2026-01-17
 */
public class TestContext {

    private static final ThreadLocal<TestContext> CONTEXT = new ThreadLocal<>();

    private String endpoint;
    private String authToken;
    private String userId;
    private String userEmail;
    private String userDocument;
    private Response response;

    private TestContext() {
    }

    /**
     * Obtém a instância do contexto para a thread atual.
     * Cria uma nova instância se não existir.
     *
     * @return instância do TestContext
     */
    public static TestContext getInstance() {
        TestContext instance = CONTEXT.get();
        if (instance == null) {
            instance = new TestContext();
            CONTEXT.set(instance);
        }
        return instance;
    }

    /**
     * Remove o contexto da thread atual.
     * Deve ser chamado após cada cenário para evitar vazamento de estado.
     */
    public static void reset() {
        CONTEXT.remove();
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public Response getResponse() {
        return response;
    }

    public void setResponse(Response response) {
        this.response = response;
    }

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String token) {
        this.authToken = token;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserDocument() {
        return userDocument;
    }

    public void setUserDocument(String userDocument) {
        this.userDocument = userDocument;
    }
}
