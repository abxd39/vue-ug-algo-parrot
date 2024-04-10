<template>
  <Introduction>
    The keyword cluster server includes two types of clusters former, one maps the original word to a normalized word, and the other one is to acquire similar words based on the normalized word.
  </Introduction>
  <el-card shadow="never" :body-style="{ textAlign: 'center' }" class="asset">
    <el-radio-group v-model="radio">
      <el-radio :label="item" v-for="item in radioItems" :key="item">{{ item }}</el-radio>
    </el-radio-group>
    <el-input v-model="input" maxlength="512" placeholder="Please enter a keyword" show-word-limit type="textarea" resize="none" />
    <el-button type="primary" @click="analyse" class="asset">Analyse</el-button>
  </el-card>
  <el-card v-show="resultShow" class="asset" shadow="never">
    <h4>Analyse Result</h4>
    <el-tag v-for="item in tagArr" :key="item">{{ item }}</el-tag>
  </el-card>
</template>

<script setup>
import { ref, getCurrentInstance, reactive } from 'vue'
import Introduction from '@/components/introduction/Introduction.vue'

const { proxy } = getCurrentInstance()
const input = ref('adc')
const resultShow = ref(false)
const radioItems = reactive(['set', 'map'])
const radio = ref('set')
const tagArr = ref([])

// 点击发送请求
const analyse = async () => {
  if (input.value.trim() === '') {
    ElMessage.error('The input value cannot be empty')
  } else {
    // 执行搜索网络请求
    const resp = await proxy.$api.nlp.keywordsCluster({
      request_body: {
        contents: [input.value],
        type: radio.value
      },
      session_data: {}
    })

    // 请求出错
    if (typeof resp === 'string') {
      ElMessage.error(resp)
      return
    }
    const { ret_code, message } = resp.data
    let data = resp.data.data
    if (ret_code === '0') {
      // 如果data是字符串，需要解析
      if (typeof data === 'string') {
        data = JSON.parse(data)
      }
      if (radio.value === 'set') {
        tagArr.value = data[input.value]
      } else if (radio.value === 'map') {
        tagArr.value = [data[input.value]]
      }
      // 展示结果区域
      resultShow.value = true
    } else {
      ElMessage.error(message)
    }
  }
}
</script>

<style lang="less" scoped>
.label {
  margin-top: 80px;
}
</style>
