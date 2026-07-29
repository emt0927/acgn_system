import { useUserStore } from '@/store'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // 登录页
        {
            path: '/login',
            name: 'login',
            component: () => import('@/views/login/index.vue'),

        }, {
            path: '/',
            redirect: '/home',
            component: () => import('@/views/layout/index.vue'),
            meta: { requiresAuth: true },
            children: [{
                path: 'home',
                name: 'home',
                component: () => import('@/views/home/index.vue')
            }, {
              path:'chart',
              name:'chart',
              component: () => import('@/views/chart/index.vue')
            },
            {
                path:'setting',
                name:'setting',
                component: () => import('@/views/mySetting/index.vue')
            },
            {
                path:'series',
                name:'series',
                component: () => import('@/views/series/index.vue')
            }
            ]
        }
    ]
})
export default router

// 路由守卫
router.beforeEach((to, from, next) => {
    const userStore = useUserStore()
    const needsAuth = to.matched.some(record => record.meta.requiresAuth)
    if (needsAuth && !userStore.token) {
        console.log('我来了');
        // 记录用户原本想去的地方
        next({ name: 'login', query: { redirect: to.fullPath } })
    } else {
        next()
    }
})