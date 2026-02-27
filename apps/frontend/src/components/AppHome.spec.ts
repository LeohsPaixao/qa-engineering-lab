import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import AppHome from './AppHome.vue';

describe('AppHome', () => {
  let wrapper: any;

  beforeEach(() => (wrapper = mount(AppHome)));

  afterEach(() => wrapper.unmount());

  describe('Renderização', () => {
    it('Deveria renderizar o componente corretamente', () => {
      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('.main-container').exists()).toBe(true);
    });

    it('Deveria exibir o logo da aplicação', () => {
      expect(wrapper.find('.logo').exists()).toBe(true);
      expect(wrapper.find('.logo').attributes('src')).toBe('/src/assets/images/qa-test-lab.png');
      expect(wrapper.find('.logo').attributes('alt')).toBe('Logo QA E2E');
    });

    it('Deveria exibir a descrição do projeto', () => {
      expect(wrapper.find('.project-description').exists()).toBe(true);
      expect(wrapper.find('.project-description').text()).toBe(
        'Este é um Laboratório de QA criado para quem acredita que qualidade não é apenas uma etapa do processo, mas uma mentalidade.  Aqui, exploramos a Qualidade de Software de forma ampla e estratégica, aplicando diferentes níveis e tipos de testes dentro de uma visão moderna de engenharia: Unit Tests, Integration Tests, API Tests, UI Tests, Testes Não Funcionais (performance, carga, resiliência), entre muitas outras abordagens.  O projeto promove a experimentação prática de conceitos como pirâmide de testes, shift-left testing, automação em CI/CD e boas práticas de arquitetura de testes. É um ambiente seguro para errar, aprender, comparar ferramentas e evoluir tecnicamente.  Sendo Open Source, este laboratório é um convite constante ao desafio: testar novas estratégias, validar hipóteses, aprimorar habilidades e construir uma visão sólida e moderna sobre qualidade.',
      );
    });
  });

  describe('Estrutura HTML', () => {
    it('Deveria ter a estrutura correta do componente', () => {
      expect(wrapper.find('.main-container').exists()).toBe(true);
      expect(wrapper.find('.logo-container').exists()).toBe(true);
      expect(wrapper.find('.logo').exists()).toBe(true);
      expect(wrapper.find('.project-description').exists()).toBe(true);
    });
  });
});
