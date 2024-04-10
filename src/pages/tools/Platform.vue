<template>
  <Breadcrumb />
  <div class="outer-box">
    <h2>Training</h2>
    <el-divider />
    <el-row :gutter="15">
      <el-col :span="8">
        <el-card>
          <div class="log-search">
            <h5 style="margin: 0">JupyterHub</h5>
            <el-button type="primary" link @click="jumpTraining">go to jupyterHub page >></el-button>
          </div>
          <el-divider />
          <h5 style="margin: 0">Ask one of the following people for permission</h5>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="Username">daiczhang; v_fchtan</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <h2>WorkFlow</h2>
    <el-divider />
    <el-row :gutter="15">
      <el-col :span="8">
        <el-card>
          <div class="log-search">
            <h5 style="margin: 0">Airflow</h5>
            <el-button type="primary" link @click="jumpAirflow">go to airflow page >></el-button>
          </div>
          <el-divider />
          <h5 style="margin: 0">Ask one of the following people for permission</h5>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="Username">daiczhang; taiichigao</el-descriptions-item>
          </el-descriptions>
        </el-card>
      </el-col>
    </el-row>
    <h2>Log Search</h2>
    <el-divider />
    <el-row :gutter="15">
      <el-col :span="8">
        <el-card>
          <div class="log-search">
            <h5 style="margin: 0">CLS</h5>
            <el-button type="primary" link @click="jumpToLog">go to cls page >></el-button>
          </div>
          <el-divider />
          <h5 style="margin: 0">It retains data for a month.</h5>
          <el-descriptions :column="1" size="small" border>
            <el-descriptions-item label="Account ID">100011600472</el-descriptions-item>
            <el-descriptions-item label="User Name">ua-cls-readonly</el-descriptions-item>
            <el-descriptions-item label="Password">Adgalgo123**</el-descriptions-item>
          </el-descriptions>
          <div style="text-align: right; margin-top: 10px; color: #409eff">
            <el-icon><Document /></el-icon>
            <a href="https://iwiki.woa.com/pages/viewpage.action?pageId=4006813234#Topic5:Logginginservices-Howtosearchtheofflinelog" target="_blank" style="color: #409eff; font-size: 14px"
              >Document</a
            >
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'

const jumpAirflow = () => {
  window.open('http://ieg-global-airflow.iegcom.com:8080/home', '_blank')
}

const jumpTraining = () => {
  window.open('http://101.32.110.242:9090/', '_blank')
}

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
