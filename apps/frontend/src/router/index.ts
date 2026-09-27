import { createRouter, createWebHistory } from 'vue-router';
import { authGuard } from '../utils/authGuards';
import routes from './routes';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(authGuard);

export default router;
