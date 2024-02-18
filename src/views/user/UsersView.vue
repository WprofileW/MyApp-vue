<script setup>
import { onMounted, ref } from 'vue'
import { getAllUserService, userInfoUpdateService } from '@/api/user.js'
import { ElMessage } from 'element-plus'
import { Edit } from '@element-plus/icons-vue'

//添加分类数据模型
const userModel = ref({
  'username': '空',
  'realName': '空',
  'phone': '空',
  'email': '空',
  'address': '空',
  'notes': '空',
  'createdAt': '空',
  'updatedAt': '空'
})

const allUsers = ref([])
//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数



//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  getAllUsers()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  getAllUsers()
}

const getAllUsers = async () => {
  let  pageHelperParams = ref(
    {
      pageNum: pageNum.value,
      pageSize: pageSize.value
    }
  )
  console.log(pageHelperParams.value)
  let result = await getAllUserService(pageHelperParams.value)
  //渲染视图
  total.value = result.data.total
  allUsers.value = result.data.items

}

//控制添加分类弹窗
const dialogVisible = ref(false)
//定义变量,控制标题的展示
const title = ref('')
//展示编辑弹窗
const showDialog = (row) => {
  dialogVisible.value = true
  title.value = '编辑分类'
  //数据拷贝
  userModel.value.username = row.username
  userModel.value.realName = row.realName
  userModel.value.phone = row.phone
  userModel.value.email = row.email
  userModel.value.address = row.address
  userModel.value.notes = row.notes
  userModel.value.createdAt = row.createdAt
  userModel.value.updatedAt = row.updatedAt
}

const userInfoUpdate = async () => {
  let result = await userInfoUpdateService(userModel.value)
  ElMessage.success(result.msg ? result.msg : '修改成功')
  //调用获取所有分类的函数
  await getAllUsers()
  //隐藏弹窗
  dialogVisible.value = false
}


onMounted(() => {
  getAllUsers()
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>用户信息</span>
      </div>
    </template>
    <el-table :data="allUsers" style="width: 100%">
      <el-table-column fixed prop="username" label="username" width="160" />
      <el-table-column prop="realName" label="realName" width="120" />
      <el-table-column prop="phone" label="phone" width="120" />
      <el-table-column prop="email" label="email" width="200" />
      <el-table-column prop="address" label="address" width="200" />
      <el-table-column prop="notes" label="notes" width="120" />
      <el-table-column prop="createdAt" label="createdAt" width="200" />
      <el-table-column prop="updatedAt" label="updatedAt" width="200" />
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="{ row }">
          <el-button link type="primary" :icon="Edit" circle @click="showDialog(row)">
            Edit
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[6, 12, 24, 32]"
      layout="jumper, total, sizes, prev, pager, next"
      background
      :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end" />

    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form :model="userModel" label-width="100px" style="padding-right: 30px">
        <el-form-item label="username">
          <el-input v-model="userModel.username" minlength="1" maxlength="10" disabled />
        </el-form-item>
        <el-form-item label="realName">
          <el-input v-model="userModel.realName" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="phone">
          <el-input v-model="userModel.phone" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="email">
          <el-input v-model="userModel.email" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="address">
          <el-input v-model="userModel.address" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="notes">
          <el-input v-model="userModel.notes" minlength="1" maxlength="15"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="userInfoUpdate()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>


<style scoped>

</style>
