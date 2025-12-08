#!/usr/bin/env tsx
/**
 * Script para criar changesets de forma não-interativa
 * 
 * Uso:
 *   yarn workspace scripts create-changeset --package <nome> --type <patch|minor|major> --message "<descrição>"
 * 
 * Exemplo:
 *   yarn workspace scripts create-changeset --package frontend --type minor --message "feat: adiciona nova funcionalidade de busca"
 */

import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

interface ChangesetOptions {
  package: string;
  type: 'patch' | 'minor' | 'major';
  message: string;
}

/**
 * Gera um nome aleatório para o changeset (formato: adjective-noun-verb)
 */
function generateChangesetName(): string {
  const adjectives = [
    'bright', 'dry', 'famous', 'fast', 'flat', 'giant', 'good', 'honest',
    'little', 'loud', 'metal', 'nasty', 'nice', 'plenty', 'popular', 'shaggy',
    'tame', 'thirty', 'tidy', 'unlucky'
  ];
  const nouns = [
    'eggs', 'scissors', 'lions', 'trainers', 'cars', 'sloths', 'bees', 'olives',
    'coins', 'terms', 'beers', 'ads', 'jobs', 'planets', 'sheep', 'lobsters',
    'tigers', 'carrots', 'cougars', 'zebras', 'lizards', 'turtles', 'owls', 'books'
  ];
  const verbs = [
    'sniff', 'press', 'fail', 'prove', 'roll', 'promise', 'burn', 'yawn',
    'tease', 'leave', 'retire', 'own', 'search', 'push', 'pretend', 'play',
    'joke', 'swim', 'repeat'
  ];

  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const verb = verbs[Math.floor(Math.random() * verbs.length)];

  return `${adj}-${noun}-${verb}`;
}

/**
 * Valida o nome do pacote
 */
function validatePackage(packageName: string): boolean {
  const validPackages = [
    'preprocessor',
    'playwright-ui-tests',
    'dashboard',
    'selenium-ui-tests',
    'frontend',
    'cypress-ui-tests',
    'backend',
    'robot-framework-ui-tests',
    'docs',
    'performance-tests'
  ];

  return validPackages.includes(packageName);
}

/**
 * Cria o arquivo changeset
 */
function createChangeset(options: ChangesetOptions): string {
  const { package: packageName, type, message } = options;

  if (!validatePackage(packageName)) {
    throw new Error(
      `Pacote inválido: ${packageName}. Pacotes válidos: ${[
        'preprocessor',
        'playwright-ui-tests',
        'dashboard',
        'selenium-ui-tests',
        'frontend',
        'cypress-ui-tests',
        'backend',
        'robot-framework-ui-tests',
        'docs',
        'performance-tests'
      ].join(', ')}`
    );
  }

  if (!['patch', 'minor', 'major'].includes(type)) {
    throw new Error(`Tipo inválido: ${type}. Use: patch, minor ou major`);
  }

  if (!message || message.trim().length === 0) {
    throw new Error('Mensagem é obrigatória');
  }

  // Encontra a raiz do workspace
  let workspaceRoot = process.cwd();
  while (!fs.existsSync(path.join(workspaceRoot, '.changeset'))) {
    const parent = path.dirname(workspaceRoot);
    if (parent === workspaceRoot) {
      throw new Error('Não foi possível encontrar o diretório .changeset');
    }
    workspaceRoot = parent;
  }

  const changesetDir = path.join(workspaceRoot, '.changeset');
  const changesetName = generateChangesetName();
  const changesetFile = path.join(changesetDir, `${changesetName}.md`);

  // Verifica se o arquivo já existe (improvável, mas possível)
  if (fs.existsSync(changesetFile)) {
    // Gera um novo nome
    const newName = generateChangesetName();
    const newFile = path.join(changesetDir, `${newName}.md`);
    if (fs.existsSync(newFile)) {
      // Se ainda existir, usa um hash
      const hash = randomBytes(4).toString('hex');
      return createChangesetFile(path.join(changesetDir, `${changesetName}-${hash}.md`), packageName, type, message);
    }
    return createChangesetFile(newFile, packageName, type, message);
  }

  return createChangesetFile(changesetFile, packageName, type, message);
}

/**
 * Cria o conteúdo do arquivo changeset
 */
function createChangesetFile(
  filePath: string,
  packageName: string,
  type: string,
  message: string
): string {
  const content = `---
"${packageName}": ${type}
---

${message}
`;

  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

/**
 * Função principal
 */
function main() {
  const args = process.argv.slice(2);
  
  let packageName: string | null = null;
  let type: 'patch' | 'minor' | 'major' | null = null;
  let message: string | null = null;

  // Parse dos argumentos
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--package' || args[i] === '-p') {
      packageName = args[++i];
    } else if (args[i] === '--type' || args[i] === '-t') {
      type = args[++i] as 'patch' | 'minor' | 'major';
    } else if (args[i] === '--message' || args[i] === '-m') {
      message = args[++i];
    } else if (!args[i].startsWith('--') && !message) {
      // Se não começar com -- e ainda não tiver mensagem, assume que é a mensagem
      message = args[i];
    }
  }

  // Validação
  if (!packageName) {
    console.error('Erro: --package é obrigatório');
    console.error('\nUso:');
    console.error('  yarn workspace scripts create-changeset --package <nome> --type <patch|minor|major> --message "<descrição>"');
    process.exit(1);
  }

  if (!type) {
    console.error('Erro: --type é obrigatório');
    console.error('\nUso:');
    console.error('  yarn workspace scripts create-changeset --package <nome> --type <patch|minor|major> --message "<descrição>"');
    process.exit(1);
  }

  if (!message) {
    console.error('Erro: --message é obrigatório');
    console.error('\nUso:');
    console.error('  yarn workspace scripts create-changeset --package <nome> --type <patch|minor|major> --message "<descrição>"');
    process.exit(1);
  }

  try {
    const filePath = createChangeset({ package: packageName, type, message });
    console.log(`✅ Changeset criado com sucesso: ${path.basename(filePath)}`);
    console.log(`📦 Pacote: ${packageName}`);
    console.log(`📊 Tipo: ${type}`);
    console.log(`💬 Mensagem: ${message}`);
  } catch (error) {
    console.error('❌ Erro ao criar changeset:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

main();
