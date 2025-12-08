import path from 'path';
import { parseStringPromise } from 'xml2js';
import { FrameworkMetadata, ParsedData, Parser, RawFile } from '../types';
import { RobotData, RobotSuite, RobotTest } from '../types/robot.types';

/**
 * Converte XML do Robot Framework para JSON
 * @param xmlContent - Conteúdo XML como string
 * @returns Dados do Robot Framework convertidos para JSON
 * @throws Error se não conseguir converter XML para JSON
 */
async function convertXmlToJson(xmlContent: string): Promise<RobotData> {
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

    return jsonData as RobotData;
  } catch (error) {
    throw new Error(`Error converting Robot Framework XML to JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Converte duração de segundos para segundos (validação)
 * O Robot Framework já retorna em segundos
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
 * Converte status do Robot Framework para status padronizado
 * @param status - Status do Robot Framework
 * @returns Status padronizado
 */
function mapStatusToStandard(status: 'PASS' | 'FAIL' | 'SKIP' | 'NOT RUN' | string): 'passed' | 'failed' | 'skipped' {
  if (status === 'PASS') {
    return 'passed';
  }
  if (status === 'FAIL') {
    return 'failed';
  }
  if (status === 'SKIP' || status === 'NOT RUN') {
    return 'skipped';
  }
  return 'failed';
}

/**
 * Extrai mensagem de erro do teste do Robot Framework
 * @param test - Teste do Robot Framework
 * @returns Mensagem de erro ou null se não houver erro
 */
function extractErrorMessage(test: RobotTest): string | null {
  const status = test.status?.[0];

  if (!status || status.$.status !== 'FAIL') {
    return null;
  }

  const errorMessages: string[] = [];

  if (status.msg) {
    for (const msg of status.msg) {
      if (msg.$?.level === 'ERROR' || msg.$?.level === 'FAIL') {
        const messageText = msg._ || '';
        if (messageText.trim()) {
          errorMessages.push(messageText.trim());
        }
      }
    }
  }

  if (errorMessages.length === 0 && test.kw) {
    for (const kw of test.kw) {
      if (kw.status) {
        for (const kwStatus of kw.status) {
          if (kwStatus.$?.status === 'FAIL' && kwStatus.msg) {
            for (const msg of kwStatus.msg) {
              if (msg.$?.level === 'ERROR' || msg.$?.level === 'FAIL') {
                const messageText = msg._ || '';
                if (messageText.trim()) {
                  errorMessages.push(messageText.trim());
                }
              }
            }
          }
        }
      }
    }
  }

  return errorMessages.length > 0 ? errorMessages.join('\n') : null;
}

/**
 * Gera ID único para o teste
 * Formato: fileName:testName
 * @param test - Teste do Robot Framework
 * @param filePath - Caminho do arquivo
 * @returns ID único para o teste
 */
function generateTestId(test: RobotTest, filePath: string): string {
  const fileName = path.basename(filePath, path.extname(filePath));
  const testName = test.$.name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-');
  return `${fileName}:${testName}`;
}

/**
 * Extrai o nome do arquivo do source da suite
 * @param source - Source da suite
 * @returns Nome do arquivo (retorna 'unknown.robot' se não houver source)
 */
function extractFileName(source: string | undefined): string {
  if (!source) {
    return 'unknown.robot';
  }
  return path.basename(source);
}

/**
 * Extrai todos os testes de todas as suites recursivamente
 * @param suites - Suites do Robot Framework
 * @returns Array de objetos com teste e nome do arquivo
 */
function extractAllTests(suites: RobotSuite[]): Array<{ test: RobotTest; file: string }> {
  const allTests: Array<{ test: RobotTest; file: string }> = [];

  for (const suite of suites) {
    const fileName = extractFileName(suite.$.source);

    if (suite.test) {
      for (const test of suite.test) {
        allTests.push({ test, file: fileName });
      }
    }

    if (suite.suite) {
      allTests.push(...extractAllTests(suite.suite));
    }
  }

  return allTests;
}

/**
 * Extrai metadados do Robot Framework se disponível
 * @param data - Dados do Robot Framework
 * @returns Metadados do Robot Framework ou undefined
 */
function extractMetadata(data: RobotData): FrameworkMetadata | undefined {
  const metadata: FrameworkMetadata = {};

  if (data.robot?.$?.generator) {
    metadata.robot = data.robot.$.generator;
  }

  if (data.robot?.$?.generated) {
    metadata.generated = data.robot.$.generated;
  }

  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

/**
 * Parser para resultados do Robot Framework (output.xml convertido para JSON)
 */
export const robotParser: Parser = {
  canParse: (file: RawFile): boolean => {
    return file.framework === 'robot-e2e';
  },
  parse: async (content: unknown, file: RawFile): Promise<ParsedData> => {
    if (typeof content !== 'string') {
      throw new Error('Invalid robot data: content is not a string (XML)');
    }

    const data = await convertXmlToJson(content);

    if (!data.robot || !data.robot.suite) {
      throw new Error('Invalid robot data: missing robot or suite');
    }

    const allTests = extractAllTests(data.robot.suite);
    const parsedTests: unknown[] = [];

    for (const { test, file: filePath } of allTests) {
      const status = test.status?.[test.status.length - 1];

      if (!status) {
        continue;
      }

      parsedTests.push({
        id: generateTestId(test, filePath),
        name: test.$.name,
        status: mapStatusToStandard(status.$.status),
        duration_s: secondsToSeconds(status.$.elapsed),
        file: filePath,
        tags: test.tag || [],
        error: extractErrorMessage(test),
      });
    }

    return {
      framework: file.framework,
      timestamp: file.timestamp,
      type: file.type,
      raw: data,
      tests: parsedTests,
      metadata: extractMetadata(data),
    };
  },
};
