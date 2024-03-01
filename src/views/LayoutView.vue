<script setup>
import { useRouter } from 'vue-router'
import {
  Avatar,
  EditPen,
  Goods,
  Histogram,
  Management,
  PictureFilled,
  ShoppingCart,
  SwitchButton,
  User,
  UserFilled
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

import { useTokenStore } from '@/stores/token.js'
import { useLoginUserStore } from '@/stores/loginUser.js'

const tokenStore = useTokenStore()
const loginUserStore = useLoginUserStore()

const router = useRouter()

const handleCommand =
  (command) => {
    //判断指令
    if (command === 'logout') {
      //退出登录
      ElMessageBox.confirm(
        '您确认要退出吗?',
        '温馨提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          //退出登录
          //1.清空pinia中存储的信息
          tokenStore.removeToken()
          loginUserStore.removeLoginUser()
          //2.跳转到登录页面
          await router.push('/login')
          ElMessage({
            type: 'success',
            message: '退出登录成功'
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '用户取消了退出登录'
          })
        })
    } else {
      router.push('/user/' + command)
    }
  }
</script>

<template>
  <el-container class="layout-container">
    <!-- 左侧菜单 -->
    <el-aside width="200px">
      <el-menu
        active-text-color="#ffd04b"
        background-color="#232323"
        text-color="#fff"
        router>
        <el-sub-menu v-if="loginUserStore.loginUser.roleId===0">

          <template #title>
            <el-icon>
              <Histogram />
            </el-icon>
            <span>图表</span>
          </template>

          <el-menu-item index="/chart/inventoryChange">
            <template #title>
              <el-icon>
                <PictureFilled />
              </el-icon>
              <span>实时库存</span>
            </template>
          </el-menu-item>

          <el-menu-item index="/chart/topThreeSale">
            <template #title>
              <el-icon>
                <PictureFilled />
              </el-icon>
              <span>销售额前三</span>
            </template>
          </el-menu-item>

        </el-sub-menu>

        <el-menu-item index="/product/productInfo">
          <el-icon>
            <Goods />
          </el-icon>
          <span v-if="loginUserStore.loginUser.roleId===0">商品管理</span>
          <span v-else>商城</span>
        </el-menu-item>

        <el-menu-item index="/product/shoppingCart" v-if="loginUserStore.loginUser.roleId===1">
          <el-icon>
            <ShoppingCart />
          </el-icon>
          <span>购物车</span>
        </el-menu-item>

        <el-menu-item index="/customer/orderItem" v-if="loginUserStore.loginUser.roleId===1">
          <el-icon>
            <Management />
          </el-icon>
          <span>订单信息</span>
        </el-menu-item>

        <el-sub-menu>

          <template #title>
            <el-icon>
              <UserFilled />
            </el-icon>
            <span>个人中心</span>
          </template>

          <el-menu-item index="/user/loginUser">
            <el-icon>
              <User />
            </el-icon>
            <span>基本资料</span>
          </el-menu-item>

          <el-menu-item index="/user/allUser" v-if="loginUserStore.loginUser.roleId===0">
            <el-icon>
              <User />
            </el-icon>
            <span>用户管理</span>
          </el-menu-item>

        </el-sub-menu>
      </el-menu>
    </el-aside>
    <!-- 右侧主区域 -->
    <el-container>
      <!-- 头部区域 -->
      <el-header>
        <div>
          <strong>{{ loginUserStore.loginUser.username }},欢迎登陆</strong>
        </div>
        <!-- 下拉菜单 -->
        <!-- command: 条目被点击后会触发,在事件函数上可以声明一个参数,接收条目对应的指令 -->
        <el-dropdown placement="bottom-end" @command="handleCommand">
          <span class="el-dropdown__box">
              <el-icon size="30">
                <Avatar />
              </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="loginUser" :icon="User">
                基本资料
              </el-dropdown-item>
              <el-dropdown-item command="resetPassword" :icon="EditPen">
                重置密码
              </el-dropdown-item>
              <el-dropdown-item command="logout" :icon="SwitchButton">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 中间区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- 底部区域 -->
      <el-footer>
        大事件 ©2023 Created by 黑马程序员
      </el-footer>
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;

  .el-aside {
    background-color: #232323;

    .el-menu {
      border-right: none;
    }
  }

  .el-header {
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .el-dropdown__box {
      display: flex;
      align-items: center;

      .el-icon {
        color: #999;
        margin-left: 10px;
      }

      &:active,
      &:focus {
        outline: none;
      }
    }
  }

  .el-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
  }
}
</style>