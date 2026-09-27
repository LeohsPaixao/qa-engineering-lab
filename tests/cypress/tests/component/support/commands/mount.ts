import { VueQueryPlugin } from '@tanstack/vue-query';
import { mount } from 'cypress/vue';
import { queryClient } from 'frontend/src/plugins/vueQuery';
import { Vue3Toastify, toastOptions } from 'frontend/src/plugins/vueToastify';
import routes from 'frontend/src/router/routes';
import { h } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';

const testRouter = createRouter({
  history: createMemoryHistory(),
  routes,
});

const RouteRecorder = {
  name: 'RouteRecorder',
  setup() {
    return () => h('input', {
      'data-testid': 'current-route',
      readOnly: true,
      value: testRouter.currentRoute.value.path,
    });
  },
};

Cypress.Commands.add('mount', (component, options = {}) => {
  options.global = options.global || {};
  options.global.plugins = options.global.plugins || [];

  options.global.plugins.push([VueQueryPlugin, { queryClient }]);
  options.global.plugins.push([Vue3Toastify, toastOptions]);
  options.global.plugins.push(testRouter);

  return mount(component, options);
});

Cypress.Commands.add('mountWithRoute', (component, options = {}) => {
  options.global = options.global || {};
  options.global.plugins = options.global.plugins || [];

  options.global.plugins.push([VueQueryPlugin, { queryClient }]);
  options.global.plugins.push([Vue3Toastify, toastOptions]);
  options.global.plugins.push(testRouter);

  const wrapper = {
    components: { RouteRecorder },
    setup() {
      return () => h('div', { 'data-testid': 'route-recorder' }, [
        h(component, { ...options.props }),
        h(RouteRecorder),
      ]);
    },
  };

  return mount(wrapper, options);
});