import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginUserStore =
  defineStore('loginUser', () => {
    const loginUser = ref({})

    const setLoginUser =
      (newLoginUser) => {
        // console.log(newLoginUser)
        loginUser.value.username = newLoginUser.value.username
        loginUser.value.roleId = newLoginUser.value.roleId
      }

    const removeLoginUser = () => {
      loginUser.value = {}
    }

    return {
      loginUser,
      setLoginUser,
      removeLoginUser
    }

  }, { persist: true })