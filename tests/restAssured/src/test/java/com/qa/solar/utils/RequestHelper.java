package com.qa.solar.utils;

import com.qa.solar.support.TestConstants;
import com.qa.solar.support.TestContext;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;

/**
 * Helper para realizar requisições HTTP via REST Assured.
 * Centraliza a configuração de headers e autenticação.
 *
 * @author Leonardo Paixao
 * @version 1.1
 * @since 2026-01-17
 */
public final class RequestHelper {

    private RequestHelper() {
    }

    /**
     * Configura a requisição base com Content-Type e Authorization (se disponível).
     *
     * @return RequestSpecification configurada
     */
    private static RequestSpecification baseRequest() {
        RequestSpecification request = RestAssured.given()
                .contentType(TestConstants.CONTENT_TYPE_JSON);

        String token = TestContext.getInstance().getAuthToken();

        if (token != null && !token.isEmpty()) {
            request.header(
                    TestConstants.AUTHORIZATION_HEADER,
                    TestConstants.BEARER_PREFIX + token);
        }

        return request;
    }

    /**
     * Realiza uma requisição GET.
     *
     * @param endpoint caminho do endpoint
     * @return Response da requisição
     */
    public static Response get(String endpoint) {
        return baseRequest()
                .get(endpoint)
                .then()
                .extract()
                .response();
    }

    /**
     * Realiza uma requisição POST com body.
     *
     * @param endpoint caminho do endpoint
     * @param body     corpo da requisição em JSON
     * @return Response da requisição
     */
    public static Response post(String endpoint, String body) {
        return baseRequest()
                .body(body)
                .post(endpoint)
                .then()
                .extract()
                .response();
    }

    /**
     * Realiza uma requisição POST sem body.
     *
     * @param endpoint caminho do endpoint
     * @return Response da requisição
     */
    public static Response postWithoutBody(String endpoint) {
        return baseRequest()
                .post(endpoint)
                .then()
                .extract()
                .response();
    }

    /**
     * Realiza uma requisição PATCH com body.
     *
     * @param endpoint caminho do endpoint
     * @param body     corpo da requisição em JSON
     * @return Response da requisição
     */
    public static Response patch(String endpoint, String body) {
        return baseRequest()
                .body(body)
                .patch(endpoint)
                .then()
                .extract()
                .response();
    }

    /**
     * Realiza uma requisição DELETE com body.
     *
     * @param endpoint caminho do endpoint
     * @param body     corpo da requisição em JSON
     * @return Response da requisição
     */
    public static Response delete(String endpoint, String body) {
        return baseRequest()
                .body(body)
                .delete(endpoint)
                .then()
                .extract()
                .response();
    }

    /**
     * Realiza uma requisição DELETE sem body.
     *
     * @param endpoint caminho do endpoint
     * @return Response da requisição
     */
    public static Response delete(String endpoint) {
        return baseRequest()
                .delete(endpoint)
                .then()
                .extract()
                .response();
    }

    /**
     * Realiza uma requisição PUT com body.
     *
     * @param endpoint caminho do endpoint
     * @param body     corpo da requisição em JSON
     * @return Response da requisição
     */
    public static Response put(String endpoint, String body) {
        return baseRequest()
                .body(body)
                .put(endpoint)
                .then()
                .extract()
                .response();
    }
}
