import { withRouteRecorder } from '@/stories/decorators';
import type { User } from '@/types/user.types';
import { defineComponent, h } from 'vue';
import AppHeader from './AppHeader.vue';

const storyUser: User = {
  id: 1,
  full_name: 'Maria QA',
  email: 'maria@example.com',
  social_name: 'Maria',
  document: '12345678909',
  phone: '11987654321',
};

const headerWithRouteRecorder = withRouteRecorder(AppHeader);

/**
 * Cenário com usuário recebido por prop e com a rota atual registrada,
 * permitindo assertar navegações disparadas pelo menu do usuário.
 */
export const WithUser = defineComponent(() => () => h(headerWithRouteRecorder, { user: storyUser }));

/**
 * Cenário sem usuário, exibindo o nome padrão do componente.
 */
export const WithoutUser = defineComponent(() => () => h(AppHeader));
