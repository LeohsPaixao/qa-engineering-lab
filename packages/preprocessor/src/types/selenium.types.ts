/**
 * Estrutura completa do XML de resultados do Selenium (JUnit XML) convertido para JSON
 */
export interface SeleniumData {
  testsuite: SeleniumTestSuite;
}

/**
 * Test Suite do Selenium
 */
export interface SeleniumTestSuite {
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
  properties?: SeleniumProperties[];
  testcase: SeleniumTestCase[];
  'system-out'?: string[];
  'system-err'?: string[];
}

/**
 * Propriedades do Test Suite
 */
export interface SeleniumProperties {
  property?: SeleniumProperty[];
}

/**
 * Propriedade individual
 */
export interface SeleniumProperty {
  $: {
    name: string;
    value?: string;
  };
}

/**
 * Test Case do Selenium
 */
export interface SeleniumTestCase {
  $: {
    name: string;
    classname: string;
    time?: string;
  };
  failure?: SeleniumFailure[];
  error?: SeleniumError[];
  skipped?: SeleniumSkipped[];
  'system-out'?: string[];
  'system-err'?: string[];
}

/**
 * Falha do teste
 */
export interface SeleniumFailure {
  $?: {
    message?: string;
    type?: string;
  };
  _?: string;
}

/**
 * Erro do teste
 */
export interface SeleniumError {
  $?: {
    message?: string;
    type?: string;
  };
  _?: string;
}

/**
 * Teste pulado
 */
export interface SeleniumSkipped {
  $?: {
    message?: string;
  };
  _?: string;
}

/**
 * Dados mesclados de múltiplos arquivos Selenium
 */
export interface MergedSeleniumData {
  testsuites: SeleniumTestSuite[];
}
