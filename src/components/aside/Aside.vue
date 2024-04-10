<template>
  <el-aside :width="width" style="position: relative" id="aside">
    <div :style="logoStyle" id="logoPic">
      <img :src="getImgSrc('logo.png')" class="logo" />
    </div>
    <el-menu :default-active="defaultActive" :collapse="isCollapse" unique-opened id="menu">
      <el-menu-item :index="item.path" v-for="item in noChildren()" :key="item.path" @click="clickMenu(item.path, item.label)">
        <el-icon><component :is="item.icon"></component></el-icon>
        <template #title>{{ item.label }}</template>
      </el-menu-item>
      <el-sub-menu :index="item.path" v-for="item in hasChildren()" :key="item.path">
        <template #title>
          <el-icon><component :is="item.icon"></component></el-icon>
          <span>{{ item.label }}</span>
        </template>
        <template v-for="subItem in item.children" :key="subItem.path">
          <!-- 有children子项 -->
          <el-sub-menu v-if="subItem.children" :index="subItem.path">
            <template #title>
              <el-icon><component :is="subItem.icon"></component></el-icon>
              <span>{{ subItem.label }}</span>
            </template>
            <el-menu-item v-for="sonItem in subItem.children" :index="sonItem.path" :key="sonItem.path" @click="clickMenu(sonItem.path, sonItem.label)">
              <el-icon><Tickets /></el-icon>
              <template #title>{{ sonItem.label }}</template>
            </el-menu-item>
          </el-sub-menu>
          <!-- 没有children -->
          <el-menu-item v-else :index="subItem.path" @click="clickMenu(subItem.path, subItem.label)">
            <el-icon><Tickets /></el-icon>
            <template #title>{{ subItem.label }}</template>
          </el-menu-item>
        </template>
      </el-sub-menu>
    </el-menu>
    <!-- <el-tooltip effect="light" content="Expand Menu" placement="top">
      <el-icon v-show="isCollapse" @click="handleOpenMenu" class="openIcon"><Expand /></el-icon>
    </el-tooltip>
    <el-tooltip effect="light" content="Collapse Menu" placement="top">
      <el-icon v-show="!isCollapse" @click="handleCloseMenu" class="closeIcon"><Fold /></el-icon>
    </el-tooltip> -->
    <div class="menu-handler" :style="menuStyle">
      <el-icon color="#fff" v-if="isCollapse" @click="handleOpenMenu" :size="14"><ArrowRightBold /></el-icon>
      <el-icon color="#fff" v-else @click="handleCloseMenu" :size="14"><ArrowLeftBold /></el-icon>
    </div>
    <div :style="logoStyle" class="avatar" id="avatar">
      <el-divider />
      <div class="r-content">
        <el-dropdown>
          <span>
            <el-avatar :src="getImgSrc('qq.jpg')" />
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="logout">Logout</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <span class="username">{{ username }}</span>
      </div>
    </div>
  </el-aside>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, onMounted, onBeforeUnmount } from 'vue'
import menuList from './menu'
import { useRouter } from 'vue-router'
import { sendUserAction } from '@/utils/api_utils'
import { getCookie, clearAllCookie } from '@/utils/api_utils'
import requestUrl from '@/api/url'

let resizeObserver, oriAsideHeight, oriMainHeight
const { proxy } = getCurrentInstance()
const router = useRouter()
const defaultActive = ref(sessionStorage.getItem('parrotPath') || menuList[0].path)
const userMenuList = ref([])
const isCollapse = ref(false)
const width = ref('250px')
const menuStyle = reactive({
  left: '250px'
})

const username = ref('')
const logoStyle = reactive({
  opacity: 1
})

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

// 获取用户信息权限信息并进行菜单过滤
const setUserMenu = async userName => {
  // 查询用户信息
  const resp = await proxy.$api.permission.searchUser({ query: userName, fuzzy: 1 })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    if (data) {
      const userInfo = data[0]
      sessionStorage.setItem('parrotUser', JSON.stringify(userInfo))
      // 判断用户权限
      if (userInfo.role_id === 1) {
        // admin可以访问所有
        userMenuList.value = menuList
      } else if (userInfo.role_id === 2) {
        // data 不能访问admin菜单, 去掉最后一项即可
        userMenuList.value = menuList.slice(0, -1)
      } else if (userInfo.role_id === 3) {
        // developer 不能访问kpi和admin菜单
        userMenuList.value = menuList.slice(0, -1)
        userMenuList.value[1].children.shift()
      } else {
        // 只能访问首页
        userMenuList.value = menuList[0]
      }
    } else {
      // 没有用户信息禁止访问，出现错误信息页面
      router.push('/noPermission')
      userMenuList.value = []
    }
  } else {
    ElMessage.error(message || 'get user info failed')
  }
}

const noChildren = () => {
  return menuList.filter(item => !item.children)
}

const hasChildren = () => {
  return menuList.filter(item => item.children)
}

const clickMenu = (path, label) => {
  // console.log(path)
  router.push(path)
  // 将当前点击的菜单index保存进本地存储
  // sessionStorage.setItem('parrotPath', path)
  // 上报用户行为
  const indexLabel = ['UA', 'Platform', 'IEGG-GPT']
  if (indexLabel.includes(label)) {
    sendUserAction({ page_name: label })
  }
}

const handleOpenMenu = () => {
  isCollapse.value = false
  width.value = '250px'
  menuStyle.left = '250px'
  logoStyle.opacity = 1
}

const handleCloseMenu = () => {
  isCollapse.value = true
  width.value = '50px'
  menuStyle.left = '50px'
  logoStyle.opacity = 0
}

const handleAsideHeight = () => {
  const aside = document.getElementById('aside')
  const asideHeight = aside.offsetHeight
  const menuHeight = document.getElementById('menu').offsetHeight
  const logoHeight = document.getElementById('logoPic').offsetHeight
  const avatarHeight = document.getElementById('avatar').offsetHeight
  const total = menuHeight + logoHeight + avatarHeight
  const mainHeight = document.getElementById('main').offsetHeight
  const maxOriHeight = Math.max(oriAsideHeight, mainHeight)
  // 如果main部分的高度小于总高度
  if (total > maxOriHeight) {
    aside.style.height = total + 'px'
  } else {
    if (asideHeight !== maxOriHeight) {
      aside.style.height = maxOriHeight + 'px'
    }
  }
}

onMounted(() => {
  oriAsideHeight = document.getElementById('aside').offsetHeight
  getAvatarInfo()
  // 监听菜单高度变化
  resizeObserver = new ResizeObserver(handleAsideHeight)
  resizeObserver.observe(document.getElementById('mainSection'))
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
})
</script>

<style lang="less" scoped>
.logo {
  width: 70%;
  // padding: 20px 20px 40px 20px;
  padding: 20px;
}
.el-aside {
  background-color: #fff;
  .el-menu {
    border-right: none;
    --el-menu-item-font-size: 13px;
  }
}

.icons {
  width: 18px;
  height: 18px;
}

.openIcon {
  margin-top: 40px;
  padding: 20px;
  cursor: pointer;
}

.closeIcon {
  margin-top: 40px;
  padding: 20px 215px;
  cursor: pointer;
}
.menu-handler {
  background-color: #b1b3b8;
  width: 14px;
  height: 36px;
  border-radius: 0 8px 8px 0;
  opacity: 0.5;
  line-height: 40px;
  cursor: pointer;
  position: fixed;
  top: 50%;
}

.r-content {
  display: flex;
  align-items: center;
  justify-content: center;
  .username {
    font-size: 14px;
    color: #000;
    margin-left: 5px;
  }
}

.avatar {
  position: absolute;
  bottom: 10px;
  width: 100%;
}
</style>
