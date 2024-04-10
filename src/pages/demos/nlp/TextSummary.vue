<template>
  <Breadcrumb />
  <div class="outer-box" id="summary">
    <el-tabs v-model="activeName">
      <el-tab-pane name="first" label="Text Summary">
        <TextSummary />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import TextSummary from '@/components/nlp/TextSummary.vue'

const activeName = ref('first')
</script>
