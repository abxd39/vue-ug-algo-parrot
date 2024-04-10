<template>
    <Breadcrumb />
    <iframe src="https://cloud-grafana.woa.com/grafana-ikxho788/d/0DtGab94k/gpt-proxy?orgId=1&var-NameSpace=mlflow-dev&var-Service=iegg-gpt-proxy&from=now-1h&to=now" frameborder="0" width="100%" :height="iframeH"></iframe>
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
  