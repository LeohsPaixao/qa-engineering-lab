package com.qa.engineering.lab.support;

import java.util.Random;

/**
 * Classe para gerar um CPF válido (Cadastro de Pessoas Físicas).
 * 
 * @author Leonardo Paixão
 * @version 1.0
 * @since 2026-01-18
 */
public class GenerateValidCPF {

  private static final Random random = new Random();

  private GenerateValidCPF() {}

  private static String generateRandomDigits(int length) {
    StringBuilder digits = new StringBuilder();
    for (int i = 0; i < length; i++) {
      digits.append(random.nextInt(10));
    }
    return digits.toString();
  }

  private static int calculateVerifierDigit(String base) {
    int sum = 0;
    int weight = base.length() + 1;

    for (int i = 0; i < base.length(); i++) {
      sum += Character.getNumericValue(base.charAt(i)) * weight;
      weight--;
    }

    int remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  }

  private static String formatCPF(String cpf) {
    return cpf.replaceAll("(\\d{3})(\\d{3})(\\d{3})(\\d{2})", "$1.$2.$3-$4");
  }

  public static String generateValidCPF() {
    String baseDigits = generateRandomDigits(9);
    int firstVerifier = calculateVerifierDigit(baseDigits);
    int secondVerifier = calculateVerifierDigit(baseDigits + firstVerifier);
    return formatCPF(baseDigits + firstVerifier + secondVerifier);
  }
}
