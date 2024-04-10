<template>
  <Breadcrumb />
  <div class="outer-box" id="aidraw">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <!-- 添加任务 -->
      <el-tab-pane name="first" label="Task Add">
        <div class="outer-box">
          <el-form :model="taskAddInfo" label-width="100px" label-position="left" :rules="rules" ref="aidrawFormRef">
            <el-form-item label="Task Name:" prop="task_name">
              <el-input v-model="taskAddInfo.task_name" placeholder="task name" style="width: 25%" />
              <span style="color: #e6a23c; padding-left: 20px; font-size: 12px">(Warning: Globally Unique)</span>
            </el-form-item>
            <el-form-item label="Excel File:" prop="file">
              <el-upload
                :action="allUrl.aidraw.createTask"
                :auto-upload="false"
                :on-change="handleUploadChange"
                ref="aiDrawUploadRef"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                :data="extraData"
                :on-error="handleError"
                :on-success="handleSuccess"
                :limit="1"
              >
                <el-button type="primary">Click to upload</el-button>
                <template #tip>
                  <div style="color: #e6a23c">xlsx file with a size less than 1M.</div>
                </template>
              </el-upload>
            </el-form-item>
            <el-form-item label="Batch Size:" prop="batch_size">
              <el-input v-model="taskAddInfo.batch_size" placeholder="batch size" style="width: 25%" />
            </el-form-item>
          </el-form>
          <div style="text-align: center; width: 25%">
            <el-button type="primary" @click="handleSubmit">Submit</el-button>
            <el-button @click="handleCancel">Cancel</el-button>
          </div>
        </div>
      </el-tab-pane>
      <!-- 查询任务 -->
      <el-tab-pane name="second" label="Task Query" :lazy="true">
        <div class="outer-box">
          <div>
            <span>Task Name: </span>
            <el-select v-model="selectName" placeholder="select task name" @change="handleChange">
              <el-option v-for="item in taskNameArr" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-icon :size="20" @click="refresh"><Refresh /></el-icon>
          </div>
          <div class="task-info">
            <el-descriptions :column="1" border size="small">
              <el-descriptions-item label="Task Id">{{ taskInfo.task_id }}</el-descriptions-item>
              <el-descriptions-item label="Caption Num">{{ taskInfo.caption_num }}</el-descriptions-item>
              <el-descriptions-item label="Caption Success Num">{{ taskInfo.caption_success_num }}</el-descriptions-item>
              <el-descriptions-item label="Caption Fail Num">{{ taskInfo.caption_fail_num }}</el-descriptions-item>
              <el-descriptions-item label="Caption Progress"><el-progress :percentage="captionPercentage" /></el-descriptions-item>
              <el-descriptions-item label="Image Total Num">{{ taskInfo.image_total_num }}</el-descriptions-item>
              <el-descriptions-item label="Filter Useful Num">{{ taskInfo.filter_useful_num }}</el-descriptions-item>
              <el-descriptions-item label="Filter Unuseful Num">{{ taskInfo.filter_unuseful_num }}</el-descriptions-item>
              <el-descriptions-item label="Filter Fail Num">{{ taskInfo.filter_fail_num }}</el-descriptions-item>
              <el-descriptions-item label="Filter Progress"><el-progress :percentage="filterPercentage" /></el-descriptions-item>
              <el-descriptions-item label="Cdn Path">{{ taskInfo.cdn_path }}</el-descriptions-item>
              <el-descriptions-item label="Cdn File Url">{{ taskInfo.cdn_file_url }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import { sendUserAction, getCookie } from '@/utils/api_utils'
import allUrl from '@/api/url'

// tab相关
const activeName = ref('first')
// tab点击的时候触发
const tabClick = context => {
  sendUserAction({ page_name: context.props.label })
}

// task add相关
var loadingInstance
const { proxy } = getCurrentInstance()

const taskAddInfo = reactive({
  task_name: '',
  file: '',
  batch_size: 1
})

const extraData = reactive({
  username: getCookie('user_name')
})

// max_num_creatives>0校验
const checkBatchSize = (rule, value, callback) => {
  if (value <= 0) {
    return callback(new Error('max_num_creatives must greater than 0'))
  }
  callback()
}

// 表单校验规则
const rules = reactive({
  task_name: [{ required: true, message: 'please input task name', trigger: 'blur' }],
  file: [{ required: true, message: 'please select file', trigger: 'blur' }],
  batch_size: [
    { required: true, message: 'please input batch size', trigger: 'blur' },
    { type: 'number', message: 'must be a number' },
    { validator: checkBatchSize, trigger: 'blur' }
  ]
})

const checkFile = (fileType, fileSize, fileName) => {
  // 判断文件类型
  if (fileType != 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
    ElMessage.error('Error, the type of file must .xlsx')
    return false
  }
  // 判断文件大小
  if (fileSize > 1 * 1024 * 1024) {
    ElMessage.error('Error, the size of file must less than 1MB')
    return false
  }
  // 文件名字
  if (!fileName.endsWith('.xlsx')) {
    ElMessage.error('Error, the file name must be end with .xlsx')
    return false
  }
  return true
}

// 文件状态发生变化时的钩子函数，添加文件、上传成功和上传失败时都会被调用
const handleUploadChange = uploadFile => {
  // 添加文件后调用
  if (uploadFile.status === 'ready') {
    // 校验文件
    if (checkFile(uploadFile.raw.type, uploadFile.size, uploadFile.name)) {
      taskAddInfo.file = uploadFile
    } else {
      // 清空文件列表
      proxy.$refs.aiDrawUploadRef.clearFiles()
    }
  }
}

const handleSubmit = () => {
  proxy.$refs.aidrawFormRef.validate(valid => {
    if (valid) {
      extraData.task_name = taskAddInfo.task_name
      extraData.batch_size = taskAddInfo.batch_size
      proxy.$refs.aiDrawUploadRef.submit()
      loadingInstance = ElLoading.service({ target: document.getElementById('aidraw'), lock: true, text: 'Loading' })
    }
  })
}

const handleCancel = () => {
  taskAddInfo.task_name = ''
  taskAddInfo.batch_size = 1
  taskAddInfo.file = ''
  proxy.$refs.aiDrawUploadRef.clearFiles()
}

// 上传失败
const handleError = error => {
  loadingInstance.close()
  ElMessage.error(error.message)
  handleCancel()
}

// 成功接到响应
const handleSuccess = resp => {
  loadingInstance.close()
  handleCancel()
  if (resp.ret_code === '0') {
    ElMessage.success(`create task success, task_id: ${resp.data.task_id}`)
    // 触发更新task_query
    getTaskNameArr()
  } else {
    ElMessage.error(resp.message)
  }
}

// 任务查询相关
const taskNameArr = ref([])
const selectName = ref()
const taskInfo = ref({
  task_id: 0,
  caption_num: 0,
  caption_success_num: 0,
  caption_fail_num: 0,
  image_total_num: 0,
  filter_useful_num: 0,
  filter_unuseful_num: 0,
  filter_fail_num: 0,
  cdn_path: '',
  cdn_file_url: ''
})

const captionPercentage = ref(0)
const filterPercentage = ref(0)

// 请求task_name数组
const getTaskNameArr = async () => {
  const username = getCookie('user_name')
  const resp = await proxy.$api.aidraw.queryByUsername({ username: username })
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  if (resp.data.ret_code === '0') {
    if (resp.data.data.length > 0) {
      taskNameArr.value = resp.data.data.map(item => {
        return {
          label: item,
          value: item
        }
      })
      selectName.value = resp.data.data[0]
      searchTask()
    }
  } else {
    ElMessage.error(resp.data.message || 'get task name arr err')
  }
}

// 查询task
const searchTask = async () => {
  if (selectName.value !== '') {
    const resp = await proxy.$api.aidraw.queryByTaskName({ task_name: selectName.value })
    //   请求出错
    if (typeof resp === 'string') {
      ElMessage.error(resp)
      return
    }
    if (resp.data.ret_code === '0') {
      taskInfo.value = resp.data.data
      captionPercentage.value = ((taskInfo.value.caption_fail_num + taskInfo.value.caption_success_num) * 100) / taskInfo.value.caption_num
      if (taskInfo.value.image_total_num == 0) {
        filterPercentage.value = 0
      } else {
        filterPercentage.value = ((taskInfo.value.filter_fail_num + taskInfo.value.filter_unuseful_num + taskInfo.value.filter_useful_num) * 100) / taskInfo.value.image_total_num
      }
    } else {
      ElMessage.error(resp.data.message || 'get task info failed')
    }
  }
}

onMounted(() => {
  getTaskNameArr()
})

// 选中值改变
const handleChange = () => {
  searchTask()
}

const refresh = () => {
  searchTask()
}
</script>

<style lang="less" scoped>
.task-info {
  margin-top: 30px;
  width: 50%;
}

.el-icon {
  padding-left: 20px;
  cursor: pointer;
}
</style>
