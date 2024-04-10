<template>
  <el-dialog v-model="$store.state.protalData.seg.dialogVisible" title="Video Info" width="20%">
    <el-divider />
    <!-- <div>
      <el-row>
        <el-col :span="8" class="video-info">name</el-col>
        <el-col :span="8" class="info-detail">{{ $store.state.protalData.seg.videoTempName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="video-info">type</el-col>
        <el-col :span="8" class="info-detail">mp4</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="video-info">size</el-col>
        <el-col :span="8" class="info-detail">{{ $store.state.protalData.seg.videoTempSize }}</el-col>
      </el-row>
    </div> -->
    <el-descriptions :column="1" size="small">
      <el-descriptions-item label="name">{{ $store.state.protalData.seg.videoTempName }}</el-descriptions-item>
      <el-descriptions-item label="type">mp4</el-descriptions-item>
      <el-descriptions-item label="size">{{ $store.state.protalData.seg.videoTempSize }}</el-descriptions-item>
    </el-descriptions>
    <el-divider />
    <template #footer>
      <span>
        <el-button @click="handleCancle">Cancel</el-button>
        <el-button type="primary" @click="handleConfirm">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { useStore } from 'vuex'

const store = useStore()

const handleCancle = () => {
  store.commit('updateSegDialogVisible', { dialogVisible: false })
  // store.commit('updateSegVideoInfo', { name: '', size: 0 })
  // 需要清空一下，不然就算取消也会在文件列表里面，跟着后面的一起上传
  store.state.protalData.seg.uploadRef.clearFiles()
}

const handleConfirm = () => {
  store.commit('updateSegDialogVisible', { dialogVisible: false })
  // 上传video
  store.state.protalData.seg.uploadRef.submit()
  // 按钮禁止点击
  store.commit('updateSegButton', { uploadDisabled: true, defaultDisabled: true })
}
</script>
