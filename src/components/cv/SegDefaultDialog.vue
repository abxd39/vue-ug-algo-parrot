<template>
  <el-dialog v-model="$store.state.protalData.seg.defaultDialogVisible" title="Default Video Info" width="40%">
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
  store.commit('updateSegDefaultDialogVisible', false)
}

const handleDefaultConfirm = async () => {
  // 初始化seg
  store.commit('initSeg')
  // 窗口隐藏
  store.commit('updateSegDefaultDialogVisible', false)
  // 禁止按钮
  store.commit('updateSegButton', { uploadDisabled: true, defaultDisabled: true })
  // 默认的视频可以提前展示原始视频，因为rawFile的地址已经知道, 需要更新视频信息，原始视频地址和是否展示
  store.commit('updateSegVideoInfo', { name: 'UA00830-PUBGM-V-1-EN-TENCENT.mp4', size: '4.69M' })
  store.commit('updateSegRawFile', store.getters.getFullDefaultPath)
  store.commit('updateSegRawFileShow', true)
  // 定时任务更新任务进程
  const timer = setInterval(() => {
    store.commit('increaseSegProgress', Math.round(Math.random() * 1 + 2))
  }, 1000)
  // 发送请求
  let resp = await proxy.$api.cv.seg({ default_url: store.state.defaultVideoUrl })
  // 请求出错
  if (typeof resp === 'string') {
    clearInterval(timer)
    ElMessage.error(resp)
    store.commit('updateSegError')
    store.commit('updateSegButton', { uploadDisabled: false, defaultDisabled: false })
    return
  }
  // 有响应
  if (resp.data.ret_code == '0') {
    clearInterval(timer)
    try {
      const { scene_in_seconds, cos_urls } = resp.data.data
      // scene_in_seconds需要处理一下
      const new_scene_in_seconds = []
      scene_in_seconds.forEach(item => {
        new_scene_in_seconds.push(item['scene_list'])
      })
      store.commit('updateSegSuccess', { sceneInSeconds: new_scene_in_seconds, cosUrls: cos_urls })
      store.commit('updateSegButton', { uploadDisabled: false, defaultDisabled: false })
      ElMessage.success(resp.data.message || 'segmetation success')
    } catch (e) {
      // console.log(resp.data)
      store.commit('updateSegError')
      store.commit('updateSegButton', { uploadDisabled: false, defaultDisabled: false })
      ElMessage.error(e.message)
    }
  } else {
    clearInterval(timer)
    ElMessage.error(resp.data.message || 'segmetation failed')
    store.commit('updateSegError')
    store.commit('updateSegButton', { uploadDisabled: false, defaultDisabled: false })
  }
}
</script>
