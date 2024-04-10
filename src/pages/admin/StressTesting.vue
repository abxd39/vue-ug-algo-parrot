<template>
  <Breadcrumb />
  <div class="outer-box">
    <div style="color: #73767a">
      <div class="stress-search">
        <span>Status </span>
        <el-select v-model="queryInfo.status" size="large">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="stress-search" style="margin-left: 20px">
        <span>Date </span>
        <el-date-picker v-model="dateArr" type="daterange" range-separator="To" start-placeholder="Start date" end-placeholder="End date" size="large" :clearable="false" @change="dateChange" />
      </div>
      <el-button type="primary" @click="searchTest" style="height: 38px; margin-left: 10px">Search</el-button>
    </div>

    <el-card shadow="hover" class="permission-data">
      <el-table :data="result.tableData" style="width: 100%" stripe v-loading="loading">
        <el-table-column type="index" :index="indexMethod" />
        <el-table-column prop="create_time" label="Create Time" width="160" />
        <el-table-column prop="user_name" label="User Name" width="150" />
        <el-table-column prop="service_name" label="Service Name" width="200" />
        <el-table-column prop="url" label="URL" width="400" />
        <el-table-column prop="con_num" label="Concurrency Num" width="150" />
        <el-table-column prop="duration_time" label="Duration Time(min)" width="160" />
        <el-table-column prop="status" label="Status" width="150">
          <template #default="scope">
            <el-tag :type="scope.row.status.type" size="small">{{ scope.row.status.statusStr }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <el-button type="primary" plain @click="showDetail(scope.row.detail)" link size="small">show detail...</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination background layout="prev, pager, next" :total="result.total" :page-size="queryInfo.pagesize" :currentPage="queryInfo.pagenum" @current-change="currentChange" />
  </div>
  <el-drawer v-model="drawer" title="Stress Testing Detail" direction="rtl" size="50%">
    <el-descriptions title="Raw Info" :column="1" border size="small">
      <el-descriptions-item label="Service Name">{{ result.rawInfo.service_name }}</el-descriptions-item>
      <el-descriptions-item label="URL">{{ result.rawInfo.url }}</el-descriptions-item>
      <el-descriptions-item label="Protocol">{{ result.rawInfo.protocol }}</el-descriptions-item>
      <el-descriptions-item label="Headers" v-if="result.rawInfo.headers.length">
        <el-table :data="result.rawInfo.headers">
          <el-table-column prop="key" label="key" />
          <el-table-column prop="value" label="value" />
        </el-table>
      </el-descriptions-item>
      <el-descriptions-item :label="index === 0 ? 'Body' : ''" v-for="(item, index) in result.rawInfo.body" :key="index">
        <v-ace-editor
          v-model:value="result.rawInfo.body[index]"
          lang="json"
          :theme="aceResultConfig.theme"
          :options="aceResultConfig.options"
          :readonly="aceResultConfig.readOnly"
          style="height: 100px; width: 50%"
          class="ace-editor"
        />
      </el-descriptions-item>
      <el-descriptions-item label="Concurrency Num">{{ result.rawInfo.con_num }}</el-descriptions-item>
      <el-descriptions-item label="Duration Time(min)">{{ result.rawInfo.duration_time }}</el-descriptions-item>
      <el-descriptions-item label="Status">
        <el-tag :type="statusMap[result.rawInfo.status][1]">{{ statusMap[result.rawInfo.status][0] }}</el-tag>
      </el-descriptions-item>
    </el-descriptions>
    <div style="width: 100%; height: 10px"></div>
    <el-divider />
    <el-descriptions title="Stress Result" :column="2" border size="small">
      <el-descriptions-item label="Success Rate(%)">{{ result.stressResult.success_rate }}</el-descriptions-item>
      <el-descriptions-item label="Avg Latency(ms)">{{ result.stressResult.avg_latency }}</el-descriptions-item>
      <el-descriptions-item label="Max Latency(ms)">{{ result.stressResult.max_latency }}</el-descriptions-item>
      <el-descriptions-item label="Min Latency(ms)">{{ result.stressResult.min_latency }}</el-descriptions-item>
      <el-descriptions-item label="QPS" :span="2">{{ result.stressResult.qps }}</el-descriptions-item>
      <el-descriptions-item label="P95" :span="2">{{ result.stressResult.p95 }}</el-descriptions-item>
      <el-descriptions-item label="P99" :span="2">{{ result.stressResult.p99 }}</el-descriptions-item>
      <el-descriptions-item label="Err Info">
        <p v-for="(item, index) in result.stressResult.err_info" :key="index" style="text-indent: 24px; color: #f56c6c; margin: 3px 0">{{ item }}</p>
        <!-- <ul class="temp-ul">
          <li v-for="(item, index) in result.stressResult.err_info" :key="index">{{ item }}</li>
        </ul> -->
      </el-descriptions-item>
    </el-descriptions>
  </el-drawer>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, onBeforeMount } from 'vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import { VAceEditor } from 'vue3-ace-editor'
import ace from 'ace-builds'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/ext-language_tools'

import { formatDate } from '@/utils/common_utils'

const statusOptions = [
  {
    label: 'waiting',
    value: 1
  },
  {
    label: 'running',
    value: 2
  },
  {
    label: 'success',
    value: 3
  },
  {
    label: 'terminated',
    value: 4
  },
  {
    label: 'failed',
    value: 5
  },
  {
    label: 'all',
    value: 0
  }
]
// 日期
const dateArr = ref([])
const queryInfo = reactive({
  status: 0,
  pagenum: 1,
  pagesize: 10,
  start_date: '',
  end_date: ''
})
const { proxy } = getCurrentInstance()
const result = reactive({
  total: 0,
  tableData: [],
  rawInfo: {},
  stressResult: {}
})

const drawer = ref(false)
const loading = ref(false)

const indexMethod = index => {
  return index + 1 + (queryInfo.pagenum - 1) * queryInfo.pagesize
}

const statusMap = {
  1: ['waiting', 'info'],
  2: ['running', ''],
  3: ['success', 'success'],
  4: ['terminated', 'danger'],
  5: ['failed', 'danger']
}

const aceResultConfig = reactive({
  theme: 'chrome', //主题
  readOnly: true, //是否只读
  options: {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    tabSize: 2,
    showPrintMargin: false,
    fontSize: 12
  }
})

// 日期变化
const dateChange = value => {
  // console.log(value)
  if (value) {
    queryInfo.start_date = formatDate(value[0], 'yyyy-mm-dd')
    queryInfo.end_date = formatDate(value[1], 'yyyy-mm-dd')
    // 这里不用自动更新数据
  } else {
    queryInfo.start_date = ''
    queryInfo.end_date = ''
  }
}
// 获取用户列表
const getTestList = async () => {
  // 发送请求
  loading.value = true
  const resp = await proxy.$api.testing.stressReport(queryInfo)
  // 请求出错
  if (typeof resp === 'string') {
    loading.value = false
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message, total } = resp.data
  if (ret_code === '0') {
    result.total = total
    result.tableData = data.map(item => {
      return {
        id: item.raw_info.db_id,
        create_time: item.raw_info.create_time,
        service_name: item.raw_info.service_name,
        url: item.raw_info.url,
        con_num: item.raw_info.con_num,
        duration_time: item.raw_info.duration_time,
        user_name: item.raw_info.user_name,
        status: {
          status: item.raw_info.status,
          statusStr: statusMap[item.raw_info.status][0],
          type: statusMap[item.raw_info.status][1]
        },
        detail: item
      }
    })
    loading.value = false
  } else {
    loading.value = false
    ElMessage.error(message || 'get stress test report failed')
  }
}

// 展示压测明细
const showDetail = detail => {
  result.rawInfo = detail.raw_info
  result.stressResult = detail.stress_result
  drawer.value = true
}

// 分页器
const currentChange = currentPage => {
  queryInfo.pagenum = currentPage
  getTestList()
}

// 查询用户
const searchTest = () => {
  getTestList()
}

const getCurrentDate = () => {
  const today = new Date()
  // 默认获取前一天的数据
  const days = 24 * 60 * 60 * 1000
  const startTime = today.getTime() - 7 * days
  const endTime = today.getTime()
  dateArr.value = [new Date(startTime), new Date(endTime)]

  queryInfo.start_date = formatDate(dateArr.value[0], 'yyyy-mm-dd')
  queryInfo.end_date = formatDate(dateArr.value[1], 'yyyy-mm-dd')
}

onBeforeMount(() => {
  getCurrentDate()
})

// 页面加载完后获取
onMounted(() => {
  getTestList()
})
</script>

<style lang="less" scoped>
.permission-data {
  margin: 20px 0;
}

span {
  margin-right: 5px;
}

.stress-search {
  float: left;
}
</style>
