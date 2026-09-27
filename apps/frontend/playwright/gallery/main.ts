import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query';
import { createApp, h, shallowRef, type App, type Component } from 'vue';
import { createMemoryHistory, createRouter } from 'vue-router';
import { Vue3Toastify, toastOptions } from '@/plugins/vueToastify';
import routes from '@/router/routes';
import '@/assets/styles/main.css';
import '@/assets/styles/toast.css';

type StoryModule = Record<string, Component | undefined>;

interface MountParams {
  story: string;
  props?: Record<string, unknown>;
}

const gallery = window as unknown as {
  mount: (params: MountParams) => Promise<void>;
  unmount: () => Promise<void>;
};

const storyFiles = import.meta.glob('../../src/**/*.story.{ts,vue}');

const storyPath = (file: string): string => file.replace(/^(\.\.\/)+src\//, '').replace(/\.story\.\w+$/, '');

const resolve = async (storyId: string): Promise<Component | undefined> => {
  const separator = storyId.lastIndexOf('/');
  const path = separator === -1 ? storyId : storyId.slice(0, separator);
  const name = separator === -1 ? undefined : storyId.slice(separator + 1);

  const file = Object.keys(storyFiles).find((candidate) => {
    const candidatePath = storyPath(candidate);

    return candidatePath === path || candidatePath.endsWith(`/${path}`);
  });

  if (!file) {
    return undefined;
  }

  const storyModule = (await storyFiles[file]()) as StoryModule;

  if (name) {
    return storyModule[name] ?? storyModule.default;
  }

  return storyModule.default ?? Object.values(storyModule)[0];
};

const story = shallowRef<Component | null>(null);
const props = shallowRef<Record<string, unknown>>({});
const host = { render: () => (story.value ? h(story.value, props.value) : null) };

let app: App | undefined;

const createGalleryApp = (): App => {
  const router = createRouter({ history: createMemoryHistory(), routes });
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: 0, refetchOnWindowFocus: false } },
  });

  return createApp(host).use(router).use(VueQueryPlugin, { queryClient }).use(Vue3Toastify, toastOptions);
};

gallery.mount = async ({ story: storyId, props: nextProps }: MountParams): Promise<void> => {
  const resolved = await resolve(storyId);

  if (!resolved) {
    throw new Error(`Unknown story: ${storyId}`);
  }

  story.value = resolved;
  props.value = nextProps ?? {};

  if (!app) {
    app = createGalleryApp();
    app.mount('#root');
  }
};

gallery.unmount = async (): Promise<void> => {
  app?.unmount();
  app = undefined;
  story.value = null;
  props.value = {};
};

export {};
