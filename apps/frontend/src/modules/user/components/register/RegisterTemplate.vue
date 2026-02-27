<template>
  <div class="register-container main-content">
    <form data-testid="register-form" class="register-form" @submit.prevent="onSubmit">
      <h2 data-testid="title-register" class="title-register">Bem-vindo!</h2>
      <p data-testid="description-register">Por favor, preencha os campos abaixo para se registrar:</p>

      <div data-testid="form-group-fullname" class="form-group">
        <label data-testid="label-fullname" for="full_name">Nome Completo <span class="required">*</span></label>
        <Field
          data-testid="input-fullname"
          type="text"
          id="full_name"
          name="full_name"
          placeholder="Insira o Nome Completo"
          :class="['input-fullname', { 'error-input': fullNameError }]"
        />
        <ErrorMessage data-testid="input-error-fullname" name="full_name" class="error" />
      </div>

      <div data-testid="form-group-socialname" class="form-group">
        <label data-testid="label-socialname" for="social_name">Nome Social</label>
        <Field
          data-testid="input-socialname"
          type="text"
          id="social_name"
          name="social_name"
          placeholder="Insira o Nome Social (opcional)"
          class="input-socialname"
        />
      </div>

      <div data-testid="form-group-document" class="form-group">
        <label data-testid="label-document" for="document">CPF/CNPJ <span class="required">*</span></label>
        <Field
          data-testid="select-document-type"
          as="select"
          id="doc_type"
          name="doc_type"
          @change="handleDocTypeChange"
          :class="['select-document-type', { 'error-input': documentError }]"
        >
          <option value="cpf">CPF</option>
          <option value="cnpj">CNPJ</option>
        </Field>
        <Field
          data-testid="input-document"
          type="text"
          id="document"
          name="document"
          :placeholder="placeholder"
          :class="['input-document', { 'error-input': documentError }]"
        />
        <ErrorMessage data-testid="input-error-cpfcnpj" name="document" class="error" />
      </div>

      <div data-testid="form-group-phone" class="form-group">
        <label data-testid="label-phone" for="phone">Telefone</label>
        <Field
          data-testid="input-phone"
          type="text"
          id="phone"
          name="phone"
          placeholder="Insira o Telefone (opcional)"
          :class="['input-phone', { 'error-input': phoneError }]"
        />
        <ErrorMessage data-testid="input-error-phone" name="phone" class="error" />
      </div>

      <div data-testid="form-group-email" class="form-group">
        <label data-testid="label-email" for="email">Email <span class="required">*</span></label>
        <Field
          data-testid="input-email"
          type="email"
          id="email"
          name="email"
          autocomplete="username"
          placeholder="Insira o Email"
          :class="['input-email', { 'error-input': emailError }]"
        />
        <ErrorMessage data-testid="input-error-email" name="email" class="error" />
      </div>

      <div data-testid="form-group-password" class="form-group">
        <label data-testid="label-password" for="password">Senha <span class="required">*</span></label>
        <Field
          data-testid="input-password"
          type="password"
          id="password"
          name="password"
          autocomplete="current-password"
          placeholder="Insira a Senha"
          :class="['input-password', { 'error-input': passwordError }]"
        />
        <ErrorMessage data-testid="input-error-password" name="password" class="error" />
      </div>

      <div data-testid="form-group-password-confirmation" class="form-group">
        <label data-testid="label-password-confirmation" for="password_confirmation">Confirmar Senha <span class="required">*</span></label>
        <Field
          data-testid="input-password-confirmation"
          type="password"
          id="password_confirmation"
          name="password_confirmation"
          autocomplete="new-password"
          placeholder="Confirme a Senha"
          :class="['input-password-confirmation', { 'error-input': passwordConfirmationError }]"
        />
        <ErrorMessage data-testid="input-error-password-confirmation" name="password_confirmation" class="error" />
      </div>

      <button data-testid="btn-register" type="submit" class="btn btn-submit" :disabled="isPending">
        {{ btnText }}
      </button>

      <div class="link-container">
        <router-link to="/" data-testid="link-go-to-login" class="link-go-to-login"> Voltar ao Login </router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { ApiErrorResponse } from '@/types/error.types';
import type { DocType, RegisterResponse } from '@/types/user.types';
import { validateCNPJ, validateCPF } from '@/utils/validateCpfCnpj';
import { toTypedSchema } from '@vee-validate/yup';
import { ErrorMessage, Field, useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import * as yup from 'yup';
import { useRegisterUser } from '../../../../composables/useRegisterUser';

const { mutate: registerUserMutation, isPending } = useRegisterUser();

const validationSchema = toTypedSchema(
  yup.object({
    full_name: yup
      .string()
      .required('O Nome Completo é obrigatório.')
      .matches(/^[a-zA-ZÀ-ÿ.]+(\s+[a-zA-ZÀ-ÿ.]+)+$/, 'O Nome Completo deve conter pelo menos Nome e Sobrenome.'),
    social_name: yup.string().optional(),
    doc_type: yup.string().oneOf(['cpf', 'cnpj']).required(),
    document: yup
      .string()
      .required('O CPF/CNPJ é obrigatório.')
      .test('document-valid', 'CPF inválido.', function (value) {
        if (!value) {
          return false;
        }
        const docType = this.parent.doc_type;
        if (docType === 'cpf') {
          return validateCPF(value);
        }
        return true;
      })
      .test('document-valid-cnpj', 'CNPJ inválido.', function (value) {
        if (!value) {
          return false;
        }
        const docType = this.parent.doc_type;
        if (docType === 'cnpj') {
          return validateCNPJ(value);
        }
        return true;
      }),
    phone: yup
      .string()
      .optional()
      .test('phone-format', 'O telefone deve conter apenas números.', function (value) {
        if (!value) {
          return true;
        }
        const normalizedValue = value.replace(/[^0-9a-zA-Z]/g, '');
        return !/[a-zA-Z]/.test(normalizedValue);
      })
      .test('phone-length-min', 'O telefone deve ter no mínimo 10 dígitos.', function (value) {
        if (!value) {
          return true;
        }
        const normalizedValue = value.replace(/[^0-9]/g, '');
        return normalizedValue.length >= 10;
      })
      .test('phone-length-max', 'O telefone deve ter no máximo 11 dígitos.', function (value) {
        if (!value) {
          return true;
        }
        const normalizedValue = value.replace(/[^0-9]/g, '');
        return normalizedValue.length <= 11;
      }),
    email: yup.string().required('O Email é obrigatório.').email('Email inválido.'),
    password: yup
      .string()
      .required('A Senha é obrigatória.')
      .test('no-leading-space', 'O valor não pode começar com espaço.', (value) => !value?.startsWith(' '))
      .min(6, 'A Senha deve ter no mínimo 6 caracteres.')
      .max(20, 'A Senha deve ter no máximo 20 caracteres.'),
    password_confirmation: yup
      .string()
      .required('A confirmação de senha é obrigatória.')
      .oneOf([yup.ref('password')], 'As senhas não coincidem.'),
  }),
);

const { handleSubmit, values, setFieldValue } = useForm({
  initialValues: {
    full_name: '',
    social_name: '',
    document: '',
    doc_type: 'cpf' as DocType,
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
  },
  validationSchema,
});

const { errorMessage: fullNameError } = useField('full_name');
const { errorMessage: documentError } = useField('document');
const { errorMessage: phoneError } = useField('phone');
const { errorMessage: emailError } = useField('email');
const { errorMessage: passwordError } = useField('password');
const { errorMessage: passwordConfirmationError } = useField('password_confirmation');

const placeholder = computed<string>(() => (values.doc_type === 'cpf' ? 'Insira o CPF' : 'Insira o CNPJ'));

const btnText = computed(() => {
  return isPending.value ? 'Cadastrando...' : 'Cadastrar';
});

const handleDocTypeChange = (): void => {
  setFieldValue('document', '');
};

const onSubmit = handleSubmit((formValues) => {
  registerUserMutation(
    {
      full_name: formValues.full_name.trim(),
      social_name: formValues.social_name?.trim() || '',
      document: formValues.document.trim(),
      doc_type: formValues.doc_type,
      phone: formValues.phone?.trim() || '',
      email: formValues.email.trim(),
      password: formValues.password.trim(),
      password_confirmation: formValues.password_confirmation.trim(),
    },
    {
      onSuccess: (data: RegisterResponse): void => {
        toast.success(data.message || 'Usuário criado com sucesso!', { autoClose: 3000 });
      },
      onError: (error: ApiErrorResponse): void => {
        toast.error(error.response?.data?.message || 'Erro ao registrar usuário', { autoClose: 5000 });
      },
    },
  );
});
</script>

<style src="./RegisterStyle.css"></style>
