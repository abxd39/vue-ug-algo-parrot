<template>
    <div style="padding-bottom: 6px">Overview date: {{ period }}</div>
    <div class="category">Production</div>
    <el-row class="asset" :gutter="15">
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Total Services
                    </div>
                </template>
                <div class="card-content"> {{ prodData.totalService}}</div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Total Pods
                    </div>
                </template>
                <div class="card-content"> {{ prodData.totalPod }}</div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Total CPU
                    </div>
                </template>
               <div class="card-content"> {{ prodData.totalCPU }}</div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Total Memory
                    </div>
                </template>
                <div class="card-content"> {{ prodData.totalMemory }} TB</div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Total GPU
                    </div>
                </template>
                <div class="card-content"> {{ prodData.totalGPU }}</div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Total Query
                    </div>
                </template>
                <div class="card-content"> {{ prodData.totalQuery }}</div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Total Cost
                    </div>
                </template>
                <div class="card-content">¥ {{ prodData.totalCost }}</div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Cost Change
                    </div>
                </template>
                <div class="card-content"> {{ prodData.costChange }} %</div>
            </el-card>
        </el-col>
    </el-row>
    <div class="category" style="padding-top: 20px;">Development</div>
    <el-row class="asset" :gutter="15">
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Total Services
                    </div>
                </template>
                <div class="card-content"> {{ devData.totalServiceDev }}</div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Total Pods
                    </div>
                </template>
                <div class="card-content"> {{ devData.totalPodDev }}</div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Total CPU
                    </div>
                </template>
                <div class="card-content"> {{ devData.totalCPUDev }}</div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Total Memory
                    </div>
                </template>
                <div class="card-content"> {{ devData.totalMemoryDev }} TB</div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Total GPU
                    </div>
                </template>
                <div class="card-content"> {{ devData.totalGPUDev }}</div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Total Query
                    </div>
                </template>
                <div class="card-content"> {{ devData.totalQueryDev }}</div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Total Cost
                    </div>
                </template>
                <div class="card-content">¥ {{ devData.totalCostDev }}</div>
            </el-card>
        </el-col>
        <el-col :span="3">
            <el-card :body-style="{ height: '100px', padding: '10px' }" shadow="always">
                <template #header>
                    <div class="card-title">
                        Cost Change
                    </div>
                </template>
                <div class="card-content"> {{ devData.costChangeDev }} %</div>
            </el-card>
        </el-col>
    </el-row>
    <el-divider />
    <div style="padding-top: 15px;">
        <el-date-picker v-model="chartConfig.dateArr" type="daterange" range-separator="To" start-placeholder="Start date" end-placeholder="End date" @change="dateChange" size="large" :clearable="false" />
        <el-select  v-model="chartConfig.dataType" placeholder="Data" size="large" style="padding-left: 6px; padding-bottom: 6px;">
            <el-option label="Service" value="total_service" />
            <el-option label="Pods" value="total_pod" />
            <el-option label="CPU" value="total_cpu" />
            <el-option label="Memory" value="total_memory" />
            <el-option label="GPU" value="total_gpu" />
            <el-option label="Query" value="total_query" />
            <el-option label="Cost" value="total_cost" />
        </el-select>
        <el-button type="primary" class="my-button" @click="search" :disabled="disabled">Search</el-button>
    </div>
    <div v-show="chart.chartShow">
    <div class="category" style="padding-top: 15px;">Production</div>
      <el-card :body-style="{ height: '300px' }" class="asset" shadow="never">
        <div id="prod" style="height: 100%; width: 100%"></div>
      </el-card>
      <div class="category" style="padding-top: 15px;">Development</div>
      <el-card :body-style="{ height: '300px' }" class="asset" shadow="never">
        <div id="dev" style="height: 100%; width: 100%"></div>
      </el-card>
    </div>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, onBeforeMount, onBeforeUnmount } from 'vue'
import { formatDate } from '@/utils/common_utils'
import * as XLSX from 'xlsx'

const dataForm = reactive({
  env: '',
  data:''
})

const { proxy } = getCurrentInstance()
let prodChart, devChart, resizeObserver
const chartConfig = reactive({
  dateArr: [],
  startDate: '',
  endDate: '',
  dataType:'total_service'
})

const chart = reactive({
  chartShow: false
})

const prodData = reactive({
  totalService: 0,
  totalPod: 0,
  totalCPU: 0,
  totalMemory: 0,
  totalGPU: 0,
  totalQuery: 0,
  totalCost: 0,
  costChange: 0
})

const devData = reactive({
  totalServiceDev: '',
  totalPodDev: '',
  totalCPUDev: '',
  totalMemoryDev: '',
  totalGPUDev: '',
  totalQueryDev: '',
  totalCostDev: '',
  costChangeDev: ''
})

const prodDataChart = ref()
const devDataChart = ref()
const period = ref('')

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
  // init chart
  prodChart = proxy.$echarts.init(document.getElementById('prod'))
  devChart = proxy.$echarts.init(document.getElementById('dev'))
  barBaseOption.yAxis = [
    {
      type: 'value',
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
  prodChart.setOption(barBaseOption)
  devChart.setOption(barBaseOption)
}

const dateChange = value => {
  if (value) {
    chartConfig.startDate = formatDate(chartConfig.dateArr[0], 'yyyy-mm-dd')
    chartConfig.endDate = formatDate(chartConfig.dateArr[1], 'yyyy-mm-dd')
  } else {
    chartConfig.startDate = ''
    chartConfig.endDate = ''
  }
}

const getMlflowData = async () => {
  const resp = await proxy.$api.kpi.mlflowOverview()
  // request failed
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    period.value = data.period
    prodData.totalService = data.production.service
    prodData.totalPod = data.production.pod
    prodData.totalCPU = data.production.cpu
    prodData.totalMemory = data.production.memory
    prodData.totalGPU = data.production.gpu
    prodData.totalQuery = data.production.query
    prodData.totalCost = data.production.cost
    prodData.costChange = data.production.cost_change

    devData.totalServiceDev = data.development.service
    devData.totalPodDev = data.development.pod
    devData.totalCPUDev = data.development.cpu
    devData.totalMemoryDev = data.development.memory
    devData.totalGPUDev = data.development.gpu
    devData.totalQueryDev = data.development.query
    devData.totalCostDev = data.development.cost
    devData.costChangeDev = data.development.cost_change
  } else {
    ElMessage.error(message || 'get cv data failed')
  }
}

const getMlflowChartData = async () => {
  const resp = await proxy.$api.kpi.mlflowOverviewChart({ start_date: chartConfig.startDate, end_date: chartConfig.endDate, data_type: chartConfig.dataType })

    // request failed
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    prodDataChart.value = data.production
    devDataChart.value = data.development
    updateChart(chartConfig.dataType)
    chart.chartShow = true
    chartAdapter()
  } else {
    ElMessage.error(message || 'get cv data failed')
  }
}

// update chart data
const updateChart = (dataType) => {
  const prodXAxisData = []
  const prodDataArr = []
  prodDataChart.value.forEach(item => {
    prodXAxisData.push(item.date)
    prodDataArr.push(item.sum)
  })
  const devXAxisData = []
  const devDataArr = []
  devDataChart.value.forEach(item => {
    devXAxisData.push(item.date)
    devDataArr.push(item.sum)
  })
  let dataMin = Math.min(...prodDataArr)
  let dataMax = Math.max(...prodDataArr)
  let chartTitle = ''
  let chartLegend = ''
  let yAxisName = ''
  switch (dataType) {
    case "total_service":
      chartTitle = 'Total Service Deployed(Weekly)'
      chartLegend = 'Total Service'
      yAxisName ='Numbers of Service'
      break;
    case "total_pod":
      chartTitle = 'Total Pod Created (Weekly)'
      chartLegend = 'Total Pod'
      yAxisName = 'Numbers of Pod'
      break;
    case "total_cpu":
      chartTitle = 'Total CPU Requested (Weekly)'
      chartLegend = 'Total CPU'
      yAxisName = 'Core'
      break;
    case "total_memory":
      chartTitle = 'Total Memory Requested (Weekly)'
      chartLegend = 'Total Memory'
      yAxisName = 'TB'
      break;
    case "total_gpu":
      chartTitle = 'Total GPU Requested (Weekly)'
      chartLegend = 'Total GPU'
      yAxisName = 'Card'
      break;
    case "total_query":
      chartTitle = 'Total Query Received (Weekly)'
      chartLegend = 'Total Query'
      yAxisName = 'Numbers of Query'
      break;
    case "total_cost":
      chartTitle = 'Total Cost (Weekly)'
      chartLegend = 'Total Cost'
      yAxisName = '¥'
      break;
    default:
      chartTitle = 'data'
      chartLegend = 'data'
      yAxisName = 'total numbers'
  }
  const prodDataOption = {
    title: { text: chartTitle},
    legend: {
      data: [chartLegend]
    },
    yAxis: [
      {
        name: yAxisName,
        min: 0,
        max: dataMax 
      }
    ],
    xAxis: [
      {
        name: 'date',
        data: prodXAxisData
      }
    ],
    series: [
      {
        name: 'data',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value
          }
        },
        barWidth: '10%',
        data: prodDataArr
      }
    ]
  }
  prodChart.setOption(prodDataOption)

  dataMin = Math.min(...devDataArr)
  dataMax = Math.max(...devDataArr)
  const devDataOption = {
    title: { text: chartTitle },
    legend: {
      data: [chartLegend]
    },
    yAxis: [
      {
        name: yAxisName,
        min:  0,
        max: dataMax
      }
    ],
    xAxis: [
      {
        name: 'date',
        data: devXAxisData
      }
    ],
    series: [
      {
        name: 'data',
        type: 'bar',
        tooltip: {
          valueFormatter: function (value) {
            return value
          }
        },
        barWidth: '10%',
        data: devDataArr
      }
    ]
  }
  devChart.setOption(devDataOption)
}


// adapt window size
const chartAdapter = () => {
  prodChart.resize()
  devChart.resize()
}

const getCurrentDate = () => {
  const today = new Date()
  const days = 24 * 60 * 60 * 1000
  const startTime = today.getTime() - 7 * days
  const endTime = today.getTime() - days
  chartConfig.dateArr[0] = new Date(startTime)
  chartConfig.dateArr[1] = new Date(endTime)

  chartConfig.startDate = formatDate(chartConfig.dateArr[0], 'yyyy-mm-dd')
  chartConfig.endDate = formatDate(chartConfig.dateArr[1], 'yyyy-mm-dd')
}

const search = () => {
  getMlflowChartData()
}

onBeforeMount(() => {
  getCurrentDate()
})

onMounted(() => {
  initChart()
  getMlflowData()
  resizeObserver = new ResizeObserver(chartAdapter)
  resizeObserver.observe(document.getElementById('kpi'))
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
  prodChart.dispose()
  devChart.dispose()
})
</script>


<style lang="less">
.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
  text-align: center;
  color:#7a7a79;
  height: 6px;
}

.card-content {
  font-size: 2.5rem;
  font-weight: bold;
  padding-top: 20px;
  text-align: center;
}

.category
{
  font-size: 1.2rem;
  font-weight: bold;
}

</style>
