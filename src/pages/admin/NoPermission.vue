<template>
  <div class="permission">
    <!-- <img :src="getImgSrc('nopermission.png')" alt="" /> -->
    <h1>No page permissions!</h1>
    <h2>Please contact the administrator for permission</h2>
    <h2>administrator:</h2>
    <div>
      <h3 v-for="item in administrator" :key="item">{{ item }}</h3>
    </div>
  </div>
</template>

<script setup>
// const getImgSrc = name => {
//   return new URL(`../../assets/images/${name}`, import.meta.url).href
// }
const administrator = ['lilysun', 'gc_suzhipeng']
</script>

<style lang="less">
.permission {
  width: 100%;
  height: 100%;
  background-color: #101b45;
  color: white;
  text-align: center;
  padding-top: 15%;
  h1 {
    margin-top: 0;
  }
  // img {
  //   width: 40%;
  // }
  // span {
  //   color: #67c23a;
  // }
}
</style>
