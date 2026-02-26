import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockUseForgotPassword = vi.fn(() => ({
  mutate: vi.fn(),
  isPending: { value: false },
}));

vi.mock('@/composables/', () => ({
  useForgotPassword: () => mockUseForgotPassword(),
}));

import RecoverPasswordTemplate from './RecoverPasswordTemplate.vue';

const validEmail = 'teste@example.com';

describe('RecoverPasswordTemplate', () => {
  let wrapper: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe('Renderização', () => {
    it('Deveria renderizar o componente corretamente', () => {
      wrapper = mount(RecoverPasswordTemplate);

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('[data-testid="form-recover-password"]').exists()).toBe(true);
    });

    it('Deveria renderizar todos os elementos do formulário', () => {
      wrapper = mount(RecoverPasswordTemplate);

      expect(wrapper.find('[data-testid="label-email-recover-password"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="input-email-recover-password"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="btn-recover-password"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="link-go-to-login"]').exists()).toBe(true);
    });

    it('Deveria renderizar a mensagem de atenção', () => {
      wrapper = mount(RecoverPasswordTemplate);

      const message = wrapper.find('.message-user-recover-password');
      expect(message.exists()).toBe(true);
      expect(message.text()).toContain('Atenção');
    });
  });

  describe('Preenchimento de Campos', () => {
    it('Deveria ser possível preencher o campo de email', () => {
      wrapper = mount(RecoverPasswordTemplate);

      wrapper.find('[data-testid="input-email-recover-password"]').setValue(validEmail);
      expect(wrapper.find('[data-testid="input-email-recover-password"]').element.value).toBe(validEmail);
    });
  });

  describe('Validação de Campos Obrigatórios', () => {
    it('Deveria exibir erro quando o campo Email estiver vazio', async () => {
      wrapper = mount(RecoverPasswordTemplate);

      const formElement = wrapper.find('[data-testid="form-recover-password"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const emailError = wrapper.find('[data-testid="message-error-email-recover-password"]');
      expect(emailError.exists()).toBe(true);
      expect(emailError.text()).toBe('O Email é obrigatório.');
    });
  });

  describe('Validação de Email', () => {
    it('Deveria exibir erro quando o email for inválido', async () => {
      wrapper = mount(RecoverPasswordTemplate);

      wrapper.find('[data-testid="input-email-recover-password"]').setValue('invalid-email');
      const formElement = wrapper.find('[data-testid="form-recover-password"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const emailError = wrapper.find('[data-testid="message-error-email-recover-password"]');
      expect(emailError.exists()).toBe(true);
      expect(emailError.text()).toBe('Email inválido.');
    });

    it('Deveria aceitar um email válido sem exibir erros', async () => {
      wrapper = mount(RecoverPasswordTemplate);

      await wrapper.find('[data-testid="input-email-recover-password"]').setValue(validEmail);
      await wrapper.vm.$nextTick();
      await flushPromises();

      const emailError = wrapper.find('[data-testid="message-error-email-recover-password"]');
      if (emailError.exists()) {
        expect(emailError.text()).toBe('');
      }
    });
  });

  describe('Submit do Formulário', () => {
    it('Deveria chamar a função onSubmit quando o formulário for submetido', async () => {
      wrapper = mount(RecoverPasswordTemplate);

      const formElement = wrapper.find('[data-testid="form-recover-password"]');
      const submitFunc = vi.spyOn(wrapper.vm, 'onSubmit');

      await formElement.trigger('submit');
      await wrapper.vm.$nextTick();

      expect(submitFunc).toHaveBeenCalled();
    });
  });

  describe('Texto do Botão', () => {
    it('Deveria exibir "Enviar instruções" quando não estiver carregando', () => {
      wrapper = mount(RecoverPasswordTemplate);

      const btnRecover = wrapper.find('[data-testid="btn-recover-password"]');
      expect(btnRecover.text()).toBe('Enviar instruções');
    });
  });

  describe('Link de Navegação', () => {
    it('Deveria renderizar o link para voltar ao login', () => {
      wrapper = mount(RecoverPasswordTemplate);

      const link = wrapper.find('[data-testid="link-go-to-login"]');
      expect(link.exists()).toBe(true);
      expect(link.text()).toContain('Voltar ao Login');
    });
  });
});
