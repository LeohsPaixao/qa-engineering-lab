import { ParsedData, Parser, RawFile } from '@/types';
import { NewmanData, NewmanTestCase, NewmanTestSuite } from '@/types/newman.types';
import path from 'path';
import { parseStringPromise } from 'xml2js';

async function convertXmlToJson(xmlContent: string): Promise<NewmanData> {
  try {
    const jsonData = await parseStringPromise(xmlContent, {
      explicitArray: true,
      mergeAttrs: false,
      explicitCharkey: false,
      trim: true,
      normalize: true,
      normalizeTags: false,
      attrkey: '$',
      charkey: '_',
      explicitRoot: true,
    });

    return jsonData as NewmanData;
  } catch (error) {
    throw new Error(`Error converting Newman XML to JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function secondsToSeconds(seconds: string | number | undefined | null): number {
  if (seconds === undefined || seconds === null) {
    return 0;
  }

  const num = typeof seconds === 'string' ? parseFloat(seconds) : seconds;

  if (isNaN(num)) {
    return 0;
  }

  return num;
}

function extractErrorMessage(test: NewmanTestCase): string | null {
  const failures = test.failure?.[test.failure.length - 1];

  if (!failures) {
    return null;
  }

  return failures.$.message || null;
}

function generateTestId(test: NewmanTestCase, filePath: string): string {
  const fileName = path.basename(filePath, path.extname(filePath));
  const testName = test.$.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  return `${fileName}:${testName}`;
}

function extractAllTests(testsuites: NewmanTestSuite[]): Array<{ test: NewmanTestCase; file: string }> {
  const allTests: Array<{ test: NewmanTestCase; file: string }> = [];

  for (const testsuite of testsuites) {
    if (testsuite.testcase) {
      for (const testcase of testsuite.testcase) {
        allTests.push({ test: testcase, file: testsuite.$.name });
      }
    }

    if (testsuite.testsuite) {
      allTests.push(...extractAllTests(testsuite.testsuite));
    }
  }

  return allTests;
}

export const newmanParser: Parser = {
  canParse: (file: RawFile): boolean => {
    return file.framework === 'newman';
  },
  parse: async (content: unknown, file: RawFile): Promise<ParsedData> => {
    if (typeof content !== 'string') {
      throw new Error('Invalid Newman data: content is not a string (XML)');
    }

    const data = await convertXmlToJson(content);

    if (!data.testsuites || !data.testsuites.testsuite) {
      throw new Error('Invalid Newman data: missing testsuites or testsuite');
    }

    const allTests = extractAllTests(data.testsuites.testsuite);
    const parsedTests: unknown[] = [];

    for (const { test, file: filePath } of allTests) {
      const isFailed = test.failure && test.failure.length > 0;
      const testStatus = isFailed ? 'failed' : 'passed';
      const testDuration = secondsToSeconds(test.$.time);
      const testId = generateTestId(test, filePath);

      parsedTests.push({
        id: testId,
        name: test.$.name,
        status: testStatus,
        duration: testDuration,
        error: extractErrorMessage(test),
        suite: test.$.classname,
        file: filePath,
        timestamp: new Date().toISOString(),
      });
    }

    return {
      framework: file.framework,
      timestamp: file.timestamp,
      type: file.type,
      raw: data,
      tests: parsedTests,
    };
  },
};
