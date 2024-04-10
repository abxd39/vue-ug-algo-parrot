<template>
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
</template>

<script setup>
import { reactive, getCurrentInstance } from 'vue'
import allUrl from '@/api/url'
import { getCookie } from '@/utils/api_utils'

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
}

// 成功接到响应
const handleSuccess = resp => {
  loadingInstance.close()
  if (resp.ret_code === '0') {
    ElMessage.success(`create task success, task_id: ${resp.data.task_id}`)
    handleCancel()
  } else {
    ElMessage.error(resp.message)
  }
}
</script>

<style lang="less" scoped></style>
