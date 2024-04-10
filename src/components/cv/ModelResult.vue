<template>
  <el-card :shadow="shadow" :style="style">
    <h4>{{ title }}</h4>
    <el-divider />
    <div>
      <el-tag v-for="(item, index) in results" :key="index" :type="type">{{ item }}</el-tag>
    </div>
  </el-card>
</template>

<script setup>
const { results, title, style, shadow, type } = defineProps({
  results: {
    type: Array,
    default: () => []
  },
  title: {
    type: String
  },
  style: {
    type: Object,
    default: () => {}
  },
  shadow: {
    type: String,
    default: () => 'hover'
  },
  type: {
    type: String
  }
})
</script>
