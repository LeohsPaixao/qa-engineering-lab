---
sidebar_position: 4
---

# 📚 Componentes

## Layout

    #### AppLayout
    Layout principal da aplicação com navegação e estrutura base.

## Cards

    #### SummaryCard
    Card de resumo exibindo métricas principais (Total, Passed, Failed, Duração).
    Suporta diferentes variantes: `default`, `success`, `danger`, `info`.

    #### FrameworkCard
    Card exibindo informações de um framework específico com resumo de resultados.

## Gráficos

    #### PassFailDonut
    Gráfico de rosca (Donut Chart) mostrando distribuição de resultados:
    - Passed (verde)
    - Failed (vermelho)
    - Skipped (cinza, quando aplicável)

    #### TotalBarChart
    Gráfico de barras exibindo total de testes por framework.
    Suporta visualização consolidada ou individual por framework.

    #### TrendLineChart
    Gráfico de linha mostrando tendências de resultados ao longo do tempo.

## Tabelas

    #### TestsTable
    Tabela exibindo lista de testes com informações detalhadas:
    - Nome do teste
    - Status (Passed/Failed/Skipped)
    - Duração
    - Framework
    - Timestamp

## Features (Páginas)

    #### OverviewPage
    Página principal com visão geral de todos os resultados:
    - Cards de resumo
    - Gráficos de distribuição
    - Cards de frameworks
    - Controles de visualização (consolidado/individual)

    #### FrameworkPage
    Página de detalhes de um framework específico:
    - Resumo do framework
    - Lista de testes
    - Gráficos específicos

    #### TestsListPage
    Página com lista completa de todos os testes:
    - Tabela de testes
    - Filtros e busca
    - Detalhes individuais

## Stores (Pinia)

    #### summaryStore
    Gerencia dados do resumo geral:
    - `overall`: Resumo geral
    - `byFramework`: Resumo por framework
    - `successRate`: Taxa de sucesso calculada
    - `formattedDuration`: Duração formatada
    - `fetchSummary()`: Carrega dados do resumo

    #### frameworkStore
    Gerencia dados de frameworks específicos:
    - Resultados por framework
    - Carregamento de dados
    - Estados de loading/error

## Serviços

    #### resultsService
    Serviço para carregar e processar resultados:
    - `loadSummary()`: Carrega resumo geral
    - `loadFrameworkResults()`: Carrega resultados de um framework
    - `loadAllFrameworkResults()`: Carrega todos os frameworks
    - `formatDuration()`: Formata duração
    - `formatTimestamp()`: Formata timestamp
    - `calculateSuccessRate()`: Calcula taxa de sucesso

## Utilitários

    #### formatFrameworkName
    Formata nome do framework para exibição (ex: `cypress-e2e` → `Cypress E2E`).

    #### getFrameworkType
    Retorna o tipo do framework (E2E, Unit, Component, etc).
