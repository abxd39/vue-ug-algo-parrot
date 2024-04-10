<template>
  <div class="asset">
    <span style="padding-left: 20px; padding-right: 5px">Game code:</span>
    <el-select v-model="taskSearch.game_code" placeholder="Select Game" size="large">
      <el-option v-for="item in gameArr" :key="item.value" :label="item.label" :value="item.value" />
    </el-select>
    <span style="padding-left: 20px; padding-right: 5px">Keyword:</span>
    <input v-model="taskSearch.key_word" type="text" placeholder="keyword" style="width: 150px; height: 25px" />
    <span style="padding-left: 20px; padding-right: 5px">Date:</span>
    <el-date-picker
      size="large"
      v-model="taskSearch.date"
      type="daterange"
      unlink-panels
      range-separator="To"
      start-placeholder="Start date"
      end-placeholder="End date"
      :shortcuts="shortcuts"
      clearable
      :disabled-date="disabledDate"
      style="margin-left: 20px"
    />

    <el-button size="large" @click="search" style="margin-left: 100px">Search</el-button>
  </div>
  <el-card shadow="never" class="asset" style="text-align: left">
    <el-table :data="tableData.service" style="width: 100%">
      <el-table-column prop="task_name" label="Task name" width="220" />
      <el-table-column prop="game" label="Game" width="120" sortable />
      <el-table-column prop="create_time" label="Create time" width="200" sortable />
      <el-table-column prop="creator" label="Creator" width="140" sortable />
      <el-table-column prop="result_table" label="Result table" width="150" sortable />
      <el-table-column prop="status" label="Status" width="170" sortable>
        <template #default="props">
          <el-tag v-if="props.row.status == 'Success'" type="success">{{ props.row.status }} </el-tag>
          <el-tag v-if="props.row.status == 'Failed'" type="danger">{{ props.row.status }} </el-tag>
          <el-tag v-if="props.row.status == 'Runing'">{{ props.row.status }} </el-tag>
          <el-tag v-if="props.row.status == 'unknow'">{{ props.row.status }} </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operation" label="Operation" width="300">
        <template #default="props">
          <el-button type="primary" :text="true" @click="taskEdit(props.row)"> Edit</el-button>
          <el-button type="primary" :text="true" @click="taskCopy(props.row)"> Duplicate </el-button>
          <el-button type="primary" :text="true" @click="deleteButton(props.row.task_id)"> Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="paginationDisabled" :page-size="pageSize" small="small" @current-change="handleCurrentChange" layout="prev, pager, next" :total="totalCount" style="width: 50%" />
  </el-card>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, toRefs, onMounted } from 'vue'
import { formatDate } from '@/utils/common_utils'
import { getCookie } from '@/utils/api_utils'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'
const router = useRouter()
const { proxy } = getCurrentInstance()
// 触发父组件的方法
const emits = defineEmits(['editTask','taskDuplication'])
var code = getCookie('code')
const props = defineProps({
  gameArr: {
    type: Array,
    required: true
  }
})
const onDayTime = 24 * 60 * 60 * 1000
const { gameArr } = toRefs(props)
const taskSearch = reactive({
  game_code: '',
  key_word: '',
  date: []
})

gameArr.value.push({
  label: 'hok',
  value: 'hok'
})
const pageSize = ref(10)
const totalCount = ref(0)
const paginationDisabled = ref(true)
let pageNum = 0
let pageSie = 10
const tableData = reactive({
  service: []
})

// 时间
const shortcuts = [
  {
    text: 'Last day',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - onDayTime)
      end.setTime(end.getTime() - onDayTime)
      return [start, end]
    }
  },
  {
    text: 'Last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - onDayTime * 7)
      end.setTime(end.getTime() - onDayTime)
      return [start, end]
    }
  },
  {
    text: 'Last 14 days',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - onDayTime * 14)
      end.setTime(end.getTime() - onDayTime)
      return [start, end]
    }
  },
  {
    text: 'Last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - onDayTime * 30)
      end.setTime(end.getTime() - onDayTime)
      return [start, end]
    }
  },
  {
    text: 'Last 2 months',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - onDayTime * 60)
      end.setTime(end.getTime() - onDayTime)
      return [start, end]
    }
  }
]

const disabledDate = dateObj => {
  const nowDate = new Date()
  if (nowDate - dateObj > onDayTime * 61 || nowDate - dateObj < onDayTime) return true
}

const getList = async () => {
  if (!code) {
    ElMessage.error('get code err, please login again')
    return
  }
  var start_time = 0
  var end_time = 0
  if (taskSearch.date?.length) {
    start_time = dayjs(formatDate(taskSearch.date[0], 'yyyy-mm-dd')).unix()
    end_time = dayjs(formatDate(taskSearch.date[1], 'yyyy-mm-dd')).unix()
  }
  const resp = await proxy.$api.applications.taskList({
    game: taskSearch.game_code ?? '',
    code: code,
    key_word: taskSearch.key_word ?? '',

    start_time: start_time ?? 0,
    end_time: end_time ?? 0,
    page_num: pageNum,
    page_size: pageSie
  })
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { err_code, task_list, total, err_msg } = resp.data
  if (err_code === '0') {
    ElMessage.success(`search success`)
    totalCount.value = parseInt(total)
    tableData.service = []
    task_list.forEach(item => {
      tableData.service.push({
        task_id: item.task_id,
        task_name: item.task_name,
        game: item.game,
        create_time: timestampToTime(item.create_time),
        creator: item.creator,
        analysze_sql: item.analysze_sql,
        extract_sql: item.extract_sql,
        output: item.output,
        analysis_result: item.analysis_result,
        tag_list: item.tag_list,
        extracted_count: item.extracted_count,
        order_by: item.order_by,
        result_table: item.output,
        status: status(item.state),
        op_str:item.op_str
      })
    })
  } else {
    ElMessage.error(err_msg || 'get task list failed')
  }
}

const getTimestamp = val => {
  if (val) {

    //return d.getTime()
  }
  return ''
}

const status = val => {
  let stateFailed = [104, 105, 103, 102]
  let stateRun = [1, 2, 3, 4, 5]
  if (stateFailed.includes(val)) {
    return 'Failed'
  }
  if (stateRun.includes(val)) {
    return 'Runing'
  }
  if (val == 6) {
    return 'Success'
  }
  return 'unknow'
}
const timestampToTime = timestamp => {
  var date = new Date(timestamp * 1000) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  return formatDate(date, 'yyyy-mm-dd hh:MM:ss')
}

const search = () => {
  getList()
}
const handleCurrentChange = val => {
  pageNum = val
  getList()
}

const deleteButton = async id => {
  const resp = await proxy.$api.applications.taskDelete({ task_id: id })
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }

  const { err_code, err_msg } = resp.data
  if (err_code != '0') {
    ElMessage.error(err_msg || 'taskDelete failed')
    return
  }
  ElMessage.success(`delete success`)
}

const taskEdit = tags => {
  emits('editTask',tags)
}

const taskCopy = tags => {
  emits('taskDuplication',tags)
}


onMounted(() => {
  getList()
})
</script>
