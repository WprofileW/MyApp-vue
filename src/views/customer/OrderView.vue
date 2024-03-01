<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, Edit } from '@element-plus/icons-vue'
import { getAllOrderItemService } from '@/api/order.js'
import { updateCartItemService } from '@/api/shoppingCart.js'
import { useLoginUserStore } from '@/stores/loginUser.js'

const loginUserStore = useLoginUserStore()

//添加分类数据模型
const orderItemModel = ref({
  username: '',
  productName: '',
  unitPrice: '',
  quantity: '',
  totalPrice: '',
  orderDate: ''
})

const allOrderItems = ref([])

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  getAllOrderItems()
}

//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  getAllOrderItems()
}

const getAllOrderItems = async () => {
  let pageHelperParams = ref(
    {
      pageNum: pageNum.value,
      pageSize: pageSize.value
    }
  )
  let result = await getAllOrderItemService(pageHelperParams.value)
  //渲染视图
  total.value = result.data.total
  allOrderItems.value = result.data.items
}

const disabled = ref(loginUserStore.loginUser.roleId === 1)
//控制添加分类弹窗
const dialogVisible = ref(false)
//定义变量,控制标题的展示
const title = ref('')
//展示编辑弹窗
const showDialog = (row) => {
  dialogVisible.value = true
  title.value = '编辑分类'
  //数据拷贝
  orderItemModel.value.username = row.username
  orderItemModel.value.productName = row.productName
  orderItemModel.value.unitPrice = row.unitPrice
  orderItemModel.value.quantity = row.quantity
  orderItemModel.value.totalPrice = row.totalPrice
  orderItemModel.value.orderDate = row.orderDate
}

const updateCartItem = async () => {
  let result = await updateCartItemService(orderItemModel.value)
  ElMessage.success(result.msg ? result.msg : '修改成功')
  await getAllOrderItems()
  dialogVisible.value = false
}

onMounted(() => {
  getAllOrderItems()
})
</script>

<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>用户信息</span>
      </div>
    </template>
    <el-table
      :data="allOrderItems"
      :default-sort="{ prop: 'orderDate', order: 'descending' }"
      style="width: 100%"
    >
      <el-table-column fixed prop="productName" label="productName" width="160" />
      <el-table-column prop="unitPrice" label="unitPrice" width="120" />
      <el-table-column prop="quantity" label="quantity" width="120" />
      <el-table-column prop="totalPrice" label="totalPrice" width="200" />
      <el-table-column prop="orderDate" label="orderDate" width="200" sortable />
      <el-table-column fixed="right" label="Operations" width="120">
        <template #default="{ row }">
          <el-button
            link circle
            type="primary"
            :icon="Edit"
            @click="showDialog(row)"
            v-if="loginUserStore.loginUser.roleId===0">
            <span>Edit</span>
          </el-button>
          <el-button
            link circle
            type="primary"
            :icon="Document"
            @click="showDialog(row)"
            v-if="loginUserStore.loginUser.roleId===1">
            <span>Detail</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页条 -->
    <el-pagination
      v-model:current-page="pageNum"
      v-model:page-size="pageSize"
      :page-sizes="[6, 12, 24, 32]"
      layout="jumper, total, sizes, prev, pager, next" background :total="total"
      @size-change="onSizeChange"
      @current-change="onCurrentChange"
      style="margin-top: 20px; justify-content: flex-end" />

    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form :model="orderItemModel" label-width="100px" style="padding-right: 30px">
        <el-form-item label="productName">
          <el-input v-model="orderItemModel.productName" minlength="1" maxlength="10" :disabled="disabled" />
        </el-form-item>
        <el-form-item label="unitPrice">
          <el-input v-model="orderItemModel.unitPrice" minlength="1" maxlength="15" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="quantity">
          <el-input v-model="orderItemModel.quantity" minlength="1" maxlength="15" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="totalPrice">
          <el-input v-model="orderItemModel.totalPrice" minlength="1" maxlength="15" :disabled="disabled">

          </el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="updateCartItem()"> 确认 </el-button>
        </span>
      </template>
    </el-dialog>
  </el-card>
</template>

<style scoped>

</style>