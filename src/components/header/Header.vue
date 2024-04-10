<template>
  <el-header>
    <div class="l-content">
      <img class="logo" :src="getImgSrc('logo.png')" />
    </div>
    <div class="r-content">
      <el-dropdown>
        <span>
          <el-avatar :src="getImgSrc('qq.jpeg')" />
          <!-- <span class="avatar">
            <img :src="avatar" alt="" />
          </span> -->
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <!-- <el-dropdown-item>Personal Center</el-dropdown-item> -->
            <el-dropdown-item @click="logout">Logout</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <span class="username">{{ username }}</span>
    </div>
  </el-header>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getCookie, clearAllCookie } from '@/utils/api_utils'
import requestUrl from '@/api/url'

// const avatar = ref('')
const username = ref('')

const getImgSrc = name => {
  return new URL(`../../assets/images/${name}`, import.meta.url).href
}

const getAvatarInfo = () => {
  // 因为网络请求的原因，这里user_name会尝试获取三次
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      if (!username.value && getCookie('user_name')) {
        username.value = getCookie('user_name')
      }
    }, 1000 * i)
  }
  // avatar.value = `//dayu.woa.com/avatars/${username.value}/avatar.jpg`
}

const logout = () => {
  // 只需要清理到cookie的user_name值
  // delCookie('user_name')
  clearAllCookie()
  if (window.location.hostname === 'algo.intltest11.com') {
    window.location.href = requestUrl.login.devLogout
  } else if (window.location.hostname === 'algo.intlgame.com') {
    window.location.href = requestUrl.login.prodLogout
  }
}

onMounted(() => {
  getAvatarInfo()
})
</script>

<style lang="less" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1e2749;
  .logo {
    width: 179px;
    vertical-align: middle;
  }
}

.r-content {
  display: flex;
  align-items: center;
  .username {
    font-size: 14px;
    color: #fff;
    margin-left: 5px;
  }
  // .avatar {
  //   display: inline-block;
  //   width: 40px;
  //   height: 40px;
  //   border-radius: 50%;
  //   background-color: #c0c4cb;
  //   img {
  //     display: inline-block;
  //     width: 100%;
  //     height: 100%;
  //     border-radius: 50%;
  //   }
  // }
}
</style>
