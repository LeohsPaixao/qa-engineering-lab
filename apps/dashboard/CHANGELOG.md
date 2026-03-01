# dashboard

## 3.0.0

### Major Changes

- 7bd2a19: refactor: Repaginada no projeto, alteração de QA-Solar para QA Engineering Lab

### Patch Changes

- 2fe0218: docs: refatora o código da documentação e dashboard
- 548b3c0: test: corrige os testes quebrados e altera os resultados do dashboard com a correção

## 2.0.0

### Major Changes

- 55aaf63: feat: implementar dashboard completo de visualização de resultados de testes

  - Implementa layout responsivo com sidebar colapsável
  - Adiciona páginas Overview, Frameworks e Tests com visualizações completas
  - Cria componentes de cards, gráficos (Chart.js) e tabelas interativas
  - Implementa stores Pinia para gerenciamento de estado reativo
  - Adiciona serviço de resultados com parsing de dados de todos os frameworks
  - Implementa seletor consolidado/individual para visualização de frameworks
  - Adiciona filtros, busca e paginação nas tabelas de testes
  - Corrige problemas de reatividade e configuração do build

### Patch Changes

- 9a325ff: feat: configura o app Dashboard no Monorepo QA-Solar
- 70becd1: chore: ajustes finais do desenvolvimento do dashboard

  Realiza ajustes finais e refinamentos no app Dashboard, incluindo melhorias na estrutura de componentes, correções de estilos e otimizações gerais do código.

- e1d0814: feat: configura a navegação do app Dashboard
- 65f962e: feat: cria as configurações do ESLint e Prettier no App Dashboard
