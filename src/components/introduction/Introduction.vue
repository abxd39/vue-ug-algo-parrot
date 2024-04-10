<template>
  <el-card shadow="hover">
    <h4>Function Introduction</h4>
    <el-divider />
    <p style="color: #606266; font-size: 14px"><slot></slot></p>
  </el-card>
</template>

<script setup></script>

<style lang="less" scoped>
h4 {
  margin: 0;
}

p {
  margin-bottom: 0;
}
</style>
