import FrameworkPage from '@/features/frameworks/FrameworkPage.vue';
import OverviewPage from '@/features/overview/OverviewPage.vue';
import TestsListPage from '@/features/tests/TestsListPage.vue';
import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Overview',
    component: OverviewPage,
  },
  {
    path: '/frameworks',
    name: 'Frameworks',
    component: FrameworkPage,
  },
  {
    path: '/frameworks/:name',
    name: 'FrameworkDetail',
    component: FrameworkPage,
    props: true,
  },
  {
    path: '/tests',
    name: 'Tests',
    component: TestsListPage,
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHistory('/qa-solar/dashboard/'),
  routes,
});

export default router;
