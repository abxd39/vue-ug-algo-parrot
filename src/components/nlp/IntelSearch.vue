<template>
  <Introduction>This feature is added to help users experience the search box as well as the search results with the auto-completion feature.</Introduction>
  <el-row :gutter="5" class="asset">
    <el-col :span="10">
      <el-input v-model="input" @keyup.enter.native="sendIntellSearch" clearable placeholder="Please enter a keyword" />
    </el-col>
    <el-col :span="4">
      <el-button type="primary" @click="sendIntellSearch" :disabled="disabled">Search</el-button>
    </el-col>
  </el-row>
  <div v-show="result.resultShow" class="result">
    <ModelResult :results="result.sqlResults" title="SQL statement" shadow="never" type="success" />
    <el-card shadow="never">
      <h4>Results</h4>
      <el-divider />
      <el-table :data="result.tableData" style="width: 50%">
        <el-table-column prop="sn" label="S/N" width="180" />
        <el-table-column prop="date" label="Date" width="180" />
        <el-table-column prop="platform" label="Platform" width="180" />
        <el-table-column prop="value" label="Value" />
      </el-table>
    </el-card>
    <el-card shadow="never">
      <h4>Intent</h4>
      <el-divider />
      <div>
        <el-tag v-for="(item, index) in result.intentResults" :key="index" :type="item.type" size="large">{{ item.name }}</el-tag>
      </div>
    </el-card>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="never">
          <h4>Entities</h4>
          <el-divider />
          <div>
            <el-tag v-for="(item, index) in result.entitiesResults" :key="index" :type="item.type" size="large">{{ item.name }}</el-tag>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never">
          <h4>Legend</h4>
          <el-divider />
          <div>
            <el-tag v-for="(item, index) in result.legendResults" :key="index" :type="item.type" size="large">{{ item.name }}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import ModelResult from '@/components/cv/ModelResult.vue'
import Introduction from '@/components/introduction/Introduction.vue'

const { proxy } = getCurrentInstance()
// 智能查询
const input = ref('')
const disabled = ref(false)
const result = reactive({
  resultShow: false,
  sqlResults: [],
  tableData: [],
  intentResults: [],
  entitiesResults: [],
  legendResults: [
    {
      name: 'Entity Name',
      type: 'success'
    },
    {
      name: 'Date',
      type: 'info'
    },
    {
      name: 'Granularity',
      type: 'warning'
    },
    {
      name: 'Metric',
      type: 'danger'
    }
  ]
})

// 点击发送智能搜索请求
const sendIntellSearch = async () => {
  if (input.value.trim() === '') {
    ElMessage.error('The input value cannot be empty')
  } else {
    const loadingInstance = ElLoading.service({ target: document.getElementById('search'), lock: true, text: 'Loading' })
    // 禁用按钮
    disabled.value = true
    // 执行搜索网络请求
    const resp = await proxy.$api.nlp.intelSearch({ text: input.value })
    if (typeof resp === 'string') {
      // 取消按钮禁用
      disabled.value = false
      loadingInstance.close()
      ElMessage.error(resp)
      return
    }
    const { SQL_statement, db_result, nlu_result } = resp.data
    if (SQL_statement) {
      result.sqlResults = [SQL_statement]
    }
    if (typeof db_result === 'string') {
      result.tableData = [
        {
          sn: 1,
          date: '',
          platform: '',
          value: ''
        }
      ]
    }
    const intentArr = []
    nlu_result.intent_ranking.forEach(item => {
      if (item.name === nlu_result.intent.name) {
        intentArr.push({
          name: item.name,
          type: 'success'
        })
      } else {
        intentArr.push({
          name: item.name,
          type: ''
        })
      }
    })
    result.intentResults = intentArr
    result.entitiesResults = [
      {
        name: nlu_result.entities.entity_name,
        type: 'success'
      }
    ]
    loadingInstance.close()
    // 展示结果区域
    result.resultShow = true
    // 取消按钮禁用
    disabled.value = false
  }
}
</script>
