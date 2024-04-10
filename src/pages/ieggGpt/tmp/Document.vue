<template>
    <h1>Document</h1>
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
  