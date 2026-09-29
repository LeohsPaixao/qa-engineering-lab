import AppFooter from 'frontend/src/components/AppFooter.vue';

describe('AppFooter Component', () => {
  
  it('Deveria ser possivel visualizar o footer', () => {
    cy.mount(AppFooter);

    cy.get('.app-footer').should('be.visible');
  });
  
  it('Deveria ser possivel visualizar a mensagem de copyright', () => {
    cy.mount(AppFooter);
    const year = new Date().getFullYear();

    cy.get('.message-footer').should('contain', `© ${year} QA Engineering Lab - Todos os direitos reservados`);
  });

  it('Deveria ser possivel visualizar o link do GitHub', () => {
    cy.mount(AppFooter);

    cy.get('.github-link').should('be.visible');
    cy.get('.github-link').should('have.attr', 'href', 'https://github.com/LeohsPaixao/qa-engineering-lab');
    cy.get('.github-link').should('have.attr', 'target', '_blank');
    cy.get('.github-link').should('have.attr', 'rel', 'noopener noreferrer');
    cy.get('.github-link').should('have.attr', 'aria-label', 'Visitar repositório no GitHub');
  });

  it("Deveria ser possivel visualizar o ícone do GitHub", () => {
    cy.mount(AppFooter);

    cy.get('.github-icon').should('be.visible');
    cy.get('.github-icon').should('have.attr', 'alt', 'GitHub');
  });
});