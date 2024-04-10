<template>
  <div class="outer-box">
    <el-button @click="newStress" :type="newStressType">New Stress Testing</el-button>
    <el-button @click="myTesting" :type="myTestingType">Show My Testings</el-button>
    <!-- new stress result -->
    <div v-show="showNewStress">
      <el-divider />
      <div style="width: 100%; display: flex; justify-content: space-between">
        <h4>
          *You can see the CPU and Memory status on Monitor
          <a
            :href="`https://cloud-grafana.woa.com/grafana-ikxho788/d/D9BfwNiVz/mlflow-online-service-monitor?orgId=1&var-NameSpace=mlflow-dev&var-Service=${newStressData.rawInfo.service_name}&var-query0=`"
            target="_blank"
            style="font-size: 14px; color: #409eff; font-weight: normal; font-style: italic; margin-left: 5px"
          >
            click here
          </a>
        </h4>
        <el-button v-show="showTerminate" type="danger" round size="small" @click="terminateNewStress">terminate</el-button>
      </div>
      <el-progress :text-inside="true" :stroke-width="15" :percentage="newStressData.percentage" :status="newStressData.status" />
      <el-divider />
      <el-descriptions title="Raw Info" :column="1" border size="small">
        <el-descriptions-item label="Service Name">{{ newStressData.rawInfo.service_name }}</el-descriptions-item>
        <el-descriptions-item label="URL">{{ newStressData.rawInfo.url }}</el-descriptions-item>
        <el-descriptions-item label="Protocol">{{ newStressData.rawInfo.protocol }}</el-descriptions-item>
        <el-descriptions-item label="Headers" v-if="newStressData.showHeaders">
          <el-table :data="newStressData.rawInfo.headers">
            <el-table-column prop="key" label="key" />
            <el-table-column prop="value" label="value" />
          </el-table>
        </el-descriptions-item>
        <el-descriptions-item :label="index === 0 ? 'Body' : ''" v-for="(item, index) in newStressData.rawInfo.body" :key="index">
          <v-ace-editor
            v-model:value="newStressData.rawInfo.body[index]"
            lang="json"
            :theme="aceResultConfig.theme"
            :options="aceResultConfig.options"
            :readonly="aceResultConfig.readOnly"
            style="height: 100px; width: 50%"
            class="ace-editor"
          />
        </el-descriptions-item>
        <el-descriptions-item label="Concurrency Num">{{ newStressData.rawInfo.con_num }}</el-descriptions-item>
        <el-descriptions-item label="Duration Time(min)">{{ newStressData.rawInfo.duration_time }}</el-descriptions-item>
        <el-descriptions-item label="Status" v-if="newStressData.rawInfo.status">
          <el-tag :type="newStressData.rawInfo.status.type">{{ newStressData.rawInfo.status.statusStr }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
      <div style="width: 100%; height: 10px"></div>
      <el-divider />
      <el-descriptions title="Stress Result" :column="2" border size="small">
        <el-descriptions-item label="Success Rate(%)">{{ newStressData.stressResult.success_rate }}</el-descriptions-item>
        <el-descriptions-item label="Avg Latency(ms)">{{ newStressData.stressResult.avg_latency }}</el-descriptions-item>
        <el-descriptions-item label="Max Latency(ms)">{{ newStressData.stressResult.max_latency }}</el-descriptions-item>
        <el-descriptions-item label="Min Latency(ms)">{{ newStressData.stressResult.min_latency }}</el-descriptions-item>
        <el-descriptions-item label="QPS" :span="2">{{ newStressData.stressResult.qps }}</el-descriptions-item>
        <el-descriptions-item label="P95" :span="2">{{ newStressData.stressResult.p95 }}</el-descriptions-item>
        <el-descriptions-item label="P99" :span="2">{{ newStressData.stressResult.p99 }}</el-descriptions-item>
        <el-descriptions-item label="Err Info">
          <p v-for="(item, index) in newStressData.stressResult.err_info" :key="index" style="text-indent: 24px; color: #f56c6c; margin: 3px 0">{{ item }}</p>
          <!-- <ul class="temp-ul">
            <li v-for="(item, index) in newStressData.stressResult.err_info" :key="index">{{ item }}</li>
          </ul> -->
        </el-descriptions-item>
      </el-descriptions>
    </div>
    <!-- My Testings -->
    <div v-show="showMyTesting">
      <el-divider />
      <el-table :data="result.general" style="width: 100%; font-size: 12px" border>
        <el-table-column prop="id" label="ID" width="100" />
        <el-table-column prop="create_time" label="Create Time" width="150" />
        <el-table-column prop="service_name" label="Service Name" width="150" />
        <el-table-column prop="url" label="URL" width="400" />
        <el-table-column prop="con_num" label="Concurrency Num" width="130" />
        <el-table-column prop="duration_time" label="Duration Time(min)" width="140" />
        <el-table-column prop="status" label="Status" width="200">
          <template #default="scope">
            <div style="display: flex; justify-content: space-between">
              <el-tag :type="scope.row.status.type" size="small">{{ scope.row.status.statusStr }}</el-tag>
              <el-button v-show="scope.row.status.show" type="danger" round size="small" @click="terminate(scope.row.id)">terminate</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column>
          <template #default="scope">
            <div style="display: flex; justify-content: space-between">
              <el-button type="primary" plain @click="showDetail(scope.row.detail)" link size="small">show detail...</el-button>
              <el-button type="primary" @click="testAgain(scope.row.detail)" size="small">test again</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <!-- new stress -->
  <el-dialog v-model="centerDialogVisible" title="New Stress Testing" width="50%" align-center>
    <el-form :model="form" label-position="left" label-width="150px" :rules="rules" ref="stress" v-loading="loading" style="height: 400px; overflow: auto">
      <el-form-item label="Service Name" prop="service_name">
        <el-input v-model="form.service_name" />
      </el-form-item>
      <el-form-item label="URL" prop="url">
        <el-input v-model="form.url" />
      </el-form-item>
      <el-form-item label="Protocol">
        <el-select v-model="form.protocol">
          <el-option v-for="item in methods" :label="item" :value="item" :key="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="Headers">
        <el-table :data="form.headers" border size="small" style="width: 70%">
          <el-table-column prop="key" label="key" width="200">
            <template #default="scope">
              <el-input v-model="scope.row.key"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="value">
            <template #default="scope">
              <el-input v-model="scope.row.value"></el-input>
            </template>
          </el-table-column>
          <el-table-column align="right" width="60">
            <template #header>
              <el-button circle @click="addHeader">
                <el-icon><Plus /></el-icon>
              </el-button>
            </template>
            <template #default="scope">
              <el-button circle @click="delHeader(scope.row.id)">
                <el-icon><Minus /></el-icon>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="Body">
        <div style="width: 80%; display: flex; justify-content: space-between">
          <el-button>
            <el-icon @click="addBody"><Plus /></el-icon>
          </el-button>
          <el-button v-show="form.body.length" @click="beautify">Beautify</el-button>
        </div>
      </el-form-item>
      <el-form-item v-for="(item, index) in form.body" :key="item.id">
        <v-ace-editor
          v-model:value="form.body[index].body"
          lang="json"
          :theme="aceBodyConfig.theme"
          :options="aceBodyConfig.options"
          :readonly="aceBodyConfig.readOnly"
          style="height: 100px; width: 80%"
          class="ace-editor"
        />
        <el-button class="del-body" @click="delBody(item.id)">
          <el-icon><Minus /></el-icon>
        </el-button>
      </el-form-item>
      <el-row>
        <el-col :span="10">
          <el-form-item label="Concurrency Num" prop="con_num">
            <el-input v-model.number="form.con_num"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4"></el-col>
        <el-col :span="10">
          <el-form-item label="Duration Time(min)" prop="duration_time">
            <el-input v-model.number="form.duration_time"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button @click="cancel" style="margin-right: 10px">Cancel</el-button>
      <span>
        <el-popover :visible="visible" placement="top" :width="260">
          <p>The request is the same as last time. Are you sure to submit it?</p>
          <div style="text-align: right; margin: 0">
            <el-button size="small" text @click="visible = false">cancel</el-button>
            <el-button size="small" type="primary" @click="confirmSubmit">confirm</el-button>
          </div>
          <template #reference>
            <el-button type="primary" @click="submit">Submit</el-button>
          </template>
        </el-popover>
      </span>
    </template>
  </el-dialog>
  <!-- 压测报告单条明细抽屉 -->
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
import { ref, reactive, getCurrentInstance, onBeforeUnmount } from 'vue'
import { nanoid } from 'nanoid'
import { VAceEditor } from 'vue3-ace-editor'
import ace from 'ace-builds'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/ext-language_tools'
import workerJsonUrl from 'ace-builds/src-noconflict/worker-json?url'

import { getCookie } from '@/utils/api_utils'
import { isUrl } from '@/utils/common_utils'

ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl)
const { proxy } = getCurrentInstance()
const centerDialogVisible = ref(false)
const methods = ['POST', 'GET']
const form = reactive({
  service_name: '',
  url: '',
  protocol: 'POST',
  headers: [],
  body: [],
  con_num: '',
  duration_time: ''
})
let duration_time_copy
// 我的压测记录
const result = reactive({
  // 概览
  general: [],
  // 明细
  rawInfo: {},
  stressResult: {}
})

// 新的压测展示
const newStressData = reactive({
  db_id: 0,
  percentage: 0,
  status: '',
  rawInfo: {},
  stressResult: {},
  timer: '',
  showHeaders: false
})
const loading = ref(false)
// 校验url格式
const checkUrl = (rule, value, callback) => {
  if (!isUrl(value)) {
    return callback(new Error('the format of url is wrong'))
  }
  callback()
}
// 校验规则
const rules = reactive({
  service_name: [{ required: true, message: 'please input service name', trigger: 'blur' }],
  url: [
    { required: true, message: 'please input url', trigger: 'blur' },
    { validator: checkUrl, trigger: 'blur' }
  ],
  con_num: [
    { required: true, message: 'please input concurrency num', trigger: 'blur' },
    { type: 'number', message: 'must be a number' }
  ],
  duration_time: [
    { required: true, message: 'please input requests num', trigger: 'blur' },
    { type: 'number', message: 'must be a number' }
  ]
})

const statusMap = {
  1: ['waiting', 'info', true],
  2: ['running', '', true],
  3: ['success', 'success', false],
  4: ['terminated', 'danger', false],
  5: ['failed', 'danger', false]
}
// 控制明细抽屉显示和隐藏
const drawer = ref(false)

// 记录上一次的压测结果
let lastStressResultStr = ''
const visible = ref(false)
// 添加headers
const addHeader = () => {
  form.headers.push({
    id: nanoid(),
    key: ref(''),
    value: ref('')
  })
}

// 点击New Stress Testing
const newStressType = ref('')
const myTestingType = ref('')
const showNewStress = ref(false)
const showMyTesting = ref(false)
const showTerminate = ref(false)
const newStress = () => {
  centerDialogVisible.value = true
  newStressType.value = 'success'
  myTestingType.value = ''
  showMyTesting.value = false
}
const myTesting = () => {
  myTestingType.value = 'success'
  newStressType.value = ''
  if (newStressData.timer) {
    clearInterval(newStressData.timer)
  }
  showNewStress.value = false
  // 获取数据
  getMyTestings()
}

// 删除headers
const delHeader = id => {
  form.headers = form.headers.filter(item => item.id !== id)
}

// 提交请求
const submit = (first = true) => {
  proxy.$refs.stress.validate(async valid => {
    // 如果验证通过，发送请求
    if (valid) {
      // 按钮颜色重置，隐藏我的测试报表
      newStress()
      // 校验body
      const requestBody = []
      let err = false
      for (const item of form.body) {
        try {
          JSON.stringify(JSON.parse(item.body), null, 2)
        } catch (e) {
          ElMessage.error(e.message)
          err = true
          break
        }
        requestBody.push(item.body)
      }
      if (err) {
        return
      }
      // 拷贝form
      const requestForm = Object.assign({}, form)
      requestForm.body = requestBody
      requestForm.user_name = getCookie('user_name')
      // console.log(form.body)
      // 确认再次提交不需要
      const requestFormStr = JSON.stringify(requestForm)
      if (first && !testAgainMark.value) {
        if (lastStressResultStr === requestFormStr) {
          visible.value = true
          return
        }
      }
      testAgainMark.value = false
      // 发送请求
      loading.value = true
      const resp = await proxy.$api.testing.stress(requestForm)
      // 请求出错
      if (typeof resp === 'string') {
        loading.value = false
        ElMessage.error(resp)
        return
      }
      const { ret_code, message, data } = resp.data
      if (ret_code === '0') {
        newStressData.db_id = data.db_id
        lastStressResultStr = requestFormStr
        loading.value = false
        ElMessage.success('submit success')
        duration_time_copy = form.duration_time
        cancel()
        newStressData.percentage = 0
        newStressData.status = ''
        getNewStressResult()
        if (newStressData.timer) {
          clearInterval(newStressData.timer)
        }
        newStressData.timer = setInterval(getNewStressResult, 5000)
        showNewStress.value = true
      } else {
        loading.value = false
        ElMessage.error(message || 'submit stress testing failed')
      }
    }
  })
}

// 获取压测结果
const getNewStressResult = async () => {
  if (newStressData.db_id) {
    const resp = await proxy.$api.testing.stressReport({ db_id: newStressData.db_id })
    // 请求出错
    if (typeof resp === 'string') {
      ElMessage.error(resp)
      clearInterval(newStressData.timer)
      return
    }
    const { ret_code, data, message } = resp.data
    if (ret_code === '0') {
      if (data.length !== 1) {
        ElMessage.error('the length of data is not 1')
        clearInterval(newStressData.timer)
        return
      }
      const item = data[0]
      newStressData.rawInfo = {
        id: item.raw_info.db_id,
        create_time: item.raw_info.create_time,
        service_name: item.raw_info.service_name,
        url: item.raw_info.url,
        protocol: item.raw_info.protocol,
        headers: item.raw_info.headers,
        body: item.raw_info.body,
        con_num: item.raw_info.con_num,
        duration_time: item.raw_info.duration_time,
        status: {
          status: item.raw_info.status,
          statusStr: statusMap[item.raw_info.status][0],
          type: statusMap[item.raw_info.status][1],
          show: statusMap[item.raw_info.status][2]
        }
      }
      newStressData.stressResult = item.stress_result
      if (item.raw_info.headers.length > 0) {
        newStressData.showHeaders = true
      } else {
        newStressData.showHeaders = false
      }
      // 展示Terminate按钮
      if (statusMap[item.raw_info.status][2]) {
        showTerminate.value = true
      } else {
        showTerminate.value = false
      }
      showNewStress.value = true
      // 开始加进度, 这里的加速最多加到94
      if (item.raw_info.status === 1) {
        newStressData.percentage = 0
        newStressData.status = ''
      } else if (item.raw_info.status === 2) {
        if (newStressData.percentage < 90) {
          const duration = duration_time_copy * 60
          const times = Math.floor(duration / 5)
          // console.log(duration, times)
          newStressData.percentage += Math.floor(90 / times)
        }
      } else if (item.raw_info.status === 3) {
        clearInterval(newStressData.timer)
        newStressData.percentage = 100
        newStressData.status = 'success'
      } else if (item.raw_info.status === 4) {
        clearInterval(newStressData.timer)
        newStressData.percentage = 100
        newStressData.status = 'warning'
      } else {
        clearInterval(newStressData.timer)
        newStressData.percentage = 100
        newStressData.status = 'exception'
      }
    } else {
      ElMessage.error(message || 'get new stress test failed')
      clearInterval(newStressData.timer)
    }
  }
}

// 确认提交
const confirmSubmit = async () => {
  visible.value = false
  submit(false)
}

// 取消提交
const cancel = () => {
  centerDialogVisible.value = false
  // proxy.$refs['interface'].resetFields()  // 清除不干净
  form.service_name = ''
  form.url = ''
  form.protocol = 'POST'
  form.headers = []
  form.body = []
  form.con_num = ''
  form.duration_time = ''
}

// 配置
const aceBodyConfig = reactive({
  // lang: 'json', //解析json
  theme: 'chrome', //主题
  readOnly: false, //是否只读
  options: {
    enableBasicAutocompletion: true,
    enableSnippets: true,
    enableLiveAutocompletion: true,
    tabSize: 2,
    showPrintMargin: false,
    fontSize: 12,
    useWorker: true
  }
})

// 添加body
const addBody = () => {
  form.body.push({
    id: nanoid(),
    body: ''
  })
}

// 删除body
const delBody = id => {
  form.body = form.body.filter(item => item.id !== id)
}

// 格式化
const beautify = () => {
  for (const index in form.body) {
    try {
      form.body[index].body = JSON.stringify(JSON.parse(form.body[index].body), null, 2)
    } catch (e) {
      ElMessage.error(e.message)
      break
    }
  }
}

// 展示压测结果
const getMyTestings = async () => {
  const username = getCookie('user_name')
  if (!username) {
    ElMessage.error('can not get user_name')
    return
  }
  const resp = await proxy.$api.testing.stressReport({ user_name: username })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    result.general = data.map(item => {
      return {
        id: item.raw_info.db_id,
        create_time: item.raw_info.create_time,
        service_name: item.raw_info.service_name,
        url: item.raw_info.url,
        con_num: item.raw_info.con_num,
        duration_time: item.raw_info.duration_time,
        status: {
          status: item.raw_info.status,
          statusStr: statusMap[item.raw_info.status][0],
          type: statusMap[item.raw_info.status][1],
          show: statusMap[item.raw_info.status][2]
        },
        detail: item
      }
    })
    showMyTesting.value = true
  } else {
    ElMessage.error(message || 'get stress test report failed')
  }
}

// 展示压测明细
const showDetail = detail => {
  result.rawInfo = detail.raw_info
  result.stressResult = detail.stress_result
  // // 处理err_info
  // result.stressResult.err_info = result.stressResult.err_info.map(item => {
  //   return {
  //     err: item
  //   }
  // })
  drawer.value = true
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

const terminateNewStress = async () => {
  const resp = await proxy.$api.testing.terminateStress({ db_id: newStressData.db_id })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message } = resp.data
  if (ret_code === '0') {
    ElMessage.success('terminate success')
    // 立刻重新请求结果
    getNewStressResult()
  } else {
    ElMessage.error(message || 'terminate failed')
  }
}

// 取消压测
const terminate = async id => {
  const resp = await proxy.$api.testing.terminateStress({ db_id: id })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message } = resp.data
  if (ret_code === '0') {
    ElMessage.success('terminate success')
    // 立刻重新请求结果
    getMyTestings()
  } else {
    ElMessage.error(message || 'terminate failed')
  }
}

// 从testAgain点击的不用跳出再次确定
const testAgainMark = ref(false)
// 对同一个压测再次测试
const testAgain = detail => {
  form.service_name = detail.raw_info.service_name
  form.url = detail.raw_info.url
  form.protocol = detail.raw_info.protocol
  form.headers = detail.raw_info.headers.map(item => {
    item.id = nanoid()
    return item
  })
  form.body = detail.raw_info.body.map(item => {
    return {
      id: nanoid(),
      body: item
    }
  })
  form.con_num = detail.raw_info.con_num
  form.duration_time = detail.raw_info.duration_time
  centerDialogVisible.value = true
  testAgainMark.value = true
}

onBeforeUnmount(() => {
  if (newStressData.timer) {
    clearInterval(newStressData.timer)
  }
})
</script>

<style lang="less" scoped>
.del-body {
  margin-left: 10px;
}

.result-text {
  margin-left: 10px;
  color: #909399;
  font-size: 14px;
}
</style>
