/**
 * Estrutura completa do XML de resultados do Robot Framework convertido para JSON
 */
export interface RobotData {
  robot: RobotRoot;
}

/**
 * Elemento raiz do Robot Framework
 */
export interface RobotRoot {
  $: {
    generator?: string;
    generated?: string;
    rpa?: string;
    schemaversion?: string;
  };
  suite: RobotSuite[];
  statistics?: RobotStatistics[];
  errors?: RobotErrors[];
}

/**
 * Suite do Robot Framework (pode conter suites aninhadas e testes)
 */
export interface RobotSuite {
  $: {
    id: string;
    name: string;
    source?: string;
  };
  suite?: RobotSuite[];
  test?: RobotTest[];
  status?: RobotStatus[];
  doc?: string[];
  metadata?: RobotMetadata[];
  [key: string]: unknown;
}

/**
 * Teste do Robot Framework
 */
export interface RobotTest {
  $: {
    id: string;
    name: string;
    line?: string;
  };
  kw?: RobotKeyword[];
  doc?: string[];
  tag?: string[];
  status?: RobotStatus[];
  [key: string]: unknown;
}

/**
 * Keyword do Robot Framework
 */
export interface RobotKeyword {
  $: {
    name: string;
    owner?: string;
    type?: string;
  };
  kw?: RobotKeyword[];
  msg?: RobotMessage[];
  arg?: string[];
  var?: string[];
  doc?: string[];
  tag?: string[];
  status?: RobotStatus[];
  [key: string]: unknown;
}

/**
 * Mensagem do Robot Framework
 */
export interface RobotMessage {
  $: {
    time?: string;
    level?: string;
  };
  _?: string;
}

/**
 * Status do Robot Framework
 */
export interface RobotStatus {
  $: {
    status: 'PASS' | 'FAIL' | 'SKIP' | 'NOT RUN';
    start?: string;
    elapsed?: string;
    endtime?: string;
  };
  msg?: RobotMessage[];
}

/**
 * Metadados do Robot Framework
 */
export interface RobotMetadata {
  $: {
    name: string;
    value?: string;
  };
}

/**
 * Estatísticas do Robot Framework
 */
export interface RobotStatistics {
  total?: RobotStatistic[];
  tag?: RobotStatistic[];
  suite?: RobotStatistic[];
}

/**
 * Estatística individual
 */
export interface RobotStatistic {
  $: {
    [key: string]: string;
  };
  stat?: RobotStat[];
}

/**
 * Estatística detalhada
 */
export interface RobotStat {
  $: {
    [key: string]: string;
  };
}

/**
 * Erros do Robot Framework
 */
export interface RobotErrors {
  msg?: RobotMessage[];
}
