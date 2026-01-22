package com.qa.solar.support;

import net.datafaker.Faker;

public class FakeDataFactory {
  private static final Faker faker = new Faker();

  private FakeDataFactory() {}

  public static String randomEmail() {
    return faker.internet().emailAddress();
  }

  public static String randomPassword() {
    return "123456";
  }

  public static String randomFullName() {
    return faker.name().fullName();
  }

  public static String randomSocialName() {
    return faker.name().name();
  }

  public static String randomPhone() {
    return faker.phoneNumber().phoneNumberNational();
  }
}
