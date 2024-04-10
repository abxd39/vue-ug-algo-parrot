<template>
  <Breadcrumb />
  <div class="outer-box" id="search">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane name="first" label="Interface Testing">
        <InterfaceTesting />
      </el-tab-pane>
      <el-tab-pane name="second" label="Stress Testing">
        <StressTesting />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import InterfaceTesting from '@/components/tools/testing/InterfaceTesting.vue'
import StressTesting from '@/components/tools/testing/StressTesting.vue'

import { sendUserAction } from '@/utils/api_utils'

const activeName = ref('first')
const tabClick = context => {
  sendUserAction({ page_name: context.props.label })
}
</script>
