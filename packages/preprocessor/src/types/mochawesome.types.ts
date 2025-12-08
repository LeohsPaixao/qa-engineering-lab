/**
 * Interface para o formato mochawesome.json
 */
export interface MochawesomeStats {
  suites: number;
  tests: number;
  passes: number;
  pending: number;
  failures: number;
  start: string;
  end: string;
  duration: number;
  testsRegistered: number;
  passPercent: number;
  pendingPercent: number;
  other: number;
  hasOther: boolean;
  skipped: number;
  hasSkipped: boolean;
}

export interface MochawesomeError {
  message?: string;
  estack?: string;
  diff?: string | null;
}

export interface MochawesomeTest {
  title: string;
  fullTitle: string;
  timedOut: number | null;
  duration: number;
  state: 'passed' | 'failed' | 'pending';
  speed: string | null;
  pass: boolean;
  fail: boolean;
  pending: boolean;
  context: unknown;
  code?: string;
  err: MochawesomeError | {};
  uuid: string;
  parentUUID: string;
  isHook: boolean;
  skipped: boolean;
}

export interface MochawesomeSuite {
  uuid: string;
  title: string;
  fullFile: string;
  file: string;
  beforeHooks: unknown[];
  afterHooks: unknown[];
  tests: MochawesomeTest[];
  suites: MochawesomeSuite[];
  passes: string[];
  failures: string[];
  pending: string[];
  skipped: string[];
  duration: number;
  root: boolean;
  rootEmpty: boolean;
  _timeout?: number;
}

export interface MochawesomeResult {
  uuid: string;
  title: string;
  fullFile: string;
  file: string;
  beforeHooks: unknown[];
  afterHooks: unknown[];
  tests: unknown[];
  suites: MochawesomeSuite[];
  passes: string[];
  failures: string[];
  pending: string[];
  skipped: string[];
  duration: number;
  root: boolean;
  rootEmpty: boolean;
  _timeout?: number;
}

export interface MochawesomeData {
  stats: MochawesomeStats;
  results: MochawesomeResult[];
  meta?: {
    mocha?: { version: string };
    mochawesome?: { version: string; options: unknown };
    marge?: { version: string; options: unknown };
    [key: string]: unknown;
  };
}
