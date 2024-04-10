<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item v-for="(item, index) in getCrubArr()" :key="index">{{ item }}</el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import menuList from '../aside/menu'

const route = useRoute()
// 获取当前点击的path
const currentPath = route.matched.at(-1).path
const getCrubArr = () => {
  const crubArr = []
  for (let i = 0; i < menuList.length; i++) {
    const item = menuList[i]
    if (item.path === currentPath) {
      crubArr.push(item.label)
      break
    }
    // 第二层
    if (item.children) {
      for (let j = 0; j < item.children.length; j++) {
        const subItem = item.children[j]
        if (subItem.path === currentPath) {
          crubArr.push(item.label, subItem.label)
          break
        }
        // 第三层
        if (subItem.children) {
          for (let k = 0; k < subItem.children.length; k++) {
            const thirdItem = subItem.children[k]
            if (thirdItem.path === currentPath) {
              crubArr.push(item.label, subItem.label, thirdItem.label)
              break
            }
          }
        }
      }
    }
  }
  return crubArr
}
</script>
