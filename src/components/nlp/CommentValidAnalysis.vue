<template>
  <Introduction>The comment-valid analysis aims to identify the validity of public opinion comments.</Introduction>
  <el-card shadow="never" :body-style="{ textAlign: 'center' }" class="asset">
    <el-input v-model="input" maxlength="512" placeholder="Please enter a keyword" show-word-limit type="textarea" resize="none" />
    <el-button type="primary" @click="analyse" class="asset">Analyse</el-button>
  </el-card>
  <el-card v-show="resultShow" class="asset" shadow="never">
    <h4>Analyse Result</h4>
    <el-tag :type="type" size="large">{{ isvalid }}</el-tag>
  </el-card>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'

import Introduction from '@/components/introduction/Introduction.vue'

const { proxy } = getCurrentInstance()
const input = ref('#TowerofFantasy #Tofgether #NewEra #Cherimu')
const resultShow = ref(false)
const isvalid = ref('')
const type = ref('info')
const validMap = {
  1: 'valid',
  0: 'invalid'
}
// 点击发送请求
const analyse = async () => {
  if (input.value.trim() === '') {
    ElMessage.error('The input value cannot be empty')
  } else {
    const resp = await proxy.$api.nlp.commentValid({
      request_body: {
        contents: [input.value]
      },
      session_data: {}
    })
    // 请求出错
    if (typeof resp === 'string') {
      ElMessage.error(resp)
      return
    }
    const { ret_code, message, data } = resp.data
    if (ret_code === '0') {
      if (data.isvalid.length !== 1) {
        ElMessage.error('the length of isvalid arr is not 1')
        return
      }
      if (data.isvalid[0] === 0) {
        type.value = 'danger'
      } else {
        type.value = 'success'
      }
      isvalid.value = validMap[data.isvalid[0]]
      // 展示结果区域
      resultShow.value = true
    } else {
      ElMessage.error(message || 'analyse failed')
    }
  }
}
</script>
