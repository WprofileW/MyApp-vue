import './assets/main.scss'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/dist/locale/zh-cn.js'

import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-persistedstate-plugin'

import { createApp } from 'vue'
import router from '@/router'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia()
const persist = createPersistedState()
pinia.use(persist)
app.use(pinia)
app.use(router)
app.use(ElementPlus, { locale })
app.mount('#app')