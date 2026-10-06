import { defineComponent, h } from 'vue';
import AppFooter from './AppFooter.vue';

/**
 * Cenário padrão do footer, exibindo o ano atual e o link para o repositório do projeto no GitHub.
 */
export const Footer = defineComponent(() => () => h(AppFooter));
