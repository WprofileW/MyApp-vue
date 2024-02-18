import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLoginUserStore =
  defineStore('loginUser', () => {
    const loginUser = ref('')

    const setLoginUser =
      (newLoginUser) => {
        loginUser.value = newLoginUser
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