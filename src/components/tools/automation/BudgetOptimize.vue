<template>
  <el-card :body-style="{ height: '300px', padding:'0px', margin:'0px'}" class="asset" shadow="never" id="optimizeBudget">
    <div v-if="chartDisplay" id="chart-container" style="height: 100%; width: 100%"></div>
  </el-card>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance, onBeforeMount, onBeforeUnmount, computed } from 'vue'
import { campainTypeArr, openidArr, targetArr, trackingBasisArr, countryArr, constraintTempArr } from './data'

const { proxy } = getCurrentInstance()
let option, myChart, resizeObserver
const chartDisplay = ref(true)
const originalRate = ref([])
let budgetRate = []
let budgetMap = new Map()
let optimizeMap = new Map()
const optRate = []
const intStr = ['Installs', 'Budget', 'CPI', 'Registers', 'CPR', 'Cost Per D1 Retention', 'Cost Per D2 Retention', 'Cost Per D14 Retention','Reattributions']
var Yname = 'Cost Per D2 Retention'

const props = defineProps({
  xaxisData: {
    type: Array
  },
  yaxisData: {
    type: Array
  }
})

//option
const budgetOption = {
  title: {
    text: ''
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['original', 'opt']
  },
  grid: {
    left: '3%',
    right: '3%',
    bottom: '1%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: true,
    name: 'Budget',
    axisTick: {
      interval: 1,
      show: true
    },
    axisLabel: {
      show: true,
      formatter: function (value, index) {
        return '' + value
      }
    },

    //data: ['Budget 10','Budget 200', 'Budget 600', 'Budget 700',  'Budget 900', 'Budget 1000', 'Budget 2000'],
    //data:xDataBudget,
    interval: 3,

    nameTextStyle: {
      color: '#303133',
      fontStyle: 'italic',
      fontSize: 13,
      padding: 0
    }
  },
  yAxis: {
    type: 'value',
    name: Yname,
    scale: true,
    nameTextStyle: {
      color: '#303133',
      fontStyle: 'italic',
      fontSize: 13,
      padding: 10,
      align: 'center'
    }
  },
  series: [
    {
      name: 'original',
      type: 'line',
      tooltip: {
        valueFormatter: function (value) {
          return value
        }
      }
    },
    {
      name: 'opt',
      type: 'line',
      tooltip: {
        valueFormatter: function (value) {
          return value
        }
      }
    }
  ]
}

const initMyChart = () => {
  var chartDom = document.getElementById('chart-container')
  myChart = proxy.$echarts.init(chartDom)
  myChart.setOption(budgetOption)
}

const chartAdapter = () => {
  myChart.resize()
}
var compare = function (x, y) {
  //比较函数
  if (x < y) {
    return -1
  } else if (x > y) {
    return 1
  } else {
    return 0
  }
}

const InitEchart = async (adjustArr, target) => {
  chartDisplay.value = true
  var targetStr
  myChart.showLoading()
  for (const item of targetArr) {
    if (item.value == target) {
      targetStr = item.label
    }
  }
  //数据填充
  for (const item of adjustArr) {
    if (!budgetMap.has(item.budget)) {
      budgetMap.set(item.budget)
      budgetRate.push(item.budget)
    }
  }
  //小到大排序
  budgetRate.sort(compare)

  for (const item of targetArr) {
    if (item.value == target) {
      targetStr = item.label
    }
  }

  for (const item of adjustArr) {
    switch (target) {
      case 1:
        conmmon(item, item.installs)
        break
      case 2:
        conmmon(item, item.cpi)
        break
      case 3:
        conmmon(item, item.registers)
        break
      case 4:
        conmmon(item, item.reattributions)
        break
      case 5:
        conmmon(item, item.cpr)
        break
      case 6:
        break
      case 7:
        conmmon(item, item.cohort_register_rate)
        break
      case 8:
        conmmon(item, item.d1_cohort_register_rate)
        break
      case 9:
        conmmon(item, item.d1_retention_rate)
        break
      case 10:
        conmmon(item, item.d2_retention_rate)
        break
      case 11:
        conmmon(item, item.d7_retention_rate)
        break
      case 12:
        conmmon(item, item.d14_retention_rate)
        break
      case 13:
        conmmon(item, item.d1_roas)
        break
      case 14:
        conmmon(item, item.d2_roas)
        break
      case 15:
        conmmon(item, item.d3_roas)
        break
      case 16:
        conmmon(item, item.d7_roas)
        break
      case 17:
        conmmon(item, item.d14_roas)
        break
      case 18:
        conmmon(item, item.cost_per_d1_retention)
        break
      case 19:
        conmmon(item, item.cost_per_d2_retention)
        break
      case 20:
        conmmon(item, item.cost_per_d7_retention)
        break
      case 21:
        conmmon(item, item.cost_per_d14_retention)
        break
      case 22:
        conmmon(item, item.budget)
        break
      default:
    }
  }
  //initMyChart()

  const xDataBudget = []
  const yDataOpt = []
  const yDataOri = []
  budgetRate.forEach(item => {
    xDataBudget.push(item)
    yDataOpt.push(optimizeMap.get(item).opt)
    yDataOri.push(optimizeMap.get(item).original)
  })
  budgetOption.yAxis.name = targetStr
  budgetOption.xAxis.data = xDataBudget
  budgetOption.series[0].data = yDataOri
  budgetOption.series[1].data = yDataOpt
  if (intStr.includes(targetStr)) {
  } else {
    var formatterfunction = function (value) {
      return value + '%'
    }
    budgetOption.series[1].tooltip.valueFormatter = formatterfunction
    budgetOption.series[0].tooltip.valueFormatter = formatterfunction
  }

  myChart.hideLoading()
  myChart.setOption(budgetOption)
}

const conmmon = (item, value) => {
  var formatValue = ''
  var opt, original
  if (value != '' && value != null && value != undefined) {
    formatValue = value.toString().replace('%', '')
  }
  if (item.object == 'opt') {
    opt = formatValue
  }
  if (item.object == 'original') {
    original = formatValue
  }
  if (optimizeMap.has(item.budget)) {
    var object = optimizeMap.get(item.budget)
    if (item.object == 'opt') {
      object.opt = formatValue
    }
    if (item.object == 'original') {
      object.original = formatValue
    }
    optimizeMap.set(item.budget, object)
  } else {
    var budgetKey = {
      original: original,
      budget: item.budget,
      opt: opt
    }
    optimizeMap.set(item.budget, budgetKey)
  }
}

onMounted(() => {
  initMyChart()

  // 监听windows不够，左侧菜单收缩windows大小没有变化，图形也不会resize
  //window.addEventListener('resize', myChart.resize);
  resizeObserver = new ResizeObserver(chartAdapter)
  resizeObserver.observe(document.getElementById('optimizeBudget'))
})
onBeforeUnmount(() => {
  // window.removeEventListener('resize', chartAdapter)
  resizeObserver.disconnect()
  // 销毁实例
  myChart.dispose()
})

defineExpose({
  InitEchart
})
</script>
<style scoped>
#chart-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
}
</style>
