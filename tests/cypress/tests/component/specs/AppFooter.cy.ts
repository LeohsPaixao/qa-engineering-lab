import AppFooter from 'frontend/src/components/AppFooter.vue';

describe('AppFooter Component', () => {
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

    cy.get('.github-icon').should('be.visible');
    cy.get('.github-icon').should('have.attr', 'alt', 'GitHub');
  });

  it('Deveria ser possivel visualizar o estilo e o layout do footer', () => {
    cy.mount(AppFooter);

    cy.get('.app-footer').should('have.css', 'display', 'flex');
    cy.get('.app-footer').should('have.css', 'justify-content', 'space-between');
    cy.get('.app-footer').should('have.css', 'align-items', 'center');
    cy.get('.app-footer').should('have.css', 'position', 'static');
    cy.get('.app-footer').should('have.css', 'bottom', 'auto');
    cy.get('.app-footer').should('have.css', 'width', '1366px');
    cy.get('.app-footer').should('have.css', 'background-color', 'rgb(51, 51, 51)');
  });

  it('Deveria ser possivel visualizar o estilo do ícone do GitHub', () => {
    cy.mount(AppFooter);

    cy.get('.github-icon').should('have.css', 'width', '24px');
    cy.get('.github-icon').should('have.css', 'height', '24px');
    cy.get('.github-icon').should('have.css', 'filter', 'brightness(0) invert(1)');
  });

  it('Deveria ser possivel visualizar o estilo da mensagem do footer', () => {
    cy.mount(AppFooter);

    cy.get('.message-footer').should('have.css', 'font-size', '12.8px');
    cy.get('.message-footer').should('have.css', 'margin', '0px');
  });

  it('Deveria ser possivel visualizar o estilo do link do GitHub', () => {
    cy.mount(AppFooter);

    cy.get('.github-link').should('have.css', 'display', 'flex');
    cy.get('.github-link').should('have.css', 'align-items', 'center');
  });

  it('Deveria ser possivel visualizar o texto alternativo do ícone do GitHub', () => {
    cy.mount(AppFooter);

    cy.get('.github-link img').should('have.attr', 'alt', 'GitHub');

    cy.get('.github-link').should('have.attr', 'target', '_blank');
    cy.get('.github-link').should('have.attr', 'rel', 'noopener noreferrer');
  });
});