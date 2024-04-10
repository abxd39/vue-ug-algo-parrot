<template>
  <Breadcrumb />
  <div class="outer-box" id="gpt_statistic">
    <div style="display: flex; justify-content: flex-start">
      <span style="line-height: 32px; padding-right: 5px">Last Minutes:</span>
      <el-input v-model.number="lastMinutes" style="width: 10%"></el-input>
      <el-button type="primary" class="my-button" @click="searchMin">Search</el-button>
    </div>
    <el-card :body-style="{ height: '350px' }" class="asset" shadow="never">
      <div id="minute" style="height: 100%; width: 100%"></div>
    </el-card>
    <div style="margin-top: 15px">
      <el-date-picker v-model="date.dateArr" type="daterange" range-separator="To" start-placeholder="Start date" end-placeholder="End date" @change="dateChange" size="large" :clearable="false" />
      <el-button type="primary" class="my-button" @click="searchDay" size="large" style="margin-top: -5px">Search</el-button>
    </div>
    <el-card :body-style="{ height: '350px' }" class="asset" shadow="never">
      <div id="day" style="height: 100%; width: 100%"></div>
    </el-card>
  </div>
</template>

<script setup>
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import { reactive, ref, onMounted, getCurrentInstance, onBeforeUnmount } from 'vue'
import { formatDate } from '@/utils/common_utils'

const oneMinute = 60 * 1000
const oneDay = 24 * 60 * 60 * 1000
const { proxy } = getCurrentInstance()
let minChart, dayChart, resizeObserver
const lastMinutes = ref(30)
const date = reactive({
  dateArr: [],
  startDate: '',
  endDate: ''
})

const minuteData = ref([])
const dayData = ref([])

const dateChange = value => {
  // console.log(value)
  if (value) {
    date.startDate = formatDate(date.dateArr[0], 'yyyy-mm-dd')
    date.endDate = formatDate(date.dateArr[1], 'yyyy-mm-dd')
    // 这里不用自动更新数据
  } else {
    date.startDate = ''
    date.endDate = ''
  }
}

const initChart = () => {
  const lineBaseOption = {
    title: {
      textAlign: 'center',
      left: '50%'
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    legend: {
      bottom: 0
    },
    grid: {
      // 解决x坐标上移
      bottom: 100
    },
    xAxis: [
      {
        type: 'category',
        axisPointer: {
          type: 'shadow'
        },
        nameTextStyle: {
          color: '#303133',
          fontStyle: 'italic',
          fontSize: 13,
          padding: 5
        },
        // nameLocation: 'start',
        nameGap: 50,
        axisTick: {
          alignWithLabel: true,
          interval: 0
        },
        // 坐标值旋转
        axisLabel: {
          rotate: 30,
          margin: 10
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'num',
        nameTextStyle: {
          color: '#303133',
          fontStyle: 'italic',
          fontSize: 13,
          padding: 5
        },
        splitLine: { show: false },
        axisLabel: {
          formatter: '{value}'
        }
      }
    ]
  }
  // 分钟
  minChart = proxy.$echarts.init(document.getElementById('minute'))
  minChart.setOption(lineBaseOption)
  // 天
  dayChart = proxy.$echarts.init(document.getElementById('day'))
  dayChart.setOption(lineBaseOption)
}

// 获取分钟统计
const getMinStatistic = async () => {
  const resp = await proxy.$api.kpi.gptPreMin({
    last_minutes: lastMinutes.value
  })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    minuteData.value = data
    updateMinuteChart()
  } else {
    ElMessage.error(message || 'get minute data failed')
  }
}

// 获取天的统计
const getDayStatistic = async () => {
  const resp = await proxy.$api.kpi.gptPreDay({
    start_date: date.startDate,
    end_date: date.endDate
  })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    dayData.value = data
    updateDayChart()
  } else {
    ElMessage.error(message || 'get day data failed')
  }
}

// 更新分钟图
const updateMinuteChart = () => {
  // x轴的坐标为当lastMinutes到当前时间的分钟数
  const nowTime = new Date()
  const xAxisTime = [formatDate(nowTime, 'yyyy-mm-dd hh:MM')]
  for (let i = 1; i < lastMinutes.value; i++) {
    const dayTime = new Date(nowTime.getTime() - oneMinute * i)
    xAxisTime.push(formatDate(dayTime, 'yyyy-mm-dd hh:MM'))
  }
  xAxisTime.sort()
  // 获取y轴的数据
  const modelArr = []
  const modelCountObj = {}
  minuteData.value.forEach(item => {
    // 没有model的不记录
    if (item.model) {
      if (!modelArr.includes(item.model)) {
        modelArr.push(item.model)
      }
      if (item.model in modelCountObj) {
        modelCountObj[item.model][item.transform_time] = item.count
      } else {
        modelCountObj[item.model] = {}
        modelCountObj[item.model][item.transform_time] = item.count
      }
    }
  })
  // 填充每一个model的数据
  const modelShowData = {}
  for (const key in modelCountObj) {
    if (!(key in modelShowData)) {
      modelShowData[key] = []
    }
    // 没有的时间线就填充0
    for (const xTime of xAxisTime) {
      if (modelCountObj[key][xTime]) {
        modelShowData[key].push(modelCountObj[key][xTime])
      } else {
        modelShowData[key].push(0)
      }
    }
  }
  const seriesArr = []
  const maxYArr = []
  for (const key in modelShowData) {
    seriesArr.push({
      name: key,
      type: 'line',
      data: modelShowData[key]
    })
    maxYArr.push(Math.max(...modelShowData[key]))
  }
  const maxY = Math.max(...maxYArr) + 10
  // 总数
  const minDataOption = {
    title: { text: 'GPT Requests Num(by minute)' },
    legend: {
      data: modelArr
    },
    xAxis: [
      {
        name: 'minute',
        data: xAxisTime
      }
    ],
    yAxis: [
      {
        min: 0,
        max: maxY
      }
    ],
    series: seriesArr
  }
  minChart.setOption(minDataOption)
}

// 更新天图
const updateDayChart = () => {
  // 计算间隔天数
  const interval = (date.dateArr[1] - date.dateArr[0]) / oneDay
  const xAxisTime = [date.startDate]
  for (let i = 1; i <= interval; i++) {
    const dayTime = new Date(date.dateArr[0].getTime() + oneDay * i)
    xAxisTime.push(formatDate(dayTime, 'yyyy-mm-dd'))
  }
  xAxisTime.sort()
  // 获取y轴的数据
  const modelArr = []
  const modelCountObj = {}
  dayData.value.forEach(item => {
    // 没有model的不记录
    if (item.model) {
      if (!modelArr.includes(item.model)) {
        modelArr.push(item.model)
      }
      if (item.model in modelCountObj) {
        modelCountObj[item.model][item.transform_time] = item.count
      } else {
        modelCountObj[item.model] = {}
        modelCountObj[item.model][item.transform_time] = item.count
      }
    }
  })
  // 填充每一个model的数据
  const modelShowData = {}
  for (const key in modelCountObj) {
    if (!(key in modelShowData)) {
      modelShowData[key] = []
    }
    // 没有的时间线就填充0
    for (const xTime of xAxisTime) {
      if (modelCountObj[key][xTime]) {
        modelShowData[key].push(modelCountObj[key][xTime])
      } else {
        modelShowData[key].push(0)
      }
    }
  }
  const seriesArr = []
  const maxYArr = []
  for (const key in modelShowData) {
    seriesArr.push({
      name: key,
      type: 'line',
      data: modelShowData[key]
    })
    maxYArr.push(Math.max(...modelShowData[key]))
  }
  const maxY = Math.max(...maxYArr) + 100
  // 总数
  const dayDataOption = {
    title: { text: 'GPT Requests Num(by day)' },
    legend: {
      data: modelArr
    },
    xAxis: [
      {
        name: 'day',
        data: xAxisTime
      }
    ],
    yAxis: [
      {
        min: 0,
        max: maxY
      }
    ],
    series: seriesArr
  }
  dayChart.setOption(dayDataOption)
}

// 尺寸适应
const chartAdapter = () => {
  minChart.resize()
  dayChart.resize()
}

const getCurrentDate = () => {
  const today = new Date()
  // 默认获取前一周的数据
  const startTime = today.getTime() - 7 * oneDay
  const endTime = today.getTime()
  date.dateArr[0] = new Date(startTime)
  date.dateArr[1] = new Date(endTime)

  date.startDate = formatDate(date.dateArr[0], 'yyyy-mm-dd')
  date.endDate = formatDate(date.dateArr[1], 'yyyy-mm-dd')
}

const searchMin = () => {
  if (lastMinutes.value <= 0) {
    ElMessage.error('Last Minutes must more than 0')
    return
  }
  getMinStatistic()
}

const searchDay = () => {
  getDayStatistic()
}

// 获取当前时间
getCurrentDate()

onMounted(() => {
  initChart()
  getMinStatistic()
  getDayStatistic()
  // window.addEventListener('resize', chartAdapter)
  // chartAdapter()
  // 监听windows不够，左侧菜单收缩windows大小没有变化，图形也不会resize
  resizeObserver = new ResizeObserver(chartAdapter)
  resizeObserver.observe(document.getElementById('gpt_statistic'))
})

onBeforeUnmount(() => {
  // window.removeEventListener('resize', chartAdapter)
  resizeObserver.disconnect()
  // 销毁实例
  minChart.dispose()
  dayChart.dispose()
})
</script>

<style lang="less">
.my-button {
  margin-left: 5px;
}
</style>
