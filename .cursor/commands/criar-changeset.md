# Criar Changeset

## Visão geral
Cria um changeset bem estruturado usando o script automatizado, analisando as alterações na branch atual.

## Processo Automatizado

Quando este comando for executado, o assistente deve:

1. **Analisar as alterações no Git**
   - Verificar o status do git (`git status`)
   - Identificar quais pacotes/workspaces foram modificados
   - Analisar os arquivos alterados para entender o tipo de mudança
   - Determinar o nível de impacto apropriado baseado nas mudanças:
     - **patch**: Correções de bugs, ajustes menores, refatorações internas
     - **minor**: Novas funcionalidades, melhorias que não quebram compatibilidade
     - **major**: Breaking changes, mudanças que quebram a API/compatibilidade

2. **Criar o changeset automaticamente**
   - Executar o comando: `yarn workspace scripts create-changeset --package <pacote> --type <tipo> --message "<descrição>"`
   - Gerar uma descrição apropriada baseada nas alterações analisadas
   - Usar convenção de commits (feat, fix, chore, etc.) na mensagem

3. **Informar o resultado**
   - Mostrar o changeset criado
   - Exibir o nome do arquivo gerado
   - Perguntar se o usuário quer ajustar a descrição ou tipo antes de commitar

## Uso Manual (se necessário)

Se preferir criar manualmente ou especificar parâmetros:

```bash
yarn workspace scripts create-changeset \
  --package <nome-do-pacote> \
  --type <patch|minor|major> \
  --message "<descrição das alterações>"
```

### Pacotes disponíveis:
- `preprocessor`
- `playwright-ui-tests`
- `dashboard`
- `selenium-ui-tests`
- `frontend`
- `cypress-ui-tests`
- `backend`
- `robot-framework-ui-tests`
- `docs`
- `performance-tests`

### Tipos de versão:
- **patch**: Correções de bugs, ajustes menores
- **minor**: Novas funcionalidades (não quebram compatibilidade)
- **major**: Mudanças que quebram compatibilidade (breaking changes)