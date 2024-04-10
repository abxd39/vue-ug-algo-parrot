<template>
  <Breadcrumb />
  <div class="outer-box">
    <Introduction
      >Video cover aims to select a most representative and appealing frame from the video as the video thumbnail. “Representative” means the selected frame can represent the main video content and
      “appealing” means it can attract user interests.</Introduction
    >
    <el-row :gutter="15" class="asset">
      <el-col :span="12">
        <UploadVideo taskType="cover" />
      </el-col>
      <el-col :span="12" v-show="$store.state.protalData.cover.rawFileShow">
        <RawFile taskType="cover" />
      </el-col>
    </el-row>
    <div v-show="$store.state.protalData.cover.isShowResult" class="result">
      <ModelResult :results="$store.getters.handleCoverFrame" title="Cover Result" shadow="never" />
      <el-card shadow="never">
        <video :src="$store.state.protalData.cover.rawFile" height="200" controls ref="frame-at"></video>
      </el-card>
      <el-card shadow="never">
        <h4>Cover Image</h4>
        <el-divider />
        <img :src="$store.state.protalData.cover.coverCosUrl" />
      </el-card>
    </div>
  </div>
  <!-- 选择视频的弹框 -->
  <CoverSelectDialog />
  <!-- 默认视频的弹框 -->
  <CoverDefaultDialog />
</template>

<script setup>
import { getCurrentInstance, onUpdated } from 'vue'
import { useStore } from 'vuex'

import UploadVideo from '@/components/cv/UploadVideo.vue'
import ModelResult from '@/components/cv/ModelResult.vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import CoverSelectDialog from '@/components/cv/CoverSelectDialog.vue'
import CoverDefaultDialog from '@/components/cv/CoverDefaultDialog.vue'
import Introduction from '@/components/introduction/Introduction.vue'
import RawFile from '@/components/cv/RawFile.vue'

const { proxy } = getCurrentInstance()
const store = useStore()
const setVideoTime = () => {
  // console.log(proxy.$refs['frame-at'])
  proxy.$refs['frame-at'].currentTime = store.state.protalData.cover.keyFrameAt
}

onUpdated(() => {
  setVideoTime()
})
// const resultStyle = { height: '300px' }
</script>

<style lang="less" scoped>
img {
  height: 200px;
}
</style>
