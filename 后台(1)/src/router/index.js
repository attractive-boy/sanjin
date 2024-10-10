import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductCenter from '@/views/ProductCenter.vue'
import ViewHistory from '@/views/ViewHistory.vue'
import userManage from '@/views/userManage.vue'
import Order from '@/views/Order.vue'
import cashiApplies from '@/views/cashiApplies.vue'
import login from '@/views/login.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      children: [
        {
          path: '/ProductCenter',
          name: 'ProductCenter',
          component: ProductCenter
        },
        {
          path: '/ViewHistory',
          name: 'ViewHistory',
          component: ViewHistory
        },
        {
          path: '/userManage',
          name: 'userManage',
          component: userManage
        },
        {
          path: '/Order',
          name: 'Order',
          component: Order
        },
        {
          path: '/cashiApplies',
          name: 'cashiApplies',
          component: cashiApplies
        }
      ]
    }
    ,
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/login.vue')
    }
  ]
})

export default router
