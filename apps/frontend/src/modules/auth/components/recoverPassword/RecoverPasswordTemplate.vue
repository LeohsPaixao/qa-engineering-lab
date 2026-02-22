<template>
  <div class="recover-password-container main-content">
    <form data-testid="form-recover-password" class="form-recover-password" @submit.prevent="onSubmit">
      <h2 class="title-recover-password">Recuperar Senha</h2>
      <p>Por favor, insira o seu e-mail para recuperar a senha:</p>

      <div class="form-group-recover-password">
        <label class="label-email" for="email" data-testid="label-email-recover-password">E-mail</label>
        <Field
          data-testid="input-email-recover-password"
          type="email"
          id="email"
          autocomplete="username"
          name="email"
          placeholder="Digite seu e-mail"
          :class="['input-email-recover-password', { 'input-error': emailError }]"
        />
        <ErrorMessage data-testid="message-error-email-recover-password" name="email" class="error-message" />
      </div>
      <button data-testid="btn-recover-password" class="btn btn-recover btn-recover-password" type="submit" :disabled="isPending">
        {{ btnText }}
      </button>
      <div class="link-container">
        <router-link to="/" data-testid="link-go-to-login" class="link-go-to-login"> Voltar ao Login </router-link>
      </div>
    </form>
    <p class="message-user-recover-password">
      <strong>Atenção:</strong> Este projeto não realiza envio de e-mails. Certifique-se de testar apenas para fins de validação da interface.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { ApiErrorResponse } from '@/types/error.types';
import type { ForgotPasswordFormData } from '@/types/user.types';
import { toTypedSchema } from '@vee-validate/yup';
import { ErrorMessage, Field, useField, useForm } from 'vee-validate';
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import * as yup from 'yup';
import { useForgotPassword } from '../../../../composables/useForgotPassword';

const { mutate: sendForgotPasswordEmailMutation, isPending } = useForgotPassword();
const router = useRouter();

const validationSchema = toTypedSchema(
  yup.object({
    email: yup.string().required('O Email é obrigatório.').email('Email inválido.'),
  }),
);

const { handleSubmit } = useForm({
  initialValues: {
    email: '',
  },
  validationSchema,
});

const { errorMessage: emailError } = useField('email');

const btnText = computed(() => {
  return isPending.value ? 'Enviando e-mail...' : 'Enviar instruções';
});

const onSubmit = handleSubmit((formValues: ForgotPasswordFormData) => {
  if (!emailError.value) {
    sendForgotPasswordEmailMutation(
      { email: formValues.email.trim() },
      {
        onSuccess: async (): Promise<void> => {
          await router.push('/');
          toast.success('Um e-mail foi enviado com instruções para recuperar a senha.', { autoClose: 3000 });
        },
        onError: (error: ApiErrorResponse): void => {
          toast.error(error.response?.data?.message || 'Erro ao enviar e-mail de recuperação de senha', { autoClose: 5000 });
        },
      },
    );
  }
});
</script>

<style src="./RecoverPasswordStyle.css"></style>
