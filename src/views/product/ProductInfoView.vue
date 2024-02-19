<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>商品信息</span>
      </div>
    </template>
    <el-table :data="productList" style="width: 100%">
      <el-table-column fixed prop="productName" label="productName" width="160" />
      <el-table-column prop="category" label="category" width="200" />
      <el-table-column prop="unitPrice" label="unitPrice" width="200" />
      <el-table-column prop="quantity" label="quantity" width="200" />
      <el-table-column prop="supplier" label="supplier" width="200" />
      <el-table-column prop="warehouseName" label="warehouseName" width="200" />
      <el-table-column fixed="right" label="Operations" width="200">
        <template #default="{ row }">
          <el-button type="primary" :icon="Edit" size="small" @click="showDialog(row)">
            Edit
          </el-button>
          <el-button type="primary" size="small" @click="addProduct(row)">
            <el-icon>
              <ShoppingCart />
            </el-icon>
            加入购物车
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
    <el-button
      type="primary"
      @click="goToCarPath"
      style="margin-top: 20px; justify-content: flex-end">
      跳转至购物车页面
    </el-button>
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form :model="productModel" label-width="120px" style="padding-right: 30px">
        <el-form-item label="productName">
          <el-input v-model="productModel.productName" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="category">
          <el-input v-model="productModel.category" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="quantity">
          <el-input v-model="productModel.quantity" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="supplier">
          <el-input v-model="productModel.supplier" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="warehouseName">
          <el-input v-model="productModel.warehouseName" minlength="1" maxlength="15"></el-input>
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
<script setup>
import { Edit, ShoppingCart } from '@element-plus/icons-vue'

import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useShoppingCartStore } from '@/stores/shoppingCart.js'
import { getAllProductService } from '@/api/product.js'
import { ElMessage } from 'element-plus'

//添加商品数据模型
const productModel = ref({
  'inventoryId': 5,
  'productName': '苹果123',
  'quantity': 999,
  'category': '888',
  'supplier': '777',
  'warehouseName': '111',
  'updateTime': '2024-02-19 12:52:42'
})

const productList = ref([])

const getAllProduct = async () => {
  let pageHelperParams = ref(
    {
      pageNum: pageNum.value,
      pageSize: pageSize.value
    }
  )
  let result = await getAllProductService(pageHelperParams.value)
  //渲染视图
  total.value = result.data.total
  productList.value = result.data.items
}

//分页条数据模型
const pageNum = ref(1)//当前页
const total = ref(20)//总条数
const pageSize = ref(3)//每页条数

//当每页条数发生了变化，调用此函数
const onSizeChange = (size) => {
  pageSize.value = size
  getAllProduct()
}
//当前页码发生变化，调用此函数
const onCurrentChange = (num) => {
  pageNum.value = num
  getAllProduct()
}

//控制添加分类弹窗
const dialogVisible = ref(false)
//定义变量,控制标题的展示
const title = ref('')
//展示编辑弹窗
const showDialog = (row) => {
  dialogVisible.value = true
  title.value = '编辑商品信息'
  //数据拷贝
  productModel.value.inventoryId = row.inventoryId
  productModel.value.productName = row.productName
  productModel.value.quantity = row.quantity
  productModel.value.category = row.category
  productModel.value.supplier = row.supplier
  productModel.value.warehouseName = row.warehouseName
  productModel.value.updateTime = row.updateTime
}

const store = useShoppingCartStore()

// 点击 添加购物车按钮
const addProduct =
  (row) => {
    store.increment(row)
    ElMessage.success('添加成功')
    //TODO
  }


// 实例化路由
const router = useRouter()
// 跳转至购物车页面
const goToCarPath = () => {
  router.push({
    path: '/product/shoppingCart'
  })
}

onMounted(() => {
  getAllProduct()
})

</script>
<style scoped>

</style>