<template>
  <Breadcrumb />
  <div class="outer-box">
    <Introduction>This tool is to help users deploy their model after registration.</Introduction>
    <el-card shadow="never" class="asset">
      <el-alert type="info" show-icon :closable="false">
        <p>
          Fill required information for model registration : <br />
          "Project Name": Project Name <br />
          "Model Name" : Model Name <br />
          "Environment": Environment <br />
          [Optional] "Transformer" : Whether to use model's own transformer or shared transformer code. <br />
        </p>
      </el-alert>
      <el-row :gutter="15" class="asset">
        <el-col :span="14">
          <el-card shadow="hover" :body-style="{ height: '315px', overflow: 'auto' }">
            <el-form :model="model" class="asset" :rules="rules" label-position="left" ref="deployForm" :label-width="120">
              <el-form-item label="Project Name" prop="projectName">
                <el-input v-model="model.projectName" placeholder="Project Name" style="width: 60%" />
              </el-form-item>
              <el-form-item label="Model Name" prop="modelName">
                <el-input v-model="model.modelName" placeholder="Model Name" style="width: 60%" />
              </el-form-item>
              <el-form-item label="Environment" prop="env">
                <el-select v-model="model.env" placeholder="Environment" v-on:change="fetchConfig(false, false)">
                  <el-option label="staging" value="staging" />
                  <el-option label="production" value="production" />
                </el-select>
              </el-form-item>
              <el-form-item label="Version Update" prop="versionUpdate">
                <el-select v-model="model.versionUpdate" placeholder="Version Update" style="margin-right: 20px">
                  <el-option label="patch" value="Patch" />
                  <el-option label="minor" value="Minor" />
                  <el-option label="major" value="Major" />
                </el-select>
                <el-container></el-container>
                <el-tag type="success">
                  <span :class="isHighlighted('Major')">x</span>
                  <span class="unhighlighted">.</span>
                  <span :class="isHighlighted('Minor')">x</span>
                  <span class="unhighlighted">.</span>
                  <span :class="isHighlighted('Patch')">x</span>
                </el-tag>
              </el-form-item>
              <el-form-item label="Transformer" prop="transformer">
                <el-select v-model="model.transformer" placeholder="Transformer" style="margin-right: 20px">
                  <el-option v-for="transformer in model.transformers" :label="transformer" :value="transformer" />
                </el-select>
              </el-form-item>
              <el-form-item label="Yaml File" prop="yaml_file">
                <el-upload
                  ref="upload"
                  class="yaml-upload"
                  action=""
                  accept=".yaml"
                  :http-request="emptyRequest"
                  :before-upload="beforeYamlUpload"
                  :on-exceed="handleYamlExceed"
                  :show-file-list="false"
                  :limit="1"
                >
                  <template #trigger>
                    <el-button type="primary" size="small" :disabled="isFormDisabled">Click to upload</el-button>
                  </template>
                  <el-button type="success" size="small" :disabled="isFormDisabled" @click="fetchConfig(false, true)" style="margin: 0 10px">Fetch current config</el-button>
                  <el-button type="danger" size="small" :disabled="isFormDisabled" @click="resetConfig" style="margin: 0">Reset to default</el-button>
                </el-upload>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
        <el-col :span="10">
          <DeploymentStatus ref="deploymentStatus" v-show="shouldShow.statusShow" />
        </el-col>
      </el-row>
      <el-row :gutter="15" class="asset">
        <el-col :span="14">
          <YamlHandler ref="yamlHandler" />
          <div style="margin-top: 15px; text-align: center">
            <el-button type="primary" :disabled="isFormDisabled" @click="onSubmit">Deploy</el-button>
          </div>
        </el-col>
        <el-col :span="10">
          <DeploymentHistory ref="deploymentHistory" />
        </el-col>
      </el-row>
    </el-card>

    <el-card shadow="never" class="asset" v-show="shouldShow.progressShow">
      <h5 style="margin: 0">Progress</h5>
      <el-divider />
      <div>
        <el-progress :percentage="progressPercent" :status="status" />
      </div>
    </el-card>

    <el-card shadow="never" class="asset" v-show="shouldShow.resultShow">
      <h5 style="margin: 0">Result</h5>
      <el-divider />
      <p :class="updateTextColour()">{{ regresult }}</p>
      <div v-show="shouldShow.alertShow">
        <el-alert type="info" show-icon :closable="false">
          <p>Successfully deployed model<br /></p>
        </el-alert>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { ref, reactive, getCurrentInstance } from 'vue'
import Introduction from '@/components/introduction/Introduction.vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import DeploymentHistory from '@/components/tools/modelDeployment/DeploymentHistory.vue'
import DeploymentStatus from '@/components/tools/modelDeployment/DeploymentStatus.vue'
import YamlHandler from '@/components/tools/modelDeployment/YamlHandler.vue'
import { getCookie } from '@/utils/api_utils'

const { proxy } = getCurrentInstance()
const upload = ref()
const store = useStore()
const model_transformer_default = '<model_default>'
const model = reactive({
  projectName: '',
  modelName: '',
  env: 'staging',
  versionUpdate: 'Patch',
  transformers: [model_transformer_default],
  transformer: model_transformer_default,
  yamlName: '',
  yamlValue: ''
})
var username = getCookie('user_name')
if (username == undefined) {
  username = 'mlflow_deployment'
}

const progressPercent = ref(0)
const status = ref('')
const regresult = ref('')

const shouldShow = reactive({
  alertShow: false,
  progressShow: false,
  resultShow: false,
  statusShow: false
})

const isFormDisabled = ref(false)
const isFetchingHistory = ref(false)

const setStatus = status => {
  shouldShow.statusShow = status?.production?.status != undefined || status?.staging?.status != undefined
  if (!shouldShow.statusShow) {
    return
  }
  proxy.$refs.deploymentStatus.$refs.statusTable.$emit('refresh', model.modelName, status)
}
const setHistory = history => {
  proxy.$refs.deploymentHistory.$refs.deploymentTable.$emit('refresh', history)
}

const fetchHistoryAndStatus = (rule, field, callback) => {
  if (isFetchingHistory.value || model.projectName == '' || model.modelName == '') {
    return callback()
  }
  isFetchingHistory.value = true
  ;(async () => {
    const resp = await proxy.$api.modelRegistration.deploymentHistory({
      request_body: { project_name: model.projectName, model_name: model.modelName }
    })
    setHistory(resp?.data?.history ?? [])
    setStatus(resp?.data?.status ?? {})
    isFetchingHistory.value = false
  })()
  callback()
}

const fetchConfigAndTransformer = (rule, field, callback) => {
  if (isFormDisabled.value) {
    return callback()
  }
  isFormDisabled.value = true
  fetchConfig(true, true)
  callback()
}

const rules = reactive({
  projectName: [
    { required: true, message: 'please input project name', trigger: 'blur' },
    { validator: fetchHistoryAndStatus, trigger: 'blur' },
    { validator: fetchConfigAndTransformer, trigger: 'blur' }
  ],
  modelName: [
    { required: true, message: 'please input model name', trigger: 'blur' },
    { validator: fetchHistoryAndStatus, trigger: 'blur' },
    { validator: fetchConfigAndTransformer, trigger: 'blur' }
  ]
})

const emptyRequest = () => {}

const beforeYamlUpload = uploadFile => {
  const reader = new FileReader()
  reader.onload = e => {
    model.yamlName = uploadFile.name
    model.yamlValue = e.target.result
    proxy.$refs.yamlHandler.$refs.yamlForm.$emit('receive', e.target.result, true)
  }
  reader.readAsText(uploadFile)
}

const handleYamlExceed = files => {
  upload.value.clearFiles()
  const file = files[0]
  file.uid = genFileId()
  upload.value.handleStart(file)
  beforeYamlUpload(file)
}

const fetchConfig = (showTransformers, disableForm) => {
  isFormDisabled.value = disableForm
  proxy.$refs.deployForm.validateField(['projectName', 'modelName'], async valid => {
    if (!valid) {
      ElMessage.error('Please fill all required fields')
      isFormDisabled.value = false
      return
    }
    const resp = await proxy.$api.modelRegistration.getConfig({
      request_body: { project_name: model.projectName, model_name: model.modelName, show_transformers: showTransformers }
    })
    const yamlString = resp.data.configs[model.env] ?? ''
    if (yamlString == '') {
      ElMessage.error('current config is empty')
      isFormDisabled.value = false
      return
    }
    model.yamlName = model.env == 'staging' ? 'stg_values.yaml' : 'values.yaml'
    model.yamlValue = yamlString

    const optionListElements = {}
    if (showTransformers) {
      const current_transformer = resp.data.configs.current_transformer
      model.transformer = current_transformer != '' ? current_transformer : model_transformer_default
      model.transformers = [model_transformer_default].concat(resp.data.configs.transformers)
      optionListElements['images'] = resp.data.configs.images
    }

    proxy.$refs.yamlHandler.$refs.yamlForm.$emit('receive', yamlString, optionListElements, isFormDisabled)
    isFormDisabled.value = false
  })
}

const resetConfig = () => {
  model.yamlName = ''
  model.yamlValue = ''
  proxy.$refs.yamlHandler.$refs.yamlForm.$emit('reset')
}

const onSubmit = () => {
  isFormDisabled.value = true
  proxy.$refs.deployForm.validate(async valid => {
    await proxy.$refs.yamlHandler.$refs.yamlForm.validate(async valid => {
      if (valid) {
        proxy.$refs.yamlHandler.$refs.yamlForm.$emit('generate', model.modelName)
      } else {
        store.commit('updateMlflowYamlString', '')
      }
    })
    var yamlConfigString = store.state.mlflowData.yamlString
    if (!valid || yamlConfigString == '') {
      ElMessage.error('Please fill all required fields')
      isFormDisabled.value = false
      return
    }

    // Handle default yaml + has currrent config but not fetched
    if (!store.state.mlflowData.isModified && model.yamlValue == '') {
      const resp = await proxy.$api.modelRegistration.getConfig({
        request_body: { project_name: model.projectName, model_name: model.modelName }
      })
      yamlString = resp.data.configs[model.env] ?? ''
      model.yamlValue = yamlString
      if (yamlString != '') {
        proxy.$refs.yamlHandler.$refs.yamlForm.$emit('receive', yamlString, undefined)
      }
    }
    // If yaml was edited or no current config and no yaml upload
    if (store.state.mlflowData.isModified || model.yamlValue == '') {
      model.yamlName = model.env == 'staging' ? 'stg_values.yaml' : 'values.yaml'
      model.yamlValue = store.state.mlflowData.yamlString
    }

    progressPercent.value = 0
    status.value = ''
    shouldShow.progressShow = true
    shouldShow.resultShow = false
    const timer = setInterval(() => {
      increaseRegProgress(Math.round(Math.random() * 1 + 2))
    }, 1500)
    const transformerName = model.transformer == model_transformer_default ? '' : model.transformer
    const resp = await proxy.$api.modelRegistration.deployModel({
      request_body: {
        username: username,
        project_name: model.projectName,
        model_name: model.modelName,
        env: model.env,
        release_type: 'all',
        version_update: model.versionUpdate,
        transformer_name: transformerName,
        yaml_name: model.yamlName,
        yaml_value: model.yamlValue
      }
    })

    if (typeof resp === 'string') {
      updateRegError(resp, timer)
      isFormDisabled.value = false
      return
    }

    const tag = resp.data.tag
    const retCode = resp.data.ret_code
    const msg = resp.data.msg
    if (retCode == 0) {
      updateRegSuccess('tag: ' + tag, timer)
      isFormDisabled.value = false
      fetchHistoryAndStatus(undefined, undefined, emptyRequest)
    } else {
      updateRegError('ERROR: ' + msg, timer)
      isFormDisabled.value = false
    }
  })
}

const increaseRegProgress = percent => {
  if (progressPercent.value < 90) {
    progressPercent.value += percent
  } else if (progressPercent.value < 98) {
    progressPercent.value += 1
  }
}

const updateRegSuccess = (msg, timer) => {
  clearInterval(timer)
  regresult.value = msg
  progressPercent.value = 100
  status.value = 'success'
  shouldShow.alertShow = true
  shouldShow.resultShow = true
}

const updateRegError = (msg, timer) => {
  clearInterval(timer)
  regresult.value = msg
  progressPercent.value = 100
  status.value = 'exception'
  shouldShow.resultShow = true
}

const updateTextColour = () => {
  if (status.value == 'exception') {
    return 'red'
  } else {
    return 'black'
  }
}

const isHighlighted = versionUpdate => {
  return model.versionUpdate == versionUpdate ? 'highlighted' : 'unhighlighted'
}

const getHistoryTimer = setInterval(() => {
  fetchHistoryAndStatus(undefined, undefined, emptyRequest)
}, 15000)
</script>

<style scoped>
.black {
  color: black;
}

.red {
  color: red;
}

.highlighted {
  font-size: 30px;
  color: red;
}

.unhighlighted {
  font-size: 16px;
  color: black;
}
</style>
