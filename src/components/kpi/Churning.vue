<template>
  <el-select v-model="select" placeholder="Select Quarter" size="large" @change="selectChange">
    <el-option v-for="item in allData.quarterArr" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
  <el-card shadow="never" class="asset" style="text-align: center">
    <h4>churning report</h4>
    <el-table :data="allData.churningData" style="width: 100%">
      <el-table-column prop="game_code" label="Game Code" />
      <el-table-column prop="spend" label="Spend" />
      <el-table-column prop="cohort_size" label="Cohort Size" />
      <el-table-column prop="spend_by_cohort" label="Spend/Cohort" />
      <el-table-column prop="d1_retention" label="D1 % Retention" />
      <el-table-column prop="d7_retention" label="D7 % Retention" />
    </el-table>
  </el-card>
  <el-card shadow="never" class="asset" style="text-align: center">
    <h4>prevent customer churning report</h4>
    <el-table :data="allData.preChurningData" style="width: 100%">
      <el-table-column prop="game_code" label="Game Code" />
      <el-table-column prop="active_time_uplift" label="Active time uplift" />
      <el-table-column prop="login_times_uplift" label="Login time uplift" />
      <el-table-column prop="arpu_uplift" label="ARPU uplift" />
      <el-table-column prop="d1_retention" label="D1 % Retention" />
      <el-table-column prop="d7_retention" label="D7 % Retention" />
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
  churningData: [],
  preChurningData: []
})

// 获取季度列表
const getQuarter = async () => {
  const resp = await proxy.$api.kpi.churningQuarter({})
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
const getChurningData = async () => {
  // console.log(select.value)
  const resp = await proxy.$api.kpi.churning({ statis_date: select.value })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    allData.churningData = data
  } else {
    ElMessage.error(message || 'get churning data failed')
  }
}

const getPreChurningData = async () => {
  // console.log(select.value)
  const resp = await proxy.$api.kpi.preChurning({ statis_date: select.value })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    allData.preChurningData = data
  } else {
    ElMessage.error(message || 'get pre churning data failed')
  }
}

// 选中值发生改变时
const selectChange = () => {
  getChurningData()
  getPreChurningData()
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
  getChurningData()
  getPreChurningData()
})
</script>
