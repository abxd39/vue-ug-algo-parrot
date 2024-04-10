<template>
  <Breadcrumb />
  <div class="outer-box">
    <el-tabs v-model="activeName">
      <el-tab-pane name="first" label="Game Graph Display Ability">
        <GameGraphDisplayAbility />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import GameGraphDisplayAbility from '@/components/nlp/GameGraphDisplayAbility.vue'

const activeName = ref('first')
</script>

<style lang="less" scoped></style>
