//导入request.js请求工具
import request from '@/utils/request.js'

//提供调用注册接口的函数
export const userRegisterService =
  (registerData) => {
    // console.log(registerData)
    return request.post('/user/register', registerData)
  }

//提供调用登录接口的函数
export const userLoginService =
  (loginData) => {
    return request.post('/user/login', loginData)
  }

//获取用户详细信息
export const userInfoGetService =
  () => {
    return request.get('/user/getUserInfo')
  }

//修改个人信息
export const userInfoUpdateService =
  (userInfoData) => {
    return request.put('/user/updateUserInfo', userInfoData)
  }

export const getAllUserService =
  (pageHelperParams) => {
    return request.post('/user/getAllUser', pageHelperParams)
  }