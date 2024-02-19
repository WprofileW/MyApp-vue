<script setup>
import { onMounted, ref } from 'vue'
import { userInfoGetService, userInfoUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { useLoginUserStore } from '@/stores/loginUser.js'

const loginUserStore = useLoginUserStore()

const userInfo = ref({
  'realName': '空',
  'phone': '空',
  'email': '空',
  'address': '空',
  'notes': '空',
  'createdAt': '空',
  'updatedAt': '空'
})

const rules = {
  realName: [
    { required: true, message: '请输入用户真名', trigger: 'blur' },
    {
      pattern: /^\S{2,10}$/,
      message: '昵称必须是2-10位的非空字符串',
      trigger: 'blur'
    }
  ],
  email: [
    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

const getUserInfo = async () => {
  let result = await userInfoGetService()
  userInfo.value = result.data
}

const updateUserInfo = async () => {
  let result = await userInfoUpdateService(userInfo.value)
  ElMessage.success(result.msg ? result.msg : '修改成功')
  await getUserInfo()
}

onMounted(() => {
  getUserInfo()
})
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>基本资料</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
          <el-form-item label="登录名称">
            <el-input v-model="loginUserStore.loginUser" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户真名" prop="realName">
            <el-input v-model="userInfo.realName"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="userInfo.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮件" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item label="创建时间" prop="email">
            <el-input v-model="userInfo.createdAt" disabled></el-input>
          </el-form-item>
          <el-form-item label="更新时间" prop="email">
            <el-input v-model="userInfo.updatedAt" disabled></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUserInfo">
              提交修改
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>