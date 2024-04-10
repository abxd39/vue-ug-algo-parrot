<template>
  <el-dialog v-model="$store.state.protalData.cover.defaultDialogVisible" title="Default Video Info" width="40%">
    <el-divider />
    <video class="defaultVideo" :src="$store.getters.getFullDefaultPath" controls></video>
    <el-divider />
    <template #footer>
      <span>
        <el-button @click="handleDefaultCancle">Cancel</el-button>
        <el-button type="primary" @click="handleDefaultConfirm">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useStore } from 'vuex'
import { getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const store = useStore()

const handleDefaultCancle = () => {
  store.commit('updateCoverDefaultDialogVisible', false)
}

const handleDefaultConfirm = async () => {
  // 初始化cover
  store.commit('initCover')
  // 窗口隐藏
  store.commit('updateCoverDefaultDialogVisible', false)
  // 禁止按钮
  store.commit('updateCoverButton', { uploadDisabled: true, defaultDisabled: true })
  // 默认的视频可以提前展示原始视频，因为rawFile的地址已经知道, 需要更新视频信息，原始视频地址和是否展示
  store.commit('updateCoverVideoInfo', { name: 'UA00830-PUBGM-V-1-EN-TENCENT.mp4', size: '4.69M' })
  store.commit('updateCoverRawFile', store.getters.getFullDefaultPath)
  store.commit('updateCoverRawFileShow', true)
  // 定时任务更新任务进程
  const timer = setInterval(() => {
    store.commit('increaseCoverProgress', Math.round(Math.random() * 1 + 2))
  }, 500)
  // 发送请求
  let resp = await proxy.$api.cv.cover({ default_url: store.state.defaultVideoUrl })
  // 请求出错
  if (typeof resp === 'string') {
    clearInterval(timer)
    ElMessage.error(resp)
    store.commit('updateCoverError')
    store.commit('updateCoverButton', { uploadDisabled: false, defaultDisabled: false })
    return
  }
  // 有响应
  if (resp.data.ret_code == '0') {
    clearInterval(timer)
    try {
      const { key_frame_at, cover_cos_url } = resp.data.data
      store.commit('updateCoverSuccess', { keyFrameAt: key_frame_at, coverCosUrl: cover_cos_url })
      store.commit('updateCoverButton', { uploadDisabled: false, defaultDisabled: false })
      ElMessage.success(resp.data.message || 'cover success')
    } catch (e) {
      // console.log(resp.data)
      store.commit('updateCoverError')
      store.commit('updateCoverButton', { uploadDisabled: false, defaultDisabled: false })
      ElMessage.error(e.message)
    }
  } else {
    clearInterval(timer)
    ElMessage.error(resp.data.message || 'cover failed')
    store.commit('updateCoverError')
    store.commit('updateCoverButton', { uploadDisabled: false, defaultDisabled: false })
  }
}
</script>
