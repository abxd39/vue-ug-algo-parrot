<template>
    <Breadcrumb />
    <iframe src="https://sdxl-web.intlgame.com" frameborder="0" width="100%" :height="iframeH"></iframe>
  </template>
  <script setup>
  import { onMounted, ref } from 'vue'
  
  import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
  
  let iframeH = ref(document.body.clientHeight)
  
  onMounted(() => {
    window.onresize = () => {
      iframeH.value = document.body.clientHeight
    }
  })
  </script>
  
  <style lang="less" scoped></style>
  