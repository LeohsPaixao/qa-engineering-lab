import { parseStringPromise } from 'xml2js';
import { FrameworkMetadata, ParsedData, Parser, RawFile } from '../types';
import { MergedSeleniumData, SeleniumData, SeleniumTestCase, SeleniumTestSuite } from '../types/selenium.types';

/**
 * Converte XML do Selenium para JSON
 * @param xmlContent - Conteúdo XML como string
 * @returns Dados do Selenium convertidos para JSON
 */
async function convertXmlToJson(xmlContent: string): Promise<SeleniumData> {
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

    return jsonData as SeleniumData;
  } catch (error) {
    throw new Error(`Error converting Selenium XML to JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Converte múltiplos XMLs do Selenium para JSON e faz merge
 * @param xmlContents - Array de strings XML
 * @returns Dados do Selenium convertidos para JSON
 * @throws Error se não conseguir converter XML para JSON
 * @throws Error se não conseguir fazer merge dos XMLs
 */
async function convertAndMergeXmls(xmlContents: string[]): Promise<MergedSeleniumData> {
  const testsuites: SeleniumTestSuite[] = [];

  for (const xmlContent of xmlContents) {
    const data = await convertXmlToJson(xmlContent);
    if (data.testsuite) {
      testsuites.push(data.testsuite);
    }
  }

  return { testsuites };
}

/**
 * Converte duração de segundos para segundos (validação)
 * O Selenium já retorna em segundos
 * @param seconds - Duração em segundos (string ou number)
 * @returns Duração em segundos (retorna 0 se inválido)
 */
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

/**
 * Converte status do Selenium para status padronizado
 * @param testCase - Teste do Selenium
 * @returns Status padronizado
 */
function mapStatusToStandard(testCase: SeleniumTestCase): 'passed' | 'failed' | 'skipped' {
  if (testCase.failure && testCase.failure.length > 0) {
    return 'failed';
  }
  if (testCase.error && testCase.error.length > 0) {
    return 'failed';
  }
  if (testCase.skipped && testCase.skipped.length > 0) {
    return 'skipped';
  }
  return 'passed';
}

/**
 * Extrai mensagem de erro do teste do Selenium
 * @param testCase - Teste do Selenium
 * @returns Mensagem de erro ou null se não houver erro
 */
function extractErrorMessage(testCase: SeleniumTestCase): string | null {
  const errorMessages: string[] = [];

  if (testCase.failure && testCase.failure.length > 0) {
    for (const failure of testCase.failure) {
      const message = failure.$?.message || failure._ || '';
      if (message.trim()) {
        errorMessages.push(message.trim());
      }
    }
  }

  if (testCase.error && testCase.error.length > 0) {
    for (const error of testCase.error) {
      const message = error.$?.message || error._ || '';
      if (message.trim()) {
        errorMessages.push(message.trim());
      }
    }
  }

  return errorMessages.length > 0 ? errorMessages.join('\n') : null;
}

/**
 * Gera ID único para o teste
 * Formato: className:testName
 * @param testCase - Teste do Selenium
 * @returns ID único para o teste
 */
function generateTestId(testCase: SeleniumTestCase): string {
  const className = testCase.$.classname.split('.').pop() || 'unknown';

  const testName = testCase.$.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  return `${className}:${testName}`;
}

/**
 * Extrai o nome do arquivo do classname
 * @param classname - Nome da classe (ex: com.qa.solar.LoginTest)
 * @returns Nome do arquivo (ex: LoginTest.java)
 */
function extractFileName(classname: string): string {
  const parts = classname.split('.');
  const className = parts[parts.length - 1] || 'unknown';
  return `${className}.java`;
}

/**
 * Extrai metadados do Selenium se disponível
 * @param data - Dados do Selenium convertidos para JSON
 * @returns Metadados do Selenium ou undefined
 */
function extractMetadata(data: MergedSeleniumData): FrameworkMetadata | undefined {
  const metadata: FrameworkMetadata = {};

  if (data.testsuites && data.testsuites.length > 0) {
    const firstSuite = data.testsuites[0];
    if (firstSuite.$?.hostname) {
      metadata.hostname = firstSuite.$.hostname;
    }
    if (firstSuite.$?.timestamp) {
      metadata.timestamp = firstSuite.$.timestamp;
    }
  }

  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

/**
 * Parser para resultados do Selenium (TEST-*.xml convertido para JSON e mesclado)
 */
export const seleniumParser: Parser = {
  canParse: (file: RawFile): boolean => {
    return file.framework === 'selenium-e2e';
  },
  parse: async (content: unknown, file: RawFile): Promise<ParsedData> => {
    if (!Array.isArray(content)) {
      throw new Error('Invalid selenium data: content is not an array of XML strings');
    }

    if (content.length === 0) {
      throw new Error('Invalid selenium data: no XML files provided');
    }

    const mergedData = await convertAndMergeXmls(content as string[]);

    if (!mergedData.testsuites || mergedData.testsuites.length === 0) {
      throw new Error('Invalid selenium data: no testsuites found');
    }

    const parsedTests: unknown[] = [];

    for (const suite of mergedData.testsuites) {
      const testCases = Array.isArray(suite.testcase) ? suite.testcase : suite.testcase ? [suite.testcase] : [];

      if (testCases.length === 0) {
        continue;
      }

      for (const testCase of testCases) {
        parsedTests.push({
          id: generateTestId(testCase),
          name: testCase.$.name,
          status: mapStatusToStandard(testCase),
          duration_s: secondsToSeconds(testCase.$.time),
          file: extractFileName(testCase.$.classname),
          tags: [],
          error: extractErrorMessage(testCase),
        });
      }
    }

    return {
      framework: file.framework,
      timestamp: file.timestamp,
      type: file.type,
      raw: mergedData,
      tests: parsedTests,
      metadata: extractMetadata(mergedData),
    };
  },
};
