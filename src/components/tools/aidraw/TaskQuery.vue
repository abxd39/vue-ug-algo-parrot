<template>
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
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import { getCookie } from '@/utils/api_utils'

const { proxy } = getCurrentInstance()

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
