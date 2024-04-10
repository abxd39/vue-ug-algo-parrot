<template>
  <Breadcrumb />
  <div style="text-align:center">
    <el-button size="large" @click="redirectToJupyterhub">Redirect to Jupyterhub</el-button>
  </div>

</template>


<script setup>
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'

window.open('http://101.32.110.242:9090/', '_blank');

const redirectToJupyterhub = () => {
  window.open('http://101.32.110.242:9090/', '_blank');
}


</script>

<style lang="less">

</style>