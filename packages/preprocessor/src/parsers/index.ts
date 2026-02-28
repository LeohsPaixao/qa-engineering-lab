import { Parser, RawFile } from '../types';
import { cypressParser } from './cypressParser';
import { jestParser } from './jestParser';
import { newmanParser } from './newmanParser';
import { playwrightParser } from './playwrightParser';
import { restassuredParser } from './restassuredParser';
import { robotParser } from './robotParser';
import { seleniumParser } from './seleniumParser';
import { vitestParser } from './vitestParser';

/**
 * Lista de todos os parsers implementados
 * @returns Array de parsers
 */
const parsers: Parser[] = [cypressParser, playwrightParser, vitestParser, jestParser, robotParser, seleniumParser, restassuredParser, newmanParser];

/**
 * Seleciona o parser para o arquivo dado
 * @param file - Arquivo para selecionar o parser
 * @returns Parser selecionado
 * @throws Error se não encontrar nenhum parser para o arquivo
 */
export function getParserFor(file: RawFile): Parser {
  const parser = parsers.find((p) => p.canParse(file));

  if (!parser) {
    throw new Error(`No parser found for framework: ${file.framework}`);
  }

  return parser;
}
