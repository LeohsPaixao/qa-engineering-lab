import { defineComponent, h } from 'vue';
import LoadingErrorState from './LoadingErrorState.vue';

/**
 * Cenário padrão: sem loading e sem erro, portanto nada é renderizado.
 */
export const Default = defineComponent(() => () => h(LoadingErrorState));

/**
 * Cenário de carregamento, exibindo o spinner.
 */
export const Loading = defineComponent(() => () => h(LoadingErrorState, { isLoading: true, isError: false }));

/**
 * Cenário de erro com a mensagem padrão do componente.
 */
export const WithError = defineComponent(() => () => h(LoadingErrorState, { isLoading: false, isError: true }));

/**
 * Cenário de loading com mensagem de erro preparada para o componente,
 * usado para validar a troca de estado sem remontar a story.
 */
export const WithErrorMessage = defineComponent(
  (props: { errorMessage?: string }) => () =>
    h(LoadingErrorState, {
      isLoading: false,
      isError: true,
      errorMessage: props.errorMessage ?? 'Erro ao carregar os dados do usuário.',
    }),
  { props: ['errorMessage'] },
);
