<template>
  <el-result icon="warning" title="404" sub-title="The page you are looking for is lost~">
    <template #extra>
      <el-button type="primary" @click="setPath()">Back Index</el-button>
    </template>
  </el-result>
</template>

<script setup>
import { useRouter } from 'vue-router'

let router = useRouter()
const setPath = () => {
  sessionStorage.setItem('path', '/index')
  router.push('/index')
}
</script>
