import request from '@/utils/request.js'

export const addCartItemService =
  (shoppingCartItemData) => {
    return request.post('/shoppingCart/addCartItem', shoppingCartItemData)
  }

export const updateCartItemService =
  (shoppingCartItemData) => {
    return request.put('/shoppingCart/updateCartItem', shoppingCartItemData)
  }

export const deleteCartItemService =
  (shoppingCartItemData) => {
    return request.post('/shoppingCart/deleteCartItem', shoppingCartItemData)
  }

export const getAllCartItemService =
  (pageHelperParams) => {
    return request.post('/shoppingCart/getAllCartItem', pageHelperParams)
  }

export const deleteAllCartItemsService =
  () => {
    return request.get('/shoppingCart/deleteAllCartItems')
  }