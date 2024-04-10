<template>
  <Introduction> pt-comment-analysis is a service which can provide importance level for HOK comments in PT. </Introduction>
  <el-card shadow="never" :body-style="{ textAlign: 'center' }" class="asset" v-loading="loading">
    <el-input v-model="inputContent" maxlength="512" placeholder="Please enter a keyword" show-word-limit type="textarea" resize="none" />
    <el-button type="primary" @click="analyse" class="asset">Analyse</el-button>
  </el-card>
  <el-card v-show="resultShow" class="asset" shadow="never">
    <h2>Analyse Result</h2>
    <el-table :data="tableData" style="width: 30%" border :span-method="objectSpanMethod">
      <el-table-column prop="level" label="Level" />
      <el-table-column prop="score" label="Score" />
      <el-table-column prop="label" label="Label">
        <template #default="scope">
          <el-tag size="large">{{ scope.row.label }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import Introduction from '@/components/introduction/Introduction.vue'
import { nanoid } from 'nanoid'

const inputContent = ref('Lian Po é igual o Ormar do AoV,chato pra porra kkkk,ainda bem que não tão jogando com ele de Sup ainda')
const loading = ref(false)
const requestData = reactive({
  request_body: {
    content: [
      {
        key: nanoid(),
        content: ''
      }
    ]
  },
  session_data: {}
})

// 发送提取请求
const resultShow = ref(false)
const tableData = ref([])
const { proxy } = getCurrentInstance()
const analyse = async () => {
  resultShow.value = false
  if (inputContent.value.trim() === '') {
    ElMessage.error('The input value cannot be empty')
    return
  }
  loading.value = true
  requestData.request_body.content[0].content = inputContent.value
  const resp = await proxy.$api.nlp.commentEffective(requestData)
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
  tableData.value = [
    {
      level: 'high',
      score: data[0].score.high,
      label: data[0].label
    },
    {
      level: 'medium',
      score: data[0].score.medium
    },
    {
      level: 'low',
      score: data[0].score.low
    }
  ]
  resultShow.value = true
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 只合并第一列budget
  if (columnIndex === 2) {
    return {
      rowspan: 3,
      colspan: 1
    }
  }
}
</script>
