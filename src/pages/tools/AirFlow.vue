<template>
  <Breadcrumb />
  <div style="text-align:center">
    <el-button size="large" @click="redirectToAirflow">Redirect to Airflow</el-button>
  </div>

</template>


<script setup>
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'

window.open('http://ieg-global-airflow.iegcom.com:8080/home', '_blank');

const redirectToAirflow = () => {
  window.open('http://ieg-global-airflow.iegcom.com:8080/home', '_blank');
}



</script>

<style lang="less">

</style>