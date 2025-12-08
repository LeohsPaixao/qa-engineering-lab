# playwright-ui-tests

## 2.0.3

### Patch Changes

- 97409cc: feat: reconfigura o Reporter do projeto de testes Playwright e altera o output dos resultados dos testes na pasta padrão qa-results

## 2.0.2

### Patch Changes

- 60c68b7: test: corrige os testes E2E do projeto de testes Playwright
- 2f520cc: test: atualiza a versão do node e os pacotes referenciados ao node de todos os projetos typescript

## 2.0.1

### Patch Changes

- 8e30405: feat: remove o arquivo REAMDE.md dos projetos
- 20aef23: feat: adiciona a propriedade private para os projetos

## 2.0.0

### Major Changes

- 4d39146: feat: refatora o projeto de testes Playwright

### Minor Changes

- 4d39146: feat: altera os projetos de testes para a pasta tests

## 1.3.0

### Minor Changes

- 4750125: docs: adiciona documentação no projeto

## 1.2.0

### Minor Changes

- c647a81: test: adiciona testes na tela de listagem de usuários com o projeto Playwright
- 5c19a98: test: adiciona testes na tela de cadastro do usuário com o projeto Playwright
- 5c19a98: test: adiciona testes na tela de recuperação de senha com o projeto Playwright
- 8b293f3: test: adiciona testes na tela de perfil do usuário com o projeto Playwright

### Patch Changes

- ffccc3d: test: adiciona variaveis de ambiente para o projeto Playwright

## 1.1.5

### Patch Changes

- e43fff5: feat: corrige os testes e o workflow

## 1.1.4

### Patch Changes

- cda13b4: test: resolve os testes quebrados apos a atualização dos componentes
- 0069498: test: ajusta os testes quebrados devido a atualizações

## 1.1.3

### Patch Changes

- chore: aprimora o workflow main.yml

## 1.1.2

### Patch Changes

- 8b3d4bc: test: tira o teste ignorado do login.spec.ts

## 1.1.1

### Patch Changes

- 224ec1d: test: finaliza os testes da tela de login

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
      const response = await axios.post(
        "http://localhost:3001/register",
        userData,
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message);
    }
  };

  // Depois:
  const registerUser = async (userData) => {
    const response = await api.post("/register", userData);
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
