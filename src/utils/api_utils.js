// 这里面是不在组件里面发送的请求
import axios from 'axios'

import requestUrl from '@/api/url'

export const roleMap = {
  1: 'admin',
  2: 'data',
  3: 'developer',
  4: 'gpt_only'
}

// 获取username
export function getUsername() {
  const username = getCookie('user_name')
  if (username) {
    getUserRole(username)
    return
  }
  const search = window.location.search
  if (search) {
    // http://algo.intlgame.com/?code=5b956bfb6991ad98f3859b963e8a841445fa25d1#/analysis
    const code = search.split('=')[1]
    // const baseCode = sessionStorage.getItem('code')
    axios
      .get('/api/v1/portal/callback', { params: { code: code } })
      .then(res => {
        const { ret_code, message, data } = res.data
        if (ret_code === '0') {
          // 用户不是登录进来的，而是点击某个链接进来的，这时候就需要跳到他点进来的地址
          const toPath = sessionStorage.getItem('parrotFullPath')
          if (toPath) {
            // code只能用一次，假如有人直接把自己的路径粘贴给别人，自己的code已经用过，给别人从新获取username会报错
            window.location.replace(`${window.location.origin}${window.location.pathname}#${toPath}`)
          } else {
            // code只能用一次，假如有人直接把自己的路径粘贴给别人，自己的code已经用过，给别人从新获取username会报错
            window.location.replace(`${window.location.origin}${window.location.pathname}${window.location.hash}`)
          }
          getUserRole(data.user_name)
        } else {
          ElMessage.error(message)
        }
      })
      .catch(err => {
        ElMessage.error(err.message)
      })
  } else {
    if (window.location.hostname === 'algo.intltest11.com') {
      top.location.href = requestUrl.login.devLogin
    } else if (window.location.hostname === 'algo.intlgame.com') {
      top.location.href = requestUrl.login.prodLogin
    }
  }
}

// 获取角色
export function getUserRole(username) {
  axios
    .post('/api/v1/portal/search_user', { query: username, fuzzy: 1 })
    .then(res => {
      const { ret_code, message, data } = res.data
      if (ret_code === '0') {
        if (data.length != 0) {
          const role = roleMap[data[0].role_id]
          sessionStorage.setItem('role', role)
        } else {
          sessionStorage.removeItem('role')
        }
      } else {
        ElMessage.error(message || 'get user role failed')
      }
    })
    .catch(err => {
      ElMessage.error(err.message)
    })
}

export function getCookie(key) {
  var cookieArr 
  if (import.meta.env.MODE === 'development') {
    var debugCookie='user_name=gc_wangyingwen; code=5c76186e97637c77ad8f36c801882ddfc2e1c1ac'
    cookieArr = debugCookie.split(';')
  }else{
    cookieArr = document.cookie.split(';')
  }
  let value = null
  for (const item of cookieArr) {
    const itemArr = item.split('=')
    if (itemArr.length !== 2) {
      continue
    }
    // 这里针对多个cookie键值对一定要去空格
    if (itemArr[0].trim() === key) {
      value = itemArr[1]
      break
    }
  }
  return value
}

export function delCookie(key) {
  document.cookie = `${key}=1;expires=${new Date(0).toUTCString()}`
}

export function clearAllCookie() {
  var keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (var i = keys.length; i--; ) document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
  }
}

// 发送用户行为
export function sendUserAction(data) {
  const username = getCookie('user_name')
  if (!username) {
    // 隔2s再获取
    setTimeout(() => {
      const username = getCookie('user_name')
      if (!username) {
        ElMessage.error('can not get user_name')
        return
      }
      data.user_name = username
      axios
        .post('/api/v1/portal/portal_report', data)
        .then(res => {
          const { ret_code, message } = res.data
          if (ret_code !== '0') {
            ElMessage.error(message)
          }
        })
        .catch(err => {
          ElMessage.error(err.message)
        })
    }, 2000)
    return
  }
  data.user_name = username
  axios
    .post('/api/v1/portal/portal_report', data)
    .then(res => {
      const { ret_code, message } = res.data
      if (ret_code !== '0') {
        ElMessage.error(message)
      }
    })
    .catch(err => {
      ElMessage.error(err.message)
    })
}
