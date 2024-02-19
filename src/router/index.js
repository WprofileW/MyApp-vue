import { createRouter, createWebHistory } from 'vue-router'

//导入组件
import LoginView from '@/views/LoginView.vue'
import LayoutView from '@/views/LayoutView.vue'
import LoginUserView from '@/views/user/LoginUserView.vue'
import UsersView from '@/views/user/UsersView.vue'
import ProductInfoView from '@/views/product/ProductInfoView.vue'
import ShoppingCartView from '@/views/customer/ShoppingCartView.vue'
import Top10View from '@/views/chart/Top10View.vue'
import DailyChangeView from '@/views/chart/DailyChangeView.vue'

//定义路由关系
const routes = [
  { path: '/login', component: LoginView },
  {
    path: '/', component: LayoutView,
    children: [
      { path: '/user/loginUser', component: LoginUserView },
      { path: '/user/allUser', component: UsersView },
      { path: '/product/productInfo', component: ProductInfoView },
      { path: '/product/shoppingCart', component: ShoppingCartView },
      { path: '/chart/top10', component: Top10View },
      { path: '/chart/dailyChange', component: DailyChangeView }
    ]
  }
]

//创建路由器
const router = createRouter({
  history: createWebHistory(),
  routes: routes
})

//导出路由
export default router