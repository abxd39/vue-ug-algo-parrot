<template>
  <Introduction>Multilingual sentence representation provides a sentence representation of a common game domain, returning similarity.</Introduction>
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
    <el-table :data="tableData" style="width: 50%">
      <el-table-column prop="euclidean" label="Euclidean Distance" />
      <el-table-column prop="manhattan" label="Manhattan Distance" />
      <el-table-column prop="cosine" label="Cosine Distance" />
      <el-table-column prop="edit" label="Edit Distance" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import Introduction from '@/components/introduction/Introduction.vue'

const { proxy } = getCurrentInstance()
const input = ref('this game lag too much! please fix it!')
const resultShow = ref(false)
const disabled = ref(true)
const tableData = ref([])

// 点击发送请求
const analyse = async () => {
  if (input.value.trim() === '') {
    ElMessage.error('The input value cannot be empty')
  } else {
    // 禁用按钮
    disabled.value = true
    // 执行搜索网络请求
    const requestData = { contents: input.value }
    const resp = await proxy.$api.nlp.multilingual(requestData)
    // 请求出错
    if (typeof resp === 'string') {
      ElMessage.error(resp)
      // 解开按钮
      disabled.value = false
      return
    }
    const { status_code } = resp.data
    if (status_code === 200) {
      tableData.value = [
        {
          euclidean: '',
          manhattan: '',
          cosine: '',
          edit: ''
        }
      ]
      // 展示结果区域
      resultShow.value = true
    } else {
      ElMessage.error('analyse failed')
    }
    // 解开按钮
    disabled.value = false
  }
}
</script>
