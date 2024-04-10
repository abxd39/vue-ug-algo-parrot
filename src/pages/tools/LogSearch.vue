<template>
  <Breadcrumb />
  <div class="outer-box">
    <el-row :gutter="15">
      <el-col :span="8">
        <el-card>
          <div class="log-search">
            <h5 style="margin: 0">It retains data for a month.</h5>
            <el-button type="primary" link @click="jumpToLog">go to log page >></el-button>
          </div>
          <el-divider />
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="Account ID">100011600472</el-descriptions-item>
            <el-descriptions-item label="User Name">ua-cls-readonly</el-descriptions-item>
            <el-descriptions-item label="Password">Adgalgo123**</el-descriptions-item>
          </el-descriptions>
          <div style="text-align: right; margin-top: 10px; color: #409eff">
            <el-icon><Document /></el-icon>
            <a href="http://" target="_blank" style="color: #409eff; font-size: 14px">Document</a>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'

const jumpToLog = () => {
  window.open('https://console.cloud.tencent.com/cls/search?grammarVersion=lucene&region=ap-singapore&topic_id=d4d56bcd-6d26-48bc-afce-7d0ea04fb711&queryBase64=', '_blank')
}
</script>

<style lang="less" scoped>
.log-search {
  display: flex;
  justify-content: space-between;
}
</style>
