<template>
  <Breadcrumb />
  <div class="outer-box">
    <Introduction
      >Video tagging aims to detect which semantic tags the video belongs to. The tags contain various aspects, such as general elements (e.g., e-sports, Christmas, screen recording), music genre
      (e.g., intense, slow, Chinese), visual angle (e.g., 3d first person, 3d third person, top down) and so on. Detecting these tags in the video is very important to understand the video content,
      thus, to improve the advertising performance.</Introduction
    >
    <el-row :gutter="15" class="asset">
      <el-col :span="12">
        <UploadVideo taskType="tagging" />
      </el-col>
      <el-col :span="12" v-show="$store.state.protalData.tag.rawFileShow">
        <RawFile taskType="tagging" />
      </el-col>
    </el-row>
    <div v-show="$store.state.protalData.tag.isShowResult" class="result">
      <ModelResult :results="$store.state.protalData.tag.tags" title="Tagging Result" shadow="never" />
      <ModelResult :results="$store.state.protalData.tag.sceneInSeconds" title="Segmetation Result" shadow="never" />
      <el-card shadow="never" class="key-frame">
        <h4>Key Frames</h4>
        <el-divider />
        <div class="images">
          <img v-for="(item, index) in $store.state.protalData.tag.keyFramesUrl" :key="index" :src="item" />
        </div>
      </el-card>
    </div>
  </div>
  <!-- 选择视频的弹框 -->
  <TagSelectDialog />
  <!-- 默认视频的弹框 -->
  <TagDefaultDialog />
</template>

<script setup>
import UploadVideo from '@/components/cv/UploadVideo.vue'
import ModelResult from '@/components/cv/ModelResult.vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import TagSelectDialog from '@/components/cv/TagSelectDialog.vue'
import TagDefaultDialog from '@/components/cv/TagDefaultDialog.vue'
import Introduction from '@/components/introduction/Introduction.vue'
import RawFile from '@/components/cv/RawFile.vue'
// const segStyle = { height: '300px' }
</script>

<style lang="less" scoped>
.key-frame {
  //   height: @cvinsights-card-height;
  //   overflow-y: auto;
  .images {
    display: inline-flex;
    // justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    img {
      width: 200px;
      margin: 10px;
    }
  }
}
</style>
