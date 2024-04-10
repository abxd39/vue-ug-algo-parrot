<template>
  <Breadcrumb />
  <div class="outer-box" id="search">
    <el-tabs v-model="activeName">
      <el-tab-pane name="first" label="Intelligent Search">
        <IntelSearch />
      </el-tab-pane>
      <!-- <el-tab-pane name="second" label="Common Search">
        <CommonSearch />
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import IntelSearch from '@/components/nlp/IntelSearch.vue'
// import CommonSearch from '@/components/nlp/CommonSearch.vue'

const activeName = ref('first')
</script>
