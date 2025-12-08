# frontend

## 2.0.4

### Patch Changes

- f66d5c1: feat: reconfigura o reporter e output dos resultados do framework vitest no frontend

## 2.0.3

### Patch Changes

- 13b6a20: test: ajusta e corrija alguns testes unitários e funções
- 2f520cc: test: instala e configura o framework vitest para testes unitários no frontend
- db20925: test: cria os testes unitários para os utilitários de Roteamento
- cca6bec: test: adiciona testes unitários para componentes principais e melhora infraestrutura de testes

  - Configura infraestrutura de testes com Vitest, mocks e setup
  - Cria novos testes unitários para AppFooter, AppHeader, AppHome e LoadingErrorState
  - Corrige falhas nos testes existentes (api.spec.ts, isAuthenticated.spec.ts)
  - Melhora testabilidade da função handleClickOutside no AppHeader
  - Adiciona data-testid para melhor identificação de elementos nos testes

- a951846: test: desenvolve os testes unitários para os utilitários do frontend
- d5770cd: test: cria testes unitários para os template de perfil do usuário logado
- 4eba93c: test: cria testes unitários para o template de registro de usuários
- 4eba93c: test: cria testes unitários para o template de login
- d5770cd: test: cria testes unitários para os template de listagem de usuários
- e8ffbf3: test: melhora a configuração do Jest para os testes unitários do Backend e Vitest para os testes unitários do Frontend
- 8d33004: test: cria testes unitários nos serviços do frontend e adiciona JSDoc
- 70ad39e: test: cria testes unitários para o template de recuperação de senha

## 2.0.2

### Patch Changes

- 9088391: test: cria os testes de perfil no projeto selenium e refatora a tela de perfil

## 2.0.1

### Patch Changes

- 8e30405: feat: remove o arquivo REAMDE.md dos projetos
- 20aef23: feat: adiciona a propriedade private para os projetos

## 2.0.0

### Major Changes

- 4d39146: feat: refatora o projeto de frontend

### Minor Changes

- 5a4530f: feat: atualiza o ESLint e Typescript do projeto frontend
- a276a9e: feat: modifica os composables para enviar e receber dados dos novos endpoints do backend

## 1.6.2

### Patch Changes

- bf20799: feat: retafora a tela de registro de usuários
- 5556806: feat: adiciona console.clear nos catchs

## 1.6.1

### Patch Changes

- 48e6afe: feat: corrige o problema de não aparece a mensagem no toast ao deslogar

## 1.6.0

### Minor Changes

- 44a4ff9: feat: criação do arquivo Dockerfile para o serviço de frontend

## 1.5.2

### Patch Changes

- 5626cda: feat: adiciona novos pacotes e remove outros para resolver as dependências do projeto frontend

## 1.5.1

### Patch Changes

- b72726c: feat: altera o hook useFetchUser para enviar o email no parâmetro pela url

## 1.5.0

### Minor Changes

- 0842e53: feat: instala e configura o plugin de instrumentação de código
- 0be3ecb: feat: instala e configura o coverage do cypress no projeto

## 1.4.2

### Patch Changes

- b1fdd03: test: adiciona alguns data-testid nos componentes da tela de cadastro de usuário
- c3483be: test: ajusta alguns data-testid no componente ListUsersTemplate.vue
- b6f447d: chore: adiciona validações no campo de telefone

## 1.4.1

### Patch Changes

- db38215: chore: configura melhor o eslint do frontend

## 1.4.0

### Minor Changes

- e4c10b8: feat: adiciona a nova tela de tabela de usuários

## 1.3.1

### Patch Changes

- 3ca055a: chore: padroniza o estilo dos botoes e remove consoles

## 1.3.0

### Minor Changes

- 491db2b: feat: melhora a experencia do usuario com hooks e feedbacks
- 82c276b: feat: cria a nova tela do projeto
- 4d602ef: feat: cria a tela de recuperar a senha

### Patch Changes

- cda13b4: feat: altera a rota de login

## 1.2.1

### Patch Changes

- chore: aprimora o workflow main.yml

## 1.2.0

### Minor Changes

- 224ec1d: feat: ajusta a conexao entre o frontend e backend

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
