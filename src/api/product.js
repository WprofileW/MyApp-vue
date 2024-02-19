//导入request.js请求工具
import request from '@/utils/request.js'

export const addProductService =
  (productData) => {
    return request.post('/product/addProductInventory', productData)
  }

export const getAllProductService =
  (pageHelperParams) => {
    return request.post('/product/getAllProducts', pageHelperParams)
  }