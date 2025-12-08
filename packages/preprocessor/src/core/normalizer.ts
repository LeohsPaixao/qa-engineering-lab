import { NormalizedFrameworkData, ParsedData, TestResult, TestStatus, TestSummary } from '../types';

/**
 * Valida e converte um teste do formato intermediário para TestResult
 */
function validateAndConvertTest(test: unknown): TestResult {
  if (!test || typeof test !== 'object') {
    throw new Error('Invalid test data: test is not an object');
  }

  const testObj = test as Record<string, unknown>;

  if (typeof testObj.id !== 'string') {
    throw new Error('Invalid test data: missing or invalid id');
  }
  if (typeof testObj.name !== 'string') {
    throw new Error('Invalid test data: missing or invalid name');
  }
  if (!['passed', 'failed', 'skipped', 'pending', 'todo', 'unknown'].includes(testObj.status as string)) {
    throw new Error(`Invalid test data: invalid status ${testObj.status}`);
  }
  if (typeof testObj.duration_s !== 'number') {
    throw new Error('Invalid test data: missing or invalid duration_s');
  }
  if (typeof testObj.file !== 'string') {
    throw new Error('Invalid test data: missing or invalid file');
  }

  return {
    id: testObj.id,
    name: testObj.name,
    status: testObj.status as TestStatus,
    duration_s: testObj.duration_s,
    file: testObj.file,
    tags: Array.isArray(testObj.tags) ? (testObj.tags as string[]) : undefined,
    error: testObj.error !== undefined ? (testObj.error === null ? null : String(testObj.error)) : undefined,
  };
}

/**
 * Calcula o summary baseado nos testes
 */
function calculateSummary(tests: TestResult[]): TestSummary {
  const summary: TestSummary = {
    total: tests.length,
    passed: 0,
    failed: 0,
    skipped: 0,
    duration_s: 0,
  };

  for (const test of tests) {
    if (test.status === 'passed') {
      summary.passed++;
    } else if (test.status === 'failed') {
      summary.failed++;
    } else if (test.status === 'skipped') {
      summary.skipped++;
    }

    summary.duration_s += test.duration_s;
  }

  return summary;
}

/**
 * Normaliza os dados analisados para o formato padrão
 * @param parsed - os dados analisados
 * @returns os dados normalizados
 * @throws Error se os dados não forem válidos
 */
export function normalize(parsed: ParsedData): NormalizedFrameworkData {
  if (!Array.isArray(parsed.tests)) {
    throw new Error('Invalid parsed data: tests is not an array');
  }

  const normalizedTests: TestResult[] = [];
  for (const test of parsed.tests) {
    try {
      normalizedTests.push(validateAndConvertTest(test));
    } catch (error) {
      console.error('Error validating test:', error);
    }
  }

  const summary = calculateSummary(normalizedTests);

  return {
    framework: parsed.framework,
    timestamp: parsed.timestamp,
    type: parsed.type,
    summary,
    tests: normalizedTests,
    metadata: parsed.metadata,
  };
}
