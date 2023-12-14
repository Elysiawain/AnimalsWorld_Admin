import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: () => import('@/views/layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/layout/home/index.vue')
        },
        {
          path: 'animals',
          name: 'about',
          component: () => import('@/views/layout/animals/index.vue')
        },
        {
          path:'admin',
          name:'admin',
          component: () => import('@/views/layout/admin/index.vue')
        },
        {
          path:'center',
          name:'center',
          component: () => import('@/views/layout/center/index.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue')
    },
    {
      path:'/:catchAll(.*)',
      name: '404',
      component: () => import('@/views/404.vue')
    }
  ]
})

export default router
