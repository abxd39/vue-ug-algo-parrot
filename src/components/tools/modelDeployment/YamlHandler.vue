<template>
  <el-card shadow="hover" :body-style="{ height: '697px', overflow: 'auto' }">
    <el-form :model="yamlConfig" v-on:receive="parseYamlString" v-on:generate="generateYamlString" v-on:reset="resetYamlString" :rules="rules" label-position="left" ref="yamlForm" :label-width="130">
      <div>Replicas</div>
      <el-card shadow="never" class="asset">
        <el-form-item label="Min" prop="replicas.min">
          <el-input v-model="yamlConfig.replicas.min" type="number" style="width: 50%" />
        </el-form-item>
        <el-form-item label="Max" prop="replicas.max">
          <el-input v-model="yamlConfig.replicas.max" type="number" style="width: 50%" />
        </el-form-item>
      </el-card>
      <div style="margin-top: 15px">Proxy</div>
      <el-card shadow="never" class="asset">
        <el-form-item label="Modify?">
          <el-checkbox v-model="yamlConfig.proxy.isModified" size="large" />
        </el-form-item>
        <el-form-item label="Cpu" prop="proxy.resources.requests.cpu" v-show="yamlConfig.proxy.isModified">
          <el-input v-model="yamlConfig.proxy.resources.requests.cpu" type="number" style="width: 50%" />
        </el-form-item>
        <el-form-item label="Memory" prop="proxy.resources.requests.memory" v-show="yamlConfig.proxy.isModified">
          <el-input v-model="yamlConfig.proxy.resources.requests.memory" type="number" style="width: 50%" />
          <span>Gi</span>
        </el-form-item>
      </el-card>
      <div style="margin-top: 15px">Transformer</div>
      <el-card shadow="never" class="asset">
        <el-form-item label="Input Transform?">
          <el-switch v-model="yamlConfig.transformer.isInputTransform" size="large" />
        </el-form-item>
        <el-form-item label="Output Transform?">
          <el-switch v-model="yamlConfig.transformer.isOutputTransform" size="large" />
        </el-form-item>
        <el-form-item label="Preload" v-show="yamlConfig.transformer.isInputTransform || yamlConfig.transformer.isOutputTransform">
          <el-checkbox v-model="yamlConfig.transformer.preload" size="large" />
        </el-form-item>
        <el-form-item label="Use Gpu" v-show="yamlConfig.transformer.isInputTransform || yamlConfig.transformer.isOutputTransform">
          <el-checkbox v-model="yamlConfig.transformer.resources.requests.useGpu" size="large" />
        </el-form-item>
        <el-form-item
          label="Cpu"
          prop="transformer.resources.requests.cpu"
          v-show="(yamlConfig.transformer.isInputTransform || yamlConfig.transformer.isOutputTransform) && !yamlConfig.transformer.resources.requests.useGpu"
        >
          <el-input v-model="yamlConfig.transformer.resources.requests.cpu" type="number" style="width: 50%" />
        </el-form-item>
        <el-form-item label="Memory" prop="transformer.resources.requests.memory" v-show="yamlConfig.transformer.isInputTransform || yamlConfig.transformer.isOutputTransform">
          <el-input v-model="yamlConfig.transformer.resources.requests.memory" type="number" style="width: 50%" />
          <span>Gi</span>
        </el-form-item>
        <el-form-item label="Env Variables:" v-show="yamlConfig.transformer.isInputTransform || yamlConfig.transformer.isOutputTransform">
          <el-button @click="addEnvVar(true)" type="primary" plain :icon="Plus"> </el-button>
        </el-form-item>
        <el-form-item
          v-for="item in yamlConfig.transformer.envVars"
          :key="item.id"
          :prop="item.id"
          :rules="[{ validator: checkEnvVar, trigger: 'blur' }]"
          v-show="yamlConfig.transformer.isInputTransform || yamlConfig.transformer.isOutputTransform"
        >
          <el-input v-model="item.name" placeholder="please input name" style="width: 35%; padding-left: 10px" />
          <el-input v-model="item.value" placeholder="please input value" style="width: 35%; padding-left: 10px" />
          <el-button @click="delEnvVar(item.id)" type="danger" plain :icon="Minus" style="margin-left: 20px"></el-button>
        </el-form-item>
      </el-card>
      <div style="margin-top: 15px">Mlflow</div>
      <el-card shadow="never" class="asset">
        <el-form-item label="Is Serving?">
          <el-switch v-model="yamlConfig.mlflow.isServing" size="large" />
        </el-form-item>
        <el-form-item label="Workers" prop="mlflow.workers" v-show="yamlConfig.mlflow.isServing && !yamlConfig.mlflow.resources.requests.useGpu">
          <el-input v-model="yamlConfig.mlflow.workers" type="number" style="width: 50%" />
        </el-form-item>
        <el-form-item label="RunId" prop="mlflow.runId" v-show="yamlConfig.mlflow.isServing">
          <el-input v-model="yamlConfig.mlflow.runId" placeholder="RunId" style="width: 50%" />
        </el-form-item>
        <el-form-item label="Image" prop="mlflow.image" v-show="yamlConfig.mlflow.isServing">
          <el-select v-model="yamlConfig.mlflow.image" placeholder="Image" style="margin-right: 20px">
            <el-option v-for="image in yamlConfig.mlflow.images" :label="image" :value="image" />
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="mlflow.newImage" v-show="yamlConfig.mlflow.isServing && yamlConfig.mlflow.image == defaultConfig.mlflow.image">
          <el-input v-model="yamlConfig.mlflow.newImage" placeholder="New Image" style="width: 50%" />
        </el-form-item>
        <el-form-item label="Use Gpu" v-show="yamlConfig.mlflow.isServing">
          <el-checkbox v-model="yamlConfig.mlflow.resources.requests.useGpu" size="large" />
        </el-form-item>
        <el-form-item label="Cpu" prop="mlflow.resources.requests.cpu" v-show="yamlConfig.mlflow.isServing && !yamlConfig.mlflow.resources.requests.useGpu">
          <el-input v-model="yamlConfig.mlflow.resources.requests.cpu" type="number" style="width: 50%" />
        </el-form-item>
        <el-form-item label="Memory" prop="mlflow.resources.requests.memory" v-show="yamlConfig.mlflow.isServing">
          <el-input v-model="yamlConfig.mlflow.resources.requests.memory" type="number" style="width: 50%" />
          <span>Gi</span>
        </el-form-item>
      </el-card>
      <div style="margin-top: 15px" v-show="!yamlConfig.transformer.resources.requests.useGpu && !yamlConfig.mlflow.resources.requests.useGpu">Deployment</div>
      <el-card shadow="never" class="asset" v-show="!yamlConfig.transformer.resources.requests.useGpu && !yamlConfig.mlflow.resources.requests.useGpu">
        <el-form-item label="Node Select? ">
          <el-switch v-model="yamlConfig.deploy.isNodeSelect" size="large" />
          <el-alert type="info" show-icon :closable="false">
            <p>
              By turning on node select, service will only deploy into computing instance machine <br />
              However if the machine resource run out, deployment will be failed <br />
            </p>
          </el-alert>
        </el-form-item>
      </el-card>      
    </el-form>
  </el-card>
</template>

<script setup>
import { useStore } from 'vuex'
import { reactive, getCurrentInstance } from 'vue'
import { nanoid } from 'nanoid'
import clone from 'just-clone'
import { parse } from 'yaml'
import { Plus, Minus } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()
const store = useStore()
const gpuName = 'tke.cloud.tencent.com/qgpu-core'
const gpuValue = '100'
const defaultConfig = {
  modelName: '',
  imagePath: '',
  replicas: {
    min: 1,
    desired: 1,
    max: 1
  },
  proxy: {
    isModified: false,
    resources: {
      requests: {
        cpu: 4,
        memory: 10
      }
    }
  },
  transformer: {
    isInputTransform: false,
    isOutputTransform: false,
    logLevel: 'INFO',
    workers: 8,
    preload: false,
    resources: {
      requests: {
        useGpu: false,
        cpu: 4,
        memory: 10
      }
    },
    envVars: []
  },
  mlflow: {
    isServing: false,
    workers: 8,
    runId: '',
    imagePath: 'ptc-docker.pkg.coding.intlgame.com/iegg-ml/mlflow-user/',
    image: '<Use new image>',
    images: ['<Use new image>'],
    newImage: '',
    resources: {
      requests: {
        useGpu: false,
        cpu: 4,
        memory: 10
      }
    }
  },
  deploy: {
    isNodeSelect: false
  },
  mlflowMultiModel: []
}
const yamlConfig = reactive(clone(defaultConfig))
let prevYaml = JSON.stringify(yamlConfig)

const checkMlflowNonEmptyValue = (rule, item, callback) => {
  if (yamlConfig.mlflow.isServing && item == '') {
    return callback(new Error('value cannot be empty'))
  }
  callback()
}

const checkMlflowNewImage = (rule, item, callback) => {
  if (yamlConfig.mlflow.isServing && yamlConfig.mlflow.image == defaultConfig.mlflow.image && yamlConfig.mlflow.newImage == '') {
    return callback(new Error('new image cannot be empty'))
  }
  callback()
}

const checkEnvVar = (rule, item, callback) => {
  if (item.name === '' || item.value === '') {
    return callback(new Error('value cannot be empty'))
  }
  if (item.value.includes("'")) {
    return callback(new Error("value cannot contain '"))
  }
  if (!/^[a-zA-Z_]/.test(item.name)) {
    return callback(new Error('name must start with character [a-zA-Z_]'))
  }
  if (/[^a-zA-Z0-9_]/.test(item.name)) {
    return callback(new Error('name can only contain characters [a-zA-Z0-9_]'))
  }
  callback()
}

const rules = {
  'replicas.min': [{ required: true, message: 'please input min replicas', trigger: 'blur' }],
  'replicas.max': [{ required: true, message: 'please input max replicas', trigger: 'blur' }],
  'proxy.resources.requests.cpu': [{ required: true, message: 'please input proxy cpu', trigger: 'blur' }],
  'proxy.resources.requests.memory': [{ required: true, message: 'please input proxy memory', trigger: 'blur' }],
  'transformer.resources.requests.cpu': [{ required: true, message: 'please input transformer cpu', trigger: 'blur' }],
  'transformer.resources.requests.memory': [{ required: true, message: 'please input transformer memory', trigger: 'blur' }],
  'mlflow.runId': [{ validator: checkMlflowNonEmptyValue, trigger: 'blur' }],
  'mlflow.image': [{ validator: checkMlflowNonEmptyValue, trigger: 'blur' }],
  'mlflow.newImage': [{ validator: checkMlflowNewImage, trigger: 'blur' }],
  'mlflow.resources.requests.cpu': [{ required: true, message: 'please input mlflow cpu', trigger: 'blur' }],
  'mlflow.resources.requests.memory': [{ required: true, message: 'please input mlflow memory', trigger: 'blur' }]
}

let envVarArr = []
const addEnvVar = checkValid => {
  const nId = nanoid()
  const item = {
    id: nId,
    name: '',
    value: ''
  }
  if (!checkValid || yamlConfig.transformer.envVars.length === 0) {
    yamlConfig.transformer.envVars.push(item)
  } else {
    proxy.$refs.yamlForm.validateField(envVarArr, valid => {
      if (valid) {
        yamlConfig.transformer.envVars.push(item)
      }
    })
  }
  envVarArr.push(nId)
  yamlConfig[nId] = item
}

const delEnvVar = id => {
  envVarArr = envVarArr.filter(item => item !== id)
  delete yamlConfig[id]
  yamlConfig.transformer.envVars = yamlConfig.transformer.envVars.filter(item => {
    return item.id !== id
  })
}

const resetYamlString = () => {
  parseYamlString('', undefined, undefined)
}

const parseYamlString = (inputString, optionListElements, isFormDisabled) => {
  const jsonDict = parse(inputString) ?? {}
  yamlConfig.modelName = jsonDict.modelName ?? defaultConfig.modelName
  yamlConfig.replicas.min = jsonDict.replicas?.min ?? defaultConfig.replicas.min
  yamlConfig.replicas.max = jsonDict.replicas?.max ?? yamlConfig.replicas.min
  yamlConfig.proxy.resources.requests.cpu = jsonDict.proxy?.resources?.requests?.cpu ?? defaultConfig.proxy.resources.requests.cpu
  yamlConfig.proxy.resources.requests.memory = jsonDict.proxy?.resources?.requests?.memory?.replace('Gi', '') ?? defaultConfig.proxy.resources.requests.memory
  yamlConfig.transformer.isInputTransform = jsonDict.transformer?.isInputTransform ?? defaultConfig.transformer.isInputTransform
  yamlConfig.transformer.isOutputTransform = jsonDict.transformer?.isOutputTransform ?? defaultConfig.transformer.isOutputTransform
  yamlConfig.transformer.logLevel = jsonDict.transformer?.logLevel ?? defaultConfig.transformer.logLevel
  yamlConfig.transformer.workers = jsonDict.transformer?.workers ?? defaultConfig.transformer.workers
  yamlConfig.transformer.preload = jsonDict.transformer?.preload ?? defaultConfig.transformer.preload
  yamlConfig.transformer.env = jsonDict.transformer?.env ?? defaultConfig.transformer.env
  const transformerResources = jsonDict.transformer?.resources?.requests ?? {}
  yamlConfig.transformer.resources.requests.useGpu = transformerResources[gpuName] == gpuValue
  yamlConfig.transformer.resources.requests.cpu = transformerResources.cpu ?? defaultConfig.transformer.resources.requests.cpu
  yamlConfig.transformer.resources.requests.memory = transformerResources.memory?.replace('Gi', '') ?? defaultConfig.transformer.resources.requests.memory

  const prevEntries = envVarArr.length
  while (envVarArr.length > 0) {
    delEnvVar(envVarArr[0])
  }
  for (let i = 0; i < jsonDict.transformer?.env?.length ?? 0; i++) {
    addEnvVar(false)
    yamlConfig.transformer.envVars[i].name = jsonDict.transformer.env[i].name
    yamlConfig.transformer.envVars[i].value = jsonDict.transformer.env[i].value
  }

  yamlConfig.mlflow.isServing = jsonDict.mlflow?.isServing ?? defaultConfig.mlflow.isServing
  yamlConfig.mlflow.workers = jsonDict.mlflow?.workers ?? defaultConfig.mlflow.workers
  yamlConfig.mlflow.runId = jsonDict.mlflow?.runId ?? defaultConfig.mlflow.runId
  yamlConfig.mlflow.imagePath = jsonDict.mlflow?.imagePath ?? defaultConfig.mlflow.imagePath
  yamlConfig.mlflow.image = (jsonDict.mlflow?.image ?? defaultConfig.mlflow.image).replace(/^mlflow-model-serve:/, '')
  yamlConfig.mlflow.images = defaultConfig.mlflow.images.concat(optionListElements?.images ?? [])
  const mlflowResources = jsonDict.mlflow?.resources?.requests ?? {}
  yamlConfig.mlflow.newImage = defaultConfig.mlflow.newImage
  yamlConfig.mlflow.resources.requests.useGpu = mlflowResources[gpuName] == gpuValue
  yamlConfig.mlflow.resources.requests.cpu = mlflowResources.cpu ?? defaultConfig.mlflow.resources.requests.cpu
  yamlConfig.mlflow.resources.requests.memory = mlflowResources.memory?.replace('Gi', '') ?? defaultConfig.mlflow.resources.requests.memory

  yamlConfig.proxy.isModified =
    yamlConfig.proxy.resources.requests.cpu != defaultConfig.proxy.resources.requests.cpu || yamlConfig.proxy.resources.requests.memory != defaultConfig.proxy.resources.requests.memory
  yamlConfig.deploy.isNodeSelect = jsonDict.hasOwnProperty('affinity')
  prevYaml = JSON.stringify(yamlConfig)
  if (isFormDisabled != undefined) {
    isFormDisabled.value = false
  }
}

const generateYamlString = modelName => {
  store.commit('updateMlflowYamlModified', prevYaml != JSON.stringify(yamlConfig))
  modelName = yamlConfig.modelName != '' ? yamlConfig.modelName : modelName
  var yamlStringLines = []
  yamlStringLines.push('# general config for the mlflow model')
  yamlStringLines.push(`modelName: ${modelName}`)
  yamlStringLines.push('replicas:')
  yamlStringLines.push(`  min: ${yamlConfig.replicas.min}`)
  yamlStringLines.push(`  max: ${yamlConfig.replicas.max}`)

  if (yamlConfig.proxy.isModified) {
    yamlStringLines.push('')
    yamlStringLines.push('# proxy ---- MLflow proxy server which can redirect the resources')
    yamlStringLines.push('  resources:')
    yamlStringLines.push('    requests:')
    yamlStringLines.push(`      cpu: ${yamlConfig.proxy.resources.requests.cpu}`)
    yamlStringLines.push(`      memory: ${yamlConfig.proxy.resources.requests.memory}Gi`)
  }

  if (yamlConfig.transformer.isInputTransform || yamlConfig.transformer.isOutputTransform) {
    yamlStringLines.push('')
    yamlStringLines.push('# transformer ---- transformer')
    yamlStringLines.push('transformer:')
    yamlStringLines.push(`  isInputTransform: ${yamlConfig.transformer.isInputTransform}`)
    yamlStringLines.push(`  isOutputTransform: ${yamlConfig.transformer.isOutputTransform}`)
    yamlStringLines.push(`  logLevel: "${yamlConfig.transformer.logLevel}"`)
    yamlStringLines.push(`  preload: ${yamlConfig.transformer.preload}`)
    yamlStringLines.push('  resources:')
    yamlStringLines.push('    requests:')
    if (yamlConfig.transformer.resources.requests.useGpu) {
      yamlStringLines.push(`      ${gpuName}: "${gpuValue}"`)
    } else {
      yamlStringLines.push(`      cpu: ${yamlConfig.transformer.resources.requests.cpu}`)
    }
    yamlStringLines.push(`      memory: ${yamlConfig.transformer.resources.requests.memory}Gi`)
    if (yamlConfig.transformer.envVars.length > 0) {
      yamlStringLines.push('  env:')
      for (let i = 0; i < yamlConfig.transformer.envVars.length; i++) {
        yamlStringLines.push(`    - name: ${yamlConfig.transformer.envVars[i].name}`)
        yamlStringLines.push(`      value: '${yamlConfig.transformer.envVars[i].value}'`)
      }
    }
  }

  if (yamlConfig.mlflow.isServing) {
    yamlStringLines.push('')
    yamlStringLines.push('#mlflow --- mlflow')
    yamlStringLines.push('mlflow:')
    yamlStringLines.push(`  isServing: ${yamlConfig.mlflow.isServing}`)
    if (!yamlConfig.mlflow.resources.requests.useGpu) {
      yamlStringLines.push(`  workers: ${yamlConfig.mlflow.workers}`)
    }
    yamlStringLines.push(`  runId: ${yamlConfig.mlflow.runId}`)
    if (yamlConfig.mlflow.image != defaultConfig.mlflow.image) {
      yamlStringLines.push(`  image: mlflow-model-serve:${yamlConfig.mlflow.image}`)
    } else {
      yamlStringLines.push(`  image: mlflow-model-serve:${yamlConfig.mlflow.newImage}`)
    }
    yamlStringLines.push('  resources:')
    yamlStringLines.push('    requests:')
    if (yamlConfig.mlflow.resources.requests.useGpu) {
      yamlStringLines.push(`      ${gpuName}: "${gpuValue}"`)
    } else {
      yamlStringLines.push(`      cpu: ${yamlConfig.mlflow.resources.requests.cpu}`)
    }
    yamlStringLines.push(`      memory: ${yamlConfig.mlflow.resources.requests.memory}Gi`)
  }

  if (yamlConfig.deploy.isNodeSelect) {
    yamlStringLines.push('')
    yamlStringLines.push('#Node select')
    yamlStringLines.push('affinity:')
    yamlStringLines.push(`  key: mbert-affinity`)
  }
  yamlStringLines.push('')

  store.commit('updateMlflowYamlString', yamlStringLines.join('\n'))
}
</script>
