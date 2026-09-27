import { withRouteRecorder } from '@/stories/decorators';
import type { User } from '@/types/user.types';
import { defineComponent, h } from 'vue';
import AppHeader from './AppHeader.vue';

const storyUser: User = {
  id: 1,
  full_name: 'Teste Usuário',
  social_name: 'Teste Usuário',
  email: 'teste@example.com',
  phone: '11999999999',
  document: '11122233344',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
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
