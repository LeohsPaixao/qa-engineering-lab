import RegisterTemplate from 'frontend/src/modules/user/components/register/RegisterTemplate.vue';

describe('Componente de registro de usuário', () => {
  it('Deveria ser possível visualizar o componente', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="register-form"]').should('exist');
  });

  it('Deveria ser possível visualizar todos os elementos do componente', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="title-register"]').should('be.visible');
    cy.get('[data-testid="description-register"]').should('be.visible');
    cy.get('[data-testid="register-form"]').should('be.visible');
    cy.get('[data-testid="label-fullname"]').should('be.visible');
    cy.get('[data-testid="input-fullname"]').should('be.visible');
    cy.get('[data-testid="label-socialname"]').should('be.visible');
    cy.get('[data-testid="input-socialname"]').should('be.visible');
    cy.get('[data-testid="label-document"]').should('be.visible');
    cy.get('[data-testid="select-document-type"]').should('be.visible');
    cy.get('[data-testid="input-document"]').should('be.visible');
    cy.get('[data-testid="label-phone"]').should('be.visible');
    cy.get('[data-testid="input-phone"]').should('be.visible');
    cy.get('[data-testid="label-email"]').should('be.visible');
    cy.get('[data-testid="input-email"]').should('be.visible');
    cy.get('[data-testid="label-password"]').should('be.visible');
    cy.get('[data-testid="input-password"]').should('be.visible');
    cy.get('[data-testid="label-password-confirmation"]').should('be.visible');
    cy.get('[data-testid="input-password-confirmation"]').should('be.visible');
    cy.get('[data-testid="btn-register"]').should('be.visible');
    cy.get('[data-testid="link-go-to-login"]').should('be.visible');
  });

  it('Deveria ser possível visualizar o erro no campo de Nome Completo quando tiver apenas um nome', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-fullname"]').type('João', { delay: 0 }).blur();
    cy.get('[data-testid="input-error-fullname"]').should('be.visible');
    cy.get('[data-testid="input-error-fullname"]').should('have.text', 'O Nome Completo deve conter pelo menos Nome e Sobrenome.');
  });

  it('Deveria ser possível visualizar o erro no campo de Nome Completo quando estiver vazio', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-fullname"]').type('Henrique', { delay: 0 }).clear().blur();
    cy.get('[data-testid="input-error-fullname"]').should('be.visible');
    cy.get('[data-testid="input-error-fullname"]').should('have.text', 'O Nome Completo é obrigatório.');
  });

  it('Deveria ser possível visualizar o erro no campo de CPF/CNPJ quando estiver vazio', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-document"]').type('12345678900', { delay: 0 }).clear().blur();
    cy.get('[data-testid="input-error-cpfcnpj"]').should('be.visible');
    cy.get('[data-testid="input-error-cpfcnpj"]').should('have.text', 'O CPF/CNPJ é obrigatório.');
  });

  it('Deveria ser possível visualizar o erro no campo de CPF quando o valor for inválido', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-document"]').type('12345678900', { delay: 0 }).blur();
    cy.get('[data-testid="input-error-cpfcnpj"]').should('be.visible');
    cy.get('[data-testid="input-error-cpfcnpj"]').should('have.text', 'CPF inválido.');
  });

  it('Deveria ser possível visualizar o erro no campo de CNPJ quando o valor for inválido', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="select-document-type"]').select('cnpj');
    cy.get('[data-testid="input-document"]').type('12345678900', { delay: 0 }).blur();
    cy.get('[data-testid="input-error-cpfcnpj"]').should('be.visible');
    cy.get('[data-testid="input-error-cpfcnpj"]').should('have.text', 'CNPJ inválido.');
  });

  it('Deveria ser possível visualizar o erro no campo de Telefone quando o valor for inválido', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-phone"]').type('1a2b3c4', { delay: 0 }).blur();
    cy.get('[data-testid="input-error-phone"]').should('be.visible');
    cy.get('[data-testid="input-error-phone"]').should('have.text', 'O telefone deve conter apenas números.');
  });

  it('Deveria ser possível visualizar o erro no campo de Telefone quando tiver menos de 10 dígitos', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-phone"]').type('123456789', { delay: 0 }).blur();
    cy.get('[data-testid="input-error-phone"]').should('be.visible');
    cy.get('[data-testid="input-error-phone"]').should('have.text', 'O telefone deve ter no mínimo 10 dígitos.');
  });

  it('Deveria ser possível visualizar o erro no campo de Telefone quando tiver mais de 11 dígitos', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-phone"]').type('123456789012', { delay: 0 }).blur();
    cy.get('[data-testid="input-error-phone"]').should('be.visible');
    cy.get('[data-testid="input-error-phone"]').should('have.text', 'O telefone deve ter no máximo 11 dígitos.');
  });

  it('Deveria ser possível visualizar o erro no campo de Email quando estiver vazio', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-email"]').type(' ', { delay: 0 }).clear().blur();
    cy.get('[data-testid="input-error-email"]').should('be.visible');
    cy.get('[data-testid="input-error-email"]').should('have.text', 'O Email é obrigatório.');
  });

  it('Deveria ser possível visualizar o erro no campo de Email quando o valor for inválido', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-email"]').type('invalid-email', { delay: 0 }).blur();
    cy.get('[data-testid="input-error-email"]').should('be.visible');
    cy.get('[data-testid="input-error-email"]').should('have.text', 'Email inválido.');
  });

  it('Deveria ser possível visualizar o erro no campo de Senha quando estiver vazio', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-password"]').type(' ', { delay: 0 }).clear().blur();
    cy.get('[data-testid="input-error-password"]').should('be.visible');
    cy.get('[data-testid="input-error-password"]').should('have.text', 'A Senha é obrigatória.');
  });

  it('Deveria ser possível visualizar o erro no campo de Senha quando tiver menos de 6 caracteres', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-password"]').type('12345', { delay: 0 }).blur();
    cy.get('[data-testid="input-error-password"]').should('be.visible');
    cy.get('[data-testid="input-error-password"]').should('have.text', 'A Senha deve ter no mínimo 6 caracteres.');
  });

  it('Deveria ser possível visualizar o erro no campo de Senha quando tiver mais de 20 caracteres', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-password"]').type('123456789012345678901', { delay: 0 }).blur();
    cy.get('[data-testid="input-error-password"]').should('be.visible');
    cy.get('[data-testid="input-error-password"]').should('have.text', 'A Senha deve ter no máximo 20 caracteres.');
  });

  it('Deveria ser possível visualizar o erro no campo de Confirmação de Senha quando estiver vazio', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-password-confirmation"]').type(' ', { delay: 0 }).clear().blur();
    cy.get('[data-testid="input-error-password-confirmation"]').should('be.visible');
    cy.get('[data-testid="input-error-password-confirmation"]').should('have.text', 'A confirmação de senha é obrigatória.');
  });

  it('Deveria ser possível visualizar o erro no campo de Confirmação de Senha quando as senhas não coincidem', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-password"]').type('123456', { delay: 0 }).blur();
    cy.get('[data-testid="input-password-confirmation"]').type('1234567', { delay: 0 }).blur();
    cy.get('[data-testid="input-error-password-confirmation"]').should('be.visible');
    cy.get('[data-testid="input-error-password-confirmation"]').should('have.text', 'As senhas não coincidem.');
  });

  it('Deveria ser possível visualizar o erro no campo de Confirmação de Senha quando o valor for inválido', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="input-password-confirmation"]').type('1234567', { delay: 0 }).clear().blur();
    cy.get('[data-testid="input-error-password-confirmation"]').should('be.visible');
    cy.get('[data-testid="input-error-password-confirmation"]').should('have.text', 'A confirmação de senha é obrigatória.');
  });

  it('Deveria ter o link de voltar ao login', () => {
    cy.mount(RegisterTemplate);
    cy.get('[data-testid="link-go-to-login"]').should('have.attr', 'to', '/');
  });
});