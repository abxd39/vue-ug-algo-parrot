<template>
  <el-dialog v-model="editRuleDialogVisible" draggable title="Edit Rule" width="60%">
    <el-form label-position="left" label-width="150px" :model="editRuleForm" :rules="editRules" ref="ruleEditFormRef" style="max-height: 600px; overflow: auto" size="small">
      <el-form-item label="Game:" prop="game_code">
        <el-select v-model="editRuleForm.game_code" placeholder="select game" disabled style="width: 50%">
          <el-option v-for="item in gameArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="Rule Name" prop="rule_name">
        <el-input v-model="editRuleForm.rule_name" style="width: 50%" />
      </el-form-item>
      <el-form-item label="Optimization Level:" prop="opt_level">
        <el-radio-group v-model="editRuleForm.opt_level" @change="editRuleOnclickRadio">
          <el-radio label="campaign">campaign</el-radio>
          <el-radio label="media">media</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Campaign Type:" prop="campaign_type">
        <el-select v-model="editRuleForm.campaign_type" placeholder="select campaign_type" style="width: 50%" disabled>
          <el-option v-for="item in campainTypeArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="Scope:" prop="openid">
        <el-select v-model="editRuleForm.openid" placeholder="select openid" style="width: 50%" :disabled="editOpenidDisabled">
          <el-option v-for="item in openidArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="Date:">
        <div style="width: 50%" data-tip="The time range of data that you'd like to include for optimization.">
          <el-date-picker
            v-model="editRuleForm.date"
            type="daterange"
            unlink-panels
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            :shortcuts="shortcuts"
            clearable
            :disabled-date="disabledDate"
            :disabled="DateDisabled"
          />
        </div>
      </el-form-item>
      <el-form-item label="Tracking Basis:" prop="tracking_basis">
        <el-select v-model="editRuleForm.tracking_basis" placeholder="select tracking_basis" style="width: 50%" @change="editTrackChange">
          <el-option v-for="item in editTrackingBasis" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="Country:" prop="country">
        <el-select v-model="editRuleForm.country" placeholder="select country" style="width: 50%" filterable clearable>
          <el-option v-for="item in countryArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="Optimization Target" prop="target">
        <el-select v-model="editRuleForm.target" placeholder="select target" style="width: 50%">
          <el-option v-for="item in editTargetArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      
      <el-form-item label="Campaigns:" prop="object">
        <div style="display: flex; justify-content: space-between; width: 50%">
          <el-button @click="editObject">edit campaign</el-button>
          <span>
            <el-button v-if="editRuleForm.object.length > 0" @click="selectObjectStatusUpdate">update </el-button>
            <el-button v-if="editRuleForm.object.length > 0" @click="clearEditObject" type="danger" plain>clear</el-button>
          </span>
        </div>
      </el-form-item>
      <el-form-item>
        <ul>
          <li v-for="item in editRuleForm.object" :key="item">
            <el-tag type="info" closable @close="delEditObjectTag(item)">{{ item }}</el-tag>
            <el-button
              :icon="editRuleForm.object_status[item] == 'frozen' ? 'Lock' : 'Unlock'"
              @click="editFroen(item, $event)"
              :title="editRuleForm.object_status[item] == 'frozen' ? 'frozen' : 'active'"
            ></el-button>
          </li>
        </ul>
      </el-form-item>
      <el-form-item v-if="editRuleForm.target === 22" label="Constraint:" prop="constraint" :rules="[{ required: true, message: 'please select constraint', trigger: 'blur' }]">
        <el-button @click="editAddConstraint" type="primary" plain :icon="Plus"> </el-button>
      </el-form-item>
      <el-form-item v-else label="Constraint:">
        <el-button @click="editAddConstraint" type="primary" plain :icon="Plus"> </el-button>
      </el-form-item>
      <el-form-item v-for="item in editRuleForm.constraint" :key="item.id" :prop="item.id" :rules="[{ validator: checkConstraint, trigger: 'blur' }]">
        <el-select v-model="item.constraint_select" placeholder="select constraint" style="width: 200px">
          <el-option v-for="item in editConstraintArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select-v2 v-if="editRuleForm.opt_level=='campaign'"  style="width: 500px;padding-left: 10px;"
              v-model="item.select_campaign"
              :options="options"
              placeholder="All Campaign"
              multiple
              collapse-tags
              collapse-tags-tooltip
              >
            </el-select-v2>
        <span v-text="lessArr.includes(item.constraint_select) ? '<' : '>'" style="padding-left: 10px; font-weight: bold"></span>
        <el-input v-model="item.constraint_value" placeholder="input rule constraint value" style="width: 150px; padding-left: 10px" />
        <el-button @click="editDelConstraint(item.id)" type="danger" plain :icon="Minus" style="margin-left: 20px"></el-button>
      </el-form-item>
      <el-form-item v-if="editRuleForm.target !== 22" label="Budget:" prop="budget">
        <el-input v-model.number="editRuleForm.budget" placeholder="input budget" style="width: 50%" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="handleEditCancle">Cancel</el-button>
        <el-button type="primary" @click="handleEditConfirm">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 编辑界面object的弹框 -->
  <ObjectSelect ref="editObjectRef" :game_code="editRuleForm.game_code" :campaign_type="editRuleForm.campaign_type" :code="code" @updateObject="updateEditObject" />
</template>
<script setup>
import { ref, reactive, getCurrentInstance, onMounted, toRefs } from 'vue'
import { Plus, Minus } from '@element-plus/icons-vue'
import { campainTypeArr, openidArr, targetArr, trackingBasisArr, countryArr, constraintTempArr } from './data'
import { formatDate } from '@/utils/common_utils'
import { nanoid } from 'nanoid'
const { proxy } = getCurrentInstance()
const props = defineProps({
  permissionCode: {
    type: String,
    required: true
  }
})
const onDayTime = 24 * 60 * 60 * 1000
const { permissionCode } = toRefs(props)
var code=permissionCode.value
const DateDisabled = ref(false)
const editRuleDialogVisible = ref(false)
const editRuleForm = reactive({
  game_code: '',
  rule_name: '',
  opt_level: '',
  campaign_type: '',
  target: '',
  openid: '',
  constraint: [],
  object: [],
  object_status: {},
  budget: 0,
  tracking_basis: '',
  country: '',
  date: []
})
const options=ref([])
const select_campaign=ref([])
const lessArr = ['cpi', 'cpr']
const editFroen = (item, op) => {
  if (editRuleForm.object_status[item] == 'active') {
    editRuleForm.object_status[item] = 'frozen'
  } else {
    editRuleForm.object_status[item] = 'active'
  }
}

let editFormConstraintArr = []
let allCampaignArr=[]
const editTrackingBasis = ref([])
const editTargetArr = ref([])
const editConstraintArr = ref([])
const editOpenidDisabled = ref(false)

const gameArr = ref([])
const emits = defineEmits(['updateRuleArr'])
const campaignChange = () => {
  // campaign_type
  if (editRuleForm.campaign_type === 2) {
    editTrackingBasis.value = trackingBasisArr.slice(0, 2)
    editOpenidDisabled.value = false
  } else {
    editTrackingBasis.value = trackingBasisArr.slice(2, 4)
    editOpenidDisabled.value = true
  }
}

const trackChange = () => {
  // tracking_basis
  if (editRuleForm.tracking_basis === 1) {
    const targetFilterValue = [1, 2, 3, 5, 7, 8, 10, 11, 13, 15, 16, 19, 20, 22]
    editTargetArr.value = targetArr.filter(item => targetFilterValue.includes(item.value))
    const constraintFilter = ['CPI', 'Installs', 'D2 Retention Rate', 'D7 Retention Rate', 'D1 ROAS', 'D3 ROAS', 'D7 ROAS']
    editConstraintArr.value = constraintArr.filter(item => constraintFilter.includes(item.label))
  } else if (editRuleForm.tracking_basis === 2) {
    const targetFilterValue = [3, 5, 10, 11, 13, 15, 16, 19, 20, 22]
    editTargetArr.value = targetArr.filter(item => targetFilterValue.includes(item.value))
    const constraintFilter = ['CPR', 'Registers', 'D2 Retention Rate', 'D7 Retention Rate', 'D1 ROAS', 'D3 ROAS', 'D7 ROAS']
    editConstraintArr.value = constraintArr.filter(item => constraintFilter.includes(item.label))
  } else {
    const targetFilterValue = [4, 6, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22]
    editTargetArr.value = targetArr.filter(item => targetFilterValue.includes(item.value))
    editConstraintArr.value = constraintArr.filter(item => item.value === 'cpr')
  }
}
const checkBudget = (rule, value, callback) => {
  if (value <= 0) {
    return callback(new Error('budget must greater than 0'))
  }
  callback()
}


const editRules = reactive({
  game_code: [{ required: true, message: 'please select game_code name', trigger: 'blur' }],
  opt_level: [{ required: true, message: 'please select level', trigger: 'blur' }],
  target: [{ required: true, message: 'please select target', trigger: 'blur' }],
  openid: [{ required: true, message: 'please select openid', trigger: 'blur' }],
  object: [{ required: true, message: 'please select object', trigger: 'blur' }],
  budget: [
    { required: true, message: 'please input budget', trigger: 'blur' },
    { type: 'number', message: 'must be a number' },
    { validator: checkBudget, trigger: 'blur' }
  ],
  campaign_type: [{ required: true, message: 'please select campaign_type', trigger: 'blur' }],
  tracking_basis: [{ required: true, message: 'please select object', trigger: 'blur' }]
})



const constraintArr = constraintTempArr.map(item => {
  return {
    label: item,
    value: item.toLocaleLowerCase().split(' ').join('_')
  }
})

// track basis改变时
const editTrackChange = () => {
  editRuleForm.target = ''
  editRuleForm.constraint = []
  trackChange()
}

// 添加约束
const editAddConstraint = () => {
  // 当第一次添加的时候，页面上面还没有props为constraint的元素，会报警告ElementPlusError: [ElForm] please pass correct props!, 所以第一次不用验证
  const nId = nanoid()
  const item = {
    id: nId,
    constraint_select: '',
    constraint_value: '',
    select_campaign: editRuleForm.object? editRuleForm.object:[],
    //todo
  }
  if (editRuleForm.constraint.length === 0) {
    editRuleForm.constraint.push(item)
  } else {
    proxy.$refs.ruleEditFormRef.validateField(editFormConstraintArr, valid => {
      if (valid) {
        editRuleForm.constraint.push(item)
      }
    })
  }
  editFormConstraintArr.push(nId)
  editRuleForm[nId] = item
}

// 删除约束
const editDelConstraint = id => {
  editFormConstraintArr = editFormConstraintArr.filter(item => item !== id)
  delete editRuleForm[id]
  editRuleForm.constraint = editRuleForm.constraint.filter(item => {
    return item.id !== id
  })
}

const handleEditCancle = () => {
  editRuleDialogVisible.value = false
}

// 发送修改请求
const handleEditConfirm = async () => {
  // 构造请求参数
  proxy.$refs.ruleEditFormRef.validate(async valid => {
    if (valid) {
      if (!code) {
        ElMessage.error('get code err, please login again')
        return
      }
      const requestData = { object_status: {}, opt_target: {}, opt_constraint: [], start_date: '', end_date: '' }
      requestData.rule_id = editRuleForm.rule_id
      requestData.rule_name = editRuleForm.rule_name
      requestData.opt_level = editRuleForm.opt_level
      requestData.opt_target.openid = editRuleForm.openid
      requestData.opt_target.metric = editRuleForm.target
    //   editRuleForm.constraint.forEach(item => {
    //     requestData.opt_constraint[item.constraint_select] = Number(item.constraint_value, 10)
    //   })
      editRuleForm.constraint.forEach(item => {
        // if (item.select_campaign.length==0){
        //   item.select_campaign.push(...allCampaignArr)
        // }
        requestData.opt_constraint.push({
          value:Number(item.constraint_value, 10),
          scope:item.select_campaign,
          key:item.constraint_select
        })
      })
      requestData.opt_objects = editRuleForm.object
      editRuleForm.object.forEach(element => {
        requestData.object_status[element] = editRuleForm.object_status[element]
      })

      requestData.opt_budget = editRuleForm.budget
      requestData.tracking_basis = editRuleForm.tracking_basis
      requestData.country = editRuleForm.country
      requestData.code = code
      // 添加日期
      if (editRuleForm.date && editRuleForm.date.length === 2) {
        requestData.start_date = formatDate( new Date(editRuleForm.date[0]) , 'yyyy-mm-dd')
        requestData.end_date = formatDate( new Date (editRuleForm.date[1]), 'yyyy-mm-dd')
      }
      // 构建参数并提交rule
      const resp = await proxy.$api.automation.ruleUpdate(requestData)
      // 请求出错
      if (typeof resp === 'string') {
        ElMessage.error(resp)
        return
      }
      const { ret_code, message } = resp.data
      if (ret_code === '0') {
        ElMessage.success('update success')
      } else {
        ElMessage.error(message || 'update failed')
      }
      editRuleDialogVisible.value = false
      // 查询新的rule列表
      //调佣父组件函数
     
      emits('updateRuleArr')
    }
  })
}

const editObject = () => {
  proxy.$refs.editObjectRef.clickObject()
}

// 清空object
const clearEditObject = () => {
  proxy.$refs.editObjectRef.clearObject()
}

// 删除object tag
const delEditObjectTag = tag => {
  editRuleForm.constraint.forEach(item=>{
    item.select_campaign= item.select_campaign.filter(campaign =>{
      return campaign!=tag
    })
  })
  proxy.$refs.editObjectRef.delObjectTag(tag)
}

// 编辑object
const updateEditObject = (selectObjectArr, budgetSum) => {
  editRuleForm.object = ref(selectObjectArr)
  editRuleForm.budget = budgetSum

  options.value=Array.from({ length: editRuleForm.object.length }).map((_, idx) => ({
  value: `${editRuleForm.object[idx%editRuleForm.object.length]}`,
  label: `${editRuleForm.object[idx%editRuleForm.object.length]}`,
}))

}


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

const automationEditInit = row => {
  editRuleDialogVisible.value = true
  editRuleForm.game_code = row.game_code
  editRuleForm.rule_name = row.rule_name
  editRuleForm.opt_level = row.opt_level
  editRuleForm.campaign_type = row.campaign_type
  editRuleForm.target = row.target
  editRuleForm.openid = row.openid
  editRuleForm.constraint = row.constraint
  editRuleForm.object = JSON.parse(JSON.stringify(row.object))
  editRuleForm.object_status = row.object_status
  editRuleForm.budget = row.budget
  editRuleForm.tracking_basis = row.tracking_basis
  editRuleForm.country = row.country
  editRuleForm.rule_id = row.rule_id
  if (row.start_date === '' || row.end_date === '') {
    editRuleForm.date = []
  } else {
    editRuleForm.date = [new Date(row.start_date), new Date(row.end_date)]
  }
  // 用于constraint的校验
  row.constraint.forEach(item => {
    editRuleForm[item.id] = item
    editFormConstraintArr.push(item.id)
  })
  options.value=Array.from({ length: editRuleForm.object.length }).map((_, idx) => ({
  value: `${editRuleForm.object[idx%editRuleForm.object.length]}`,
  label: `${editRuleForm.object[idx%editRuleForm.object.length]}`,
}))
  campaignChange()
  trackChange()
  GameEditDemoDate()
  proxy.$refs.editObjectRef.getAllObjectArr(editRuleForm.game_code, editRuleForm.campaign_type, code, editRuleForm.object)
}

const editRuleOnclickRadio = radioValue => {
  editRuleForm.opt_level = radioValue
}
const GameEditDemoDate = () => {
  //检查game 是否为demo 如果是demo 则date 为固定日期且不能修改
  if (editRuleForm.game_code === 'demo') {
    DateDisabled.value = true
    editRuleForm.date = ['2023-08-15', '2023-08-30']
  }
}

const selectObjectStatusUpdate = () => {
  proxy.$refs.editObjectRef.updateObjectStatus()
}

const clickObject = () => {
  proxy.$refs.addObjectRef.getAllObjectArr(editRuleForm.game_code, editRuleForm.campaign_type, code,editRuleForm.object)
  proxy.$refs.addObjectRef.clickObject()
}

// 清空object
const clearAddObject = () => {
  proxy.$refs.addObjectRef.clearObject()
}


// 删除object tag
const delObjectTag = tag => {
  proxy.$refs.addObjectRef.delObjectTag(tag)
}

const checkConstraint = (rule, item, callback) => {
  // 不能为空
  if (item.constraint_select === '' || item.constraint_value === '') {
    return callback(new Error(`value can not be empty`))
  }
  // 必须是数字
  if (isNaN(Number(item.constraint_value, 10))) {
    return callback(new Error(`the value of ${item.constraint_select} must be number`))
  }
  // 必须都要大于0
  if (Number(item.constraint_value, 10) <= 0) {
    return callback(new Error(`the value of ${item.constraint_select} must be more than 0`))
  }
  // rate百分比的数字要小于1
  if (item.constraint_select.endsWith('_rate')) {
    if (Number(item.constraint_value, 10) >= 1) {
      return callback(new Error(`the value of ${item.constraint_select} must be less than 1`))
    }
  }
  callback()
}
// rule查询相关
// //
// const ruleArr = ref()
// const getRuleArr = async () => {
//   if (!code) {
//     ElMessage.error('get code err, please login again')
//     return
//   }
//   // 根据用户名查询rule
//   const resp = await proxy.$api.automation.ruleQuery({ creator: username, code: code })
//   //   请求出错
//   if (typeof resp === 'string') {
//     ElMessage.error(resp)
//     return
//   }
//   const { ret_code, data, message } = resp.data
//   if (ret_code === '0') {
//     ruleArr.value = data.map(item => {
//       const constraint = []
//       Object.keys(item.opt_constraint).forEach(key => {
//         if (item.opt_constraint[key] !== 0) {
//           constraint.push({
//             id: nanoid(),
//             constraint_select: key,
//             constraint_value:item.opt_constraint[key].value,
//             select_campaign:item.opt_constraint[key].scope
//           })
//         }
//       })
//       return {
//         rule_id: item.rule_id,
//         game_code: item.game_code,
//         rule_name: item.rule_name,
//         opt_level: item.opt_level,
//         target: item.opt_target.metric,
//         openid: item.opt_target.openid,
//         constraint: constraint,
//         object: item.opt_objects,
//         object_status: item.object_status,
//         budget: item.opt_budget,
//         creator: item.creator,
//         create_time: item.create_time,
//         tracking_basis: item.tracking_basis === 0 ? '' : item.tracking_basis,
//         country: item.country,
//         campaign_type: item.campaign_type,
//         start_date: item.start_date,
//         end_date: item.end_date,
//         subscribe: item.subscribe ? item.subscribe : 'unsubscribe'
//       }
//     })
//   } else {
//     ElMessage.error(message || 'get rule failed')
//   }
// }


// 暴露变量和方法
defineExpose({
  automationEditInit
})
</script>
