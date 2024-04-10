<template>
  <Breadcrumb />
  <div style="width: 90%; margin: 20px">
    <el-form label-width="80px" label-position="left">
      <el-row>
        <el-col :span="5">
          <el-select v-model="trainingStatu" prop="trainingStatus" placeholder="select status" style="width: 98%" @visible-change="InitTrackChange">
            <el-option v-for="item in trainingStatus" :key="item.value" :value="item.value" :label="item.lable" />
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="QueryTaskClick"> Query </el-button>
        </el-col>
        <el-col :span="1"> </el-col>
        <el-col :span="11"> <el-button type="primary" @click="AddTaskClick"> New Task </el-button></el-col>
      </el-row>
    </el-form>
    <div style="height: 10px"></div>
    <el-card shadow="never" class="asset" style="text-align: left; width: 100%">
      <el-table :data="tableData.trainingCurrentPage" stripe style="width: 100%" v-fit-columns>
        <el-table-column prop="TaskId" label="TaskId" width="100" align="center" />
        <el-table-column prop="TaskName" label="TaskName" />
        <el-table-column prop="Status" label="Status" />
        <el-table-column prop="UpdateTime" label="Update Time" />
      </el-table>
      <el-pagination v-if="paginationDisabled" :page-size="pageSize" small="small" @current-change="handleCurrentChange" layout="prev, pager, next" :total="total" style="width: 50%" />
    </el-card>
    <el-dialog v-model="newAddTaskVisible" draggable width="60%">
      <el-form label-position="left" label-width="150px" :model="addTask" :rules="addRules" ref="trainingFormRef" style="max-height: 600px; overflow: auto" size="large">
        <el-form-item label="Category:" prop="category">
          <el-select v-model="addTask.category" placeholder="select category" style="width: 50%">
            <el-option v-for="item in categorys" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Game:" prop="game">
          <el-select v-model="addTask.game" placeholder="select game" style="width: 50%">
            <el-option v-for="item in games" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Src Lang:" prop="srclang">
          <el-select v-model="addTask.srclang" placeholder="select src lang" style="width: 50%">
            <el-option v-for="item in srclangs" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="To Lang:" prop="tolang">
          <el-select v-model="addTask.tolang" placeholder="select to lang" style="width: 50%">
            <el-option v-for="item in tolangs" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Embedding Type:" prop="embeddingType">
          <el-select v-model="addTask.embeddingType" placeholder="select embedding type" style="width: 50%">
            <el-option v-for="item in embeddingTypes" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Embedding Service:" prop="embeddingService">
          <el-select v-model="addTask.embeddingService" placeholder="select embedding service" style="width: 50%">
            <el-option v-for="item in embeddingServices" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="Data File:" width="80px">
          <el-upload
            ref="uploadRef"
            :action="allUrl.nlp.translationTrainingAdd"
            :on-success="handleSuccess"
            :on-error="handleError"
            :auto-upload="false"
            :data="addTask"
            :on-change="handleUploadChange"
            :http-request="uploadHttpRequest"
            :limit="1"
            :on-remove="onRemove"
            :accept="accept"
          >
            <el-button type="info">Select Files</el-button>
            <template #tip>
              <div style="color: #e6a23c">support .xlsx/.csv，size less than 1G.</div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      <div style="text-align: center; width: 50%; padding: 20px">
        <el-button type="primary" @click="handleSubmit">Submit</el-button>
        <el-button @click="handleCancel">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, onBeforeMount } from 'vue'

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import allUrl from '@/api/url'

const { proxy } = getCurrentInstance()
const InitTrackChange = ref(false)
const trainingStatu = ref('all')

const newAddTaskVisible = ref(false)
const paginationDisabled = ref(false)
const pageSize = ref(10)
const total = ref(0)
const addTask = reactive({
  category: '',
  game: '',
  srclang: '',
  tolang: '',
  embeddingType: '',
  embeddingService: '',
  isUploadfile: false
})
const accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/comma-separated-values,text/csv,application/csv"
const tableData = reactive({
  trainingTotal: [],
  trainingCurrentPage: []
})

const clearnTask = () => {
  addTask.category = ''
  addTask.game = ''
  addTask.srclang = ''
  addTask.tolang = ''
  addTask.embeddingService = ''
  addTask.embeddingType = ''
  addTask.isUploadfile = false
  proxy.$refs.uploadRef.clearFiles()
}

const categorys = ref([])
const games = ref([])
const srclangs = ref([])
const tolangs = ref([])
const embeddingTypes = ref([])
const embeddingServices = [
  { label: 'COS', value: 'COS' },
  { label: 'pgvector', value: 'pgvector' }
]
const trainingStatus = [
  { value: 'all', label: 'all' },
  { value: 'init', label: 'init' },
  { value: 'running', label: 'running' },
  { value: 'success', label: 'success' },
  { value: 'failed', label: 'failed' }
]

const addRules = reactive({
  category: [{ required: true, message: 'please select Category', trigger: 'blur' }],
  game: [{ required: true, message: 'please select Game', trigger: 'blur' }],
  srclang: [{ required: true, message: 'please select Src Lang', trigger: 'blur' }],
  tolang: [{ required: true, message: 'please select To Lang ', trigger: 'blur' }],
  embeddingType: [{ required: true, message: 'please select Embedding type', trigger: 'blur' }],
  embeddingService: [{ required: true, message: 'please select Embedding Service', trigger: 'blur' }]
})

const QueryTaskClick = () => {
  var status = ''
  if (trainingStatu.value === 'all') {
    status = ''
  } else {
    status = trainingStatu.value
  }
  getServiceData(status)
}

const handleCurrentChange = val => {
  var offset = (val - 1) * pageSize.value
  tableData.trainingCurrentPage = tableData.trainingTotal.slice(offset, offset + pageSize.value)
}

const getServiceData = async status => {
  const resp = await proxy.$api.nlp.translationTrainingQuery({ status: status })
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    total.value = data.length
    paginationDisabled.value = true
    tableData.trainingTotal = []
    tableData.trainingCurrentPage = []
    newAddTaskVisible.value = false
    data.forEach(item => {
      var ob = {
        TaskId: 0,
        TaskName: '',
        Status: '',
        UpdateTime: ''
      }
      ob.TaskId = item.task_id
      ob.TaskName = item.task_name
      ob.Status = item.status
      ob.UpdateTime = item.update_time
      tableData.trainingTotal.push(ob)
      if (tableData.trainingCurrentPage.length < pageSize.value) {
        tableData.trainingCurrentPage.push(ob)
      }
    })
  }
}

//七彩石的配置文件如下 consns.log(items[0].kvs.kvs[0].value)
/*
{
    "postgresql":
    {
        "host": "127.0.0.1",
        "port": 5432,
        "db_name": "nlp_localization",
        "user": "postgres",
        "password": "123456"
    },
    "mt_localization":
    {
        "name": "mt_localizatioin",
        "host": "101.32.174.207",
        "port": 8080,
        "uri": "predict"
    },
     "training_svr":
    {
        "name": "training_svr",
        "host": "101.32.174.207",
        "port": 8080,
        "uri": "predict"
    },
    "keys":
    [
        {
            "source": "localization",
            "key": "translation123"
        }
    ],
    "model_name": "gpt-4",
    "batch_num": 2,
    "group_id": "wrkSFfCgAAmM6QidlhYAWUXFIJoZ0A5A",
    "category":["射击", "二次元", "MOBA", "MMO", "Other"],
    "game":["AVA", "CON", "COS", "SOP", "AUR", "HTT", "NKE", "Re0", "AOV", "HOK", "DN2", "TDM", "NBA", "STF","ROB"],
    "src_lang":["cn","en","fr","jp","ko","tw","de","es","id","pt","th","tr","it","ar","ru"],
    "tgt_lang":["cn","en","fr","jp","ko","tw","de","es","id","pt","th","tr","it","ar","ru"]
}
*/
// 七彩石获取配置信息
const getBusiness = async () => {
  let envName = 'local'
  if (window.location.hostname === 'algo.intltest11.com') {
    envName = 'dev'
  } else if (window.location.hostname === 'algo.intlgame.com') {
    envName = 'pro'
  }
  const resp = await proxy.$api.rainbow.rainbow({
    app_id: 'e1eaa1f0-0d45-4c98-8f6b-29cdc4e16c95',
    group: 'ug-algo-service.localization.base',
    env_name: envName
  })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, items, ret_msg } = resp.data
  if (ret_code === 0) {
    var obj = JSON.parse(items[0].kvs.kvs[0].value)

    for (let value of obj.category) {
      categorys.value.push({
        label: value,
        value: value
      })
    }
    for (let value of obj.game) {
      games.value.push({
        label: value,
        value: value
      })
    }
    for (let value of obj.src_lang) {
      srclangs.value.push({
        label: value,
        value: value
      })
    }
    for (let value of obj.tgt_lang) {
      tolangs.value.push({
        label: value,
        value: value
      })
    }

    for(let value of obj.embedding_type){
      embeddingTypes.value.push({
        label: value,
        value: value
      })
    }
  } else {
    ElMessage.error(ret_msg || 'get rainbow data failed')
  }
}
const handleSubmit = () => {
  proxy.$refs.trainingFormRef.validate(valid => {
    if (valid) {
      proxy.$refs.uploadRef.submit()
      //默认false
      if (!addTask.isUploadfile) {
        let formData = new FormData()
        formData.append('category', addTask.category)
        formData.append('game', addTask.game)
        formData.append('srclang', addTask.srclang)
        formData.append('tolang', addTask.tolang)
        formData.append('embedding_type', addTask.embeddingType)
        formData.append('embedding_service', addTask.embeddingService)
        AddTask(formData)
      }
    }
  })
}

const AddTask = async formData => {
  const resp = await proxy.$api.nlp.translationTrainingAdd(formData)
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, task_id, message } = resp.data
  if (ret_code === '0' && task_id != 0) {
    clearnTask()
    getServiceData('')
  }
}

const onRemove = uploadFiles => {
  addTask.isUploadfile = false
}

// 手动触发 proxy.$refs.uploadRef.submit()后 如果有文件被选中。会触发该函数
const uploadHttpRequest = param => {
  addTask.isUploadfile = false
  let formData = new FormData()
  formData.append('file', param.file)
  formData.append('category', addTask.category)
  formData.append('game', addTask.game)
  formData.append('srclang', addTask.srclang)
  formData.append('tolang', addTask.tolang)
  formData.append('embedding_type', addTask.embeddingType)
  formData.append('embedding_service', addTask.embeddingService)
  AddTask(formData)
}

const checkFile = (fileType, fileSize, fileName) => {
  // 判断文件类型
  var list=accept.split(',')
  if (!list.includes(fileType)) {
    ElMessage.error('Error, the type of file must .xlsx' )
    return false
  }
  // 判断文件大小
  if (fileSize > 1 * 1024 * 1024 * 1024) {
    ElMessage.error('Error, the size of file must less than 1G')
    return false
  }
  // 文件名字
  if (!fileName.endsWith('.xlsx')&&!fileName.endsWith('.csv')) {
    ElMessage.error('Error, the file name must be end with .xlsx')
    return false
  }
  return true
}

const handleCancel = () => {
  newAddTaskVisible.value = false
  clearnTask()
}

const handleUploadChange = uploadFile => {
  // 添加文件后调用
  if (uploadFile.status === 'ready') {
    // 校验文件
    if (checkFile(uploadFile.raw.type, uploadFile.size, uploadFile.name)) {
      addTask.isUploadfile = true
    } else {
      // 清空文件列表
      proxy.$refs.uploadRef.clearFiles()
    }
  }
}

const handleSuccess = () => {
  tableData.trainingTotal = []
  tableData.trainingCurrentPage = []
  newAddTaskVisible.value = false
}
const handleError = error => {
  ElMessage.error(error.message)
}

const AddTaskClick = () => {
  newAddTaskVisible.value = true
}

onBeforeMount(() => {
  getBusiness()
})

onMounted(() => {
  getServiceData('')
})
</script>
