<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { ElMessage } from 'element-plus'
import { CirclePlusFilled, DeleteFilled, Edit, ShoppingCart } from '@element-plus/icons-vue'

import { useShoppingCartStore } from '@/stores/shoppingCart.js'
import { addProductService, deleteProductService, getAllProductService, updateProductService } from '@/api/product.js'
import { useLoginUserStore } from '@/stores/loginUser.js'

//添加商品数据模型
const productModel = ref({
  'productName': '',
  'quantity': '',
  'unitPrice': '',
  'category': '',
  'supplier': '',
  'warehouseName': ''
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

//控制添加商品弹窗
const dialogVisible = ref(false)
//控制抽屉是否显示
const visibleDrawer = ref(false)
//定义变量,控制标题的展示
const title = ref('')

//展示编辑弹窗
const showDialog =
  (row) => {
    dialogVisible.value = true
    title.value = '编辑商品信息'
    console.log(row)
    //数据拷贝
    productModel.value.inventoryId = row.inventoryId
    productModel.value.productName = row.productName
    productModel.value.unitPrice = row.unitPrice
    productModel.value.quantity = row.quantity
    productModel.value.category = row.category
    productModel.value.supplier = row.supplier
    productModel.value.warehouseName = row.warehouseName
    productModel.value.updateTime = row.updateTime
  }

const addProduct =
  () => {
    addProductService(productModel.value)
    ElMessage.success('添加成功')
    visibleDrawer.value = false
    getAllProduct()
  }

const deleteProduct =
  (row) => {
    deleteProductService(row)
    ElMessage.success('删除成功')
    getAllProduct()
  }

const productInfoUpdate =
  async () => {
    let result = await updateProductService(productModel.value)
    ElMessage.success(result.msg ? result.msg : '修改成功')
    await getAllProduct()
    //隐藏弹窗
    dialogVisible.value = false
  }

const clearProductModel =
  () => {
    productModel.value = {
      'productName': '',
      'quantity': '',
      'unitPrice': '',
      'category': '',
      'supplier': '',
      'warehouseName': ''
    }
  }

const shoppingCartStore = useShoppingCartStore()
const loginUserStore = useLoginUserStore()

// 点击添加到购物车
const addShoppingCart =
  (row) => {
    row.username = loginUserStore.loginUser.username
    shoppingCartStore.increment(row)
    ElMessage.success('添加成功')
  }

// 实例化路由
const router = useRouter()
// 跳转至购物车页面
const goToCarPath =
  () => {
    router.push({ path: '/product/shoppingCart' })
  }

onMounted(
  () => {
    getAllProduct()
  })

</script>

<template>
  <el-card>
    <template #header>
      <div class="header">
        <span>商品信息</span>
      </div>
    </template>

    <el-button type="primary" @click="visibleDrawer = true">
      <el-icon>
        <CirclePlusFilled />
      </el-icon>
      添加商品
    </el-button>

    <el-table
      :data="productList"
      style="width: 100%">
      <el-table-column fixed prop="inventoryId" label="inventoryId" width="160" />
      <el-table-column prop="productName" label="productName" width="160" />
      <el-table-column prop="category" label="category" width="200" />
      <el-table-column prop="unitPrice" label="unitPrice" width="200" />
      <el-table-column prop="quantity" label="quantity" width="200" />
      <el-table-column prop="supplier" label="supplier" width="200" />
      <el-table-column prop="warehouseName" label="warehouseName" width="200" />
      <el-table-column prop="updateTime" label="updateTime" width="200" />
      <el-table-column fixed="right" label="Operations" width="200">
        <template #default="{ row }">
          <el-button
            type="primary"
            :icon="Edit"
            size="small"
            @click="showDialog(row)"
            v-if="loginUserStore.loginUser.roleId===0">
            Edit
          </el-button>
          <el-button
            type="primary"
            :icon="DeleteFilled"
            size="small"
            @click="deleteProduct(row)"
            v-if="loginUserStore.loginUser.roleId===0">
            Delete
          </el-button>
          <el-button
            type="primary"
            size="small"
            @click="addShoppingCart(row)"
            v-if="loginUserStore.loginUser.roleId===1">
            <el-icon>
              <ShoppingCart />
            </el-icon>
            加入购物车
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页条 -->
    <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[6, 12, 24, 32]"
                   layout="jumper, total, sizes, prev, pager, next" background :total="total"
                   @size-change="onSizeChange"
                   @current-change="onCurrentChange" style="margin-top: 20px; justify-content: flex-end" />
    <el-button type="primary" @click="goToCarPath" style="margin-top: 20px; justify-content: flex-end">
      跳转至购物车页面
    </el-button>
    <el-dialog v-model="dialogVisible" :title="title" width="30%">
      <el-form :model="productModel" label-width="120px" style="padding-right: 30px">
        <el-form-item label="productName">
          <el-input v-model="productModel.productName" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="unitPrice">
          <el-input v-model="productModel.unitPrice" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="quantity">
          <el-input v-model="productModel.quantity" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="category">
          <el-input v-model="productModel.category" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="supplier">
          <el-input v-model="productModel.supplier" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item label="warehouseName">
          <el-input v-model="productModel.warehouseName" minlength="1" maxlength="15"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="dialogVisible = false; clearProductModel()">取消</el-button>
          <el-button type="primary" @click="productInfoUpdate()"> 确认</el-button>
        </el-form-item>

      </el-form>


    </el-dialog>


    <!-- 抽屉 -->
    <el-drawer v-model="visibleDrawer" direction="rtl" size="50%">

      <el-form :model="productModel" label-width="200px">
        <el-form-item label="productName">
          <el-input v-model="productModel.productName" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="unitPrice">
          <el-input v-model="productModel.unitPrice" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="quantity">
          <el-input v-model="productModel.quantity" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="category">
          <el-input v-model="productModel.category" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="supplier">
          <el-input v-model="productModel.supplier" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="warehouseName">
          <el-input v-model="productModel.warehouseName" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addProduct()">
            添加商品
          </el-button>
        </el-form-item>
      </el-form>
    </el-drawer>
  </el-card>
</template>

<style scoped></style>