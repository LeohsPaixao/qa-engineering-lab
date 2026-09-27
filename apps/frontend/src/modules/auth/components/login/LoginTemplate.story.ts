import { defineComponent, h } from 'vue';
import LoginTemplate from './LoginTemplate.vue';

/**
 * Cenário padrão do formulário de login, com os campos em branco
 * para exercitar a validação e o envio do formulário.
 */
export const Default = defineComponent(() => () => h(LoginTemplate));
