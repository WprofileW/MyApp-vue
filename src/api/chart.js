import request from '@/utils/request.js'

export const getInventoryChangeLimitFiveService =
  () => {
    return request.get('/chart/getInventoryChangeLimitFive')
  }

export const getTopThreeSaleService =
  () => {
    return request.get('/chart/getTopThreeSale')
  }