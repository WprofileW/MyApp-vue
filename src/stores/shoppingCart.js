import { defineStore } from 'pinia'

export const useShoppingCartStore =
  defineStore('ShoppingCart', {
    state:
      () => (
        {
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
                // console.log(acc, cur)
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
              num: 1
            })
          } else {
            let index = this.listArr
              .findIndex((item) => item.productName === row.productName)
            if (index !== -1) {
              this.listArr[index].num = this.listArr[index].num + 1
            } else {
              this.listArr.push({
                ...row,
                num: 1
              })
            }
          }
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
        removeShoppingCartItems() {
          this.listArr = []
          this.selectListArr = []
        }

      },
    // 开启数据持久化
    persist: true
  })