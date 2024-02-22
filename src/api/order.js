import request from '@/utils/request.js'

export const addOrderItemService =
    (OrderItemData) => {
        return request.post('/order/addOrderItem', OrderItemData)
    }

export const updateOrderItemService =
    (OrderItemData) => {
        return request.put('/order/updateOrderItem', OrderItemData)
    }

export const deleteOrderItemService =
    (OrderItemData) => {
        return request.post('/order/deleteOrderItem', OrderItemData)
    }

export const getAllOrderItemService =
    (pageHelperParams) => {
        return request.post('/order/getAllOrders', pageHelperParams)
    }