<template>
  <el-select v-model="select" placeholder="Select Quarter" size="large" @change="selectChange">
    <el-option v-for="item in allData.quarterArr" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
  <el-card shadow="never" class="asset" style="text-align: center">
    <el-table :data="allData.automationData" style="width: 100%">
      <el-table-column prop="category" label="Category" />
      <el-table-column prop="game_code" label="Game Code" />
      <el-table-column prop="country" label="Country" />
      <el-table-column prop="spend" label="Spend($)" />
      <el-table-column prop="kpi" label="KPI" />
      <el-table-column prop="improvement" label="Improvement(%)" />
    </el-table>
  </el-card>
</template>

<script setup>
import { reactive, ref, onBeforeMount, onMounted, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const select = ref('')
const allData = reactive({
  allSelect: [],
  quarterArr: [],
  automationData: []
})

// 获取季度列表
const getQuarter = async () => {
  const resp = await proxy.$api.kpi.automationQuarter({})
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    select.value = data[0]
    allData.allSelect = data.map(item => {
      return { label: item, value: item }
    })
    allData.quarterArr = allData.allSelect.filter(item => {
      return item.value !== select.value
    })
  } else {
    ElMessage.error(message || 'get quarter data failed')
  }
}

// 获取数据
const getData = async () => {
  // console.log(select.value)
  const resp = await proxy.$api.kpi.automation({ statis_date: select.value })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    allData.automationData = data
  } else {
    ElMessage.error(message || 'get automation data failed')
  }
}

// 选中值发生改变时
const selectChange = () => {
  getData()
  allData.quarterArr = allData.allSelect.filter(item => {
    return item.value !== select.value
  })
}

// 获取季度
onBeforeMount(() => {
  getQuarter()
})

// 获取具体数据
onMounted(() => {
  getData()
})
</script>
