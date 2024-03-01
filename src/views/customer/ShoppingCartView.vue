<script setup>
import { h, onMounted, ref } from 'vue'

import { ElDivider, ElMessage } from 'element-plus'
import { DeleteFilled } from '@element-plus/icons-vue'

import { useLoginUserStore } from '@/stores/loginUser.js'
import { useShoppingCartStore } from '@/stores/shoppingCart.js'
import { addOrderItemService } from '@/api/order.js'
import { deleteAllCartItemsService, deleteCartItemService, updateCartItemService } from '@/api/shoppingCart'
import { getProductByName, updateProductByName } from '@/api/product.js'

const store = useShoppingCartStore()

const multipleTableRef = ref(null)

onMounted(
  () => {
    if (shoppingCartItems.value.length > 0 && store.selectListArr.length > 0) {
      let productNameArr = store.selectListArr.map((item) => item.productName)
      //之前购物车中选中的内容的回显
      shoppingCartItems.value.map(
        (item) => {
          if (productNameArr.includes(item.productName)) {
            multipleTableRef.value.toggleRowSelection(item, true)
          } else {
            multipleTableRef.value.toggleRowSelection(item, false)
          }
        })
    }
  })

// 购物车数据
const shoppingCartItems = ref([])
shoppingCartItems.value =
  store.listArr.filter(
    item => (
      item.username === useLoginUserStore().loginUser.username
    ))

// 选择购物车中的商品
const handleSelectionChange =
  (val) => {
    store.selectGoodCar(val)
  }

const changeCartItemNum =
  (row) => {
    updateCartItemService({
      cartItemId: row.cartItemId,
      username: row.username,
      productName: row.productName,
      unitPrice: row.unitPrice,
      num: row.num
    })
    ElMessage.success('修改成功')
  }

const removeProduct =
  (row) => {
    store.decrement(row)
    deleteCartItemService(row)
    ElMessage.success('移除成功')
    location.reload()
  }

const clearShoppingCart =
  () => {
    store.removeShoppingCartItems(useLoginUserStore().loginUser.username)
    deleteAllCartItemsService()
    ElMessage.success('清空成功')
    location.reload()
  }

const placeOrder = async () => {
  let orderList = []
  store.selectListArr.forEach(
    item =>
      orderList.push({
          username: item.username,
          productName: item.productName,
          unitPrice: item.unitPrice,
          quantity: item.num,
          totalPrice: item.unitPrice * item.num
        }
      )
  )
  addOrderItemService(orderList)
  let updateInventoryList = []
  for (const item of orderList) {
    updateInventoryList.push(
      {
        productName: item.productName,
        quantity:
          (await getProductByName({ productName: item.productName })).data.quantity - item.quantity
      }
    )
  }
  updateInventoryList.forEach(
    item => updateProductByName(item)
  )
  clearShoppingCart()
  ElMessage.success('下单成功')
}

</script>

<template>
  <el-card>
    <el-table
      ref="multipleTableRef"
      :data="shoppingCartItems"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <el-table-column fixed prop="productName" label="productName" width="150" />
      <el-table-column prop="category" label="category" width="150" />
      <el-table-column prop="unitPrice" label="unitPrice" width="150" />
      <el-table-column prop="quantity" label="库存数量" width="150" />
      <el-table-column prop="supplier" label="supplier" width="150" />
      <el-table-column fixed="right" label="购买数量">
        <template #default="scope">
          <el-space
            :size="10"
            :spacer="h(ElDivider, { direction: 'vertical' })">
            <el-input-number
              v-model.number="scope.row.num"
              :min="1"
              :max="scope.row.quantity"
              @change="changeCartItemNum(scope.row)"
              :precision="0" />
            <el-button
              type="primary"
              size="small"
              @click="removeProduct(scope.row)">
              移出购物车
            </el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>

    <el-button-group style="margin-top: 20px; justify-content: flex-end">
      <el-button type="danger" @click="clearShoppingCart()">
        <el-icon>
          <DeleteFilled />
        </el-icon>
        清空购物车
      </el-button>
      <el-button type="success" @click="placeOrder()">下单</el-button>
      <el-button type="primary">共{{ store.totalNum }}件商品</el-button>
      <el-button type="primary">共{{ store.totalPrice }}元</el-button>
    </el-button-group>
  </el-card>
</template>

<style scoped>

</style>