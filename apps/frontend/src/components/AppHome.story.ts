import { defineComponent, h } from 'vue';
import AppHome from './AppHome.vue';

/**
 * Cenário padrão do home, exibindo o conteúdo principal da página.
 */
export const Home = defineComponent(() => () => h(AppHome));
