<template>
  <el-date-picker v-model="date.dateArr" type="daterange" range-separator="To" start-placeholder="Start date" end-placeholder="End date" @change="dateChange" size="large" :clearable="false" />
  <el-button type="primary" class="my-button" @click="search">Search</el-button>
  <el-card :body-style="{ height: '300px' }" class="asset" shadow="never">
    <div id="sum" style="height: 100%; width: 100%"></div>
  </el-card>
  <el-card :body-style="{ height: '300px' }" class="asset" shadow="never">
    <div id="add" style="height: 100%; width: 100%"></div>
  </el-card>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, onBeforeMount, onBeforeUnmount } from 'vue'
import { formatDate } from '@/utils/common_utils'
import * as XLSX from 'xlsx'

const { proxy } = getCurrentInstance()
let sumChart, addChart, resizeObserver
const date = reactive({
  dateArr: [],
  startDate: '',
  endDate: ''
})

const allData = ref()

const initChart = () => {
  const barBaseOption = {
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
      bottom: 5
    },
    toolbox: {
      feature: {
        dataView: {
          show: true,
          readOnly: false,
          lang: ['Data View', 'Close', 'Export For Excel'],
          optionToContent: function (opt) {
            // console.log(opt)
            const xAxisData = opt.xAxis[0].data
            const seriesData = opt.series
            const headItemArr = seriesData.map(item => {
              return `<th style="padding: 5px 20px; text-align: center">${item.name}</th>`
            })
            const headItem = headItemArr.join('')
            const head = `<tr><th style="padding: 5px 20px; text-align: center">date</th>${headItem}</tr>`
            const spendDataArr = seriesData.map(item => item.data)
            const bodyArr = xAxisData.map((item, index) => {
              const innerDataArr = spendDataArr.map(innerItem => {
                return `<td style="padding: 5px 20px; text-align: center">${innerItem[index]}</td>`
              })
              const innerText = innerDataArr.join('')
              return `<tr><td style="padding: 5px 20px; text-align: center">${item}</td>${innerText}</tr>`
            })
            const body = bodyArr.join('')
            return `<table border="1" align="center" style="border-collapse: collapse" id="cvTable">${head}${body}</table>`
          },
          contentToOption: function (dom, opt) {
            const et = XLSX.utils.table_to_book(document.getElementById('cvTable'))
            const today = new Date()
            const dateStr = formatDate(today, 'yyyy-mm-dd')
            const excelNamePre = opt.title[0].text.split(' ').join('_')
            const excelName = `${excelNamePre}(${dateStr}).xlsx`
            XLSX.writeFile(et, excelName)
          }
        },
        saveAsImage: { show: true }
      }
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
        nameLocation: 'start',
        nameGap: 50,
        axisTick: {
          alignWithLabel: true,
          interval: 0
        }
      }
    ]
  }
  // 总数
  sumChart = proxy.$echarts.init(document.getElementById('sum'))
  barBaseOption.yAxis = [
    {
      type: 'value',
      name: 'the sum num',
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
  sumChart.setOption(barBaseOption)
  // 新增
  addChart = proxy.$echarts.init(document.getElementById('add'))
  barBaseOption.yAxis = [
    {
      type: 'value',
      name: 'the new add num',
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
    },
    {
      type: 'value',
      name: 'success rate',
      nameTextStyle: {
        color: '#303133',
        fontStyle: 'italic',
        fontSize: 13,
        padding: 5
      },
      splitLine: { show: false },
      axisLabel: {
        formatter: '{value}%'
      }
    }
  ]
  addChart.setOption(barBaseOption)
}

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

const getCvData = async () => {
  const resp = await proxy.$api.kpi.cv({ start_date: date.startDate, end_date: date.endDate })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    allData.value = data
    updateChart()
  } else {
    ElMessage.error(message || 'get cv data failed')
  }
}

// 更新图标数据
const updateChart = () => {
  const xAxisData = []
  const sumArr = []
  const newAddArr = []
  const successRate = []
  allData.value.forEach(item => {
    xAxisData.push(item.date)
    sumArr.push(item.sum)
    newAddArr.push(item.new_add)
    successRate.push(item.success_rate)
  })
  const sumMin = Math.min(...sumArr)
  const sumMax = Math.max(...sumArr)
  // 总数
  const sumDataOption = {
    title: { text: 'Total Creatives Num(by day)' },
    legend: {
      data: ['sum']
    },
    yAxis: [
      {
        min: sumMin - 100 > 0 ? sumMin - 100 : 0,
        max: sumMax + 100
      }
    ],
    xAxis: [
      {
        name: 'date',
        data: xAxisData
      }
    ],
    series: [
      {
        name: 'sum',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value
          }
        },
        barWidth: '10%',
        data: sumArr
      }
    ]
  }
  sumChart.setOption(sumDataOption)
  // 新增
  const newAddMin = Math.min(...newAddArr)
  const newAddMax = Math.max(...newAddArr)
  const successRateMin = Math.min(...successRate)
  const successRateMax = Math.max(...successRate)
  const addDataOption = {
    title: { text: 'New Daily Added Creatives Num(by day)' },
    legend: {
      data: ['new_add', 'success_rate']
    },
    xAxis: [
      {
        name: 'date',
        data: xAxisData
      }
    ],
    yAxis: [
      {
        min: newAddMin - 50 > 0 ? newAddMin - 50 : 0,
        max: newAddMax + 50
      },
      {
        min: successRateMin - 5 > 0 ? successRateMin - 5 : 0,
        max: successRateMax + 5 < 100 ? successRateMax + 5 : 100
      }
    ],
    series: [
      {
        name: 'new_add',
        type: 'bar',
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: function (value) {
            return value
          }
        },
        barWidth: '10%',
        data: newAddArr
      },
      {
        name: 'success_rate',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value + '%'
          }
        },
        data: successRate
      }
    ]
  }
  addChart.setOption(addDataOption)
}

// 尺寸适应
const chartAdapter = () => {
  sumChart.resize()
  addChart.resize()
}

const getCurrentDate = () => {
  const today = new Date()
  // 默认获取前一天的数据
  const days = 24 * 60 * 60 * 1000
  const startTime = today.getTime() - 7 * days
  const endTime = today.getTime() - days
  date.dateArr[0] = new Date(startTime)
  date.dateArr[1] = new Date(endTime)

  date.startDate = formatDate(date.dateArr[0], 'yyyy-mm-dd')
  date.endDate = formatDate(date.dateArr[1], 'yyyy-mm-dd')
}

const search = () => {
  getCvData()
}

onBeforeMount(() => {
  // 获取当前时间
  getCurrentDate()
})

onMounted(() => {
  initChart()
  getCvData()
  // window.addEventListener('resize', chartAdapter)
  // chartAdapter()
  // 监听windows不够，左侧菜单收缩windows大小没有变化，图形也不会resize
  resizeObserver = new ResizeObserver(chartAdapter)
  resizeObserver.observe(document.getElementById('kpi'))
})

onBeforeUnmount(() => {
  // window.removeEventListener('resize', chartAdapter)
  resizeObserver.disconnect()
  // 销毁实例
  sumChart.dispose()
  addChart.dispose()
})
</script>

<style lang="less">
.my-button {
  margin-left: 5px;
}
</style>
