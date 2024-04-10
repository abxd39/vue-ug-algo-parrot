<template>
  <Introduction>
    There are many sources of overseas public opinion monitoring data and many corresponding text languages. Language identification is used to identify the language of public opinion text data.
  </Introduction>
  <!-- <el-row :gutter="5" class="asset">
    <el-col :span="20">
      <el-input v-model="input" @keyup.enter.native="analyse" clearable placeholder="Please enter a keyword" />
    </el-col>
    <el-col :span="4">
      <el-button type="primary" @click="analyse" :disabled="disabled">Analyse</el-button>
    </el-col>
  </el-row> -->
  <el-card shadow="never" :body-style="{ textAlign: 'center' }" class="asset">
    <el-input v-model="input" maxlength="512" placeholder="Please enter a keyword" show-word-limit type="textarea" resize="none" />
    <el-button type="primary" @click="analyse" :disabled="disabled" class="asset">Analyse</el-button>
  </el-card>
  <el-card v-show="resultShow" class="asset" shadow="never">
    <h2>Analyse Result</h2>
    <el-table :data="tableData" style="width: 30%">
      <el-table-column prop="category" label="Category" />
      <el-table-column prop="output" label="Algorithm Output" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import Introduction from '@/components/introduction/Introduction.vue'

const { proxy } = getCurrentInstance()
const input = ref('this game lag too much! please fix it!')
const resultShow = ref(false)
const disabled = ref(false)
const tableData = reactive([
  {
    category: 'Tags',
    output: ''
  },
  {
    category: 'Probability',
    output: ''
  }
])
// 点击发送请求
const analyse = async () => {
  if (input.value.trim() === '') {
    ElMessage.error('The input value cannot be empty')
  } else {
    // 禁用按钮
    disabled.value = true
    // 执行搜索网络请求
    const resp = await proxy.$api.nlp.langDetection({ request_body: { content: [input.value] }, session_data: {} })
    // 请求出错
    if (typeof resp === 'string') {
      ElMessage.error(resp)
      // 解开按钮
      disabled.value = false
      return
    }
    const { ret_code, data, message } = resp.data
    if (ret_code === '0') {
      tableData[0].output = data.tags.join(',')
      tableData[1].output = data.tags_probability.join(',')
      // 展示结果区域
      resultShow.value = true
    } else {
      ElMessage.error(message || 'analyse failed')
    }
    // 解开按钮
    disabled.value = false
  }
}
</script>
