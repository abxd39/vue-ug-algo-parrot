<template>
  <el-card shadow="hover" class="video-control">
    <!-- 上传文件 -->
    <el-upload
      :ref="genRefName()"
      :auto-upload="false"
      :action="getUrl()"
      :before-upload="beforeUpload"
      :on-error="onError"
      :on-success="onSuccess"
      :on-progress="onProgress"
      :show-file-list="false"
      :on-change="onChange"
    >
      <template #trigger>
        <el-button type="primary" :disabled="getUploadDisabled()">select video</el-button>
      </template>
      <span>or</span>
      <el-button type="success" @click="uploadDefault" :disabled="getDefaultDisabled()">use default video</el-button>
      <template #tip>
        <div class="el-upload__tip" style="color: #e6a23c">mp4 video with a size less than 50MB.</div>
      </template>
    </el-upload>
    <h5 class="task-progress">Progress</h5>
    <!-- 进度条 -->
    <el-progress :percentage="getPercentage()" :status="getStatus()" />
  </el-card>
</template>

<script setup>
// import { onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import { getCurrentInstance } from 'vue'
import cvUrl from '@/api/url'

const { proxy } = getCurrentInstance()
// 组件传参
const { taskType } = defineProps({
  taskType: {
    type: String,
    required: true
  }
})

// vuex
const store = useStore()

const getUrl = () => {
  if (taskType === 'segmetation') {
    return cvUrl.cv.seg
  } else if (taskType === 'cover') {
    return cvUrl.cv.cover
  } else {
    return cvUrl.cv.tag
  }
}

const getPercentage = () => {
  if (taskType === 'segmetation') {
    return store.state.protalData.seg.percentage
  } else if (taskType === 'cover') {
    return store.state.protalData.cover.percentage
  } else {
    return store.state.protalData.tag.percentage
  }
}

const getStatus = () => {
  if (taskType === 'segmetation') {
    return store.state.protalData.seg.status
  } else if (taskType === 'cover') {
    return store.state.protalData.cover.status
  } else {
    return store.state.protalData.tag.status
  }
}

const genRefName = () => {
  if (taskType === 'segmetation') {
    return 'segUpload'
  } else if (taskType === 'cover') {
    return 'coverUpload'
  } else {
    return 'tagUpload'
  }
}

const getUploadDisabled = () => {
  if (taskType === 'segmetation') {
    return store.state.protalData.seg.uploadDisabled
  } else if (taskType === 'cover') {
    return store.state.protalData.cover.uploadDisabled
  } else {
    return store.state.protalData.tag.uploadDisabled
  }
}

const getDefaultDisabled = () => {
  if (taskType === 'segmetation') {
    return store.state.protalData.seg.defaultDisabled
  } else if (taskType === 'cover') {
    return store.state.protalData.cover.defaultDisabled
  } else {
    return store.state.protalData.tag.defaultDisabled
  }
}

const checkFile = (fileType, fileSize) => {
  // 判断文件类型
  if (fileType != 'video/mp4') {
    ElMessage.error('Error, the type of file must mp4')
    return false
  }
  // 判断文件大小
  if (fileSize > 50 * 1024 * 1024) {
    ElMessage.error('Error, the size of file must less than 50MB')
    return false
  }
  return true
}

// 文件状态发生变化时的钩子函数，添加文件、上传成功和上传失败时都会被调用
const onChange = uploadFile => {
  // console.log('onchange', uploadFile)
  // 添加文件后调用
  if (uploadFile.status === 'ready') {
    // 校验文件
    if (checkFile(uploadFile.raw.type, uploadFile.size)) {
      // 显示dialog以及获取upload实例，用于点击确认按钮时上传视频
      if (taskType === 'segmetation') {
        store.commit('updateSegVideoTempInfo', { name: uploadFile.name, size: (uploadFile.size / 1024 / 1024).toFixed(2) + 'M' })
        store.commit('updateSegDialogVisible', { dialogVisible: true })
        store.commit('setSegUploadRef', proxy.$refs.segUpload)
      } else if (taskType === 'cover') {
        store.commit('updateCoverVideoTempInfo', { name: uploadFile.name, size: (uploadFile.size / 1024 / 1024).toFixed(2) + 'M' })
        store.commit('updateCoverDialogVisible', { dialogVisible: true })
        store.commit('setCoverUploadRef', proxy.$refs.coverUpload)
      } else {
        store.commit('updateTagVideoTempInfo', { name: uploadFile.name, size: (uploadFile.size / 1024 / 1024).toFixed(2) + 'M' })
        store.commit('updateTagDialogVisible', { dialogVisible: true })
        store.commit('setTagUploadRef', proxy.$refs.tagUpload)
      }
    } else {
      if (taskType === 'segmetation') {
        // 清空文件列表
        proxy.$refs.segUpload.clearFiles()
      } else if (taskType === 'cover') {
        // 清空文件列表
        proxy.$refs.coverUpload.clearFiles()
      } else {
        // 清空文件列表
        proxy.$refs.tagUpload.clearFiles()
      }
    }
  }
}

// 文件上传前的校验
const beforeUpload = rawFile => {
  // console.log(rawFile)
  if (taskType === 'segmetation') {
    store.commit('initSeg')
    store.commit('updateSegVideoInfo', { name: rawFile.name, size: (rawFile.size / 1024 / 1024).toFixed(2) + 'M' })
  } else if (taskType === 'cover') {
    store.commit('initCover')
    store.commit('updateCoverVideoInfo', { name: rawFile.name, size: (rawFile.size / 1024 / 1024).toFixed(2) + 'M' })
  } else {
    store.commit('initTag')
    store.commit('updateTagVideoInfo', { name: rawFile.name, size: (rawFile.size / 1024 / 1024).toFixed(2) + 'M' })
  }
}

let segTimer, coverTimer, tagTimer

// 文件上传的过程，这里只是文件上传的过程不包括任务执行时，所以设置只能占总任务的10%
const onProgress = evt => {
  // console.log(evt, evt.percent)
  if (taskType === 'segmetation') {
    store.commit('updateSegProgress', Math.round(evt.percent / 10))
    // 文件已经上传完成
    if (evt.percent === 100) {
      segTimer = setInterval(() => {
        // console.log('increase seg')
        // 取3到5的随机整数，0.5秒更新一次
        store.commit('increaseSegProgress', Math.round(Math.random() * 1 + 1))
      }, 1000)
    }
  } else if (taskType === 'cover') {
    store.commit('updateCoverProgress', Math.round(evt.percent / 10))
    if (evt.percent === 100) {
      coverTimer = setInterval(() => {
        // console.log('increase cover')
        store.commit('increaseCoverProgress', Math.round(Math.random() * 1 + 1))
      }, 500)
    }
  } else {
    store.commit('updateTagProgress', Math.round(evt.percent / 10))
    if (evt.percent === 100) {
      tagTimer = setInterval(() => {
        // console.log('increase tag')
        store.commit('increaseTagProgress', Math.round(Math.random() * 1 + 1))
      }, 900)
    }
  }
}

// 上传失败
const onError = error => {
  // console.log(error.message)
  ElMessage.error(error.message)
  if (taskType === 'segmetation') {
    clearInterval(segTimer)
    store.commit('updateSegError')
    store.commit('updateSegButton', { uploadDisabled: false, defaultDisabled: false })
  } else if (taskType === 'cover') {
    clearInterval(coverTimer)
    store.commit('updateCoverError')
    store.commit('updateCoverButton', { uploadDisabled: false, defaultDisabled: false })
  } else {
    clearInterval(tagTimer)
    store.commit('updateTagError')
    store.commit('updateTagButton', { uploadDisabled: false, defaultDisabled: false })
  }
}

// 成功接到响应
const onSuccess = resp => {
  // console.log(resp)
  if (resp.ret_code === '0') {
    if (taskType === 'segmetation') {
      clearInterval(segTimer)
      try {
        const { scene_in_seconds, cos_urls, raw_file } = resp.data
        // scene_in_seconds需要处理一下
        const new_scene_in_seconds = []
        scene_in_seconds.forEach(item => {
          new_scene_in_seconds.push(item['scene_list'])
        })
        store.commit('updateSegRawFile', raw_file)
        store.commit('updateSegRawFileShow', true)
        store.commit('updateSegSuccess', { sceneInSeconds: new_scene_in_seconds, cosUrls: cos_urls })
        store.commit('updateSegButton', { uploadDisabled: false, defaultDisabled: false })
      } catch (e) {
        store.commit('updateSegError')
        store.commit('updateSegButton', { uploadDisabled: false, defaultDisabled: false })
        ElMessage.error(e.message)
        return
      }
    } else if (taskType === 'cover') {
      clearInterval(coverTimer)
      try {
        const { key_frame_at, cover_cos_url, raw_file } = resp.data
        store.commit('updateCoverRawFile', raw_file)
        store.commit('updateCoverRawFileShow', true)
        store.commit('updateCoverSuccess', { keyFrameAt: key_frame_at, coverCosUrl: cover_cos_url })
        store.commit('updateCoverButton', { uploadDisabled: false, defaultDisabled: false })
      } catch (e) {
        store.commit('updateCoverError')
        store.commit('updateCoverButton', { uploadDisabled: false, defaultDisabled: false })
        ElMessage.error(e.message)
        return
      }
    } else {
      clearInterval(tagTimer)
      try {
        const { scene_in_seconds, key_frames_url, tags, raw_file } = resp.data
        // scene_in_seconds需要处理一下
        const new_scene_in_seconds = []
        scene_in_seconds.forEach(item => {
          new_scene_in_seconds.push(item['scene_list'])
        })
        store.commit('updateTagRawFile', raw_file)
        store.commit('updateTagRawFileShow', true)
        store.commit('updateTagSuccess', { sceneInSeconds: new_scene_in_seconds, keyFramesUrl: key_frames_url, tags: tags })
        store.commit('updateTagButton', { uploadDisabled: false, defaultDisabled: false })
      } catch (e) {
        store.commit('updateTagError')
        store.commit('updateTagButton', { uploadDisabled: false, defaultDisabled: false })
        ElMessage.error(e.message)
        return
      }
    }
    ElMessage.success(resp.message || `${taskType} success`)
  } else {
    ElMessage.error(resp.message || `${taskType} failed`)
    if (taskType === 'segmetation') {
      clearInterval(segTimer)
      store.commit('updateSegError')
      store.commit('updateSegButton', { uploadDisabled: false, defaultDisabled: false })
    } else if (taskType === 'cover') {
      clearInterval(coverTimer)
      store.commit('updateCoverError')
      store.commit('updateCoverButton', { uploadDisabled: false, defaultDisabled: false })
    } else {
      clearInterval(tagTimer)
      store.commit('updateTagError')
      store.commit('updateTagButton', { uploadDisabled: false, defaultDisabled: false })
    }
  }
}

// 控制默认视频的弹框
const uploadDefault = () => {
  if (taskType === 'segmetation') {
    store.commit('updateSegDefaultDialogVisible', true)
  } else if (taskType === 'cover') {
    store.commit('updateCoverDefaultDialogVisible', true)
  } else {
    store.commit('updateTagDefaultDialogVisible', true)
  }
}

// onBeforeUnmount(() => {
//   clearInterval(segTimer)
// })
</script>

<style lang="less">
.video-control {
  height: @cvinsights-card-height;
  span {
    margin: 0 10px;
  }
}
</style>
