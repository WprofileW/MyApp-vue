//定制请求的实例
import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useTokenStore } from '@/stores/token.js'
import router from '@/router'

//定义一个变量,记录公共的前缀 baseURL
const baseURL = '/api'
const instance = axios.create({ baseURL })

//添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    //请求前的回调
    //添加token
    const tokenStore = useTokenStore()
    //判断有没有token
    if (tokenStore.token) {
      config.headers.Authorization = tokenStore.token
    }
    return config
  },
  (err) => {
    //请求错误的回调
    Promise.reject(err)
  }
)

//添加响应拦截器
instance.interceptors.response.use(
  result => {
    //判断业务状态码
    if (result.data.code === 0) {
      return result.data
    }
    //操作失败
    ElMessage.error(result.data.msg ? result.data.msg : '服务异常')
    //异步操作的状态转换为失败
    return Promise.reject(result.data)
  },
  err => {
    //判断响应状态码,如果为401,则证明未登录,提示请登录,并跳转到登录页面
    if (err.response.status === 401) {
      ElMessage.error('请先登录')
      router.push('/login')
        .then()
    } else {
      ElMessage.error('服务异常')
    }
    //异步的状态转化成失败的状态
    return Promise.reject(err)
  }
)

export default instance