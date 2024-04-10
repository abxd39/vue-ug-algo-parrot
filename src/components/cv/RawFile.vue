<template>
  <el-card class="raw-file" shadow="hover">
    <el-row>
      <el-col :span="10">
        <el-descriptions :column="1" size="small" title="Raw Video Info" class="des">
          <el-descriptions-item label="name">{{ getName() }}</el-descriptions-item>
          <el-descriptions-item label="type">mp4</el-descriptions-item>
          <el-descriptions-item label="size">{{ getSize() }}</el-descriptions-item>
        </el-descriptions>
      </el-col>
      <el-col :span="14">
        <video :src="getSrc()" controls></video>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { useStore } from 'vuex'

const { taskType } = defineProps({
  taskType: {
    type: String,
    required: true
  }
})
const store = useStore()

const getSrc = () => {
  if (taskType === 'segmetation') {
    return store.state.protalData.seg.rawFile
  } else if (taskType === 'cover') {
    return store.state.protalData.cover.rawFile
  } else {
    return store.state.protalData.tag.rawFile
  }
}

const getName = () => {
  if (taskType === 'segmetation') {
    return store.state.protalData.seg.videoName
  } else if (taskType === 'cover') {
    return store.state.protalData.cover.videoName
  } else {
    return store.state.protalData.tag.videoName
  }
}

const getSize = () => {
  if (taskType === 'segmetation') {
    return store.state.protalData.seg.videoSize
  } else if (taskType === 'cover') {
    return store.state.protalData.cover.videoSize
  } else {
    return store.state.protalData.tag.videoSize
  }
}
</script>

<style lang="less">
.raw-file {
  height: @cvinsights-card-height;
  video {
    height: 160px;
  }
}

.des {
  margin-left: 20px;
}
</style>
