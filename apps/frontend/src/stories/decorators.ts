import { defineComponent, h, type Component } from 'vue';
import { useRoute } from 'vue-router';

/**
 * Envolve uma story aplicando props fixas no componente sob teste.
 *
 * @param story - Componente (story) que será renderizado.
 * @param props - Props fixas do cenário.
 *
 * @returns {Component} Story decorada com as props informadas.
 *
 * @example
 * ```typescript
 * const story = withProps(AppHeader, { user });
 * ```
 */
export const withProps = (story: Component, props: Record<string, unknown> = {}): Component =>
  defineComponent({
    inheritAttrs: false,
    setup(_props, { attrs }) {
      return () => h(story, { ...props, ...attrs });
    },
  });

/**
 * Envolve uma story registrando a rota atual do router em um input oculto,
 * para que os testes possam assertar navegações disparadas pelo componente.
 *
 * @param story - Componente (story) que será renderizado.
 *
 * @returns {Component} Story decorada com o registro da rota atual.
 *
 * @example
 * ```typescript
 * const story = withRouteRecorder(AppHeader);
 * await expect(story.getByTestId('current-route')).toHaveValue('/profile');
 * ```
 */
export const withRouteRecorder = (story: Component): Component =>
  defineComponent({
    inheritAttrs: false,
    setup(_props, { attrs: componentAttrs }) {
      const route = useRoute();

      return () =>
        h('div', { 'data-testid': 'route-recorder' }, [
          h(story, { ...componentAttrs }),
          h('input', { 'data-testid': 'current-route', readOnly: true, value: route.path }),
        ]);
    },
  });
