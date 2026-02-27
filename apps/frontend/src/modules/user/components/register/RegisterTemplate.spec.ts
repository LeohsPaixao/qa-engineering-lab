import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/composables/', () => ({
  useRegisterUser: () => ({
    mutate: vi.fn(),
    isPending: false,
  }),
}));

import RegisterTemplate from './RegisterTemplate.vue';

const validForm = {
  full_name: 'João Silva',
  social_name: 'João',
  document: '11144477735',
  doc_type: 'cpf',
  phone: '11987654321',
  email: 'joao@example.com',
  password: '123456',
  password_confirmation: '123456',
};

describe('RegisterTemplate', () => {
  let wrapper: any;

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
  });

  describe('Renderização', () => {
    it('Deveria renderizar o componente corretamente', () => {
      wrapper = mount(RegisterTemplate);

      expect(wrapper.exists()).toBe(true);
      expect(wrapper.find('[data-testid="register-form"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="title-register"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="description-register"]').exists()).toBe(true);
    });

    it('Deveria renderizar todos os campos do formulário', () => {
      wrapper = mount(RegisterTemplate);

      expect(wrapper.find('[data-testid="input-fullname"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="input-socialname"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="select-document-type"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="input-document"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="input-phone"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="input-email"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="input-password"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="input-password-confirmation"]').exists()).toBe(true);
      expect(wrapper.find('[data-testid="btn-register"]').exists()).toBe(true);
    });
  });

  describe('Preenchimento de Campos', () => {
    it('Deveria ser possível preencher todos os campos do formulário', () => {
      wrapper = mount(RegisterTemplate);

      wrapper.find('[data-testid="input-fullname"]').setValue(validForm.full_name);
      wrapper.find('[data-testid="input-socialname"]').setValue(validForm.social_name);
      wrapper.find('[data-testid="input-document"]').setValue(validForm.document);
      wrapper.find('[data-testid="input-phone"]').setValue(validForm.phone);
      wrapper.find('[data-testid="input-email"]').setValue(validForm.email);
      wrapper.find('[data-testid="input-password"]').setValue(validForm.password);
      wrapper.find('[data-testid="input-password-confirmation"]').setValue(validForm.password_confirmation);

      expect(wrapper.find('[data-testid="input-fullname"]').element.value).toBe(validForm.full_name);
      expect(wrapper.find('[data-testid="input-socialname"]').element.value).toBe(validForm.social_name);
      expect(wrapper.find('[data-testid="input-document"]').element.value).toBe(validForm.document);
      expect(wrapper.find('[data-testid="input-phone"]').element.value).toBe(validForm.phone);
      expect(wrapper.find('[data-testid="input-email"]').element.value).toBe(validForm.email);
      expect(wrapper.find('[data-testid="input-password"]').element.value).toBe(validForm.password);
      expect(wrapper.find('[data-testid="input-password-confirmation"]').element.value).toBe(validForm.password_confirmation);
    });
  });

  describe('Validação de Campos Obrigatórios', () => {
    it('Deveria exibir erro quando o campo Nome Completo estiver vazio', async () => {
      wrapper = mount(RegisterTemplate);

      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const fullNameError = wrapper.find('[data-testid="input-error-fullname"]');
      expect(fullNameError.exists()).toBe(true);
      expect(fullNameError.text()).toBe('O Nome Completo é obrigatório.');
    });

    it('Deveria exibir erro quando o campo CPF/CNPJ estiver vazio', async () => {
      wrapper = mount(RegisterTemplate);

      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const documentError = wrapper.find('[data-testid="input-error-cpfcnpj"]');
      expect(documentError.exists()).toBe(true);
      expect(documentError.text()).toBe('O CPF/CNPJ é obrigatório.');
    });

    it('Deveria exibir erro quando o campo Email estiver vazio', async () => {
      wrapper = mount(RegisterTemplate);

      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const emailError = wrapper.find('[data-testid="input-error-email"]');
      expect(emailError.exists()).toBe(true);
      expect(emailError.text()).toBe('O Email é obrigatório.');
    });

    it('Deveria exibir erro quando o campo Senha estiver vazio', async () => {
      wrapper = mount(RegisterTemplate);

      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const passwordError = wrapper.find('[data-testid="input-error-password"]');
      expect(passwordError.exists()).toBe(true);
      expect(passwordError.text()).toBe('A Senha é obrigatória.');
    });

    it('Deveria exibir erro quando o campo Confirmar Senha estiver vazio', async () => {
      wrapper = mount(RegisterTemplate);

      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const passwordConfirmationError = wrapper.find('[data-testid="input-error-password-confirmation"]');
      expect(passwordConfirmationError.exists()).toBe(true);
      expect(passwordConfirmationError.text()).toBe('A confirmação de senha é obrigatória.');
    });
  });

  describe('Validação de Nome Completo', () => {
    it('Deveria exibir erro quando o Nome Completo não tiver sobrenome', async () => {
      wrapper = mount(RegisterTemplate);

      wrapper.find('[data-testid="input-fullname"]').setValue('João');
      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const fullNameError = wrapper.find('[data-testid="input-error-fullname"]');
      expect(fullNameError.exists()).toBe(true);
      expect(fullNameError.text()).toBe('O Nome Completo deve conter pelo menos Nome e Sobrenome.');
    });
  });

  describe('Validação de CPF/CNPJ', () => {
    it('Deveria exibir erro quando o CPF for inválido', async () => {
      wrapper = mount(RegisterTemplate);

      wrapper.find('[data-testid="input-document"]').setValue('12345678900');
      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const documentError = wrapper.find('[data-testid="input-error-cpfcnpj"]');
      expect(documentError.exists()).toBe(true);
      expect(documentError.text()).toBe('CPF inválido.');
    });

    it('Deveria exibir erro quando o CNPJ for inválido', async () => {
      wrapper = mount(RegisterTemplate);

      const selectDocType = wrapper.find('[data-testid="select-document-type"]');
      await selectDocType.setValue('cnpj');
      wrapper.find('[data-testid="input-document"]').setValue('12345678000100');
      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const documentError = wrapper.find('[data-testid="input-error-cpfcnpj"]');
      expect(documentError.exists()).toBe(true);
      expect(documentError.text()).toBe('CNPJ inválido.');
    });

    it('Deveria limpar o campo documento ao mudar o tipo de documento', async () => {
      wrapper = mount(RegisterTemplate);

      await wrapper.find('[data-testid="input-document"]').setValue('11144477735');
      await wrapper.vm.$nextTick();

      const selectDocType = wrapper.find('[data-testid="select-document-type"]');
      await selectDocType.setValue('cnpj');
      await selectDocType.trigger('change');
      await wrapper.vm.$nextTick();
      await flushPromises();

      expect(wrapper.find('[data-testid="input-document"]').element.value).toBe('');
    });
  });

  describe('Validação de Telefone', () => {
    it('Deveria exibir erro quando o telefone contiver letras', async () => {
      wrapper = mount(RegisterTemplate);

      wrapper.find('[data-testid="input-phone"]').setValue('abc1234567');
      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const phoneError = wrapper.find('[data-testid="input-error-phone"]');
      expect(phoneError.exists()).toBe(true);
      expect(phoneError.text()).toBe('O telefone deve conter apenas números.');
    });

    it('Deveria exibir erro quando o telefone tiver menos de 10 dígitos', async () => {
      wrapper = mount(RegisterTemplate);

      wrapper.find('[data-testid="input-phone"]').setValue('123456789');
      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const phoneError = wrapper.find('[data-testid="input-error-phone"]');
      expect(phoneError.exists()).toBe(true);
      expect(phoneError.text()).toBe('O telefone deve ter no mínimo 10 dígitos.');
    });

    it('Deveria exibir erro quando o telefone tiver mais de 11 dígitos', async () => {
      wrapper = mount(RegisterTemplate);

      wrapper.find('[data-testid="input-phone"]').setValue('123456789012');
      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const phoneError = wrapper.find('[data-testid="input-error-phone"]');
      expect(phoneError.exists()).toBe(true);
      expect(phoneError.text()).toBe('O telefone deve ter no máximo 11 dígitos.');
    });
  });

  describe('Validação de Email', () => {
    it('Deveria exibir erro quando o email for inválido', async () => {
      wrapper = mount(RegisterTemplate);

      wrapper.find('[data-testid="input-email"]').setValue('invalid-email');
      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const emailError = wrapper.find('[data-testid="input-error-email"]');
      expect(emailError.exists()).toBe(true);
      expect(emailError.text()).toBe('Email inválido.');
    });
  });

  describe('Validação de Senha', () => {
    it('Deveria exibir erro quando a senha começar com espaço', async () => {
      wrapper = mount(RegisterTemplate);

      wrapper.find('[data-testid="input-password"]').setValue(' 123456');
      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const passwordError = wrapper.find('[data-testid="input-error-password"]');
      expect(passwordError.exists()).toBe(true);
      expect(passwordError.text()).toBe('O valor não pode começar com espaço.');
    });

    it('Deveria exibir erro quando a senha tiver menos de 6 caracteres', async () => {
      wrapper = mount(RegisterTemplate);

      wrapper.find('[data-testid="input-password"]').setValue('12345');
      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const passwordError = wrapper.find('[data-testid="input-error-password"]');
      expect(passwordError.exists()).toBe(true);
      expect(passwordError.text()).toBe('A Senha deve ter no mínimo 6 caracteres.');
    });

    it('Deveria exibir erro quando a senha tiver mais de 20 caracteres', async () => {
      wrapper = mount(RegisterTemplate);

      wrapper.find('[data-testid="input-password"]').setValue('123456789012345678901');
      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const passwordError = wrapper.find('[data-testid="input-error-password"]');
      expect(passwordError.exists()).toBe(true);
      expect(passwordError.text()).toBe('A Senha deve ter no máximo 20 caracteres.');
    });

    it('Deveria exibir erro quando as senhas não coincidirem', async () => {
      wrapper = mount(RegisterTemplate);

      wrapper.find('[data-testid="input-password"]').setValue('123456');
      wrapper.find('[data-testid="input-password-confirmation"]').setValue('654321');
      const formElement = wrapper.find('[data-testid="register-form"]');
      await formElement.trigger('submit');
      await flushPromises();
      await new Promise((resolve) => setTimeout(resolve, 10));

      const passwordConfirmationError = wrapper.find('[data-testid="input-error-password-confirmation"]');
      expect(passwordConfirmationError.exists()).toBe(true);
      expect(passwordConfirmationError.text()).toBe('As senhas não coincidem.');
    });
  });

  describe('Submit do Formulário', () => {
    it('Deveria chamar a função onSubmit quando o formulário for submetido', async () => {
      wrapper = mount(RegisterTemplate);

      const formElement = wrapper.find('[data-testid="register-form"]');
      const authFunc = vi.spyOn(wrapper.vm, 'onSubmit');

      await formElement.trigger('submit');
      await wrapper.vm.$nextTick();

      expect(authFunc).toHaveBeenCalled();
    });
  });

  describe('Placeholder Dinâmico', () => {
    it('Deveria exibir placeholder de CPF quando doc_type for cpf', () => {
      wrapper = mount(RegisterTemplate);

      const documentInput = wrapper.find('[data-testid="input-document"]');
      expect(documentInput.attributes('placeholder')).toBe('Insira o CPF');
    });

    it('Deveria exibir placeholder de CNPJ quando doc_type for cnpj', async () => {
      wrapper = mount(RegisterTemplate);

      const selectDocType = wrapper.find('[data-testid="select-document-type"]');
      await selectDocType.setValue('cnpj');
      await wrapper.vm.$nextTick();

      const documentInput = wrapper.find('[data-testid="input-document"]');
      expect(documentInput.attributes('placeholder')).toBe('Insira o CNPJ');
    });
  });

  describe('Texto do Botão', () => {
    it('Deveria exibir "Cadastrar" quando não estiver carregando', () => {
      wrapper = mount(RegisterTemplate);

      const btnRegister = wrapper.find('[data-testid="btn-register"]');
      expect(btnRegister.text()).toBe('Cadastrar');
    });
  });
});
