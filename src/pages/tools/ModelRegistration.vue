<template>
  <Breadcrumb />
    <div class="outer-box" id="registration">
      <el-tabs v-model="activeName">
        <!-- 添加rule -->
        <el-tab-pane name="first" label="Model Registration">
          <div class="outer-box">
            <Introduction>This tool is to help users self-register model to MLFlow server.</Introduction>

            <el-card shadow="never" class="asset">
              <el-alert type="info" show-icon :closable="false">
                <p>
                  Fill required information for model registration : <br />
                  "Model Name" : Prefered and Relavent model Name <br />
                  "Model Type" : Type of model to be registered <br />
                  "Model Path" : COS bucket path where model file stored <br />
                </p>
              </el-alert>
              <el-form :model="model" class="asset" :rules="rules" label-position="left" ref="regForm" :label-width="120">
                <el-form-item label="Model Name" prop="name">
                  <el-input v-model="model.name" placeholder="Model Name" style="width: 50%" />
                </el-form-item>
                <el-form-item label="Model Type" prop="type">
                  <el-select v-model="model.type" placeholder="Model Type">
                    <el-option label="ONNX" value="onnx-1.12" />
                    <el-option label="PyTorch" value="pytorch-1.12" />
                    <el-option label="TensorFlow" value="tensorflow-2.3.1" />
                  </el-select>
                </el-form-item>
                <el-form-item label="Model Path" prop="path">
                  <el-input v-model="model.path" placeholder="Model Path" style="width: 50%"> </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :disabled="disabled" @click="onSubmit">Register</el-button>
                </el-form-item>
              </el-form>
            </el-card>

            <el-card shadow="never" class="asset" v-show="progress.progressShow">
              <h4>Progress</h4>
              <el-divider />
              <div>
                <el-progress :percentage="percentage" :status="status" />
              </div>
            </el-card>

            <el-card shadow="never" class="asset" v-show="result.resultShow">
              <h4>Result</h4>
              <el-divider />
              <p :class="updateTextColour()" >{{ regresult }}</p>
              <div v-show="alert.alertShow">
                <el-alert type="info" show-icon :closable="false">
                  <p>
                    What to do after registration :<br />
                    1. Copy the run_id (runs:/****...****/model-name) into deploy_config.yml in Transformer <br />
                    2. Deploy the model to Rancher<br />
                  </p>
                </el-alert>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
          <el-tab-pane name="second" label="Model History">
            <div class="outer-box">
              <Introduction>This feature is to query model registration history.</Introduction>
              <el-row :gutter="5" class="asset">
                <el-col :span="10">
                  <el-input v-model="input" clearable placeholder="Please enter a model name" />
                </el-col>
                <el-col :span="4">
                  <el-button type="primary" @click="sendHistoryQuery" :disabled="historyDisabled">Search</el-button>
                </el-col>
              </el-row>
              <el-card shadow="hover" class="history-data">
                <el-table :data="tableData" style="width: 100%" stripe>
                  <el-table-column type="index" :index="indexMethod" />
                  <el-table-column prop="model_name" label="Model Name"/>
                  <el-table-column prop="version" label="Version"/>
                  <el-table-column prop="run_id" label="Run Id" />
                  <el-table-column prop="status" label="Status" />
                  <el-table-column prop="creation_time" label="Creation Time"/>
                </el-table>
              </el-card>
            </div>
          </el-tab-pane>
      </el-tabs>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import Introduction from '@/components/introduction/Introduction.vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'

const { proxy } = getCurrentInstance()

const model = reactive({
  name: '',
  type: '',
  path: ''
})

const percentage = ref(0)
const status = ref('')
const regresult = ref('')

const result = reactive({
  resultShow: false
})

const progress = reactive({
  progressShow: false
})

const alert = reactive({
  alertShow: false
})

const disabled = ref(false)
const historyDisabled = ref(false)

const rules = reactive({
  name: [{ required: true, message: 'please input model name', trigger: 'blur' }],
  type: [
    {
      required: true,
      message: 'Please select model type',
      trigger: 'change'
    }
  ],
  path: [
    {
      required: true,
      message: 'please input model path',
      trigger: 'blur'
    }
  ]
})

// active tab
const activeName = ref('first')
const tableData = ref([])
const input = ref('')

const onSubmit = () => {
  proxy.$refs.regForm.validate(async valid => {
    if (valid) {
      disabled.value = true
      percentage.value = 0
      status.value = ''
      progress.progressShow = true
      result.resultShow = false
      const timer = setInterval(() => {
        increaseRegProgress(Math.round(Math.random() * 1 + 2))
      }, 1500)
      const resp = await proxy.$api.modelRegistration.register({
        request_body: { model_name: model.name, model_type: model.type, model_path: model.path }
      })
      if (typeof resp === 'string') {
        clearInterval(timer)
        disabled.value = false
        ElMessage.error(resp)
        return
      }

      const runid = resp.data.runid
      const retCode = resp.data.ret_code
      const msg = resp.data.msg
      if (retCode == 0) {
        clearInterval(timer)
        updateRegSuccess()
        regresult.value = 'Run_id: ' + runid
        result.resultShow = true
        alert.alertShow = true
      } else {
        clearInterval(timer)
        updateRegError()
        regresult.value = 'ERROR: ' + msg
        result.resultShow = true
      }
    } else {
      disabled.value = false
      ElMessage.error('Please fill all required fields')
    }
  })
}

const indexMethod = index => {
  return index + 1
}

const sendHistoryQuery = async () => {
  if (input.value.trim() === '') {
    ElMessage.error('The model name cannot be empty')
  } else {
    const loadingInstance = ElLoading.service({ target: document.getElementById('search'), lock: true, text: 'Loading' })
    // disabled search button
    historyDisabled.value = true
    // execute query
    const resp = await proxy.$api.modelRegistration.modelHistory({ request_body:{model: input.value }})
    if (resp.data.ret_code === 0) {
      // retrieve model history
      const modelHistory = []
      resp.data.runid.forEach(item => {
        modelHistory.push(item)
      })
      tableData.value = modelHistory
      historyDisabled.value = false
      loadingInstance.close()
    } else {
      ElMessage.error(resp.data.message || 'get model history failed')
      historyDisabled.value = false
      loadingInstance.close()
    }
  }
}

const increaseRegProgress = percent => {
  if (percentage.value < 90) {
    percentage.value += percent
  } else if (percentage.value < 98) {
    percentage.value += 1
  }
}

const updateRegSuccess = () => {
  percentage.value = 100
  status.value = 'success'
  disabled.value = false
}

const updateRegError = () => {
  percentage.value = 100
  status.value = 'exception'
  disabled.value = false
}

const updateTextColour = () => {
  if (status.value == 'exception')
  {
    return 'red'
  }
  else
  {
    return 'black' 
  }
}

</script>


<style scoped>
.history-data {
  margin: 20px 0;
}

.black {
  color: black;
}

.red {
  color: red;
}
</style>