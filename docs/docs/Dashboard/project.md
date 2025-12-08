---
sidebar_position: 3
---

# 📂 Projeto

Aqui você encontrará informações sobre o projeto dashboard do monorepo **QA Solar**.

## Como Executar o Projeto

  #### **1. Iniciar o Servidor**
    * Desenvolvimento:
        ```bash
        yarn workspace dashboard dev
        ```

    * Build:
        ```bash
        yarn workspace dashboard build
        ```

    * Build com verificação de tipos:
        ```bash
        yarn workspace dashboard build
        ```

## Estrutura do Projeto

```plaintext
dashboard/
├── public/
│   └── qa-results/
│       └── processed/          # Resultados processados dos testes
│           ├── summary.json    # Resumo geral
│           ├── cypress-ct.json
│           ├── cypress-e2e.json
│           ├── jest.json
│           ├── playwright-e2e.json
│           ├── robot-e2e.json
│           ├── selenium-e2e.json
│           └── vitest.json
├── src/
│   ├── components/             # Componentes reutilizáveis
│   │   ├── cards/             # Cards de resumo
│   │   │   ├── FrameworkCard.vue
│   │   │   └── SummaryCard.vue
│   │   ├── charts/            # Componentes de gráficos
│   │   │   ├── PassFailDonut.vue
│   │   │   ├── TotalBarChart.vue
│   │   │   └── TrendLineChart.vue
│   │   ├── layout/            # Layout da aplicação
│   │   │   └── AppLayout.vue
│   │   ├── tables/            # Tabelas de dados
│   │   │   └── TestsTable.vue
│   │   └── buttonBack.vue
│   ├── features/              # Features/páginas da aplicação
│   │   ├── frameworks/        # Página de frameworks
│   │   │   └── FrameworkPage.vue
│   │   ├── overview/          # Página de overview
│   │   │   └── OverviewPage.vue
│   │   └── tests/             # Página de testes
│   │       └── TestsListPage.vue
│   ├── router/                # Configuração de rotas
│   │   └── index.ts
│   ├── services/              # Serviços de dados
│   │   └── resultsService.ts
│   ├── stores/                # Stores Pinia
│   │   ├── frameworkStore.ts
│   │   ├── summaryStore.ts
│   │   └── index.ts
│   ├── types/                 # Tipos TypeScript
│   │   ├── BarChart.types.ts
│   │   ├── card.types.ts
│   │   ├── Donut.types.ts
│   │   ├── LineChart.types.ts
│   │   ├── results.types.ts
│   │   ├── summaryCard.types.ts
│   │   └── testsTable.types.ts
│   ├── utils/                 # Utilitários
│   │   ├── formatFrameworkName.ts
│   │   └── getFrameworkType.ts
│   ├── App.vue                # Componente raiz
│   └── main.ts                # Ponto de entrada
├── package.json
└── vite.config.ts
```

## Scripts Disponíveis

  #### **Desenvolvimento**
    - **`yarn dev`**: Inicia o servidor em modo desenvolvimento
    - **`yarn start`**: Build e inicia o servidor
    - **`yarn build`**: Compila o projeto para produção (com verificação de tipos)

  #### **Qualidade de Código**
    - **`yarn lint`**: Executa o linter e corrige problemas automaticamente
    - **`yarn format`**: Formata o código com Prettier

## Funcionalidades

### Overview
- Visualização geral dos resultados de todos os testes
- Cards de resumo com métricas principais
- Gráficos de distribuição (Donut Chart)
- Gráfico de barras por framework
- Cards individuais para cada framework

### Frameworks
- Visualização detalhada de cada framework de teste
- Análise de resultados por framework
- Comparação entre frameworks

### Testes
- Lista completa de todos os testes executados
- Detalhes de cada teste individual
- Filtros e busca

## Dados

O dashboard consome dados processados pelo preprocessor localizados em:
- `public/qa-results/processed/summary.json` - Resumo geral
- `public/qa-results/processed/{framework}.json` - Resultados por framework

Os dados são carregados via fetch API e gerenciados através de stores Pinia para reatividade.
