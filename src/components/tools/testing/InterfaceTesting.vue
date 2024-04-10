<template>
  <el-row :gutter="60">
    <el-col :span="18">
      <el-form :model="form" label-position="left" label-width="120px" :rules="rules" ref="interface" v-loading="loading">
        <el-form-item label="Name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" style="width: 100%" />
        </el-form-item>
        <el-form-item label="Protocol">
          <el-select v-model="form.protocol">
            <el-option v-for="item in methods" :label="item" :value="item" :key="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Headers">
          <el-table :data="form.headers" border style="width: 100%">
            <el-table-column prop="key" label="key" width="300">
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
          <div style="width: 100%; display: flex; justify-content: space-between">
            <el-button @click="changeBody">
              <el-icon v-if="showBody"><Minus /></el-icon>
              <el-icon v-else><Plus /></el-icon>
            </el-button>
            <el-button @click="beautify" v-show="showBody">Beautify</el-button>
          </div>
        </el-form-item>
        <el-form-item v-show="showBody">
          <v-ace-editor
            v-model:value="form.body"
            lang="json"
            :theme="aceBodyConfig.theme"
            :options="aceBodyConfig.options"
            :readonly="aceBodyConfig.readOnly"
            style="height: 300px; width: 100%"
            class="ace-editor"
          />
        </el-form-item>
        <el-form-item>
          <el-button  @click="submit">Submit</el-button>
          <el-button  @click="reset">Reset</el-button>
          <el-button icon='Star' @click="favorite">Favorite</el-button>
        </el-form-item>
        <div v-show="showResult">
          <el-divider />
          <el-form-item label="Result">
            <div style="width: 100%; text-align: right; color: #b1b3b8">
              <span>time: {{ result.time }}ms</span>
            </div>
          </el-form-item>
          <el-form-item>
            <v-ace-editor
              v-model:value="result.resp"
              lang="json"
              :theme="aceResultConfig.theme"
              :options="aceResultConfig.options"
              :readonly="aceResultConfig.readOnly"
              style="height: 300px; width: 100%"
              class="ace-editor"
            />
          </el-form-item>
        </div>
      </el-form>
    </el-col>
    <el-col :span="6">
      <el-card :body-style="{ maxHeight: '600px', overflow: 'auto', backgroundColor: '#f4f4f5' }">
        <h5 style="margin: 0">Favorite</h5>
        <el-divider />
        <div style="margin-top: 8px">
          <ul style="padding-left: 10px" v-show="true">
            <li v-for="(item, index) in history"  :key="item.Id"   @click="showHistory(item)" :style="historyStyle(item.id)" class="history">
              <span>{{ item.name }}</span>
              <el-icon @click.stop="delHistory(item.id)" color="#F56C6C" style="z-index: 10"><CircleClose /></el-icon>
            </li>
          </ul>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import { nanoid } from 'nanoid'
import { VAceEditor } from 'vue3-ace-editor'
import ace from 'ace-builds'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-chrome'
import 'ace-builds/src-noconflict/ext-language_tools'
import workerJsonUrl from 'ace-builds/src-noconflict/worker-json?url'
import { isUrl } from '@/utils/common_utils'
import { getCookie } from '@/utils/api_utils'

ace.config.setModuleUrl('ace/mode/json_worker', workerJsonUrl)
const { proxy } = getCurrentInstance()
const methods = ['POST', 'GET']
const form = reactive({
  name: 'New Request',
  url: '',
  protocol: 'POST',
  headers: [],
  body: '',
  mark:1
})
const result = reactive({
  resp: '',
  time: 0
})
const showResult = ref(true)
const loading = ref(false)
const showBody = ref(false)
const history = ref([])
const currentHistoryId = ref(0)
// 校验url格式
const checkUrl = (rule, value, callback) => {
  if (!isUrl(value)) {
    return callback(new Error('the format of url is wrong'))
  }
  callback()
}
// 校验规则
const rules = reactive({
  url: [
    { required: true, message: 'please input url', trigger: 'blur' },
    { validator: checkUrl, trigger: 'blur' }
  ]
})

// 添加headers
const addHeader = () => {
  form.headers.push({
    id: nanoid(),
    key: ref(''),
    value: ref('')
  })
}

// 删除headers
const delHeader = id => {
  form.headers = form.headers.filter(item => item.id !== id)
}

// 提交请求
const submit = () => {
  result.resp = ''
  result.time = 0
  form.mark=1
  proxy.$refs.interface.validate(async valid => {
    // 如果验证通过，发送请求
    if (valid) {
      // 校验body
      if (form.body !== '') {
        try {
          JSON.parse(form.body, null, 2)
        } catch (error) {
          ElMessage.error('body json format error')
          return
        }
      }
      // 发送请求
      loading.value = true
      form.username = getCookie('user_name')
      if (form.name === '') {
        form.name = 'New Request'
      }
      const resp = await proxy.$api.testing.interface(form)
      loading.value = false
      // 请求出错
      if (typeof resp === 'string') {
        loading.value = false
        ElMessage.error(resp)
        return
      }
      const { ret_code, data, message } = resp.data
      if (ret_code === '0') {
        // console.log(data)
        try {
          result.resp = JSON.stringify(JSON.parse(data.result), null, 2)
        } catch (error) {
          ElMessage.error(error.message)
        }
        result.time = data.time
      } else {
        ElMessage.error(message || 'interface testing failed')
      }
    }
  })
}

// 重置
const reset = () => {
  // proxy.$refs['interface'].resetFields()  // 清除不干净
  form.url = ''
  form.protocol = 'POST'
  form.headers = []
  showBody.value = false
  form.body = ''
  form.name = 'New Request'
  showResult.value = true
  result.resp = ''
  result.time = 0
  currentHistoryId.value = 0
}

const favorite=()=>{
  //请求接口判断
  //如果没有点击 Submit 按钮，而是先点击的favorite 按钮
  form.mark=2 //favorite
  proxy.$refs.interface.validate(async valid => {
    // 如果验证通过，发送请求
    if (valid) {
      // 校验body
      if (form.body !== '') {
        try {
          JSON.parse(form.body, null, 2)
        } catch (error) {
          ElMessage.error('body json format error')
          return
        }
      }
      form.result=result.resp
      form.time=result.time
      // 发送请求
      form.username = getCookie('user_name')
      if (form.name === '') {
        form.name = 'New Request'
      }
      const resp = await proxy.$api.testing.interface(form)
      // 请求出错
      if (typeof resp === 'string') {
        ElMessage.error(resp)
        return
      }
      const { ret_code, data, message } = resp.data
      if (ret_code === '0') {
       ElMessage.success(`favorite success`)
      } else {
        ElMessage.error(message || 'favorite interface failed')
      }
      getHistory(true)
    }
  })
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
const changeBody = () => {
  showBody.value = !showBody.value
  form.body = ''
}

// json格式化
const beautify = () => {
  try {
    form.body = JSON.stringify(JSON.parse(form.body), null, 2)
  } catch (e) {
    ElMessage.error(e.message)
  }
}

const aceResultConfig = reactive({
  // lang: 'json', //解析json
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

const historyOpenMap = {} // 用来记录日期的历史数据的展开情况
// 获取历史列表
const getHistory = async (submit = false) => {
  const resp = await proxy.$api.testing.interfaceList({ username: getCookie('user_name') })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    history.value = data
  } else {
    ElMessage.error(message || 'get history failed')
  }
}

// 点击展示历史数据
const showHistory = item => {
  currentHistoryId.value = item.id
  form.name = item.name
  form.url = item.url
  form.protocol = item.protocol
  form.headers = item.headers.map(item => {
    return {
      id: nanoid(),
      key: item.key,
      value: item.value
    }
  })
  if (item.body) {
    showBody.value = true
  } else {
    showBody.value = false
  }
  form.body = item.body
  result.time = item.time
  if (item.result) {
    result.resp = JSON.stringify(JSON.parse(item.result), null, 2)
  } else {
    result.resp = item.result
  }
}

// 历史数据列表样式
const historyStyle = id => {
  if (currentHistoryId.value === id) {
    return {
      color: '#409eff',
      backgroundColor: '#fff'
    }
  }
  return {
    color: '#303133'
  }
}

// 删除历史
const delHistory = async id => {
  const resp = await proxy.$api.testing.interfaceDel({ id: id })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message } = resp.data
  if (ret_code === '0') {
    ElMessage.success('delete success')
    getHistory()
    // 如果删除的是当前点击的id，需要reset
    if (id === currentHistoryId.value) {
      reset()
    }
  } else {
    ElMessage.error(message)
  }
}
onMounted(() => {
  getHistory()
})
</script>

<style lang="less" scoped>
.history {
  cursor: pointer;
  padding: 5px;
  font-size: 15px;
  border-radius: 3px;
  display: flex;
  justify-content: space-between;
}

.arrow {
  width: 20px;
  height: 10px;
  cursor: pointer;
}
</style>
