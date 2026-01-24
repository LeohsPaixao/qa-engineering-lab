import { parseStringPromise } from 'xml2js';
import { FrameworkMetadata, ParsedData, Parser, RawFile } from '../types';
import { MergedRestAssuredData, RestAssuredData, RestAssuredTestCase, RestAssuredTestSuite } from '../types/restassured.types';

/**
 * Converte XML do RestAssured para JSON
 * @param xmlContent - Conteúdo XML como string
 * @returns Dados do RestAssured convertidos para JSON
 */
async function convertXmlToJson(xmlContent: string): Promise<RestAssuredData> {
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

    return jsonData as RestAssuredData;
  } catch (error) {
    throw new Error(`Error converting RestAssured XML to JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Converte múltiplos XMLs do RestAssured para JSON e faz merge
 * @param xmlContents - Array de strings XML
 * @returns Dados do RestAssured convertidos para JSON
 * @throws Error se não conseguir converter XML para JSON
 * @throws Error se não conseguir fazer merge dos XMLs
 */
async function convertAndMergeXmls(xmlContents: string[]): Promise<MergedRestAssuredData> {
  const testsuites: RestAssuredTestSuite[] = [];

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
 * O RestAssured já retorna em segundos
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
 * Converte status do RestAssured para status padronizado
 * @param testCase - Teste do RestAssured
 * @returns Status padronizado
 */
function mapStatusToStandard(testCase: RestAssuredTestCase): 'passed' | 'failed' | 'skipped' {
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
 * Extrai mensagem de erro do teste do RestAssured
 * @param testCase - Teste do RestAssured
 * @returns Mensagem de erro ou null se não houver erro
 */
function extractErrorMessage(testCase: RestAssuredTestCase): string | null {
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
 * @param testCase - Teste do RestAssured
 * @returns ID único para o teste
 */
function generateTestId(testCase: RestAssuredTestCase): string {
  const className = testCase.$.classname.split('.').pop() || 'unknown';

  const testName = testCase.$.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');

  return `${className}:${testName}`;
}

function normalizeSystemOut(systemOut: unknown): string {
  if (!systemOut) {
    return '';
  }

  if (Array.isArray(systemOut)) {
    return systemOut.join('\n');
  }
  if (typeof systemOut === 'object' && '_' in systemOut) {
    return String((systemOut as any)._);
  }
  if (typeof systemOut === 'string') {
    return systemOut;
  }

  return '';
}

/**
 * Extrai informações do systemOut caso seja um Scenario Outline
 * @param systemOut - String de saida do JunitXML
 * @returns Nome da feature
 */
function parseScenarioOutlineFromSystemOut(systemOutRaw: unknown): { scenarioOutline?: string; featureFile?: string } {
  const systemOut = normalizeSystemOut(systemOutRaw);
  const result: {
    scenarioOutline?: string;
    featureFile?: string;
  } = {};

  const lines = systemOut.split('\n');

  for (const line of lines) {
    const scenarioMatch = line.match(/Scenario Outline:\s*(.*?)(?=\s*\?|$)/);

    if (scenarioMatch) {
      result.scenarioOutline = scenarioMatch[1].trim();
    }

    const featureMatch = line.match(/features\/.+\.feature/);

    if (featureMatch) {
      result.featureFile = featureMatch[0].split('/').pop();
    }
  }

  return result;
}

/**
 * Extrai o nome do arquivo .feature a partir do classname do Cucumber
 * @param classname - ex: feature_classpath_features/user/get_logged_user.feature
 * @returns ex: get_logged_user.feature
 */
function extractFileName(classname: string): string {
  const normalized = classname.replace(/\\/g, '/');
  const parts = normalized.split('/');
  return parts[parts.length - 1] || 'unknown.feature';
}

/**
 * Extrai metadados do RestAssured se disponível
 * @param data - Dados do RestAssured convertidos para JSON
 * @returns Metadados do RestAssured ou undefined
 */
function extractMetadata(data: MergedRestAssuredData): FrameworkMetadata | undefined {
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
 * Parser para resultados do RestAssured (TEST-*.xml convertido para JSON e mesclado)
 */
export const restassuredParser: Parser = {
  canParse: (file: RawFile): boolean => {
    return file.framework === 'rest-assured';
  },

  parse: async (content: unknown, file: RawFile): Promise<ParsedData> => {
    if (!Array.isArray(content)) {
      throw new Error('Invalid RestAssured data: content is not an array of XML strings');
    }

    if (content.length === 0) {
      throw new Error('Invalid RestAssured data: no XML files provided');
    }

    const mergedData = await convertAndMergeXmls(content as string[]);

    if (!mergedData.testsuites || mergedData.testsuites.length === 0) {
      throw new Error('Invalid RestAssured data: no testsuites found');
    }

    const parsedTests: any[] = [];

    for (const suite of mergedData.testsuites) {
      const testCases = Array.isArray(suite.testcase) ? suite.testcase : suite.testcase ? [suite.testcase] : [];

      for (const testCase of testCases) {
        let fileName = extractFileName(testCase.$.classname);
        let testName = testCase.$.name;

        if (testCase.$.classname === 'Examples' && testCase['system-out']) {
          const { scenarioOutline, featureFile } = parseScenarioOutlineFromSystemOut(testCase['system-out']);

          if (featureFile) {
            fileName = featureFile;
          }

          if (scenarioOutline) {
            testName = `${scenarioOutline} ${testCase.$.name}`;
          }
        }

        parsedTests.push({
          id: generateTestId(testCase),
          name: testName,
          status: mapStatusToStandard(testCase),
          duration_s: secondsToSeconds(testCase.$.time),
          file: fileName,
          tags: ['api'],
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
