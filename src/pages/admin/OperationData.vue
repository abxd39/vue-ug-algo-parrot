<template>
  <Breadcrumb />
  <div class="outer-box" id="operation_box">
    <el-date-picker v-model="date.dateArr" type="daterange" range-separator="To" start-placeholder="Start date" end-placeholder="End date" @change="dateChange" size="large" :clearable="false" />
    <el-button type="primary" class="my-button" @click="search">Search</el-button>
    <el-card :body-style="{ height: '300px' }" class="asset" shadow="never">
      <div id="operation" style="height: 100%; width: 100%"></div>
    </el-card>
    <el-card :body-style="{ height: '350px' }" class="asset" shadow="never">
      <div id="operation_detail" style="height: 100%; width: 100%"></div>
    </el-card>
    <div class="pvuv">
      <el-card style="text-align: left" shadow="never">
        <h2 style="text-align: center">Indicator Overview</h2>
        <el-table :data="formData" :header-cell-style="headClass" style="width: 100%" v-fit-columns>
          <el-table-column prop="indicator" label="Indicator" />
          <el-table-column prop="thisYear" label="value of this year" />
          <el-table-column prop="currentTime" :label="curentDateLable" />
        </el-table>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, onBeforeMount, onBeforeUnmount } from 'vue'
import { formatDate } from '@/utils/common_utils'
import * as XLSX from 'xlsx'

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'

const { proxy } = getCurrentInstance()
let operationChart, operationDetailChart, resizeObserver
const date = reactive({
  dateArr: [],
  startDate: '',
  endDate: ''
})
const allData = ref()

const formData = ref([])
const curentDateLable = ref('')
const initChart = () => {
  const lineInitOption = {
    title: {
      text: 'PV & UV (by day)',
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
            return `<table border="1" align="center" style="border-collapse: collapse" id="actionTable">${head}${body}</table>`
          },
          contentToOption: function (dom, opt) {
            const et = XLSX.utils.table_to_book(document.getElementById('actionTable'))
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
        name: 'Date',
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
    ],
    yAxis: [
      {
        type: 'value',
        name: 'Operation Data(by day)',
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
  operationChart = proxy.$echarts.init(document.getElementById('operation'))
  operationChart.setOption(lineInitOption)
  // detail
  const detailInitOption = {
    title: {
      text: 'Page Views Rank (top 10)',
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
            return `<table border="1" align="center" style="border-collapse: collapse" id="actionTable">${head}${body}</table>`
          },
          contentToOption: function (dom, opt) {
            const et = XLSX.utils.table_to_book(document.getElementById('actionTable'))
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
        name: 'page',
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
        },
        axisLabel: {
          rotate: 10,
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
      },
      {
        type: 'value',
        name: 'percent',
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
    ],
    grid: {
      bottom: 100
    }
  }
  operationDetailChart = proxy.$echarts.init(document.getElementById('operation_detail'))
  operationDetailChart.setOption(detailInitOption)
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

// 获取网络数据
const getData = async () => {
  const resp = await proxy.$api.permission.operation({ start_date: date.startDate, end_date: date.endDate })
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
    ElMessage.error(message || 'get operation data failed')
  }
}

const getUvPvData = async () => {
  const resp = await proxy.$api.permission.operationData({ start_date: date.startDate, end_date: date.endDate })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, gpt_proxy, bot, mlflow_info, portal, message } = resp.data
  if (ret_code === '0') {
    formatTableData(gpt_proxy, bot, mlflow_info, portal)
  } else {
    ElMessage.error(message || 'get getUvPvData data failed')
  }
}

const formatTableData = (gpt_proxy, bot, mlflow_info, portal) => {
  formData.value = []
  var gpt_obj = {
    indicator: '',
    thisYear: '',
    currentTime: ''
  }
  var tri_obj = {
    indicator: '',
    thisYear: '',
    currentTime: ''
  }
  var portal_obj = {
    indicator: '',
    thisYear: '',
    currentTime: ''
  }
  var mlflow_obj = {
    indicator: '',
    thisYear: '',
    currentTime: ''
  }

  gpt_obj.indicator = 'gpt-proxy'
  gpt_obj.thisYear = 'PV=' + gpt_proxy[0].pv + '\n' + 'UV=' + gpt_proxy[0].uv
  gpt_obj.currentTime = 'PV=' + gpt_proxy[1].pv + '\n' + 'UV=' + gpt_proxy[1].uv
  formData.value.push(gpt_obj)
  tri_obj.indicator = 'tri-terminal'
  var yearData=bot['year'].list
  for (let item of yearData){
    if (item.chat_source==='webot'){
      item.chat_source='wecombot'
    }

    tri_obj.thisYear += item.chat_source+':'+' PV='+item.pv+' UV='+item.uv+'\n'
  }
  //tri_obj.thisYear = 'wecombot: ' + 'PV=' + wecom_bot[0].pv + ' UV=' + wecom_bot[0].uv + '\n' + 'slackbot: ' + 'PV=' + slack_bot[0].pv + ' UV=' + slack_bot[0].uv
  var current = bot['current'].list
  for (let item of current) {
    if (item.chat_source==='webot'){
      item.chat_source='wecombot'
    }
    tri_obj.currentTime += item.chat_source+':' + ' PV= ' + item.pv + ' UV=' + item.uv + '\n'
  }
  //tri_obj.currentTime = 'wecombot: ' + 'PV=' + wecom_bot[1].pv + ' UV=' + wecom_bot[1].uv + '\n' + 'slackbot: ' + 'PV=' + slack_bot[1].pv + ' UV=' + slack_bot[1].uv
  formData.value.push(tri_obj)
  portal_obj.indicator = 'portal platform'
  portal_obj.thisYear = 'PV=' + portal[0].pv + '\n' + 'UV=' + portal[0].uv
  portal_obj.currentTime = 'PV=' + portal[1].pv + '\n' + 'UV=' + portal[1].uv
  formData.value.push(portal_obj)
  mlflow_obj.indicator = 'mlflow'
  mlflow_obj.thisYear = '-'
  mlflow_obj.currentTime = 'servers count:' + mlflow_info.servers_count + '\n' + 'cpu_usage_rate:' + mlflow_info.cpu_usage_rate + '\n' + 'memery_usage_rate:' + mlflow_info.memery_usage_rate
  formData.value.push(mlflow_obj)
  curentDateLable.value = 'value of ' + formatDate(date.dateArr[0], 'yyyymmdd') + '~' + formatDate(date.dateArr[1], 'yyyymmdd')
}

// 更新图标数据
const updateChart = () => {
  const xAxisData = []
  const yPvData = []
  const yUvData = []
  allData.value.total_data.forEach(item => {
    xAxisData.push(item.date)
    yPvData.push(item.pv)
    yUvData.push(item.uv)
  })
  const dataOption = {
    // title: { text: 'New Daily Added Creatives Num(by day)' },
    legend: {
      data: ['uv', 'pv']
    },
    xAxis: [
      {
        data: xAxisData
      }
    ],
    series: [
      {
        name: 'uv',
        type: 'line',
        data: yUvData
      },
      {
        name: 'pv',
        type: 'line',
        data: yPvData
      }
    ]
  }
  operationChart.setOption(dataOption)
  // pv detail数据
  const detailXAxisData = []
  const detailYPvData = []
  const detailYUvData = []
  const detailPercentData = []
  allData.value.table_data.forEach(item => {
    detailXAxisData.push(item.page_name)
    detailYUvData.push(item.uv)
    detailYPvData.push(item.pv)
    detailPercentData.push(item.pv_percentage)
  })
  const detailData = {
    legend: {
      data: ['uv', 'pv', 'pv percentage']
    },
    xAxis: [
      {
        data: detailXAxisData
      }
    ],
    series: [
      {
        name: 'uv',
        type: 'bar',
        yAxisIndex: 0,
        barWidth: '15%',
        data: detailYUvData
      },
      {
        name: 'pv',
        type: 'bar',
        yAxisIndex: 0,
        barWidth: '15%',
        data: detailYPvData
      },
      {
        name: 'pv percentage',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value + '%'
          }
        },
        data: detailPercentData
      }
    ]
  }
  operationDetailChart.setOption(detailData)
}

// 尺寸适应
const chartAdapter = () => {
  operationChart.resize()
  operationDetailChart.resize()
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

const headClass = () => {
  return {
    background: '#FAFAFA',
    color: '#333333',
    fontWeight: 'bold',
    fontSize: '14px'
  }
}

const search = () => {
  getData()
  getUvPvData()
}

onBeforeMount(() => {
  // 获取当前时间
  getCurrentDate()
})

onMounted(() => {
  initChart()
  getData()
  getUvPvData()
  // window.addEventListener('resize', chartAdapter)
  // chartAdapter()
  resizeObserver = new ResizeObserver(chartAdapter)
  resizeObserver.observe(document.getElementById('operation_box'))
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
  // 销毁实例
  operationChart.dispose()
  operationDetailChart.dispose()
})
</script>

<style lang="less" scoped>
.my-button {
  margin-left: 5px;
}

.pvuv {
  :deep(.el-table) {
    .cell {
      white-space: pre-line;
    }
  }
}
</style>
