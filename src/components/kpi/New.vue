<template>
  <el-select v-model="select" placeholder="Select Quarter" size="large" @change="selectChange">
    <el-option v-for="item in allData.quarterArr" :key="item.value" :label="item.label" :value="item.value" />
  </el-select>
  <el-row class="asset" :gutter="15">
    <el-col :span="12">
      <el-card :body-style="{ height: '300px', padding: '10px' }" shadow="never">
        <div id="spendPieChart" style="height: 100%; width: 100%"></div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card :body-style="{ height: '300px', padding: '10px' }" shadow="never">
        <div id="spendChart" style="height: 100%; width: 100%"></div>
      </el-card>
    </el-col>
  </el-row>

  <el-row class="asset" :gutter="15">
    <el-col :span="12">
      <el-card :body-style="{ height: '300px', padding: '10px' }" shadow="never">
        <div id="cprD2Chart" style="height: 100%; width: 100%"></div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card :body-style="{ height: '300px', padding: '10px' }" shadow="never">
        <div id="cprD7Chart" style="height: 100%; width: 100%"></div>
      </el-card>
    </el-col>
  </el-row>
  <el-row class="asset" :gutter="15">
    <el-col :span="12">
      <el-card :body-style="{ height: '300px', padding: '10px' }" shadow="never">
        <div id="roiD2Chart" style="height: 100%; width: 100%"></div>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card :body-style="{ height: '300px', padding: '10px' }" shadow="never">
        <div id="roiD7Chart" style="height: 100%; width: 100%"></div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref, onBeforeMount, onMounted, getCurrentInstance, onBeforeUnmount } from 'vue'
import * as XLSX from 'xlsx'
import { formatDate, formatValue } from '@/utils/common_utils'

const { proxy } = getCurrentInstance()
const select = ref('')
const allData = reactive({
  allSelect: [],
  quarterArr: [],
  statis: []
})
let spendPieChart, spendChart, cprD2Chart, cprD7Chart, roiD2Chart, roiD7Chart, resizeObserver

const initChart = () => {
  // 饼图
  spendPieChart = proxy.$echarts.init(document.getElementById('spendPieChart'))
  const pieInitOption = {
    title: {
      text: 'new install spend',
      textAlign: 'center',
      left: '50%'
    },
    tooltip: {
      trigger: 'item'
    },
    toolbox: {
      feature: {
        dataView: {
          show: true,
          readOnly: false,
          lang: ['Data View', 'Close', 'Export For Excel'],
          optionToContent: function (opt) {
            const head = '<tr><th style="padding: 5px 20px; text-align: center">classify</th><th style="padding: 5px 20px; text-align: center">spend</th></tr>'
            const bodyArr = opt.series[0].data.map(item => {
              return `<tr><td style="padding: 5px 20px; text-align: center">${item.name}</td><td style="padding: 5px 20px; text-align: center">${item.value}</td></tr>`
            })
            const body = bodyArr.join('')
            return `<table border="1" align="center" style="border-collapse: collapse" id="pieSpendTable">${head}${body}</table>`
          },
          contentToOption: function (dom, opt) {
            const et = XLSX.utils.table_to_book(document.getElementById('pieSpendTable'))
            const today = new Date()
            const dateStr = formatDate(today, 'yyyy-mm-dd')
            const excelName = `spend(${dateStr}).xlsx`
            XLSX.writeFile(et, excelName)
          }
        },
        // restore: { show: true },
        saveAsImage: { show: true }
      }
    },
    legend: {
      bottom: 5
    },
    series: [
      {
        type: 'pie',
        label: {
          formatter: function (arg) {
            // console.log(arg)
            return arg.name + '(' + arg.percent + '%' + ')'
          }
        },
        // 饼图的设置
        // radius: 40,  // 半径
        radius: '60%', // 百分比参照的是宽度和高度中较小的那一方的一半来进行百分比设置
        // 圆环的设置
        // radius : ['50%', '75%'],  // 第0个元素表示内圆的半径，第1个元素表示外圆的半径
        // 选中效果
        selectedMode: 'single' // 选中后将会偏离原心一小段距离
      }
    ]
  }
  spendPieChart.setOption(pieInitOption)
  // 直方图
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
    grid: {
      // show: true,
      // 解决坐标系左边文字被隐藏掉了
      left: 80
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
            const head = `<tr><th style="padding: 5px 20px; text-align: center">game</th>${headItem}</tr>`
            const spendDataArr = seriesData.map(item => item.data)
            const bodyArr = xAxisData.map((item, index) => {
              const innerDataArr = spendDataArr.map(innerItem => {
                return `<td style="padding: 5px 20px; text-align: center">${innerItem[index]}</td>`
              })
              const innerText = innerDataArr.join('')
              return `<tr><td style="padding: 5px 20px; text-align: center">${item}</td>${innerText}</tr>`
            })
            const body = bodyArr.join('')
            const domId = opt.title[0].text.split(' ').join('_')
            return `<table border="1" align="center" style="border-collapse: collapse" id="${domId}">${head}${body}</table>`
          },
          contentToOption: function (dom, opt) {
            const domId = opt.title[0].text.split(' ').join('_')
            const et = XLSX.utils.table_to_book(document.getElementById(domId))
            const today = new Date()
            const dateStr = formatDate(today, 'yyyy-mm-dd')
            const excelName = `${domId}(${dateStr}).xlsx`
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
        nameGap: 30,
        axisTick: {
          alignWithLabel: true,
          interval: 0
        },
        axisLabel: {
          rotate: 15,
          margin: 10
        }
      }
    ]
  }
  spendChart = proxy.$echarts.init(document.getElementById('spendChart'))
  barBaseOption.yAxis = [
    {
      type: 'value',
      name: 'money',
      nameTextStyle: {
        color: '#303133',
        fontStyle: 'italic',
        fontSize: 13,
        padding: 5
      },
      // 是否显示坐标轴轴线
      // axisLine: { show: true },
      // 是否显示坐标轴分隔线
      splitLine: { show: false },
      axisLabel: {
        formatter: '${value}'
      }
    },
    {
      type: 'value',
      name: 'rate',
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
  spendChart.setOption(barBaseOption)
  // cpr
  cprD2Chart = proxy.$echarts.init(document.getElementById('cprD2Chart'))
  cprD7Chart = proxy.$echarts.init(document.getElementById('cprD7Chart'))
  barBaseOption.yAxis = [
    {
      type: 'value',
      name: 'cpr',
      nameTextStyle: {
        color: '#303133',
        fontStyle: 'italic',
        fontSize: 13,
        padding: 5
      },
      splitLine: { show: false },
      axisLabel: {
        formatter: '${value}'
      }
    },
    {
      type: 'value',
      name: 'rate',
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
  cprD2Chart.setOption(barBaseOption)
  cprD7Chart.setOption(barBaseOption)
  // roi
  roiD2Chart = proxy.$echarts.init(document.getElementById('roiD2Chart'))
  roiD7Chart = proxy.$echarts.init(document.getElementById('roiD7Chart'))
  barBaseOption.yAxis = [
    {
      type: 'value',
      name: 'roi',
      nameTextStyle: {
        color: '#303133',
        fontStyle: 'italic',
        fontSize: 13,
        padding: 5
      },
      splitLine: { show: false },
      axisLabel: {
        formatter: '${value}'
      }
    },
    {
      type: 'value',
      name: 'rate',
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
  roiD2Chart.setOption(barBaseOption)
  roiD7Chart.setOption(barBaseOption)
}

// 获取季度列表
const getQuarter = async () => {
  const resp = await proxy.$api.kpi.newQuarter({})
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
  const resp = await proxy.$api.kpi.new({ statis_date: select.value })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    allData.statis = data
    updateChart()
  } else {
    ElMessage.error(message || 'get statis data failed')
  }
}

// 更新图标数据
const updateChart = () => {
  // 更新饼图数据
  const pieLegend = []
  const pieData = []
  Object.keys(allData.statis.spend_total).forEach(key => {
    pieLegend.push(key)
    pieData.push({
      name: key,
      value: allData.statis.spend_total[key]
    })
  })
  const pieDataOption = {
    legend: {
      data: pieLegend
    },
    series: [
      {
        data: pieData
      }
    ]
  }
  spendPieChart.setOption(pieDataOption)
  // 更新spend直方图数据
  const spendXAxisData = []
  const algoArr = []
  const othersArr = []
  const rateArr = []
  allData.statis.spend.forEach(item => {
    spendXAxisData.push(item.game_code)
    algoArr.push(item.algo)
    othersArr.push(item.others)
    rateArr.push(item.rate)
  })
  const spendDataOption = {
    title: { text: 'new install spend by games' },
    legend: {
      data: ['algo', 'others', 'rate']
    },
    color: ['#de6e6a', '#85bedb', '#59a076'],
    xAxis: [
      {
        name: 'game',
        data: spendXAxisData
      }
    ],
    series: [
      {
        name: 'algo',
        type: 'bar',
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: function (value) {
            return formatValue(value)
          }
        },
        barWidth: '15%',
        data: algoArr
      },
      {
        name: 'others',
        type: 'bar',
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: function (value) {
            return formatValue(value)
          }
        },
        barWidth: '15%',
        data: othersArr
      },
      {
        name: 'rate',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value + '%'
          }
        },
        data: rateArr
      }
    ]
  }
  spendChart.setOption(spendDataOption)
  // 更新cpr直方图
  const cprXAxisData = []
  const d2CprAlgoArr = []
  const d7CprAlgoArr = []
  const d2CprOthersArr = []
  const d7CprOthersArr = []
  const d2CprRateArr = []
  const d7CprRateArr = []
  allData.statis.retention_cpr.forEach(item => {
    cprXAxisData.push(item.game_code)
    d2CprAlgoArr.push(item.d2_algo)
    d7CprAlgoArr.push(item.d7_algo)
    d2CprOthersArr.push(item.d2_others)
    d7CprOthersArr.push(item.d7_others)
    d2CprRateArr.push(item.d2_rate)
    d7CprRateArr.push(item.d7_rate)
  })
  const cprD2Data = {
    title: { text: 'new install retention cost by games(d2)' },
    legend: {
      data: ['d2_algo_cpr', 'd2_others_cpr', 'd2_rate_cpr']
    },
    xAxis: [
      {
        name: 'game',
        data: cprXAxisData
      }
    ],
    series: [
      {
        name: 'd2_algo_cpr',
        type: 'bar',
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: function (value) {
            return formatValue(value)
          }
        },
        barWidth: '15%',
        data: d2CprAlgoArr
      },
      {
        name: 'd2_others_cpr',
        type: 'bar',
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: function (value) {
            return formatValue(value)
          }
        },
        barWidth: '15%',
        data: d2CprOthersArr
      },
      {
        name: 'd2_rate_cpr',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value + '%'
          }
        },
        data: d2CprRateArr
      }
    ]
  }
  cprD2Chart.setOption(cprD2Data)
  const cprD7Data = {
    title: { text: 'new install retention cost by games(d7)' },
    legend: {
      data: ['d7_algo_cpr', 'd7_others_cpr', 'd7_rate_cpr']
    },
    color: ['#de6e6a', '#85bedb', '#59a076'],
    xAxis: [
      {
        name: 'game',
        data: cprXAxisData
      }
    ],
    series: [
      {
        name: 'd7_algo_cpr',
        type: 'bar',
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: function (value) {
            return formatValue(value)
          }
        },
        barWidth: '15%',
        data: d7CprAlgoArr
      },
      {
        name: 'd7_others_cpr',
        type: 'bar',
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: function (value) {
            return formatValue(value)
          }
        },
        barWidth: '15%',
        data: d7CprOthersArr
      },
      {
        name: 'd7_rate_cpr',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value + '%'
          }
        },
        data: d7CprRateArr
      }
    ]
  }
  cprD7Chart.setOption(cprD7Data)
  // 更新roi直方图
  const roiXAxisData = []
  const d2RoiAlgoArr = []
  const d7RoiAlgoArr = []
  const d2RoiOthersArr = []
  const d7RoiOthersArr = []
  const d2RoiRateArr = []
  const d7RoiRateArr = []
  allData.statis.retention_roi.forEach(item => {
    roiXAxisData.push(item.game_code)
    d2RoiAlgoArr.push(item.d2_algo)
    d7RoiAlgoArr.push(item.d7_algo)
    d2RoiOthersArr.push(item.d2_others)
    d7RoiOthersArr.push(item.d7_others)
    d2RoiRateArr.push(item.d2_rate)
    d7RoiRateArr.push(item.d7_rate)
  })
  const roiD2Data = {
    title: { text: 'new install retention ROI by games(d2)' },
    legend: {
      data: ['d2_algo_roi', 'd2_others_roi', 'd2_rate_roi']
    },
    xAxis: [
      {
        name: 'game',
        data: roiXAxisData
      }
    ],
    series: [
      {
        name: 'd2_algo_roi',
        type: 'bar',
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: function (value) {
            return formatValue(value)
          }
        },
        barWidth: '15%',
        data: d2RoiAlgoArr
      },
      {
        name: 'd2_others_roi',
        type: 'bar',
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: function (value) {
            return formatValue(value)
          }
        },
        barWidth: '15%',
        data: d2RoiOthersArr
      },
      {
        name: 'd2_rate_roi',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value + '%'
          }
        },
        data: d2RoiRateArr
      }
    ]
  }
  roiD2Chart.setOption(roiD2Data)
  const roiD7Data = {
    title: { text: 'new install retention ROI by games(d7)' },
    legend: {
      data: ['d7_algo_roi', 'd7_others_roi', 'd7_rate_roi']
    },
    color: ['#de6e6a', '#85bedb', '#59a076'],
    xAxis: [
      {
        name: 'game',
        data: roiXAxisData
      }
    ],
    series: [
      {
        name: 'd7_algo_roi',
        type: 'bar',
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: function (value) {
            return formatValue(value)
          }
        },
        barWidth: '15%',
        data: d7RoiAlgoArr
      },
      {
        name: 'd7_others_roi',
        type: 'bar',
        yAxisIndex: 0,
        tooltip: {
          valueFormatter: function (value) {
            return formatValue(value)
          }
        },
        barWidth: '15%',
        data: d7RoiOthersArr
      },
      {
        name: 'd7_rate_roi',
        type: 'line',
        yAxisIndex: 1,
        tooltip: {
          valueFormatter: function (value) {
            return value + '%'
          }
        },
        data: d7RoiRateArr
      }
    ]
  }
  roiD7Chart.setOption(roiD7Data)
}

// 选中值发生改变时
const selectChange = () => {
  getData()
  allData.quarterArr = allData.allSelect.filter(item => {
    return item.value !== select.value
  })
}

// 尺寸适应
const chartAdapter = () => {
  // const baseNum = document.body.clientWidth / 100
  // const adaptOption = {}
  spendPieChart.resize()
  spendChart.resize()
  cprD2Chart.resize()
  roiD2Chart.resize()
  cprD7Chart.resize()
  roiD7Chart.resize()
}

onBeforeMount(() => {
  getQuarter()
})

onMounted(() => {
  initChart()
  getData()
  // 监听事件
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
  spendPieChart.dispose()
  spendChart.dispose()
  cprD2Chart.dispose()
  roiD2Chart.dispose()
  cprD7Chart.dispose()
  roiD7Chart.dispose()
})
</script>
