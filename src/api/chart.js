import request from '@/utils/request.js'

export const getAllInventoryChangeByMinuteService =
  () => {
    return request.get('/chart/getInventoryChangeByMinute')
  }

export const getInventoryChangeLimitFiveService =
  () => {
    return request.get('/chart/getInventoryChangeLimitFive')
  }

export const getTopThreeSaleService =
  () => {
    return request.get('/chart/getTopThreeSale')
  }