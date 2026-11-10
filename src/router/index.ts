import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import store from '@/store'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomePage.vue'),
    meta: { title: '星溯智能科技 | 探索智能的宇宙边界' }
  },
  {
    path: '/yeharn',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录' }
  },
  {
    path: '/admin',
    component: () => import('@/layout/AdminLayout.vue'),
    redirect: '/admin/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/admin/Dashboard.vue'),
        meta: { title: '控制台' }
      },
      {
        path: 'home',
        name: 'HomeManage',
        component: () => import('@/views/admin/HomeManage.vue'),
        meta: { title: '首页管理' }
      },
      {
        path: 'founder',
        name: 'FounderManage',
        component: () => import('@/views/admin/FounderManage.vue'),
        meta: { title: '创始人管理' }
      },
      {
        path: 'core-tech',
        name: 'CoreTechManage',
        component: () => import('@/views/admin/CoreTechManage.vue'),
        meta: { title: '核心技术管理' }
      },
      {
        path: 'ai-capability',
        name: 'AiCapabilityManage',
        component: () => import('@/views/admin/AiCapabilityManage.vue'),
        meta: { title: '星际AI管理' }
      },
      {
        path: 'metaphor',
        name: 'MetaphorManage',
        component: () => import('@/views/admin/MetaphorManage.vue'),
        meta: { title: '意象解析管理' }
      },
      {
        path: 'philosophy',
        name: 'PhilosophyManage',
        component: () => import('@/views/admin/PhilosophyManage.vue'),
        meta: { title: '技术哲学管理' }
      },
      {
        path: 'milestone',
        name: 'MilestoneManage',
        component: () => import('@/views/admin/MilestoneManage.vue'),
        meta: { title: '里程碑管理' }
      },
      {
        path: 'ecosystem',
        name: 'EcosystemManage',
        component: () => import('@/views/admin/EcosystemManage.vue'),
        meta: { title: '跨生态管理' }
      },
      {
        path: 'contact',
        name: 'ContactManage',
        component: () => import('@/views/admin/ContactManage.vue'),
        meta: { title: '联系我们管理' }
      },
      {
        path: 'messages',
        name: 'MessageManage',
        component: () => import('@/views/admin/MessageManage.vue'),
        meta: { title: '留言管理' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  document.title = (to.meta.title as string) || '星溯智能科技'
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)
  const token = store.state.token
  if (requiresAuth && !token) {
    next('/yeharn')
  } else if (to.path === '/yeharn' && token) {
    next('/admin/dashboard')
  } else {
    next()
  }
})

export default router
