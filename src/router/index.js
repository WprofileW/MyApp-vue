import { createRouter, createWebHistory } from 'vue-router'

//导入组件
import LoginVue from '@/views/Login.vue'
import LayoutVue from '@/views/Layout.vue'
import LoginUserView from '@/views/user/LoginUserView.vue'
import UsersView from '@/views/user/UsersView.vue'

//定义路由关系
const routes = [
  { path: '/login', component: LoginVue },
  {
    path: '/', component: LayoutVue,
    children: [
      { path: '/user/loginUser', component: LoginUserView },
      { path: '/user/allUser', component: UsersView }
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