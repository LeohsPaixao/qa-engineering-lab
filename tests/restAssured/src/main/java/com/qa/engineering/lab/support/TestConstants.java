package com.qa.engineering.lab.support;

/**
 * Constantes utilizadas nos testes.
 * Centraliza valores fixos para facilitar manutenção.
 *
 * @author Leonardo Paixao
 * @version 1.0
 * @since 2026-01-23
 */
public final class TestConstants {

    private TestConstants() {
    }

    /**
     * Email do usuário genérico para testes.
     * Este usuário deve existir no banco de dados de teste.
     */
    public static final String DEFAULT_USER_EMAIL = "generic@example.com";

    /**
     * Senha padrão para testes.
     */
    public static final String DEFAULT_PASSWORD = "123456";

    public static final String AUTH_LOGIN_ENDPOINT = "/auth/login";
    public static final String AUTH_LOGOUT_ENDPOINT = "/auth/logout";
    public static final String USERS_ENDPOINT = "/users";
    public static final String USERS_ME_ENDPOINT = "/users/me";
    public static final String USERS_DELETE_ENDPOINT = "/users/delete";
    public static final String PASSWORD_RECOVERY_ENDPOINT = "/password-recovery/forgot-password";
    public static final String SCHEMA_BASE_PATH = "schemas/";
    public static final String SCHEMA_EXTENSION = ".schema.json";
    public static final String DOC_TYPE_CPF = "cpf";
    public static final String DOC_TYPE_CNPJ = "cnpj";
    public static final String CONTENT_TYPE_JSON = "application/json";
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String BEARER_PREFIX = "Bearer ";
}
