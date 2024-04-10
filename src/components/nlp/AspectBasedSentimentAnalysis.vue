<template>
  <Introduction>
    As an important ﬁne-grained sentiment analysis problem, aspect-based sentiment analysis (ABSA), aiming to analyze and understand user's opinions at the aspect level, is going to be applied in our
    system. In the game scenario, this tool can analyse aspect term, opinion term and sentiment polarity about some aspect of a game for a given review.
  </Introduction>
  <el-card shadow="never" :body-style="{ textAlign: 'center' }" class="asset">
    <el-radio-group v-model="lang" @change="dateRangeChange">
      <el-radio :label="item" size="small" v-for="item in langArr" :key="item">{{ item }}</el-radio>
    </el-radio-group>
    <el-input v-model="input" maxlength="512" placeholder="Please enter a keyword" show-word-limit type="textarea" resize="none" />
    <el-button type="primary" @click="analyse" :disabled="disabled" class="asset">Analyse</el-button>
  </el-card>
  <el-card v-show="resultShow" class="asset" shadow="never">
    <h2>Analyse Result</h2>
    <el-table :data="tableData" style="width: 100%" stripe>
      <el-table-column prop="aspect_category" label="Category" />
      <el-table-column prop="aspect_term" label="Aspect" />
      <el-table-column prop="opinion_term" label="Opinion" />
      <el-table-column prop="sentiment_polarity" label="Sentiment" />
      <el-table-column prop="opinion_expression" label="Opinion Expression" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { nanoid } from 'nanoid'

import Introduction from '@/components/introduction/Introduction.vue'

const { proxy } = getCurrentInstance()
const langArr = ['en', 'pt']
const input = ref('wonderful game but terrible server')
const resultShow = ref(false)
const disabled = ref(false)
const tableData = ref([])
const lang = ref(langArr[0])
// 点击发送请求
const analyse = async () => {
  if (input.value.trim() === '') {
    ElMessage.error('The input value cannot be empty')
  } else {
    const loadingInstance = ElLoading.service({ target: document.getElementById('opinion'), lock: true, text: 'Loading' })
    // 禁用按钮
    disabled.value = true
    // 执行搜索网络请求
    const inputMd5 = md5(input.value)
    const resp = await proxy.$api.nlp.reviewProcess({
      request_id: nanoid(),
      reviews: [
        {
          text: input.value,
          id: inputMd5
        }
      ],
      args: {},
      debug: false,
      cache: false,
      language: lang.value
    })
    // 请求出错
    if (typeof resp === 'string') {
      // 解开按钮
      disabled.value = false
      loadingInstance.close()
      ElMessage.error(resp)
      return
    }
    const { ret_code, message, data } = resp.data
    if (ret_code === '0') {
      tableData.value = data.results[inputMd5].sentence_infos
      loadingInstance.close()
      // 展示结果区域
      resultShow.value = true
    } else {
      loadingInstance.close()
      ElMessage.error(message || 'analyse failed')
    }
    // 解开按钮
    disabled.value = false
  }
}
</script>
