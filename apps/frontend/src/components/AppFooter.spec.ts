import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import AppFooter from './AppFooter.vue';

describe('AppFooter', () => {
  let wrapper: any;

  beforeEach(() => (wrapper = mount(AppFooter)));

  afterEach(() => wrapper.unmount());

  describe('Renderização', () => {
    it('Deveria renderizar o componente corretamente', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.app-footer').exists()).toBe(true);
    });

    it('Deveria exibir o ano atual no texto do footer', () => {
      const messageElement = wrapper.find('.message-footer');
      const currentYear = new Date().getFullYear();
      expect(messageElement.text()).toBe(`© ${currentYear} QA Engineering Lab - Todos os direitos reservados`);
    });

    it('Deveria renderizar o link do GitHub com atributos corretos', () => {
      const githubLink = wrapper.find('.github-link');
      expect(githubLink.exists()).toBe(true);
      expect(githubLink.attributes('href')).toBe('https://github.com/LeohsPaixao/qa-engineering-lab');
      expect(githubLink.attributes('target')).toBe('_blank');
      expect(githubLink.attributes('rel')).toBe('noopener noreferrer');
      expect(githubLink.attributes('aria-label')).toBe('Visitar repositório no GitHub');
    });

    it('Deveria renderizar o ícone do GitHub com atributos corretos', () => {
      const githubIcon = wrapper.find('.github-icon');
      expect(githubIcon.exists()).toBe(true);
      const src = githubIcon.attributes('src');
      expect(src).toMatch(/@\/assets\/images\/github-mark-white\.svg|data:image\/svg\+xml/);
      expect(githubIcon.attributes('alt')).toBe('GitHub');
    });
  });

  describe('Estrutura HTML', () => {
    it('Deveria ter a estrutura correta do footer', () => {
      const footer = wrapper.find('.app-footer');
      expect(footer.exists()).toBe(true);

      const message = footer.find('.message-footer');
      const githubLink = footer.find('.github-link');
      const githubIcon = githubLink.find('.github-icon');

      expect(message.exists()).toBe(true);
      expect(githubLink.exists()).toBe(true);
      expect(githubIcon.exists()).toBe(true);
    });

    it('Deveria ter as classes CSS corretas', () => {
      expect(wrapper.find('.app-footer').classes()).toContain('app-footer');
      expect(wrapper.find('.message-footer').classes()).toContain('message-footer');
      expect(wrapper.find('.github-link').classes()).toContain('github-link');
      expect(wrapper.find('.github-icon').classes()).toContain('github-icon');
    });
  });

  describe('Acessibilidade', () => {
    it('Deveria ter aria-label no link do GitHub', () => {
      const githubLink = wrapper.find('.github-link');
      expect(githubLink.attributes('aria-label')).toBe('Visitar repositório no GitHub');
    });

    it('Deveria ter alt text no ícone do GitHub', () => {
      const githubIcon = wrapper.find('.github-icon');
      expect(githubIcon.attributes('alt')).toBe('GitHub');
    });
  });

  describe('Interações', () => {
    it('Deveria abrir o link do GitHub em nova aba', () => {
      const githubLink = wrapper.find('.github-link');
      expect(githubLink.attributes('target')).toBe('_blank');
      expect(githubLink.attributes('rel')).toBe('noopener noreferrer');
    });
  });

  describe('Responsividade', () => {
    it('Deveria aplicar estilos responsivos em telas pequenas', () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 768,
      });

      wrapper = mount(AppFooter);

      expect(wrapper.find('.app-footer').exists()).toBe(true);
      expect(wrapper.find('.message-footer').exists()).toBe(true);
      expect(wrapper.find('.github-icon').exists()).toBe(true);
    });
  });
});
