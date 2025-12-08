import AppHeader from 'frontend/src/components/AppHeader.vue';
import { mockGetMe } from '../support/mocks/getMe';

describe('AppHeader Component', () => {

  beforeEach(() => {
    mockGetMe();
  });

  it('Deveria ser possivel visualizar os links de navegação', () => {
    cy.mount(AppHeader);

    cy.get('[data-testid="link-home"]').should('be.visible');
    cy.get('[data-testid="link-table-users"]').should('be.visible');
  });

  it('Deveria ser possivel visualizar o dropdown do usuário', () => {
    cy.mount(AppHeader);

    cy.get('[data-testid="user-dropdown"]').should('be.visible');
    cy.get('[data-testid="user-avatar"]').should('be.visible');
    cy.get('[data-testid="user-name"]').should('contain', 'Teste Usuário');
  });

  it('Deveria ser possivel alternar o dropdown do usuário', () => {
    cy.mount(AppHeader);

    cy.get('[data-testid="dropdown-profile"]').should('not.exist');
    cy.get('[data-testid="user-dropdown"]').click();
    cy.get('[data-testid="dropdown-profile"]').should('be.visible');
    cy.get('[data-testid="dropdown-profile-update"]').should('be.visible');
    cy.get('[data-testid="dropdown-profile-logout"]').should('be.visible');
    cy.get('[data-testid="user-dropdown"]').click();
    cy.get('[data-testid="dropdown-profile"]').should('not.exist');
  });

  it('Deveria ser possivel visualizar as opções do dropdown do usuário', () => {
    cy.mount(AppHeader);

    cy.get('[data-testid="user-dropdown"]').click();
    cy.get('[data-testid="dropdown-profile-update"]').should('contain', 'Perfil');
    cy.get('[data-testid="dropdown-profile-logout"]').should('contain', 'Sair');
  });

  it('Deveria ser possivel visualizar o efeito de hover nos itens do dropdown do usuário', () => {
    cy.mount(AppHeader);

    cy.get('[data-testid="user-dropdown"]').click();
    cy.get('[data-testid="dropdown-profile-update"]').trigger('mouseover');
    cy.get('[data-testid="dropdown-profile-update"]').should('have.css', 'background-color').and('eq', 'rgba(0, 0, 0, 0)');
  });

  it('Deveria ser possivel visualizar o estilo e o layout do header', () => {
    cy.mount(AppHeader);

    cy.get('[data-testid="app-header"]').should('have.css', 'display', 'flex');
    cy.get('[data-testid="app-header"]').should('have.css', 'justify-content', 'space-between');
    cy.get('[data-testid="app-header"]').should('have.css', 'align-items', 'center');

    cy.get('[data-testid="nav-menu"]').should('have.css', 'display', 'flex');
    cy.get('[data-testid="nav-menu"]').should('have.css', 'list-style', 'outside none disc');
  });
});