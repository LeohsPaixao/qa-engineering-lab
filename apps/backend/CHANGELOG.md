# backend

## 2.0.4

### Patch Changes

- fed49fc: feat: reconfigura o jest, adicionando um reporter e configurando o caminho de saida dos resultados

## 2.0.3

### Patch Changes

- 2f520cc: test: atualiza a versão do node e os pacotes referenciados ao node de todos os projetos typescript
- e8ffbf3: test: melhora a configuração do Jest para os testes unitários do Backend e Vitest para os testes unitários do Frontend

## 2.0.2

### Patch Changes

- 9088391: test: cria os testes de perfil no projeto selenium e refatora a tela de perfil

## 2.0.1

### Patch Changes

- 8e30405: feat: remove o arquivo REAMDE.md dos projetos
- 20aef23: feat: adiciona a propriedade private para os projetos

## 2.0.0

### Major Changes

- 1dff647: feat: migra o projeto de javascript com express para typescript com nestJs

### Minor Changes

- 4d39146: chore: refaz os testes e2e do projeto backend e melhora os componentes
- 4d39146: feat: adiciona testes unitários nos controllers do modúlos do backend

### Patch Changes

- 50f3805: feat: remove pacotes e pasta do projeto backend que não será mais utilizado nesta nova versão
- 4d39146: feat: resolve alguns problemas do JWT do backend e melhore o retorno do serviço findAll

## 1.11.0

### Minor Changes

- 9c7f60f: feat: cria uma branch somente para o zapier e remove conteúdo relacionado da main

## 1.10.0

### Minor Changes

- bf20799: feat: corrige e adiciona novos testes unitários no backend

### Patch Changes

- 5556806: feat: adiciona console.clear nos catchs

## 1.9.0

### Minor Changes

- d823d6f: feat: cria novas rotas para o App no Zapier

## 1.8.1

### Patch Changes

- 48e6afe: feat: corrige o problema de não aparece a mensagem no toast ao deslogar

## 1.8.0

### Minor Changes

- 0f40abf: feat: criação do arquivo Dockerfile para o servico de backend

## 1.7.2

### Patch Changes

- f6e9075: feat: resolve as dependencias de pacotes do projeto backend

## 1.7.1

### Patch Changes

- 40e92eb: feat: adiciona try catch no endpoint de login

## 1.7.0

### Minor Changes

- cd65c96: feat: configura e cria os testes de API utilizando o jest

## 1.6.0

### Minor Changes

- 0507cb1: feat: termina a documentação da API
- b72726c: feat: configura o swagger no projeto do backend

## 1.5.1

### Patch Changes

- c3483be: chore: ajusta uma validação no controlador deleteUsers.js

## 1.5.0

### Minor Changes

- db38215: feat: instala eslint no projeto de backend

## 1.4.0

### Minor Changes

- e4c10b8: feat: cria novos endpoints para a nova tela de tabela de usuários

## 1.3.1

### Patch Changes

- 3ca055a: chore: padroniza o estilo dos botoes e remove consoles

## 1.3.0

### Minor Changes

- 4d602ef: feat: cria novos endpoints para busca de usuário e logout
- 491db2b: feat: adiciona um novo endpoint para usuarios

### Patch Changes

- 82c276b: feat: organiza o código com o Prettier

## 1.2.1

### Patch Changes

- chore: aprimora o workflow main.yml

## 1.2.0

### Minor Changes

- 224ec1d: feat: ajusta a conexao entre o frontend e backend
- 4f72bac: feat: cria seed genericUser.js para gerar usuario generico

## 1.1.0

### Minor Changes

- dae790c: feat: ajusta o projeto inteiro

  description: |
  **O que mudou:**
  Foram realizadas melhorias gerais em todo o projeto, incluindo ajustes nas configurações de testes de UI, atualizações no frontend e no backend para melhorar a estrutura do código e a integração entre as partes.

  **Por que a mudança foi feita:**
  As mudanças foram necessárias para garantir uma maior consistência no código, facilitar a manutenção e otimizar a execução dos testes. Além disso, a atualização melhora a integração entre o frontend e o backend.

  **Como atualizar o código:**

  - **Playwright e Cypress (UI Tests):** Certifique-se de que todas as dependências de teste estão atualizadas e reconfigure os testes conforme as novas práticas e integrações.
  - **Frontend:** Verifique as atualizações nas dependências do frontend e adapte os componentes que possam ter sido refatorados.
  - **Backend:** Se você estiver utilizando o backend, atualize para as novas versões das APIs e ajuste suas chamadas conforme necessário.

  **Exemplo de código de ajuste:**

  - Para conexões com o backend, agora você pode usar hooks ao invés de axios puro.

  ```js
  // Antes:
  export const registerUser = async (userData) => {
    try {
      const response = await axios.post('http://localhost:3001/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  };

  // Depois:
  const registerUser = async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  };

  export const useRegisterUser = () => {
    return useMutation({
      mutationFn: registerUser,
      onSuccess: (data) => {
        toast.success(data.message, { autoClose: 3000 });
      },
      onError: (error) => {
        const errorMessage = error.response?.data?.message || error.message;
        toast.error(errorMessage, { autoClose: 5000 });
      },
    });
  };
  ```
