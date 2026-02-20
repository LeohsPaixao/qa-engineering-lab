/**
 * Estrutura completa de XML de resultados do Newman convertido para JSON
 */

export interface NewmanData {
  testsuites: NewmanTestSuites;
}

export interface NewmanTestSuites {
  $: {
    name: string;
    tests: string;
    time: string;
  };
  testsuite: NewmanTestSuite[];
}

export interface NewmanTestSuite {
  $: {
    name: string;
    id: string;
    timestamp: string;
    tests: string;
    failures: string;
    errors: string;
    time: string;
  };
  testcase: NewmanTestCase[];
}

export interface NewmanTestCase {
  $: {
    name: string;
    time: string;
    classname: string;
  };
  failure?: NewmanFailure[];
}

export interface NewmanFailure {
  $: {
    type: string;
    message: string;
  };
}
