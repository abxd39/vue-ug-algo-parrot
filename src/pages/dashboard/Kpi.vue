<template>
  <Breadcrumb />
  <div class="outer-box" id="kpi">
    <el-tabs v-model="activeName">
      <el-tab-pane name="seventh" label="MLFlow Overview" :lazy="true">
        <Overview />
      </el-tab-pane>
      <el-tab-pane name="sixth" label="MLFlow Service Report" :lazy="true">
        <Service />
      </el-tab-pane>
      <el-tab-pane name="fifth" label="CV Report" :lazy="true">
        <CV />
      </el-tab-pane>
      <el-tab-pane name="first" label="Audience For New Report" :lazy="true">
        <New />
      </el-tab-pane>
      <!-- <el-tab-pane name="second" label="Audience For Churning Report" :lazy="true">
        <Churning />
      </el-tab-pane>
      <el-tab-pane name="third" label="Audience For Optimism Report" :lazy="true">
        <Optimism />
      </el-tab-pane> -->
      <el-tab-pane name="fourth" label="NLP Report" :lazy="true">
        <NLP />
      </el-tab-pane>
      <el-tab-pane name="second" label="Audience For Churning Report" :lazy="true">
        <Churning />
      </el-tab-pane>
      <el-tab-pane name="third" label="Automation Report" :lazy="true">
        <Automation />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import New from '@/components/kpi/New.vue'
import Churning from '@/components/kpi/Churning.vue'
import Automation from '@/components/kpi/Automation.vue'
import NLP from '@/components/kpi/NLP.vue'
import CV from '@/components/kpi/CV.vue'
import Service from '@/components/kpi/Service.vue'
import Overview from '@/components/kpi/Overview.vue'

const activeName = ref('seventh')
</script>

<style lang="less" scoped></style>
