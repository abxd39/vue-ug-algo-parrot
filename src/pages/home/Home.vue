<template>
  <el-container class="lay-container">
    <!-- <Header /> -->
    <el-container id="mainSection">
      <Aside v-if="asideDisable" />
      <Main />
    </el-container>
  </el-container>
</template>

<script setup>
import { ref} from 'vue'
// import Header from '../../components/header/Header.vue'
import Aside from '../../components/aside/Aside.vue'
import Main from '../../components/main/Main.vue'
const asideDisable=ref(true)
//如果是带有参数from=aix 的url 需要掩藏侧边栏
let url=new URL(window.location.href.replace('#','a'))
  let args = new URLSearchParams(url.search)
  let where=args.get("from")
  if (where&&where.includes('aix')){
    ElMessage.error('%%%%%%%%%%%%%%%%%%%%%%%%');
    asideDisable.value=false
  }
</script>

<style lang="less" scoped>
.lay-container {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
