<template>
  <el-dialog v-model="$store.state.protalData.tag.dialogVisible" title="Video Info" width="20%">
    <el-divider />
    <!-- <div>
      <el-row>
        <el-col :span="8" class="video-info">name</el-col>
        <el-col :span="8" class="info-detail">{{ $store.state.protalData.tag.videoTempName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="video-info">type</el-col>
        <el-col :span="8" class="info-detail">mp4</el-col>
      </el-row>
      <el-row>
        <el-col :span="8" class="video-info">size</el-col>
        <el-col :span="8" class="info-detail">{{ $store.state.protalData.tag.videoTempSize }}</el-col>
      </el-row>
    </div> -->
    <el-descriptions :column="1" size="small">
      <el-descriptions-item label="name">{{ $store.state.protalData.tag.videoTempName }}</el-descriptions-item>
      <el-descriptions-item label="type">mp4</el-descriptions-item>
      <el-descriptions-item label="size">{{ $store.state.protalData.tag.videoTempSize }}</el-descriptions-item>
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
  store.commit('updateTagDialogVisible', { dialogVisible: false })
  // store.commit('updateTagVideoInfo', { name: '', size: 0 })
  store.state.protalData.tag.uploadRef.clearFiles()
}

const handleConfirm = () => {
  store.commit('updateTagDialogVisible', { dialogVisible: false })
  // 上传video
  store.state.protalData.tag.uploadRef.submit()
  // 按钮禁止点击
  store.commit('updateTagButton', { uploadDisabled: true, defaultDisabled: true })
}
</script>
