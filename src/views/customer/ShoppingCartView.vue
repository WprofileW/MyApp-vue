<template>
  <el-card>
    <el-table
      ref="multipleTableRef"
      :data="shoppingCartItems"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column fixed prop="productName" label="productName" width="150" />
      <el-table-column prop="category" label="category" width="150" />
      <el-table-column prop="unitPrice" label="unitPrice" width="150" />
      <el-table-column prop="quantity" label="quantity" width="150" />
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
              :precision="0"
            />
            <el-button type="primary" size="small" @click="removeProduct(scope.row)">
              移出购物车
            </el-button>
          </el-space>
        </template>
      </el-table-column>
    </el-table>

    <el-button-group style="margin-top: 20px; justify-content: flex-end">
      <el-button
        type="danger"
        @click="clearShoppingCart()">
        <el-icon>
          <DeleteFilled />
        </el-icon>
        清空购物车
      </el-button>
      <el-button type="success">下单</el-button>
      <el-button type="primary">共{{ store.totalNum }}件商品</el-button>
      <el-button type="primary">共{{ store.totalPrice }}元</el-button>
    </el-button-group>
  </el-card>
</template>

<script setup>
import { h, onMounted, ref } from 'vue'
import { useShoppingCartStore } from '@/stores/shoppingCart.js'
import { ElDivider, ElMessage } from 'element-plus'
import { DeleteFilled } from '@element-plus/icons-vue'

const store = useShoppingCartStore()

// console.log('store:', store)
const multipleTableRef = ref(null)

onMounted(() => {
  if (shoppingCartItems.value.length > 0 && store.selectListArr.length > 0) {
    let idsArr = store.selectListArr.map((item) => item.productName)
    // console.log(idsArr)
    //之前购物车中选中的内容的回显
    shoppingCartItems.value.map(
      (item) => {
        if (idsArr.includes(item.productName)) {
          multipleTableRef.value.toggleRowSelection(item, true)
        } else {
          multipleTableRef.value.toggleRowSelection(item, false)
        }
      })
  }
})

// 购物车数据
const shoppingCartItems = ref([])
shoppingCartItems.value = store.listArr

// 选择购物车中的商品
const handleSelectionChange =
  (val) => {
    store.selectGoodCar(val)
  }

const removeProduct =
  (row) => {
    store.decrement(row)
    ElMessage.success('移除成功')
    //TODO
  }

const clearShoppingCart = () => {
  store.removeShoppingCartItems()
  location.reload()
}

</script>
<style>
.sum-container {
  padding-top: 10px;
  text-align: right;
}

.weight-text {
  font-weight: 600;
  font-size: 26px;
}
</style>