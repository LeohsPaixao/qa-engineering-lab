---
sidebar_position: 5
---

# 🧪 Testes

Aqui você encontrará informações sobre os testes do projeto backend do monorepo **QA Solar**.

## Testes

  #### **Executar Testes**
    - **`yarn test`**: Executa todos os testes
    - **`yarn test:coverage`**: Executa testes com cobertura

  #### **Cobertura de Testes**
    Os testes cobrem os módulos principais da aplicação:
    - Módulo de Autenticação
    - Módulo de Usuários
    - Módulo de Recuperação de Senha

## Testes de API (Postman/Newman)

Aqui você encontrará informações sobre a coleção de testes de API do projeto backend, gerenciada com Postman e executada via Newman.

A coleção de Postman, denominada "**QA Solar API**", é descrita como "API for QA Solar application - Version 2.0.4. Built with NestJS and PostgreSQL. Base URL: http://localhost:3001. Swagger documentation available at /api".

#### **Executar Testes de API**
    - **`yarn test:newman`**: Executa todos os testes de API via Newman.

#### **Cobertura dos Testes de API**
    Os testes de API focam na validação das funcionalidades da API, cobrindo os seguintes módulos e aspectos:
    - **Autenticação**: Login (sucesso, senha inválida, usuário não encontrado), Logout.
    - **Usuários**: Criação de usuário (sucesso, conflito de CPF/CNPJ, conflito de e-mail), Listagem de usuários (sucesso, não autorizado, usuários não encontrados), Obtenção de usuário atual, Atualização de usuário (sucesso, usuário não encontrado), Exclusão de usuários (sucesso, exclusão de usuário logado, usuários não encontrados).
    - **Recuperação de Senha**: Solicitação de recuperação de senha (sucesso, e-mail não encontrado).
    - **Validação de Endpoints**: Status codes e schemas de resposta.
    - **Cenários de Segurança**: Acesso a recursos protegidos.
    - **Dados Dinâmicos**: Utilização de variáveis e pré-scripts para geração de dados de teste (ex: CPF, nomes, e-mails).

A **Base URL** para a API é `http://localhost:3001` e a documentação interativa do **Swagger** está disponível em `/api`.