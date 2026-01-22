package com.qa.solar.support;

import io.restassured.response.Response;

/**
 * Contexto compartilhado entre os steps do Cucumber
 * Armazena o estado da requisição e resposta para validações
 * 
 * @author Leonardo Paixão
 * @version 1.0
 * @since 2026-01-17
 */
public class TestContext {
    private static final ThreadLocal<TestContext> context = new ThreadLocal<>();
    
    private String endpoint;
    private Response response;
    
    private TestContext() {
    }
    
    public static TestContext getInstance() {
        TestContext instance = context.get();
        if (instance == null) {
            instance = new TestContext();
            context.set(instance);
        }
        return instance;
    }
    
    public static void reset() {
        context.remove();
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
}
