<template>
  <Breadcrumb />
  <div class="outer-box" id="security">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane name="first" label="Security">
        <Security />
      </el-tab-pane>
      <el-tab-pane name="second" label="Hack" :lazy="true">
        <Hack />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import Security from '@/components/nlp/Security.vue'
import Hack from '@/components/nlp/Hack.vue'
import { sendUserAction } from '@/utils/api_utils'

const activeName = ref('first')

const tabClick = context => {
  sendUserAction({ page_name: context.props.label })
}
</script>

<style lang="less" scoped></style>
