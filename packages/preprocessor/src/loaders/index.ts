import { Loader, RawFile } from '../types';
import { loadCypress } from './loadCypress';
import { loadJest } from './loadJest';
import { loadNewman } from './loadNewman';
import { loadPlaywright } from './loadPlaywright';
import { loadRestAssured } from './loadRestAssured';
import { loadRobot } from './loadRobot';
import { loadSelenium } from './loadSelenium';
import { loadVitest } from './loadVitest';

/**
 * Lista de todos os loaders disponíveis
 * @returns Array de loaders
 */
const loaders: Loader[] = [loadCypress, loadPlaywright, loadVitest, loadJest, loadRobot, loadSelenium, loadRestAssured, loadNewman];

/**
 * Seleciona o loader para o arquivo dado
 * @param file - Arquivo para selecionar o loader
 * @returns Loader selecionado
 * @throws Error se não encontrar nenhum loader para o arquivo
 */
export function getLoaderFor(file: RawFile): Loader {
  const loader = loaders.find((l) => l.canLoad(file));

  if (!loader) {
    throw new Error(`No loader found for framework: ${file.framework}`);
  }

  return loader;
}
