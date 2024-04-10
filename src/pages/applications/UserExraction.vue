<template>
  <Breadcrumb />
  <div class="outer-box">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <el-tab-pane name="first" :label="tableName">
        <div class="outer-box">
          <el-form :model="exraction" ref="taskCommitRef" label-width="150px" label-height="100px" label-position="left" :rules="addRules">
            <el-form-item label="Game:" prop="game_code">
              <el-select v-model="exraction.game_code" placeholder="select game" @change="gameChange" :disabled="gameCodeDisabled" style="width: 300px">
                <el-option v-for="item in gameArr" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="Source:" prop="source">
              <el-select v-model="exraction.source" placeholder="select game" @change="sourceChange" style="width: 300px">
                <el-option v-for="item in sourceArr" :key="item.table_name" :label="item.table_name" :value="item.table_name" />
              </el-select>
            </el-form-item>
            <el-form-item label="Labels:" prop="labels">
              <el-checkbox-group v-model="exraction.labels" @change="labelsChange">
                <el-row :gutter="24">
                  <el-col :span="6" v-for="(item, index) in lables" :key="index">
                    <el-checkbox :label="item.tag_name">{{ item.tag_name }}</el-checkbox>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="primary" @click="cancelSelectObject">customized lable</el-button>
                  </el-col>
                </el-row>
              </el-checkbox-group>
            </el-form-item>
            <!-- <el-form-item label="Operation:" prop="operation"></el-form-item> -->
            <el-form-item
              :label="index == 0 ? 'Operation:' : ''"
              v-for="(tag, index) in exraction.operation"
              :key="index"
              :prop="tag.tag_name"
              :rules="[{ validator: checkOperation, trigger: 'blur' }]"
            >
              <el-row :gutter="20">
                <el-col v-if="index >= 1" :span="4">
                  <el-select v-model="tag.logicType" placeholder="select logic type" @change="tagLogicTypeChange">
                    <el-option v-for="item in logicType" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-col>
                <el-col :span="3">
                  <span>{{ tag.tag_name }} </span>
                </el-col>
                <el-col :span="8">
                  <el-select v-model="tag.opType" placeholder="select opType" @change="tagOpTypeChange">
                    <el-option v-for="item in operationTyps" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </el-col>
                <el-col :span="6">
                  <input v-model="tag.inputValue" type="text" placeholder="value" style="width: 100%; height: 25px" @change="tagInputValueChange" />
                </el-col>
                <el-col :span="3">
                  <el-button @click="delOperation(tag.tag_name)" type="danger" plain :icon="Minus"></el-button>
                </el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="Order by:" prop="orderby" :rules="[{ validator: checkOrderby, trigger: 'blur' }]">
              <input v-model="exraction.orderby.orderField" type="text" placeholder="value" style="width: 150px; height: 25px" prop="orderField" @change="orderByFieldChange" />
              <el-select v-model="exraction.orderby.orderType" placeholder="select op" style="padding-left: 10px" prop="orderType" @change="orderByTypeChange">
                <el-option v-for="item in orderByArr" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="ID Num:" prop="idNum">
              <input v-model="exraction.idNum" type="text" placeholder="value" style="width: 150px; height: 25px" @change="idNumChange" />
              <span style="padding-left: 10px; width: 150px; height: 25px"> (TopN 绝对数量/比例)</span>
            </el-form-item>
            <div style="height: 30px"></div>
            <span style="padding-left: 200px">generated sql:SELECT * FROM {{ exraction.source }} WHERE{{ generated }} LIMIT {{ exraction.idNum }}</span>
            <div style="height: 100px"></div>
            <div style="text-align: center; width: 50%">
              <el-button size="large" type="primary" @click="handleSubmit">Submit</el-button>
              <el-button style="margin-left: 100px" size="large" @click="handleCancel">Cancel</el-button>
            </div>
          </el-form>
        </div>
      </el-tab-pane>

      <el-tab-pane name="second" label="Tasks"
        ><div class="outer-box" v-if="disabledTask == true">
          <userExractionTask ref="taskRef" :gameArr="gameArr" @editTask="editTask" @taskDuplication="taskDuplication"></userExractionTask>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, toRefs } from 'vue'
import { Plus, Minus } from '@element-plus/icons-vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import { sendUserAction, getCookie } from '@/utils/api_utils'
import { operationTyps, getValueOfType } from './UserData.js'
import userExractionTask from './UserExractionTask.vue'
import Schema from 'async-validator'
import dayjs from 'dayjs'
const activeName = ref('first')
const { proxy } = getCurrentInstance()
const tableName = ref('New Extraction')
// 用户名
var taskId = 0
var taskName = ''
var taskEdit = false
var taskCopy = false
const username = getCookie('user_name')
const code = getCookie('code')
const disabledTask = ref(false)
const generated = ref('')
const exraction = reactive({
  game_code: '',
  source: '',
  labels: [],
  operation: [],
  orderby: {
    orderField: '', //排序字段
    orderType: ''
  },

  idNum: 1
})

const TagLabel = ref({
  tag_id: 0,
  tag_name: '',
  tag_comment: '',
  ck_source: '',
  thive_source: false,
  label_valid: false,
  tag_express_option: '',
  tag_express_value: ''
})
const gameCodeDisabled = ref(false)

const gameArr = ref([
  {
    label: 'hok',
    value: 'hok'
  }
])
const sourceArr = ref([])
const lables = ref([])

const orderByArr = ref([
  {
    label: 'DESC',
    value: 1
  },
  {
    label: 'ASC',
    value: 2
  }
])

const orderByTypeGetLabel = args => {
  for (let i = 0; i < orderByArr.value.length; i++) {
    if (orderByArr.value[i].value === args) {
      return orderByArr.value[i].label
    }
  }
  return ' '
}

const logicType = ref([
  {
    label: 'AND',
    value: 1
  },
  {
    label: 'OR',
    value: 2
  }
])

const logicTypeGetLabel = args => {
  for (let i = 0; i < logicType.value.length; i++) {
    if (logicType.value[i].value === args) {
      return logicType.value[i].label
    }
  }
  return ' '
}
// 获取权限
const getPermission = async () => {
  if (!code) {
    //ElMessage.error('get code err, please login again')
    return
  }
  const resp = await proxy.$api.automation.permission({ code: code })
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    if (data.game_codes.length > 0) {
      var games = data.game_codes.map(item => {
        return {
          label: item,
          value: item
        }
      })
      gameArr.value.push(...games)
      exraction.game_code = gameArr.value[0].value
    } else {
    }
  } else {
    ElMessage.error(message || 'get permission err')
  }
}

getPermission()

// tab相关

// tab点击的时候触发
const tabClick = context => {
  if (context.props.label === 'Tasks') {
    disabledTask.value = true
  } else {
    disabledTask.value = false
  }
  sendUserAction({ page_name: context.props.label })
}

const gameChange = () => {}

const sourceChange = () => {
  lables.value=[]
  getFieldLabelList()
}

const tagId = tagName => {
  if (lables.value.length === 0) {
    return
  }
  for (let i = 0; i < lables.value.length; i++) {
    if (lables.value[i].tag_name == tagName) {
      return lables.value[i]
    }
  }
  return -1
}

const labelsChange = args => {
  let arr = Array.from(new Set(args))
  //转map
  let operationLabelsMap = new Map()
  exraction.operation.forEach(item => {
    operationLabelsMap.set(item.tagComment, item)
  })

  //添加新增的
  for (var i = 0; i < arr.length; i++) {
    if (!operationLabelsMap.has(arr[i])) {
      let tag = tagId(arr[1])
      var item = {
        tag_id: tag.tag_id,
        tag_name: arr[i],
        tag_comment: tag.tag_comment,
        opType: '',
        logicType: '',
        inputValue: '',
        ck_source: tag.ck_source,
        thive_source: tag.thive_source,
        label_valid: tag.label_valid,
        calc_valid: tag.calc_valid,
        tag_express_option: tag.tag_express_option,
        tag_express_value: tag.tag_express_value
      }
      operationLabelsMap.set(arr[i], item)
    }
  }
  //不存在的需要删除
  operationLabelsMap.forEach(function (value, key) {
    if (!arr.includes(key)) {
      operationLabelsMap.delete(key)
    }
  })

  let values = operationLabelsMap.values()
  exraction.operation = []
  for (let tag of values) {
    exraction.operation.push({
      tag_name: tag.tag_name,
      tag_comment: tag.tag_comment,
      logicType: tag.logicType,
      inputValue: tag.inputValue,
      opType: tag.opType,
      tag_id: tag.tag_id,
      ck_source: tag.ck_source,
      thive_source: tag.thive_source,
      label_valid: tag.label_valid,
      calc_valid: tag.calc_valid,
      tag_express_option: tag.tag_express_option,
      tag_express_value: tag.tag_express_value
    })
  }
}

//获取所有的label
const getFieldLabelList = async () => {
  const resp = await proxy.$api.applications.getFieldLabelList({ game: exraction.game_code, data_source: exraction.source })
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { err_code, tag_list, err_msg } = resp.data
  if (err_code != '0') {
    ElMessage.error(err_msg || 'get getFieldLabelList failed')
    return
  }
  tag_list.forEach(item => {
    lables.value.push({
      tag_id: item.tag_id,
      tag_name: item.tag_name,
      tag_comment: item.tag_comment,
      ck_source: item.ck_source,
      thive_source: item.thive_source,
      label_valid: item.label_valid,
      calc_valid: item.calc_valid,
      tag_express_option: item.tag_express_option,
      tag_express_value: item.tag_express_value
    })
  })
}
//source list
const getProductionList = async () => {
  const resp = await proxy.$api.applications.getProductionList()
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { err_code, game_list, err_msg } = resp.data
  if (err_code != '0') {
    ElMessage.error(err_msg || 'get getProductionList failed')
    return
  }
  sourceArr.value = []
  game_list?.forEach(item => {
    sourceArr.value.push({
      target: item.target,
      table_name: item.table_name,
      game: item.game
    })
  })

  ElMessage.success(`success`)
}

const delOperation = tagName => {
  exraction.operation = exraction.operation.filter(item => {
    if (item.tag_name != tagName) {
      return item
    }
  })
  exraction.labels = exraction.labels.filter(label => {
    if (label.tag_name != tagName) {
      return label
    }
  })
}

const orderByTypeChange = () => {
  generated.value = tagChange() + ' ORDER BY  ' + orderByChange()
}

const orderByFieldChange = () => {
  generated.value = tagChange() + ' ORDER BY ' + orderByChange()
}

const tagInputValueChange = () => {
  generated.value = tagChange()
}

const tagOpTypeChange = () => {
  generated.value = tagChange()
}
const tagLogicTypeChange = () => {
  generated.value = tagChange()
}

const tagChange = () => {
  let condition = ''
  exraction.operation.forEach(item => {
    condition = condition.concat(' ', logicTypeGetLabel(item.logicType))
    condition = condition.concat(' ', item.tag_name)
    condition = condition.concat(' ', getValueOfType(item.opType))
    condition = condition.concat(' ', item.inputValue)
  })
  return condition
}

const orderByChange = () => {
  let order = exraction.orderby.orderField
  return (order = order.concat(' ', orderByTypeGetLabel(exraction.orderby.orderType)))
}

const addRules = reactive({
  game_code: [{ required: true, message: 'please select game_code name', trigger: 'blur' }],
  source: [{ required: true, message: 'please select source ', trigger: 'blur' }],
  labels: [{ required: true, message: 'please select label', trigger: 'blur' }],
  orderby: [{ required: true, message: 'please select order by', trigger: 'blur' }],
  idNum: [{ required: true, message: 'please input idNum', trigger: 'blur' }]
})

const checkOperation = (rule, value, callback) => {
  exraction.operation.forEach((item, index) => {
    if (item.tag_name == rule.field) {
      if (index != 0) {
        //只有一个tag 时不用判断该字段
        if (!item.logicType || item.logicType == '') {
          return callback(new Error(`logicType can not be empty`))
        }
      }
      if (!item.opType || item.opType == '') {
        return callback(new Error(`opType can not be empty`))
      }
      if (!item.inputValue || item.inputValue == '') {
        return callback(new Error(`inputValue can not be empty`))
      }
      callback()
    }
  })
  // if (!value) {
  //   return callback(new Error(`value can not be empty`))
  // }
}

const checkOrderby = (rule, value, callback) => {
  if (!exraction.orderby.orderField || exraction.orderby.orderField == '') {
    return callback(new Error(`orderField can not be empty`))
  }
  if (!exraction.orderby.orderType || exraction.orderby.orderType == '') {
    return callback(new Error(`orderType can not be empty`))
  }
  callback()
}

var task_list = []

const handleSubmit = async () => {
  //暂时放上面
  proxy.$refs.taskCommitRef
    .validate(async valid => {
      if (!valid) {
        ElMessage.error('param validate faild')
        return
      }
      let sql = 'SELECT * FROM ' + exraction.source + ' WHERE' + generated.value + '  LIMIT ' + exraction.idNum
      if (taskEdit || taskCopy) {
      } else {
        taskName = exraction.game_code + '_' + exraction.source + '_' + dayjs().format('YYYYMMDD')
      }
      let request = {
        task_id: taskId,
        task_name: taskName,
        creator: username,
        op_str: JSON.stringify(exraction),
        analysze_sql: sql,
        extract_sql: sql,
        extracted_count: exraction.idNum,
        game: exraction.game_code,
        tag_list: exraction.operation,
        order_by: orderByChange()
      }
      const resp = await proxy.$api.applications.taskCommit({ task: request })
      if (typeof resp === 'string') {
        ElMessage.error(resp)
        return
      }
      const { err_code, tag, err_msg } = resp.data
      if (err_code != '0') {
        ElMessage.error(err_msg || 'get taskCommit failed')
        return
      }
      //console.log(tag)
      task_list.push(tag.task_id)
      ElMessage.success(`commit success`)
      taskSchedule()
    })
    .catch()
}

const taskSchedule = async () => {
  const resp = await proxy.$api.applications.taskSchedule({ game: exraction.game_code, task_id_list: task_list })
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { err_code, tag, err_msg } = resp.data
  if (err_code != '0') {
    ElMessage.error(err_msg || 'get taskCommit failed')
    return
  }
  //console.log(tag)
  //跳到列表页
  activeName.value='sceond'
  ElMessage.success(`schedule success`)
}

const handleCancel = () => {
  exraction.source = ''
  generated.value = ''
  exraction.idNum = 1
  exraction.labels = []
  lables.value=[]
  exraction.operation = []
  exraction.orderby.orderbyField = ''
  exraction.orderby.orderbyType = ''
  taskName = ''
  taskId = 0
  taskEdit = false
  taskCopy = false
}
const cancelSelectObject = () => {}

const init = () => {
  exraction.game_code = 'hok'
}
onMounted(() => {
  //console.log('this this ....')
  getProductionList()
  //init()
})

const editInit = param => {}

//编辑页面 跳转回来初始化页面，
const editTask = tags => {
  activeName.value = 'first'
  disabledTask.value = false
  let data = JSON.parse(tags.op_str)
  // let data = tags.op_str
  console.log(data);
  exraction.labels = data.labels
  exraction.operation = data.operation
  exraction.game_code = data.game_code
  exraction.source = data.source
  exraction.orderby.orderbyField = data.orderby.orderbyField
  exraction.orderby.orderbyType = data.orderby.orderbyType
  taskName = tags.task_name
  taskId = tags.task_id
  taskEdit = true
  getFieldLabelList()
}

const taskDuplication = tags => {
  activeName.value = 'first'
  disabledTask.value = false
  let data = JSON.parse(tags.op_str)
  exraction.labels = data.labels
  exraction.operation = data.operation
  exraction.game_code = data.game_code
  exraction.source = data.source
  exraction.orderby.orderbyField = data.orderby.orderbyField
  exraction.orderby.orderbyType = data.orderby.orderbyType
  taskCopy = true
  ElMessage.success(`duplication success`)
  getFieldLabelList()
}

//编辑提交
</script>
