<template>
  <el-date-picker v-model="date.dateArr" type="daterange" range-separator="To" start-placeholder="Start date" end-placeholder="End date" @change="dateChange" size="large" :clearable="false" />
  <el-button type="primary" class="my-button" @click="search" :disabled="disabled">Search</el-button>
  <el-row>
    <el-col :span="12">
      <el-card shadow="never" class="asset" style="text-align: center">
        <h4>NLP In Databrain(by week)</h4>
        <el-table :data="tableData.nlp" stripe style="width: 100%">
          <el-table-column prop="date" label="date" />
          <el-table-column prop="service" label="service" />
          <el-table-column prop="pv_rate" label="pv rate" />
          <el-table-column prop="uv_rate" label="uv rate" />
        </el-table>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, onBeforeMount } from 'vue'
import { formatDate } from '@/utils/common_utils'

// 1天的毫秒
const oneDays = 24 * 60 * 60 * 1000
const { proxy } = getCurrentInstance()
const date = reactive({
  dateArr: [],
  startDate: '',
  endDate: ''
})

const tableData = reactive({
  nlp: []
  // service: []
})
const disabled = ref(false)
const dateChange = value => {
  if (value) {
    const interval = value[1] - value[0]
    if (interval < 7 * oneDays) {
      ElMessage.error('The date interval must be at least 7 days')
      disabled.value = true
      return
    }
    disabled.value = false
    date.startDate = formatDate(value[0], 'yyyy-mm-dd')
    date.endDate = formatDate(value[1], 'yyyy-mm-dd')
    // 这里不用自动更新数据
  } else {
    date.startDate = ''
    date.endDate = ''
  }
}

const getNlpData = async () => {
  const resp = await proxy.$api.kpi.nlp({ start_date: date.startDate, end_date: date.endDate })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    // 针对data为null的情况
    if (data) {
      const tempArr = []
      data.forEach(item => {
        tempArr.push({
          date: item.date,
          service: 'opinion',
          pv_rate: item.opinion_pv_rate + '%',
          uv_rate: item.opinion_uv_rate + '%'
        })
        tempArr.push({
          // date: item.date,
          service: 'intelligence',
          pv_rate: item.intelligence_pv_rate + '%',
          uv_rate: item.intelligence_uv_rate + '%'
        })
      })
      tableData.nlp = tempArr
    }
  } else {
    ElMessage.error(message || 'get nlp data failed')
  }
}

const getCurrentDate = () => {
  const today = new Date()
  // 获取上周周一到周天的时间
  let weekDay = today.getDay()
  // 星期天为0
  if (weekDay === 0) {
    weekDay = 7
  }
  const startTime = today.getTime() - (6 + weekDay) * oneDays
  const endTime = today.getTime() - weekDay * oneDays
  date.dateArr[0] = new Date(startTime)
  date.dateArr[1] = new Date(endTime)

  date.startDate = formatDate(date.dateArr[0], 'yyyy-mm-dd')
  date.endDate = formatDate(date.dateArr[1], 'yyyy-mm-dd')
  // console.log(date.startDate, date.endDate)
}

const search = () => {
  getNlpData()
}

onBeforeMount(() => {
  // 获取当前时间
  getCurrentDate()
})

onMounted(() => {
  getNlpData()
})
</script>

<style lang="less">
.my-button {
  margin-left: 5px;
}
</style>
