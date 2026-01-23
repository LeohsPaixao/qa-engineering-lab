package com.qa.solar.support;

import java.util.Locale;

import net.datafaker.Faker;

/**
 * Factory para geração de dados fake para testes.
 * Utiliza a biblioteca DataFaker com locale pt-BR.
 *
 * @author Leonardo Paixao
 * @version 1.1
 * @since 2026-01-17
 */
public final class FakeDataFactory {

    private static final Faker FAKER = new Faker(Locale.of("pt", "BR"));

    private FakeDataFactory() {
    }

    /**
     * Gera um email aleatório único.
     *
     * @return email no formato usuario@dominio.com
     */
    public static String randomEmail() {
        return FAKER.internet().emailAddress();
    }

    /**
     * Retorna a senha padrão para testes.
     * Utiliza senha fixa para facilitar validações.
     *
     * @return senha padrão "123456"
     */
    public static String defaultPassword() {
        return TestConstants.DEFAULT_PASSWORD;
    }

    /**
     * Gera um nome completo aleatório (nome + sobrenome).
     *
     * @return nome completo
     */
    public static String randomFullName() {
        return FAKER.name().fullName();
    }

    /**
     * Gera um nome social aleatório.
     *
     * @return nome social
     */
    public static String randomSocialName() {
        return FAKER.name().firstName();
    }

    /**
     * Gera um número de telefone brasileiro válido.
     * Formato: apenas números, 10-11 dígitos.
     *
     * @return telefone no formato nacional
     */
    public static String randomPhone() {
        String areaCode = String.valueOf(FAKER.number().numberBetween(11, 99));
        String number = FAKER.number().digits(9);
        return areaCode + number;
    }

    /**
     * Gera um primeiro nome aleatório.
     *
     * @return primeiro nome
     */
    public static String randomFirstName() {
        return FAKER.name().firstName();
    }

    /**
     * Gera um sobrenome aleatório.
     *
     * @return sobrenome
     */
    public static String randomLastName() {
        return FAKER.name().lastName();
    }
}
