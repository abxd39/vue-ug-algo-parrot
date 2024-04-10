<template>
  <el-date-picker v-model="date.dateArr" type="daterange" range-separator="To" start-placeholder="Start date" end-placeholder="End date" @change="dateChange" size="large" :clearable="false" />
  <el-button type="primary" class="my-button" @click="search">Search</el-button>
  <el-card shadow="never" class="asset" style="text-align: center">
    <h4>Services Operation Data(by day)</h4>
    <el-table :data="tableData.service" style="width: 100%" v-loading="loading">
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.children" stripe :ref="props.row.date" height="800">
            <el-table-column prop="service_name" label="service name" width="220" fixed />
            <el-table-column prop="avg_qps" label="avg qps" width="120" sortable />
            <el-table-column prop="max_qps" label="max qps" width="120" sortable />
            <el-table-column prop="err_rate" label="error rate(%)" width="140" sortable />
            <el-table-column prop="avg_latency" label="avg latency(s)" width="150" sortable />
            <el-table-column prop="cpu_usage_rate" label="cpu usage rate(%)" width="170" sortable />
            <el-table-column prop="max_cpu_usage" label="max cpu usage(cores)" width="200" sortable />
            <el-table-column prop="cpu_request" label="cpu request(cores)" width="180" sortable />
            <el-table-column prop="memory_usage_rate" label="memory usage rate(%)" width="200" sortable />
            <el-table-column prop="max_mem_usage" label="max mem usage(GB)" width="190" sortable />
            <el-table-column prop="memory_request" label="memory request(GB)" width="190" sortable />
            <el-table-column prop="gpu_usage" label="gpu usage" width="120" sortable />
            <el-table-column prop="max_gpu_usage" label="max gpu usage" width="150" sortable />
            <el-table-column prop="gpu_request" label="gpu request" width="130" sortable />
            <el-table-column v-if="props.row.date.split('（')[0] == 'OverView'" prop="cost" label="sum cost(￥)" width="140" sortable />
            <el-table-column v-else prop="cost" label="cost(￥)" width="120" sortable />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="date" />
      <el-table-column fixed="right" width="120">
        <template #default="scope">
          <el-button @click="resetDateSort(scope.row.date)">reset</el-button>
        </template>
      </el-table-column>
      <el-table-column fixed="right" width="155">
        <template #default="scope">
          <el-button @click="downloadExcel(scope.row.children, scope.row.date)">download excel</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup>
import { reactive, onMounted, getCurrentInstance, onBeforeMount, ref } from 'vue'
import { formatDate } from '@/utils/common_utils'
import { Big } from 'big.js'
import { ExportExcelFile } from '@/utils/exportExcelFile.js'

const { proxy } = getCurrentInstance()
const date = reactive({
  dateArr: [],
  startDate: '',
  endDate: ''
})

const tableData = reactive({
  //   nlp: [],
  service: []
})
const loading = ref(false)

const dateChange = value => {
  // console.log(value)
  if (value) {
    date.startDate = formatDate(date.dateArr[0], 'yyyy-mm-dd')
    date.endDate = formatDate(date.dateArr[1], 'yyyy-mm-dd')
  } else {
    date.startDate = ''
    date.endDate = ''
  }
}

//所有日期下的overview
const totalView = data => {
  let currentDate = formatDate(date.dateArr[1], 'yyyy-mm-dd')
  const average = {}
  const serviceObj = {}
  data.forEach(item => {
    if (serviceObj[item.service_name]) {
      serviceObj[item.service_name].avg_qps.push(item.avg_qps)
      serviceObj[item.service_name].max_qps.push(item.max_qps)
      serviceObj[item.service_name].err_rate.push(item.err_rate)
      serviceObj[item.service_name].avg_latency.push(item.avg_latency)
      serviceObj[item.service_name].cpu_usage_rate.push(item.cpu_usage_rate)
      serviceObj[item.service_name].max_cpu_usage.push(item.max_cpu_usage)
      serviceObj[item.service_name].memory_usage_rate.push(item.memory_usage_rate)
      serviceObj[item.service_name].max_mem_usage.push(item.max_mem_usage)
      serviceObj[item.service_name].gpu_usage.push(item.gpu_usage)
      serviceObj[item.service_name].max_gpu_usage.push(item.max_gpu_usage)
      serviceObj[item.service_name].cost.push(item.cost)
      //不同服务的当前日期值
      if (item.date === currentDate) {
        serviceObj[item.service_name].memory_request = item.memory_request
        serviceObj[item.service_name].cpu_request = item.cpu_request
        serviceObj[item.service_name].gpu_request = item.gpu_request
      }
    } else {
      serviceObj[item.service_name] = {
        avg_qps: [],
        max_qps: [],
        err_rate: [],
        avg_latency: [],
        cpu_usage_rate: [],
        max_cpu_usage: [],
        cpu_request: 0,
        memory_usage_rate: [],
        max_mem_usage: [],
        memory_request: 0,
        gpu_usage: [],
        max_gpu_usage: [],
        gpu_request: 0,
        cost: []
      }
      serviceObj[item.service_name].avg_qps.push(item.avg_qps)
      serviceObj[item.service_name].max_qps.push(item.max_qps)
      serviceObj[item.service_name].err_rate.push(item.err_rate)
      serviceObj[item.service_name].avg_latency.push(item.avg_latency)
      serviceObj[item.service_name].cpu_usage_rate.push(item.cpu_usage_rate)
      serviceObj[item.service_name].max_cpu_usage.push(item.max_cpu_usage)
      serviceObj[item.service_name].memory_usage_rate.push(item.memory_usage_rate)
      serviceObj[item.service_name].max_mem_usage.push(item.max_mem_usage)
      serviceObj[item.service_name].gpu_usage.push(item.gpu_usage)
      serviceObj[item.service_name].max_gpu_usage.push(item.max_gpu_usage)
      serviceObj[item.service_name].cost.push(item.cost)
      if (item.date === currentDate) {
        serviceObj[item.service_name].memory_request = item.memory_request
        serviceObj[item.service_name].cpu_request = item.cpu_request
        serviceObj[item.service_name].gpu_request = item.gpu_request
      }
    }
  })
  const serviceArr = []
  Object.keys(serviceObj).forEach(item => {
    serviceArr.push(optCalcu(serviceObj[item], item))
  })

  return { date: 'OverView（' + formatDate(date.dateArr[0], 'yyyymmdd') + '～' + formatDate(date.dateArr[1], 'yyyymmdd') + '）', children: serviceArr }
}

const ArraySum = arr => {
  let list = []
  list = Array.from(arr)
  if (list.length === 0) {
    return 0
  }
  var sum = new Big(0)
  for (let i = 0; i < list.length; i++) {
    sum = sum.plus(list[i])
  }
  return Number(sum.toFixed(3))
}

const ArrayMax = arr => {
  let list = []
  list = Array.from(arr)
  if (list.length === 0) {
    return 0
  }
  let max = list[0]
  for (let i = 1; i < list.length; i++) {
    if (list[i] > max) {
      max = list[i]
    }
  }
  return max
}

const ArrayAvg = arr => {
  let list = []
  list = Array.from(arr)
  if (list.length === 0) {
    return 0
  }
  var sum = new Big(0),
    ArrayLen = new Big(0)
  for (var i = 0; i < list.length; i++) {
    if (list[i] != 0) {
      sum = sum.plus(list[i])
      ArrayLen = ArrayLen.plus(1)
    }
  }
  if (sum.eq(0)) {
    return 0
  }
  return Number(sum.div(ArrayLen).toFixed(3))
}

const getServiceData = async () => {
  loading.value = true
  const resp = await proxy.$api.kpi.service({ start_date: date.startDate, end_date: date.endDate })
  // 请求出错
  if (typeof resp === 'string') {
    loading.value = false
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    const serviceObj = {}
    data.forEach(item => {
      if (serviceObj[item.date]) {
        serviceObj[item.date].push({
          service_name: item.service_name,
          avg_qps: item.avg_qps,
          max_qps: item.max_qps,
          err_rate: item.err_rate,
          avg_latency: item.avg_latency,
          cpu_usage_rate: item.cpu_usage_rate,
          max_cpu_usage: item.max_cpu_usage,
          cpu_request: item.cpu_request,
          memory_usage_rate: item.memory_usage_rate,
          max_mem_usage: item.max_mem_usage,
          memory_request: item.memory_request,
          gpu_usage: item.gpu_usage,
          max_gpu_usage: item.max_gpu_usage,
          gpu_request: item.gpu_request,
          cost: item.cost
        })
      } else {
        serviceObj[item.date] = [
          {
            service_name: item.service_name,
            avg_qps: item.avg_qps,
            max_qps: item.max_qps,
            err_rate: item.err_rate,
            avg_latency: item.avg_latency,
            cpu_usage_rate: item.cpu_usage_rate,
            max_cpu_usage: item.max_cpu_usage,
            cpu_request: item.cpu_request,
            memory_usage_rate: item.memory_usage_rate,
            max_mem_usage: item.max_mem_usage,
            memory_request: item.memory_request,
            gpu_usage: item.gpu_usage,
            max_gpu_usage: item.max_gpu_usage,
            gpu_request: item.gpu_request,
            cost: item.cost
          }
        ]
      }
    })
    // 遍历对象
    const serviceArr = []
    //指定日期下的各个服务的overview
    var total = totalView(data)
    total.children.unshift(OverView(total.children))
    serviceArr.push(total)

    Object.keys(serviceObj).forEach(key => {
      serviceObj[key].unshift(OverView(serviceObj[key]))
      serviceArr.push({
        date: key,
        children: serviceObj[key]
      })
    })
    tableData.service = serviceArr
    loading.value = false
  } else {
    loading.value = false
    ElMessage.error(message || 'get service data failed')
  }
}

//单个日期下的overview
const OverView = data => {
  var object = {
    avg_qps: [],
    max_qps: [],
    err_rate: [],
    avg_latency: [],
    cpu_usage_rate: [],
    max_cpu_usage: [],
    cpu_request: [],
    memory_usage_rate: [],
    max_mem_usage: [],
    memory_request: [],
    gpu_usage: [],
    max_gpu_usage: [],
    gpu_request: [],
    cost: []
  }
  data.forEach(item => {
    object.avg_qps.push(item.avg_qps)
    object.max_qps.push(item.max_qps)
    object.err_rate.push(item.err_rate)
    object.avg_latency.push(item.avg_latency)
    object.cpu_usage_rate.push(item.cpu_usage_rate)
    object.max_cpu_usage.push(item.max_cpu_usage)
    object.cpu_request.push(item.cpu_request)
    object.memory_usage_rate.push(item.memory_usage_rate)
    object.max_mem_usage.push(item.max_mem_usage)
    object.memory_request.push(item.memory_request)
    object.gpu_usage.push(item.gpu_usage)
    object.max_gpu_usage.push(item.max_gpu_usage)
    object.gpu_request.push(item.gpu_request)
    object.cost.push(item.cost)
  })
  return optCalcu(object, 'OverView')
}

//计算数组的的和，最大值，平均值
const optCalcu = (object, service_name) => {
  if (service_name == 'OverView') {
    return {
      service_name: service_name,
      avg_qps: ArrayAvg(object.avg_qps),
      max_qps: ArrayMax(object.max_qps),
      err_rate: ArrayAvg(object.err_rate),
      avg_latency: ArrayAvg(object.avg_latency),
      cpu_usage_rate: ArrayAvg(object.cpu_usage_rate),
      max_cpu_usage: ArrayMax(object.max_cpu_usage),
      memory_usage_rate: ArrayAvg(object.memory_usage_rate),
      max_mem_usage: ArrayMax(object.max_mem_usage),
      gpu_usage: ArrayAvg(object.gpu_usage),
      max_gpu_usage: ArrayMax(object.max_gpu_usage),
      cost: ArraySum(object.cost),
      cpu_request: ArraySum(object.cpu_request),
      memory_request: ArraySum(object.memory_request),
      gpu_request: ArraySum(object.gpu_request)
    }
  } else {
    return {
      service_name: service_name,
      avg_qps: ArrayAvg(object.avg_qps),
      max_qps: ArrayMax(object.max_qps),
      err_rate: ArrayAvg(object.err_rate),
      avg_latency: ArrayAvg(object.avg_latency),
      cpu_usage_rate: ArrayAvg(object.cpu_usage_rate),
      max_cpu_usage: ArrayMax(object.max_cpu_usage),
      memory_usage_rate: ArrayAvg(object.memory_usage_rate),
      max_mem_usage: ArrayMax(object.max_mem_usage),
      gpu_usage: ArrayAvg(object.gpu_usage),
      max_gpu_usage: ArrayMax(object.max_gpu_usage),
      cost: ArraySum(object.cost),
      cpu_request: object.cpu_request,
      memory_request: object.memory_request,
      gpu_request: object.gpu_request
    }
  }
}

const getCurrentDate = () => {
  const today = new Date()
  // 默认获取前2天的数据
  const days = 24 * 60 * 60 * 1000
  const startTime = today.getTime() - 7 * days
  const endTime = today.getTime() - days
  date.dateArr[0] = new Date(startTime)
  date.dateArr[1] = new Date(endTime)

  date.startDate = formatDate(date.dateArr[0], 'yyyy-mm-dd')
  date.endDate = formatDate(date.dateArr[1], 'yyyy-mm-dd')
}

const search = () => {
  //   getNlpData()
  getServiceData()
}

// 重置排序
const resetDateSort = date => {
  proxy.$refs[date].clearSort()
}
//Excel数据导出
const downloadExcel = (data, title) => {
  const header = [
    'service_name',
    'avg_qps',
    'max_qps',
    'err_rate',
    'avg_latency',
    'cpu_usage_rate',
    'max_cpu_usage',
    'cpu_request',
    'memory_usage_rate',
    'max_mem_usage',
    'memory_request',
    'gpu_usage',
    'max_gpu_usage',
    'gpu_request',
    'cost'
  ]
  const headerDisplay = {
    service_name: 'service name',
    avg_qps: 'avg qps',
    max_qps: 'max qps',
    err_rate: 'error rate(%)',
    avg_latency: 'avg_latency(s)',
    cpu_usage_rate: 'cpu usage rate(%)',
    max_cpu_usage: 'max cup usage(cores)',
    cpu_request: 'cpu request(cores)',
    memory_usage_rate: 'memory usage rate(%)',
    max_mem_usage: 'max mem usage(GB)',
    memory_request: 'memory request(GB)',
    gpu_usage: 'gpu usage',
    max_gpu_usage: 'max gpu usage',
    gpu_request: 'gpu request',
    cost: 'sum cost(￥)'
  }
  ExportExcelFile(data, title, header, headerDisplay)
}

onBeforeMount(() => {
  // 获取当前时间
  getCurrentDate()
})

onMounted(() => {
  getServiceData()
})
</script>

<style lang="less">
.my-button {
  margin-left: 5px;
}
</style>
