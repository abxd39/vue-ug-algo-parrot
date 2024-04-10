<template>
  <Introduction>
    The keyword extraction task aims to extract keywords or key phrases from text documents. They are selected among phrases in the text document and characterize the topic of the text document. In
    the opinion system of the game domain, it can reveal what players discuss about a game in a quick and rough fashion, helping us to know the demands of players.
  </Introduction>
  <el-card shadow="never" :body-style="{ textAlign: 'center' }" class="asset" v-loading="loading">
    <el-radio-group v-model="selectLangLabel">
      <el-radio :label="item" v-for="item in langOption" :key="item">{{ item }}</el-radio>
    </el-radio-group>
    <el-input v-model="inputContent" maxlength="512" placeholder="Please enter a keyword" show-word-limit type="textarea" resize="none" />
    <el-button type="primary" @click="analyse" class="asset">Extract</el-button>
  </el-card>
  <el-card v-show="resultShow" class="asset" shadow="never">
    <h3>Result</h3>
    <p v-html="resultContent"></p>
  </el-card>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import Introduction from '@/components/introduction/Introduction.vue'

const langOption = ['en', 'zh', 'zh-tw', 'pt', 'es', 'ja']
const selectLangLabel = ref('en')
const inputContent = ref('nikke i think It is a good game,but it has a lot of shit,so i can not recommend it to people.')
const loading = ref(false)
const requestData = reactive({
  request_body: {
    content: [],
    content_en: [],
    language: '',
    env: window.location.hostname === 'algo.intlgame.com' ? 'master' : 'dev'
  },
  session_data: {}
})

// 发送提取请求
const resultShow = ref(false)
const resultContent = ref(inputContent.value)
const { proxy } = getCurrentInstance()
const analyse = async () => {
  resultShow.value = false
  resultContent.value = inputContent.value
  if (inputContent.value.trim() === '') {
    ElMessage.error('The input value cannot be empty')
    return
  }
  loading.value = true
  requestData.request_body.content = [inputContent.value]
  requestData.request_body.language = selectLangLabel.value
  const resp = await proxy.$api.nlp.textExtract(requestData)
  loading.value = false
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message, data } = resp.data
  if (ret_code !== '0') {
    ElMessage.error(message)
    return
  }
  for (const word of data.keywords[0]) {
    const replaceWord = `<span style="background-color: #E6A23C">${word}</span>`
    resultContent.value = resultContent.value.replace(word, replaceWord)
  }
  resultShow.value = true
}
</script>
