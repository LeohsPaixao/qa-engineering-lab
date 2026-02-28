import RecoverPasswordTemplate from 'frontend/src/modules/auth/components/recoverPassword/RecoverPasswordTemplate.vue';

describe('Componente de recuperação de senha', () => {
  it('Deveria exibir o componente de recuperação de senha', () => {
    cy.mount(RecoverPasswordTemplate);
    cy.get('[data-testid="form-recover-password"]').should('be.visible');
  });

  it('Deveria exibir todas as informações do componente de recuperação de senha', () => {
    cy.mount(RecoverPasswordTemplate);
    cy.get('h2').should('be.visible').and('have.text', 'Recuperar Senha');
    cy.get('p:eq(0)').should('be.visible').and('have.text', 'Por favor, insira o seu e-mail para recuperar a senha:');
    cy.get('[data-testid="label-email-recover-password"]').should('be.visible').and('have.text', 'E-mail');
    cy.get('[data-testid="input-email-recover-password"]').should('be.visible');
  });

  it('Deveria exibir mensagem de erro quando o e-mail é inválido', () => {
    cy.mount(RecoverPasswordTemplate);
    cy.get('[data-testid="input-email-recover-password"]').type('invalid-email');
    cy.get('[data-testid="input-email-recover-password"]').blur();
    cy.get('[data-testid="message-error-email-recover-password"]').should('be.visible').and('have.text', 'Email inválido.');
  });

  it('Deveria exibir mensagem de sucesso quando o campo e-mail está vazio', () => {
    cy.mount(RecoverPasswordTemplate);
    cy.get('[data-testid="input-email-recover-password"]').type('generic@example.com').clear().blur();
    cy.get('[data-testid="message-error-email-recover-password"]').should('be.visible').and('have.text', 'O Email é obrigatório.');
  });

  it('Deveria ter o link de voltar ao login', () => {
    cy.mount(RecoverPasswordTemplate);
    cy.get('[data-testid="link-go-to-login"]').should('have.attr', 'to', '/');
  });
});