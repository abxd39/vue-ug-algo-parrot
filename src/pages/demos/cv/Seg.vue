<template>
  <Breadcrumb />
  <div class="outer-box">
    <Introduction
      >Video segmentation aims to divide the video into a sequence of different scene segments. Each scene segment is visually coherent and has a clear semantic meaning. For instance, a game
      advertising video may be divided into these scene segments: Introducing the game character, game playing, showing the game information and downloading ways.</Introduction
    >
    <el-row :gutter="15" class="asset">
      <el-col :span="12">
        <UploadVideo taskType="segmetation" />
      </el-col>
      <el-col :span="12" v-show="$store.state.protalData.seg.rawFileShow">
        <RawFile taskType="segmetation" />
      </el-col>
    </el-row>
    <div v-show="$store.state.protalData.seg.isShowResult" class="result">
      <ModelResult :results="$store.state.protalData.seg.sceneInSeconds" title="Segmetation Result" shadow="never" />
      <el-card shadow="never">
        <h4>Segmetation Videos</h4>
        <el-divider />
        <div class="videos">
          <video v-for="(item, index) in $store.state.protalData.seg.cosUrls" :key="index" :src="item" width="200" height="200" controls></video>
        </div>
      </el-card>
    </div>
  </div>
  <!-- 选择视频的弹框 -->
  <SegSelectDialog />
  <!-- 默认视频的弹框 -->
  <SegDefaultDialog />
</template>

<script setup>
import UploadVideo from '@/components/cv/UploadVideo.vue'
import ModelResult from '@/components/cv/ModelResult.vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import SegSelectDialog from '@/components/cv/SegSelectDialog.vue'
import SegDefaultDialog from '@/components/cv/SegDefaultDialog.vue'
import Introduction from '@/components/introduction/Introduction.vue'
import RawFile from '@/components/cv/RawFile.vue'
</script>

<style lang="less" scoped>
.videos {
  display: flex;
  flex-wrap: wrap;
  video {
    margin: 0 10px;
  }
}
</style>
