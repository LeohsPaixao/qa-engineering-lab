<template>
  <div class="login-container main-content">
    <div class="content">
      <form data-testid="form-login" class="form-login" @submit.prevent="onSubmit">
        <img data-testid="logo" src="@/assets/images/qa-test-lab.png" alt="Logo" class="logo" />
        <h2>Bem-vindo de volta!</h2>
        <p>Por favor, entre com suas credenciais abaixo:</p>

        <div class="form-group-login">
          <label for="email" data-testid="label-email">Insira seu E-mail</label>
          <Field
            data-testid="input-email"
            type="email"
            id="email"
            name="email"
            autocomplete="username"
            :class="['input-email-login', { 'input-error': emailError }]"
          />
          <ErrorMessage data-testid="message-error-email" name="email" class="error-message" />
        </div>

        <div class="form-group-login">
          <label for="password" data-testid="label-password">Insira sua Senha</label>
          <Field
            data-testid="input-password"
            type="password"
            id="password"
            name="password"
            autocomplete="current-password"
            :class="['input-password-login', { 'input-error': passwordError }]"
          />
          <ErrorMessage data-testid="message-error-password" name="password" class="error-message" />
        </div>

        <button data-testid="btn-login" class="btn btn-login" type="submit" :disabled="isPending">
          {{ btnText }}
        </button>

        <div class="link-container">
          <a data-testid="link-recover-password" href="/recover-password" class="link recover-password"> Esqueceu a senha? </a>
          <a data-testid="link-signup" href="/signup" class="link signup"> Criar uma nova conta </a>
        </div>
      </form>

      <p class="message-user-login">
        <strong>Atenção:</strong> Para acessar com as credenciais padrão, utilize o e-mail <em>generic@example.com</em> e a senha <em>123456</em>.
        Essas informações foram geradas automaticamente pelo seeder para facilitar testes e demonstrações.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ApiErrorResponse } from '@/types/error.types';
import type { LoginFormData, LoginResponse } from '@/types/user.types';
import { toTypedSchema } from '@vee-validate/yup';
import { ErrorMessage, Field, useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import * as yup from 'yup';
import { useLoginUser } from '../../../../composables/useLoginUser';

const validationSchema = toTypedSchema(
  yup.object({
    email: yup.string().required('O Email é obrigatório.').email('Email inválido.'),
    password: yup.string().required('A Senha é obrigatória.'),
  }),
);

const { handleSubmit } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema,
});

const { mutate: loginUserMutation, isPending } = useLoginUser();
const router = useRouter();

const { errorMessage: emailError } = useField('email');
const { errorMessage: passwordError } = useField('password');

const btnText = computed(() => {
  return isPending.value ? 'Entrando...' : 'Entrar na Conta';
});

const onSubmit = handleSubmit((formValues: LoginFormData) => {
  loginUserMutation(
    {
      email: formValues.email.trim(),
      password: formValues.password.trim(),
    },
    {
      onSuccess: async (data: LoginResponse): Promise<void> => {
        await router.push('/home');
        toast.success(data.message || 'Login realizado com sucesso!', { autoClose: 3000 });
      },
      onError: (error: ApiErrorResponse): void => {
        toast.error(error.response?.data?.message || 'Erro ao realizar login', { autoClose: 5000 });
      },
    },
  );
});
</script>

<style src="./LoginStyle.css"></style>
