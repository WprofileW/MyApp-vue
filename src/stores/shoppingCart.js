import { defineStore } from 'pinia'
import { addCartItemService } from '@/api/shoppingCart.js'

export const useShoppingCartStore =
  defineStore('ShoppingCart', {
    state:
      () => (
        {
          cartItemId: 1000,
          listArr: [],
          selectListArr: []
        }),
    getters:
      {
        // 购物车中的总数量
        totalNum: (state) => {
          let num = 0
          if (state.selectListArr.length > 0) {
            num = state.selectListArr.reduce(
              (acc, cur) => {
                return acc + cur.num
              }, 0)
          }
          return num
        },
        // 购物车中的总价格
        totalPrice: (state) => {
          let price = 0
          if (state.selectListArr.length > 0) {
            price = state.selectListArr.reduce(
              (acc, cur) => {
                return acc + cur.num * cur.unitPrice
              }, 0)
          }
          return price
        }
      },
    actions:
      {
        increment(row) {
          if (this.listArr.length === 0) {
            this.listArr.push({
              ...row,
              num: 1,
              cartItemId: this.cartItemId
            })
            this.cartItemId += 1
          } else {
            let index = this.listArr
              .findIndex(item =>
                item.productName === row.productName && item.username === row.username)
            if (index !== -1) {
              this.listArr[index].num = this.listArr[index].num + 1
            } else {
              this.listArr.push({
                ...row,
                num: 1,
                cartItemId: this.cartItemId
              })
              this.cartItemId += 1
            }
          }
          let afterIndex = this.listArr
            .findIndex(item =>
              item.productName === row.productName && item.username === row.username)
          row.num = this.listArr[afterIndex].num
          row.cartItemId = this.listArr[afterIndex].cartItemId
          addCartItemService(row)
        },

        decrement(row) {
          let index = this.listArr
            .findIndex((item) => item.productName === row.productName)
          this.listArr.splice(index, 1)
        },

        // 选中购物车中的商品
        selectGoodCar(state) {
          this.selectListArr = state
        },

        removeShoppingCartItems(username) {
          let index = this.listArr.findIndex(item => item.username === username)
          console.log(index)
          if (index === -1) {
            return
          }
          do {
            this.listArr.splice(index, 1)
            index = this.listArr.findIndex(item => item.username === username)
          } while (index !== -1)
          this.selectListArr = []
        }
      },
    // 开启数据持久化
    persist: true
  })