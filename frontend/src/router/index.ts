import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import authMiddleware from '../middleware/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        layout: 'default',
        requiresAuth: true
      }
    },
    {
      path: '/sign-in',
      name: 'signIn',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SignIn.vue'),
      meta: {
        layout: 'auth'
      }
    },
    {
      path: '/sign-up',
      name: 'signUp',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SignUp.vue'),
      meta: {
        layout: 'auth'
      }
    },
    {
      path: '/transactions',
      name: 'transactions',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/TransactionsHistory.vue'),
      meta: {
        layout: 'default',
        requiresAuth: true
      }
    },
    {
      path: '/send-money',
      name: 'send-money',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/SendMoney.vue'),
      meta: {
        layout: 'default',
        requiresAuth: true
      }
    },
  ],
})
router.beforeEach(authMiddleware);

export default router
