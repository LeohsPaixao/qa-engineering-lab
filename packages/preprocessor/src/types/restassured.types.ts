/**
 * Estrutura completa do XML de resultados do RestAssured (JUnit XML) convertido para JSON
 */
export interface RestAssuredData {
  testsuite: RestAssuredTestSuite;
}

/**
 * Test Suite do RestAssured
 */
export interface RestAssuredTestSuite {
  $: {
    name: string;
    tests: string;
    skipped?: string;
    failures?: string;
    errors?: string;
    timestamp?: string;
    hostname?: string;
    time?: string;
  };
  properties?: RestAssuredProperties[];
  testcase: RestAssuredTestCase[];
  'system-out'?: string[];
  'system-err'?: string[];
}

/**
 * Propriedades do Test Suite
 */
export interface RestAssuredProperties {
  property?: RestAssuredProperty[];
}

/**
 * Propriedade individual
 */
export interface RestAssuredProperty {
  $: {
    name: string;
    value?: string;
  };
}

/**
 * Test Case do RestAssured
 */
export interface RestAssuredTestCase {
  $: {
    name: string;
    classname: string;
    time?: string;
  };
  failure?: RestAssuredFailure[];
  error?: RestAssuredError[];
  skipped?: RestAssuredSkipped[];
  'system-out'?: string;
  'system-err'?: string[];
}

/**
 * Falha do teste
 */
export interface RestAssuredFailure {
  $?: {
    message?: string;
    type?: string;
  };
  _?: string;
}

/**
 * Erro do teste
 */
export interface RestAssuredError {
  $?: {
    message?: string;
    type?: string;
  };
  _?: string;
}

/**
 * Teste pulado
 */
export interface RestAssuredSkipped {
  $?: {
    message?: string;
  };
  _?: string;
}

/**
 * Dados mesclados de múltiplos arquivos RestAssured
 */
export interface MergedRestAssuredData {
  testsuites: RestAssuredTestSuite[];
}

export type ParsedOutlineInfo = {
  featureFile: string | null;
  scenarioOutline: string | null;
};
