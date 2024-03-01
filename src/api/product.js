import request from '@/utils/request.js'

export const addProductService =
  (productData) => {
    return request.post('/product/addProduct', productData)
  }

export const updateProductService =
  (productData) => {
    return request.put('/product/updateProduct', productData)
  }

export const updateProductByName =
  (productData) => {
    return request.put('/product/updateProductByName', productData)
  }

export const deleteProductService =
  (productData) => {
    return request.post('/product/deleteProduct', productData)
  }

export const getAllProductService =
  (pageHelperParams) => {
    return request.post('/product/getAllProducts', pageHelperParams)
  }

export const getProductByName =
  (productName) => {
    return request.post('/product/getProductByName', productName)
  }