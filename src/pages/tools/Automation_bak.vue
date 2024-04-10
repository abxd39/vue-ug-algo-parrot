<template>
  <Breadcrumb />
  <div class="outer-box" id="automation">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <!-- 添加rule -->
      <el-tab-pane name="first" label="Rule Add">
        <div class="outer-box">
          <el-form :model="ruleAddForm" label-width="150px" label-position="left" :rules="addRules" ref="ruleAddFormRef">
            <el-form-item label="Game:" prop="game_code">
              <el-select v-model="ruleAddForm.game_code" placeholder="select game" @change="gameChange">
                <el-option v-for="item in gameArr" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="Rule Name:" prop="rule_name">
              <el-input v-model="ruleAddForm.rule_name" placeholder="input rule name" style="width: 25%" />
            </el-form-item>
            <el-form-item label="Openid:" prop="openid">
              <el-select v-model="ruleAddForm.openid" placeholder="select openid" style="width: 25%">
                <el-option v-for="item in openidArr" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="Campain Type:" prop="campain_type">
              <el-select v-model="ruleAddForm.campain_type" placeholder="select campain_type" style="width: 25%" @change="campainTypeChange">
                <el-option v-for="item in campainTypeArr" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="Optimization Target:" prop="target">
              <el-select v-model="ruleAddForm.target" placeholder="select target" style="width: 25%">
                <el-option v-for="item in targetArr" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="Constraint:">
              <el-button @click="addConstraint" type="primary" plain :icon="Plus"> </el-button>
            </el-form-item>
            <el-form-item v-for="item in ruleAddForm.constraint" :key="item.id" :prop="item.id" :rules="[{ validator: checkConstraint, trigger: 'blur' }]">
              <el-select v-model="item.constraint_select" placeholder="select constraint" style="width: 25%">
                <el-option v-for="item in constraintArr" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <span v-text="lessArr.includes(item.constraint_select) ? '<' : '>'" style="padding-left: 10px; font-weight: bold"></span>
              <!-- <el-select v-model="item.constraint_operator" placeholder="select constraint operator" style="width: 5%; padding-left: 10px" disabled>
                <el-option v-for="item in operatorArr" :key="item.value" :label="item.label" :value="item.value" />
              </el-select> -->
              <el-input v-model="item.constraint_value" placeholder="input rule constraint value" style="width: 15%; padding-left: 10px" />
              <el-button @click="delConstraint(item.id)" type="danger" plain :icon="Minus" style="margin-left: 20px"></el-button>
            </el-form-item>
            <el-form-item label="Object:" prop="object">
              <el-button @click="clickObject">select object</el-button>
            </el-form-item>
            <el-form-item>
              <ul>
                <li v-for="item in ruleAddForm.object" :key="item">
                  <el-tag type="info" closable @close="delObjectTag(item)">{{ item }}</el-tag>
                </li>
              </ul>
            </el-form-item>
            <el-form-item label="Budget:" prop="budget">
              <el-input v-model.number="ruleAddForm.budget" placeholder="input budget" style="width: 25%" />
            </el-form-item>
          </el-form>
          <div style="text-align: center; width: 25%">
            <el-button type="primary" @click="handleSubmit">Submit</el-button>
            <el-button @click="handleCancel">Cancel</el-button>
          </div>
        </div>
      </el-tab-pane>
      <!-- 查询rule -->
      <el-tab-pane name="second" label="Rule Search">
        <div class="outer-box">
          <el-table :data="ruleArr" style="width: 100%" id="ruleSearchTable" size="small" border>
            <!-- <el-table-column prop="game_code" label="Game" /> -->
            <el-table-column prop="rule_name" label="Rule Name" />
            <el-table-column prop="target" label="Optimization Target" width="150">
              <template #default="scope">
                <span>{{
                  targetArr.filter(one => {
                    return one.value === scope.row.target
                  })[0].label
                }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="constraint" label="Constraint" width="200">
              <template #default="scope">
                <ul>
                  <li v-for="item in scope.row.constraint">
                    <el-tag type="info">
                      {{
                        `${item.constraint_select} ${lessArr.includes(item.constraint_select) ? '<' : '>'} ${
                          item.constraint_select.startsWith('%') ? item.constraint_value + '%' : item.constraint_value
                        }`
                      }}
                    </el-tag>
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column prop="object" label="Object" width="600">
              <template #default="scope">
                <ul>
                  <li v-for="item in scope.row.object">
                    <el-tag type="info">{{ item }}</el-tag>
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column prop="creator" label="Creator" width="100" />
            <el-table-column prop="create_time" label="Create Time" width="130">
              <template #default="scope">
                {{ scope.row.create_time.slice(0, 19) }}
              </template>
            </el-table-column>
            <el-table-column label="Operation" width="270">
              <template #default="scope">
                <el-button type="primary" size="small" @click="editRule(scope.row)">edit</el-button>
                <el-button type="success" size="small" @click="optimize(scope.row.rule_id)">optimize</el-button>
                <el-button color="#626aef" size="small" @click="history(scope.row.rule_id)">history</el-button>
                <el-button type="danger" size="small" @click="delRule(scope.row.rule_id)">del</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <!-- object选择 -->
  <el-dialog v-model="objectVisible" title="Select Object" width="60%" align-center draggable>
    <el-table ref="objectTableRef" :data="showObjectArr" style="width: 100%; height: 500px" stripe size="small">
      <el-table-column>
        <template #default="scope">
          <input type="checkbox" :checked="scope.row.checked" @click="selectObject(scope.row)" :id="scope.row.name" />
        </template>
      </el-table-column>
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column property="name" label="name" width="600" sortable />
      <el-table-column property="budget" label="budget" width="100" show-overflow-tooltip />
      <el-table-column align="right">
        <template #header>
          <div style="display: flex">
            <el-input v-model="searchObjectStr" size="small" placeholder="search object by name" clearable @clear="clearObjectSearch" />
            <el-button :icon="Search" size="small" type="primary" style="margin-left: 3px" @click="searchObject" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSelectObject">Cancel</el-button>
        <el-button type="primary" @click="confirmSelectObjec"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 编辑rule的弹框 -->
  <el-dialog v-model="editRuleDialogVisible" title="Edit Rule" width="50%">
    <el-form label-position="left" label-width="150px" :model="editRuleForm" :rules="addRules" ref="ruleEditFormRef" style="max-height: 500px; overflow: auto" size="small">
      <el-form-item label="Game" prop="game_code">
        <el-select v-model="editRuleForm.game_code" placeholder="select game" disabled>
          <el-option v-for="item in gameArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="Rule Name" prop="rule_name">
        <el-input v-model="editRuleForm.rule_name" style="width: 50%" />
      </el-form-item>
      <el-form-item label="Openid:" prop="openid">
        <el-select v-model="editRuleForm.openid" placeholder="select openid" style="width: 50%">
          <el-option v-for="item in openidArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="Optimization Target" prop="target">
        <el-select v-model="editRuleForm.target" placeholder="select target" style="width: 50%">
          <el-option v-for="item in targetArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="Constraint:">
        <el-button @click="editAddConstraint" type="primary" plain :icon="Plus"> </el-button>
      </el-form-item>
      <el-form-item v-for="item in editRuleForm.constraint" :key="item.id" :prop="item.id" :rules="[{ validator: checkConstraint, trigger: 'blur' }]">
        <el-select v-model="item.constraint_select" placeholder="select constraint" style="width: 50%">
          <el-option v-for="item in constraintArr" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <span v-text="lessArr.includes(item.constraint_select) ? '<' : '>'" style="padding-left: 10px; font-weight: bold"></span>
        <el-input v-model="item.constraint_value" placeholder="input rule constraint value" style="width: 15%; padding-left: 10px" />
        <el-button @click="editDelConstraint(item.id)" type="danger" plain :icon="Minus" style="margin-left: 20px"></el-button>
      </el-form-item>
      <el-form-item label="Object:" prop="object">
        <ul>
          <li v-for="item in editRuleForm.object" :key="item">
            <el-tag type="info">{{ item }}</el-tag>
          </li>
        </ul>
      </el-form-item>
      <el-form-item label="Budget:" prop="budget">
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
  <!-- 删除rule的弹框 -->
  <el-dialog v-model="delRuleDialogVisible" title="Warning" width="30%" center>
    <span>This operation will permanently delete the rule. Do you want to continue?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="delRuleDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="handleDelConfirm">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- optimize抽屉 -->
  <el-drawer v-model="drawerVisible" title="Rule Adjust" direction="btt" size="70%">
    <el-table :data="adjustArr" style="width: 100%" size="small" :span-method="objectSpanMethod" stripe border v-loading="adjustLoading">
      <el-table-column prop="budget" label="budget" width="150">
        <template #default="scope">
          <!-- <el-input v-model.number="scope.row.budget" placeholder="input budget" @blur="bugetBlur(scope.row.budget, scope.$index)" style="width: 80%" /> -->
          <el-input v-if="scope.row.input" v-model.number="scope.row.budget" placeholder="input budget" @blur="bugetBlur(scope.row.budget, scope.$index)" style="width: 80%" />
          <span v-else style="display: inline-block; width: 80%">{{ `${scope.row.budget}${scope.row.label || ''}` }}</span>
          <!-- 0: 不出现，1：向下， 2：向上 -->
          <el-icon v-show="scope.row.showOpen === 1" style="cursor: pointer" @click="openDetail(scope.$index)"><CaretBottom /></el-icon>
          <el-icon v-show="scope.row.showOpen === 2" style="cursor: pointer" @click="foldDetail(scope.$index)"><CaretTop /></el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="object" label="Object" width="500" />
      <el-table-column prop="cur_budget" label="curBudget" />
      <el-table-column prop="cur_bid" label="curBid" />
      <el-table-column prop="rec_budget" label="recBudget" />
      <el-table-column prop="rec_bid" label="recBid" />
      <el-table-column prop="spend" label="Spend" width="120" />
      <el-table-column prop="installs" label="Installs" width="100" />
      <el-table-column prop="cpi" label="CPI" width="100" />
      <el-table-column prop="registers" label="Registers" width="100" />
      <el-table-column prop="cohort_register_rate" label="Cohort Register Rate" width="150" />
      <el-table-column prop="d1_cohort_register_rate" label="D1 Cohort Register Rate" width="160" />
      <el-table-column prop="d2_retention_rate" label="D2 Retention Rate" width="150" />
      <el-table-column prop="d7_retention_rate" label="D7 Retention Rate" width="150" />
      <el-table-column prop="cost_per_d2_retention" label="Cost Per D2 Retention" width="150" />
      <el-table-column prop="cost_per_d7_retention" label="Cost Per D7 Retention" width="150" />
    </el-table>
  </el-drawer>
  <!-- history抽屉 -->
  <el-drawer v-model="allVisible" title="All Rule Adjust" direction="btt" size="70%">
    <el-table :data="allAdjustArr" style="width: 100%" size="small" stripe>
      <el-table-column type="expand">
        <template #default="props">
          <el-table :data="props.row.children" size="small" :span-method="allSpanMethod" border>
            <el-table-column prop="budget" label="budget" />
            <el-table-column prop="object" label="Object" width="500" />
            <el-table-column prop="cur_budget" label="curBudget" />
            <el-table-column prop="cur_bid" label="curBid" />
            <el-table-column prop="rec_budget" label="recBudget" />
            <el-table-column prop="rec_bid" label="recBid" />
            <el-table-column prop="spend" label="Spend" width="120" />
            <el-table-column prop="installs" label="Installs" width="100" />
            <el-table-column prop="cpi" label="CPI" width="100" />
            <el-table-column prop="registers" label="Registers" width="100" />
            <el-table-column prop="cohort_register_rate" label="Cohort Register Rate" width="150" />
            <el-table-column prop="d1_cohort_register_rate" label="D1 Cohort Register Rate" width="160" />
            <el-table-column prop="d2_retention_rate" label="D2 Retention Rate" width="150" />
            <el-table-column prop="d7_retention_rate" label="D7 Retention Rate" width="150" />
            <el-table-column prop="cost_per_d2_retention" label="Cost Per D2 Retention" width="150" />
            <el-table-column prop="cost_per_d7_retention" label="Cost Per D7 Retention" width="150" />
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="Date" prop="date" />
    </el-table>
  </el-drawer>
  <!-- 确认重新计算的弹框 -->
  <el-dialog v-model="newAdjustDialogVisible" title="Notice" width="20%" center top="40vh">
    <span>Do you want to calculate new budget?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="newAdjustDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmNewAdjust">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, nextTick } from 'vue'
import { Plus, Minus, Search } from '@element-plus/icons-vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import { sendUserAction, getCookie } from '@/utils/api_utils'
import { nanoid } from 'nanoid'

// 常量
// 业务
const gameArr = [
  {
    label: 'PUBGM',
    value: 'pubgm'
  },
  {
    label: 'HOK',
    value: 'hok'
  }
]
const campainTypeArr = [
  {
    label: 'newinstall',
    value: 2
  }
]
// openid
const openidArr = [
  {
    label: 'All',
    value: 1
  },
  {
    label: 'Exist',
    value: 2
  },
  {
    label: 'New',
    value: 3
  }
]
// target
const targetArr = [
  {
    label: 'Installs',
    value: 1
  },
  {
    label: 'CPI',
    value: 2
  },
  {
    label: 'Registers',
    value: 3
  },
  {
    label: 'Cohort Register Rate',
    value: 4
  },
  {
    label: 'D1 Cohort Register Rate',
    value: 5
  },
  {
    label: 'D2 Retention Rate',
    value: 6
  },
  {
    label: 'D7 Retention Rate',
    value: 7
  },
  {
    label: 'Cost Per D2 Retention',
    value: 8
  },
  {
    label: 'Cost Per D7 Retention',
    value: 9
  }
]

// 小于号的constraint_value
const lessArr = ['cpi', 'cost_per_d2_retention', 'cost_per_d7_retention']

// 用户名
const username = getCookie('user_name')

// constraint选择
const constraintArr = targetArr.map(item => {
  return {
    label: item.label,
    value: item.label.toLocaleLowerCase().split(' ').join('_')
  }
})

// tab相关
const activeName = ref('first')
// tab点击的时候触发
const tabClick = context => {
  sendUserAction({ page_name: context.props.label })
}

// rule add相关
const { proxy } = getCurrentInstance()
// rule表单
const ruleAddForm = reactive({
  game_code: gameArr[0].value,
  rule_name: '',
  target: '',
  campain_type: campainTypeArr[0].value,
  openid: openidArr[0].value,
  constraint: [],
  object: [],
  budget: 0
})
// game发生变化时
const gameChange = () => {
  getAllObjectArr()
  ruleAddForm.object = []
  ruleAddForm.budget = 0
}

// campain发送change时
const campainTypeChange = () => {
  getAllObjectArr()
  ruleAddForm.object = []
  ruleAddForm.budget = 0
}

// 添加约束
let addFormConstraintArr = []
const addConstraint = () => {
  // 当第一次添加的时候，页面上面还没有props对应值的元素时，（如果校验数组为空时，会校验表单所有字段）会报警告ElementPlusError: [ElForm] please pass correct props!, 所以第一次不用验证
  const nId = nanoid()
  const item = {
    id: nId,
    constraint_select: '',
    constraint_value: ''
  }
  if (ruleAddForm.constraint.length === 0) {
    ruleAddForm.constraint.push(item)
  } else {
    proxy.$refs.ruleAddFormRef.validateField(addFormConstraintArr, valid => {
      if (valid) {
        ruleAddForm.constraint.push(item)
      }
    })
  }
  addFormConstraintArr.push(nId)
  // 表单里面必须要有对应prop的值
  ruleAddForm[nId] = item
  // addRules[nId] = [{ validator: checkConstraint, trigger: 'blur' }]
}

// 删除约束
const delConstraint = id => {
  addFormConstraintArr = addFormConstraintArr.filter(item => item !== id)
  delete ruleAddForm[id]
  ruleAddForm.constraint = ruleAddForm.constraint.filter(item => {
    return item.id !== id
  })
}

// Object，从接口获取Object
const allObjectArr = ref([])
const showObjectArr = ref([])
const objectVisible = ref(false)

const getAllObjectArr = async () => {
  const resp = await proxy.$api.automation.campaign({ game_code: ruleAddForm.game_code, campaign_type: ruleAddForm.campain_type })
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    allObjectArr.value = data
    showObjectArr.value = allObjectArr.value
  } else {
    ElMessage.error(message || 'get objects err')
  }
}

const queryObject = async campaign_name => {
  const resp = await proxy.$api.automation.campaign({
    game_code: ruleAddForm.game_code,
    campaign_type: ruleAddForm.campain_type,
    campaign_name: campaign_name
  })
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    showObjectArr.value = data
    // 需要标记出选择的
    showObjectArr.value.forEach(item => {
      if (ruleAddForm.object.includes(item.name)) {
        item.checked = true
      }
    })
  } else {
    ElMessage.error(message || 'get objects err')
  }
}

const clickObject = () => {
  objectVisible.value = true
}

// 搜索object
const searchObjectStr = ref('')
// 搜索object
const searchObject = () => {
  if (searchObjectStr.value.trim() === '') {
    clearObjectSearch()
  } else {
    queryObject(searchObjectStr.value.trim())
  }
}

// 点击选择框的时候触发
const selectObject = row => {
  for (const item of allObjectArr.value) {
    if (item.name === row.name) {
      // 不能直接取反，checked可能为空值
      if (item.checked) {
        item.checked = false
        ruleAddForm.object = ruleAddForm.object.filter(rule => rule !== item.name)
        ruleAddForm.budget -= item.budget
      } else {
        item.checked = true
        ruleAddForm.object.push(item.name)
        ruleAddForm.budget += item.budget
      }
      break
    }
  }
}

// 清空搜索框
const clearObjectSearch = () => {
  showObjectArr.value = allObjectArr.value
  // 因为checked缓存的原因，不得已自己操作dom
  nextTick(() => {
    showObjectArr.value.forEach(item => {
      if (item.checked) {
        document.getElementById(item.name).checked = true
      } else {
        document.getElementById(item.name).checked = false
      }
    })
  })
}

// 选择object的变化的时候
// const selectObjectChange = selection => {
//   let sumBudget = 0
//   ruleAddForm.object = selection.map(item => {
//     sumBudget += item.budget
//     return item.name
//   })
//   // budget输入框就是选择的object的budget的和
//   ruleAddForm.budget = sumBudget
// }

// 取消选择
const cancelSelectObject = () => {
  objectVisible.value = false
  // proxy.$refs['objectTableRef'].clearSelection()
  for (const item of allObjectArr.value) {
    if (item.checked) {
      item.checked = false
    }
  }
  ruleAddForm.object = []
  ruleAddForm.budget = 0
  // 搜索恢复原状
  if (searchObjectStr.value !== '') {
    searchObjectStr.value = ''
    showObjectArr.value = allObjectArr.value
  }
}

// 确认选择object
const confirmSelectObjec = () => {
  objectVisible.value = false
  // 搜索恢复原状
  if (searchObjectStr.value !== '') {
    searchObjectStr.value = ''
    showObjectArr.value = allObjectArr.value
  }
}

// 删除object tag
const delObjectTag = tag => {
  // 删除tag，并且要将object表格中选中的改为未选中
  ruleAddForm.object = ruleAddForm.object.filter(item => item != tag)
  // 获取所有选中的行
  // const selection = proxy.$refs['objectTableRef'].getSelectionRows()
  // let toggleRow
  // for (const row of selection) {
  //   if (row.name === tag) {
  //     toggleRow = row
  //     break
  //   }
  // }
  // if (toggleRow !== undefined) {
  //   proxy.$refs['objectTableRef'].toggleRowSelection(toggleRow, false)
  // }
  for (const item of allObjectArr.value) {
    if (item.name === tag) {
      item.checked = false
      ruleAddForm.budget -= item.budget
      break
    }
  }
}

// 表单校验规则
const checkBudget = (rule, value, callback) => {
  if (value <= 0) {
    return callback(new Error('budget must greater than 0'))
  }
  callback()
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

const addRules = reactive({
  game_code: [{ required: true, message: 'please select game_code name', trigger: 'blur' }],
  rule_name: [{ required: true, message: 'please input rule name', trigger: 'blur' }],
  target: [{ required: true, message: 'please select target', trigger: 'blur' }],
  openid: [{ required: true, message: 'please select openid', trigger: 'blur' }],
  object: [{ required: true, message: 'please select object', trigger: 'blur' }],
  budget: [
    { required: true, message: 'please input budget', trigger: 'blur' },
    { type: 'number', message: 'must be a number' },
    { validator: checkBudget, trigger: 'blur' }
  ],
  campain_type: [{ required: true, message: 'please select campain_type', trigger: 'blur' }]
  // constraint: [{ validator: checkConstraint, trigger: 'blur' }]
})

const handleSubmit = () => {
  // console.log(ruleAddForm)
  proxy.$refs.ruleAddFormRef.validate(async valid => {
    if (valid) {
      // 构造请求参数
      const requestData = { opt_target: {}, opt_constraint: {}, creator: username }
      requestData.game_code = ruleAddForm.game_code
      requestData.rule_name = ruleAddForm.rule_name
      requestData.opt_target.openid = ruleAddForm.openid
      requestData.opt_target.metric = ruleAddForm.target
      ruleAddForm.constraint.forEach(item => {
        requestData.opt_constraint[item.constraint_select] = Number(item.constraint_value, 10)
      })
      requestData.opt_objects = ruleAddForm.object
      requestData.opt_budget = ruleAddForm.budget
      // 构建参数并提交rule
      const resp = await proxy.$api.automation.ruleAdd(requestData)
      // 请求出错
      if (typeof resp === 'string') {
        ElMessage.error(resp)
        return
      }
      const { ret_code, message, data } = resp.data
      if (ret_code === '0') {
        ElMessage.success(`add success, rule_id: ${data.rule_id}`)
        // 提交成功后需要提醒查询重新获取ruleArr
        getRuleArr()
        // 跳转到rule search页面并且清空表单
        activeName.value = 'second'
        handleCancel()
      } else {
        ElMessage.error(message || 'submit failed')
      }
    }
  })
}

const handleCancel = () => {
  ruleAddForm.game_code = gameArr[0].value
  ruleAddForm.rule_name = ''
  ruleAddForm.target = ''
  ruleAddForm.openid = openidArr[0].value
  ruleAddForm.constraint = []
  // proxy.$refs['objectTableRef'].clearSelection()
  for (const item of allObjectArr.value) {
    if (item.checked) {
      item.checked = false
    }
  }
  ruleAddForm.object = []
  ruleAddForm.budget = 0
}

// rule查询相关
const ruleArr = ref()
const getRuleArr = async () => {
  // 根据用户名查询rule
  const resp = await proxy.$api.automation.ruleQuery({ creator: username })
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    ruleArr.value = data.map(item => {
      const constraint = []
      Object.keys(item.opt_constraint).forEach(key => {
        if (item.opt_constraint[key] !== 0) {
          constraint.push({
            id: nanoid(),
            constraint_select: key,
            constraint_value: item.opt_constraint[key]
          })
        }
      })
      return {
        rule_id: item.rule_id,
        game_code: item.game_code,
        rule_name: item.rule_name,
        target: item.opt_target.metric,
        openid: item.opt_target.openid,
        constraint: constraint,
        object: item.opt_objects,
        budget: item.opt_budget,
        creator: item.creator,
        create_time: item.create_time
      }
    })
  } else {
    ElMessage.error(message || 'get rule failed')
  }
}

// 编辑rule
const editRuleDialogVisible = ref(false)
const editRuleForm = ref({})
let editFormConstraintArr = []
const editRule = row => {
  editRuleForm.value = row
  row.constraint.forEach(item => {
    editRuleForm.value[item.id] = item
    editFormConstraintArr.push(item.id)
  })
  editRuleDialogVisible.value = true
}
// 添加约束
const editAddConstraint = () => {
  // 当第一次添加的时候，页面上面还没有props为constraint的元素，会报警告ElementPlusError: [ElForm] please pass correct props!, 所以第一次不用验证
  const nId = nanoid()
  const item = {
    id: nId,
    constraint_select: '',
    constraint_value: ''
  }
  if (editRuleForm.value.constraint.length === 0) {
    editRuleForm.value.constraint.push(item)
  } else {
    proxy.$refs.ruleEditFormRef.validateField(editFormConstraintArr, valid => {
      if (valid) {
        editRuleForm.value.constraint.push(item)
      }
    })
  }
  editFormConstraintArr.push(nId)
  editRuleForm.value[nId] = item
}

// 删除约束
const editDelConstraint = id => {
  editFormConstraintArr = editFormConstraintArr.filter(item => item !== id)
  delete editRuleForm.value[id]
  editRuleForm.value.constraint = editRuleForm.value.constraint.filter(item => {
    return item.id !== id
  })
}
const handleEditCancle = () => {
  editRuleDialogVisible.value = false
}
const handleEditConfirm = async () => {
  // 发送修改请求
  // 构造请求参数
  proxy.$refs.ruleEditFormRef.validate(async valid => {
    if (valid) {
      const requestData = { opt_target: {}, opt_constraint: {} }
      requestData.rule_id = editRuleForm.value.rule_id
      requestData.rule_name = editRuleForm.value.rule_name
      requestData.opt_target.openid = editRuleForm.value.openid
      requestData.opt_target.metric = editRuleForm.value.target
      editRuleForm.value.constraint.forEach(item => {
        requestData.opt_constraint[item.constraint_select] = Number(item.constraint_value, 10)
      })
      requestData.opt_budget = editRuleForm.value.budget
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
      getRuleArr()
    }
  })
}

// 删除rule
const delRuleDialogVisible = ref(false)
const delRuleId = ref(0)
const delRule = rule_id => {
  delRuleId.value = rule_id
  delRuleDialogVisible.value = true
}
const handleDelConfirm = async () => {
  // 通过rule id删除rule
  const resp = await proxy.$api.automation.ruleDel({ rule_id: delRuleId.value })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message } = resp.data
  if (ret_code === '0') {
    ElMessage.success('del success')
  } else {
    ElMessage.error(message || 'del failed')
  }
  delRuleDialogVisible.value = false
  // 查询新的rule列表
  getRuleArr()
}

// adjust rule
const drawerVisible = ref(false)
const adjustLoading = ref(false)
// 表格数据
const adjustArr = ref([])
const mergeRow = ref([])
// 表格原始数据（刚请求回来的数据）
let openAdjustArr = []
let foldAdjustArr = []
// 合并的表格行
let openMergeRow = []
let foldMergeRow = []
// 当前点击的rule name
let currentRuleId = ''

// 构造数据的函数
const genData = (item, openArr, foldArr, showOpen) => {
  const opt_budget = item.opt_budget
  const original_item = {
    budget: opt_budget,
    object: 'original',
    cur_budget: item.total.original.budget.toFixed(0),
    cur_bid: '-',
    rec_budget: '-',
    rec_bid: '-',
    spend: item.total.original.spend.toFixed(2),
    installs: item.total.original.installs.toFixed(0),
    cpi: item.total.original.cpi.toFixed(2),
    registers: item.total.original.registers.toFixed(0),
    cohort_register_rate: (item.total.original.cohort_register_rate * 100).toFixed(2) + '%',
    d1_cohort_register_rate: (item.total.original.d1_cohort_register_rate * 100).toFixed(2) + '%',
    d2_retention_rate: (item.total.original.d2_retention_rate * 100).toFixed(2) + '%',
    d7_retention_rate: (item.total.original.d7_retention_rate * 100).toFixed(2) + '%',
    cost_per_d2_retention: item.total.original.cost_per_d2_retention.toFixed(2),
    cost_per_d7_retention: item.total.original.cost_per_d7_retention.toFixed(2),
    showOpen: showOpen // 开始是否显示open下箭头
  }
  const opt_item = {
    budget: opt_budget,
    object: 'opt',
    cur_budget: '-',
    cur_bid: '-',
    rec_budget: item.total.opt.budget.toFixed(0),
    rec_bid: '-',
    spend: item.total.opt.spend.toFixed(2),
    installs: item.total.opt.installs.toFixed(0),
    cpi: item.total.opt.cpi.toFixed(2),
    registers: item.total.opt.registers.toFixed(0),
    cohort_register_rate: (item.total.opt.cohort_register_rate * 100).toFixed(2) + '%',
    d1_cohort_register_rate: (item.total.opt.d1_cohort_register_rate * 100).toFixed(2) + '%',
    d2_retention_rate: (item.total.opt.d2_retention_rate * 100).toFixed(2) + '%',
    d7_retention_rate: (item.total.opt.d7_retention_rate * 100).toFixed(2) + '%',
    cost_per_d2_retention: item.total.opt.cost_per_d2_retention.toFixed(2),
    cost_per_d7_retention: item.total.opt.cost_per_d7_retention.toFixed(2),
    showOpen: showOpen // 开始是否显示open下箭头
  }
  openArr.push(original_item, opt_item)
  foldArr.push(original_item, opt_item)
  item.details.forEach(item => {
    openArr.push({
      budget: opt_budget,
      object: item.campaign_name,
      cur_budget: item.original.budget.toFixed(0),
      cur_bid: item.original.bid.toFixed(2),
      rec_budget: item.opt.budget.toFixed(0),
      rec_bid: item.opt.bid.toFixed(2),
      spend: `${item.original.spend.toFixed(2)}(${item.opt.spend.toFixed(2)})`,
      installs: `${item.original.installs.toFixed(0)}(${item.opt.installs.toFixed(0)})`,
      cpi: `${item.original.cpi.toFixed(2)}(${item.opt.cpi.toFixed(2)})`,
      registers: `${item.original.registers.toFixed(0)}(${item.opt.registers.toFixed(0)})`,
      cohort_register_rate: `${(item.original.cohort_register_rate * 100).toFixed(2) + '%'}(${(item.opt.cohort_register_rate * 100).toFixed(2) + '%'})`,
      d1_cohort_register_rate: `${(item.original.d1_cohort_register_rate * 100).toFixed(2) + '%'}(${(item.opt.d1_cohort_register_rate * 100).toFixed(2) + '%'})`,
      d2_retention_rate: `${(item.original.d2_retention_rate * 100).toFixed(2) + '%'}(${(item.opt.d2_retention_rate * 100).toFixed(2) + '%'})`,
      d7_retention_rate: `${(item.original.d7_retention_rate * 100).toFixed(2) + '%'}(${(item.opt.d7_retention_rate * 100).toFixed(2) + '%'})`,
      cost_per_d2_retention: `${item.original.cost_per_d2_retention.toFixed(2)}(${item.opt.cost_per_d2_retention.toFixed(2)})`,
      cost_per_d7_retention: `${item.original.cost_per_d7_retention.toFixed(2)}(${item.opt.cost_per_d7_retention.toFixed(2)})`,
      showOpen: showOpen // 开始是否显示open下箭头
    })
  })
}

const optimize = async rule_id => {
  currentRuleId = rule_id
  // 每次都需要将表格清空
  openAdjustArr = []
  foldAdjustArr = []
  drawerVisible.value = true
  adjustLoading.value = true
  const resp = await proxy.$api.automation.optCalculate({ rule_id: rule_id })
  adjustLoading.value = false
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message, data } = resp.data
  if (ret_code === '0') {
    if (data.length > 0) {
      // 将结果拆成结果想要的数据结构
      data.forEach(item => {
        if (!item.solved) {
          const adjustItem = {
            budget: item.opt_budget,
            object: '-',
            cur_budget: '-',
            cur_bid: '-',
            rec_budget: '-',
            rec_bid: '-',
            spend: '-',
            installs: '-',
            cpi: '-',
            registers: '-',
            cohort_register_rate: '-',
            d1_cohort_register_rate: '-',
            d2_retention_rate: '-',
            d7_retention_rate: '-',
            cost_per_d2_retention: '-',
            cost_per_d7_retention: '-',
            showOpen: 0 // 失败的不显示箭头
          }
          // 展开
          openAdjustArr.push(adjustItem)
          // 折叠
          foldAdjustArr.push(adjustItem)
        } else {
          genData(item, openAdjustArr, foldAdjustArr, 1)
        }
      })
      // 对拿到的openAdjustArr根据budget从小到大排序
      openAdjustArr = openAdjustArr.sort((obj1, obj2) => {
        const x = obj1.budget
        const y = obj2.budget
        if (x < y) {
          return -1
        } else if (x > y) {
          return 1
        } else {
          return 0
        }
      })
      foldAdjustArr = foldAdjustArr.sort((obj1, obj2) => {
        const x = obj1.budget
        const y = obj2.budget
        if (x < y) {
          return -1
        } else if (x > y) {
          return 1
        } else {
          return 0
        }
      })
      // openAdjustArr和foldAdjustArr最后面追加一个空的可以输入的对象
      openAdjustArr.push({
        budget: '',
        object: '-',
        cur_budget: '-',
        cur_bid: '-',
        rec_budget: '-',
        rec_bid: '-',
        spend: '-',
        installs: '-',
        cpi: '-',
        registers: '-',
        cohort_register_rate: '-',
        d1_cohort_register_rate: '-',
        d2_retention_rate: '-',
        d7_retention_rate: '-',
        cost_per_d2_retention: '-',
        cost_per_d7_retention: '-',
        showOpen: 0,
        input: true
      })
      foldAdjustArr.push({
        budget: '',
        object: '-',
        cur_budget: '-',
        cur_bid: '-',
        rec_budget: '-',
        rec_bid: '-',
        spend: '-',
        installs: '-',
        cpi: '-',
        registers: '-',
        cohort_register_rate: '-',
        d1_cohort_register_rate: '-',
        d2_retention_rate: '-',
        d7_retention_rate: '-',
        cost_per_d2_retention: '-',
        cost_per_d7_retention: '-',
        showOpen: 0,
        input: true
      })
      // 排序完要找到需要合并buget的行
      openMergeRow = [[0, 0]] // 内元素 [从第几行（行索引）开始，合并多少行]
      let openBudget = openAdjustArr[0].budget
      openAdjustArr.forEach((item, index) => {
        if (openBudget !== item.budget) {
          openBudget = item.budget
          openMergeRow.push([index, 1])
          return
        }
        openMergeRow[openMergeRow.length - 1][1] += 1
      })
      // 合并的
      foldMergeRow = [[0, 0]] // 内元素 [从第几行（行索引）开始，合并多少行]
      let foldBudget = foldAdjustArr[0].budget
      foldAdjustArr.forEach((item, index) => {
        if (foldBudget !== item.budget) {
          foldBudget = item.budget
          foldMergeRow.push([index, 1])
          return
        }
        foldMergeRow[foldMergeRow.length - 1][1] += 1
      })
      // 给openMergeRow和foldMergeRow添加label标签，比如(0.8*budget)，(1.0*budget)，(1.2*budget)
      const labelArr = ['(0.8*budget)', '(1.0*budget)', '(1.2*budget)']
      for (const index in openMergeRow) {
        const item = openMergeRow[index]
        if (openAdjustArr[item[0]].budget !== '') {
          openAdjustArr[item[0]].label = labelArr[index]
        }
      }
      for (const index in foldMergeRow) {
        const item = foldMergeRow[index]
        if (foldAdjustArr[item[0]].budget !== '') {
          foldAdjustArr[item[0]].label = labelArr[index]
        }
      }
      // 深拷贝
      adjustArr.value = JSON.parse(JSON.stringify(foldAdjustArr))
      mergeRow.value = JSON.parse(JSON.stringify(foldMergeRow))
    }
    // console.log(foldMergeRow, openMergeRow)
  } else {
    ElMessage.error(message || 'adjust failed')
  }
}

// 单元格合并规则
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // console.log(row, column, rowIndex, columnIndex)
  // 只合并第一列budget
  if (columnIndex === 0) {
    for (let item of mergeRow.value) {
      if (rowIndex === item[0]) {
        return {
          rowspan: item[1],
          colspan: 1
        }
      }
    }
    return {
      rowspan: 0,
      colspan: 0
    }
  }
}

// 展开details
const openDetail = index => {
  let currentRowIndex = 0 // 当前点击对应合并row数组的index
  for (const rowIndex in mergeRow.value) {
    const rowItem = mergeRow.value[rowIndex]
    if (index === rowItem[0]) {
      currentRowIndex = rowIndex
      break
    }
  }
  // console.log(currentRowIndex)
  // 替换掉点击的部分
  const replaceIndex = mergeRow.value[currentRowIndex]
  const newIndex = openMergeRow[currentRowIndex]
  adjustArr.value = [
    ...adjustArr.value.slice(0, replaceIndex[0]),
    ...JSON.parse(JSON.stringify(openAdjustArr.slice(newIndex[0], newIndex[0] + newIndex[1]))),
    ...adjustArr.value.slice(replaceIndex[0] + replaceIndex[1], adjustArr.value.length)
  ]
  // 处理新的合并行
  const newAddRow = openMergeRow[currentRowIndex][1] - mergeRow.value[currentRowIndex][1]
  mergeRow.value[currentRowIndex][1] = openMergeRow[currentRowIndex][1]
  // mergeRow从当前行的下一行开始，每个开始行需要加newAddRow(不理解这里currentRowIndex+1怎么变成字符串加1了)
  for (let i = parseInt(currentRowIndex) + 1; i < mergeRow.value.length; i++) {
    mergeRow.value[i][0] += newAddRow
  }
  // 箭头向上
  adjustArr.value[index].showOpen = 2
}

// 关闭details
const foldDetail = index => {
  let currentRowIndex = 0 // 当前点击对应合并row数组的index
  for (const rowIndex in mergeRow.value) {
    const rowItem = mergeRow.value[rowIndex]
    if (index === rowItem[0]) {
      currentRowIndex = rowIndex
      break
    }
  }
  // console.log(currentRowIndex)
  // 替换掉点击的部分
  const replaceIndex = mergeRow.value[currentRowIndex]
  const newIndex = foldMergeRow[currentRowIndex]
  adjustArr.value = [
    ...adjustArr.value.slice(0, replaceIndex[0]),
    ...JSON.parse(JSON.stringify(foldAdjustArr.slice(newIndex[0], newIndex[0] + newIndex[1]))),
    ...adjustArr.value.slice(replaceIndex[0] + replaceIndex[1], adjustArr.value.length)
  ]
  // 处理新的合并行
  const newSubRow = mergeRow.value[currentRowIndex][1] - foldMergeRow[currentRowIndex][1]
  mergeRow.value[currentRowIndex][1] = foldMergeRow[currentRowIndex][1]
  // mergeRow从当前行的下一行开始，每个开始行需要减掉newSubRow(不理解这里currentRowIndex+1怎么变成字符串加1了)
  for (let i = parseInt(currentRowIndex) + 1; i < mergeRow.value.length; i++) {
    mergeRow.value[i][0] -= newSubRow
  }
  // 箭头向下
  adjustArr.value[index].showOpen = 1
}

const newAdjustDialogVisible = ref(false)
const newAdjustParams = reactive({
  budget: 0,
  currentRowIndex: 0,
  rawShowOpen: 0
})

// buget输入框失去焦点时(此是在原始的输入框修改，此需求已经废弃，改为在最底下加一个输入框，原始不能修改)
const bugetBlur = (budget, index) => {
  if (typeof budget === 'string') {
    ElMessage.error('budget can not be string')
    return
  }
  // 前后值一样也不用处理
  let currentRowIndex = 0 // 当前点击对应合并row数组的index
  for (const rowIndex in mergeRow.value) {
    const rowItem = mergeRow.value[rowIndex]
    if (index === rowItem[0]) {
      currentRowIndex = parseInt(rowIndex)
      break
    }
  }
  const rawShowOpen = adjustArr.value[index].showOpen
  // 在原来非失败的情况下相同值可用再次请求
  if (rawShowOpen !== 0) {
    if (budget === openAdjustArr[openMergeRow[currentRowIndex][0]].budget) {
      ElMessage.error('budget same as before')
      return
    }
  }
  newAdjustDialogVisible.value = true
  newAdjustParams.budget = budget
  newAdjustParams.currentRowIndex = currentRowIndex
  newAdjustParams.rawShowOpen = rawShowOpen
}

const confirmNewAdjust = async () => {
  const budget = newAdjustParams.budget
  const currentRowIndex = newAdjustParams.currentRowIndex
  const rawShowOpen = newAdjustParams.rawShowOpen
  newAdjustDialogVisible.value = false
  adjustLoading.value = true
  // 用currentRuleId和budget请求后端接口进行重新计算
  const resp = await proxy.$api.automation.optCalculate({ rule_id: currentRuleId, budget: budget })
  adjustLoading.value = false
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message, data } = resp.data
  if (ret_code === '0') {
    // 返回值校验
    if (data.length !== 1) {
      ElMessage.error('the length of data is not 1')
      return
    }
    const item = data[0]
    if (item.opt_budget !== budget) {
      ElMessage.error('the opt_budget in data is not equal to ' + budget)
      return
    }
    if (!item.solved) {
      // 需要将当前替换成'-'
      const adjustItem = {
        budget: budget,
        object: '-',
        cur_budget: '-',
        cur_bid: '-',
        rec_budget: '-',
        rec_bid: '-',
        spend: '-',
        installs: '-',
        cpi: '-',
        registers: '-',
        cohort_register_rate: '-',
        d1_cohort_register_rate: '-',
        d2_retention_rate: '-',
        d7_retention_rate: '-',
        cost_per_d2_retention: '-',
        cost_per_d7_retention: '-',
        showOpen: 0
      }
      const adjustIndexArr = mergeRow.value[currentRowIndex]
      const openIndexArr = openMergeRow[currentRowIndex]
      const foldIndexArr = foldMergeRow[currentRowIndex]
      // 替换数据数组和合并行数组
      adjustArr.value = [...adjustArr.value.slice(0, adjustIndexArr[0]), adjustItem, ...adjustArr.value.slice(adjustIndexArr[0] + adjustIndexArr[1], adjustArr.value.length)]
      const sub1 = mergeRow.value[currentRowIndex][1] - 1
      mergeRow.value[currentRowIndex][1] = 1
      // mergeRow从当前行的下一行开始，每个开始行需要减掉sub
      for (let i = parseInt(currentRowIndex) + 1; i < mergeRow.value.length; i++) {
        mergeRow.value[i][0] -= sub1
      }

      openAdjustArr = [...openAdjustArr.slice(0, openIndexArr[0]), JSON.parse(JSON.stringify(adjustItem)), ...openAdjustArr.slice(openIndexArr[0] + openIndexArr[1], openAdjustArr.length)]
      const sub2 = openMergeRow[currentRowIndex][1] - 1
      openMergeRow[currentRowIndex][1] = 1
      // mergeRow从当前行的下一行开始，每个开始行需要减掉sub
      for (let i = parseInt(currentRowIndex) + 1; i < openMergeRow.length; i++) {
        openMergeRow[i][0] -= sub2
      }

      foldAdjustArr = [...foldAdjustArr.slice(0, foldIndexArr[0]), JSON.parse(JSON.stringify(adjustItem)), ...foldAdjustArr.slice(foldIndexArr[0] + foldIndexArr[1], foldAdjustArr.length)]
      const sub3 = foldMergeRow[currentRowIndex][1] - 1
      foldMergeRow[currentRowIndex][1] = 1
      // mergeRow从当前行的下一行开始，每个开始行需要减掉sub
      for (let i = parseInt(currentRowIndex) + 1; i < foldMergeRow.length; i++) {
        foldMergeRow[i][0] -= sub3
      }
      return
    }
    // if (rawShowOpen !== 0) {
    //   if (data[0].details.length !== (openMergeRow[currentRowIndex][1] - foldMergeRow[currentRowIndex][1]) / 2) {
    //     ElMessage.error('the length of details is not equal to ' + (openMergeRow[currentRowIndex][1] - foldMergeRow[currentRowIndex][1]) / 2)
    //     return
    //   }
    // }
    // 获取原始展开状态
    const tempOpenArr = []
    const tempFoldArr = []
    const adjustIndexArr = mergeRow.value[currentRowIndex]
    const openIndexArr = openMergeRow[currentRowIndex]
    const foldIndexArr = foldMergeRow[currentRowIndex]
    // 然来是失败的，需要特殊处理
    if (rawShowOpen === 0) {
      genData(item, tempOpenArr, tempFoldArr, 1)
      adjustArr.value = [...adjustArr.value.slice(0, adjustIndexArr[0]), ...tempFoldArr, ...adjustArr.value.slice(adjustIndexArr[0] + adjustIndexArr[1], adjustArr.value.length)]
      const add1 = tempFoldArr.length - mergeRow.value[currentRowIndex][1]
      mergeRow.value[currentRowIndex][1] = tempFoldArr.length
      // mergeRow从当前行的下一行开始，每个开始行需要加1行
      for (let i = parseInt(currentRowIndex) + 1; i < mergeRow.value.length; i++) {
        mergeRow.value[i][0] += add1
      }

      openAdjustArr = [...openAdjustArr.slice(0, openIndexArr[0]), ...JSON.parse(JSON.stringify(tempOpenArr)), ...openAdjustArr.slice(openIndexArr[0] + openIndexArr[1], openAdjustArr.length)]
      const add2 = tempOpenArr.length - openMergeRow[currentRowIndex][1]
      openMergeRow[currentRowIndex][1] = tempOpenArr.length
      // mergeRow从当前行的下一行开始，每个开始行需要减掉sub
      for (let i = parseInt(currentRowIndex) + 1; i < openMergeRow.length; i++) {
        openMergeRow[i][0] += add2
      }

      foldAdjustArr = [...foldAdjustArr.slice(0, foldIndexArr[0]), ...JSON.parse(JSON.stringify(tempFoldArr)), ...foldAdjustArr.slice(foldIndexArr[0] + foldIndexArr[1], foldAdjustArr.length)]
      const add3 = tempFoldArr.length - foldMergeRow[currentRowIndex][1]
      foldMergeRow[currentRowIndex][1] = tempFoldArr.length
      // mergeRow从当前行的下一行开始，每个开始行需要减掉sub
      for (let i = parseInt(currentRowIndex) + 1; i < foldMergeRow.length; i++) {
        foldMergeRow[i][0] += add3
      }
      return
    }
    genData(item, tempOpenArr, tempFoldArr, rawShowOpen)
    // 这里只需替换数据数组，数据正常的情况下合并项应该都是一样的
    if (rawShowOpen === 1) {
      // 没有展开
      adjustArr.value = [...adjustArr.value.slice(0, adjustIndexArr[0]), ...tempFoldArr, ...adjustArr.value.slice(adjustIndexArr[0] + adjustIndexArr[1], adjustArr.value.length)]
    } else {
      // 展开了
      adjustArr.value = [...adjustArr.value.slice(0, adjustIndexArr[0]), ...tempOpenArr, ...adjustArr.value.slice(adjustIndexArr[0] + adjustIndexArr[1], adjustArr.value.length)]
    }

    openAdjustArr = [...openAdjustArr.slice(0, openIndexArr[0]), ...JSON.parse(JSON.stringify(tempOpenArr)), ...openAdjustArr.slice(openIndexArr[0] + openIndexArr[1], openAdjustArr.length)]

    foldAdjustArr = [...foldAdjustArr.slice(0, foldIndexArr[0]), ...JSON.parse(JSON.stringify(tempFoldArr)), ...foldAdjustArr.slice(foldIndexArr[0] + foldIndexArr[1], foldAdjustArr.length)]
  } else {
    ElMessage.error(message || 'adjust failed')
  }
}

const allAdjustArr = ref([])
const allVisible = ref(false)
let mergeRowMap = {}
const history = async rule_id => {
  const resp = await proxy.$api.automation.optQuery({ rule_id: rule_id })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message, data } = resp.data
  if (ret_code === '0') {
    const results = []
    const mergeMap = {}
    Object.keys(data).forEach(key => {
      const rec = { date: key, children: [] }
      data[key].value.forEach(item => {
        if (!item.solved) {
          rec.children.push({
            budget: item.opt_budget,
            object: '-',
            cur_budget: '-',
            cur_bid: '-',
            rec_budget: '-',
            rec_bid: '-',
            spend: '-',
            installs: '-',
            cpi: '-',
            registers: '-',
            cohort_register_rate: '-',
            d1_cohort_register_rate: '-',
            d2_retention_rate: '-',
            d7_retention_rate: '-',
            cost_per_d2_retention: '-',
            cost_per_d7_retention: '-',
            date: key
          })
        } else {
          const opt_budget = item.opt_budget
          const original_item = {
            budget: opt_budget,
            object: 'original',
            cur_budget: item.total.original.budget.toFixed(0),
            cur_bid: '-',
            rec_budget: '-',
            rec_bid: '-',
            spend: item.total.original.spend.toFixed(2),
            installs: item.total.original.installs.toFixed(0),
            cpi: item.total.original.cpi.toFixed(2),
            registers: item.total.original.registers.toFixed(0),
            cohort_register_rate: (item.total.original.cohort_register_rate * 100).toFixed(2) + '%',
            d1_cohort_register_rate: (item.total.original.d1_cohort_register_rate * 100).toFixed(2) + '%',
            d2_retention_rate: (item.total.original.d2_retention_rate * 100).toFixed(2) + '%',
            d7_retention_rate: (item.total.original.d7_retention_rate * 100).toFixed(2) + '%',
            cost_per_d2_retention: item.total.original.cost_per_d2_retention.toFixed(2),
            cost_per_d7_retention: item.total.original.cost_per_d7_retention.toFixed(2),
            date: key
          }
          const opt_item = {
            budget: opt_budget,
            object: 'opt',
            cur_budget: '-',
            cur_bid: '-',
            rec_budget: item.total.opt.budget.toFixed(0),
            rec_bid: '-',
            spend: item.total.opt.spend.toFixed(2),
            installs: item.total.opt.installs.toFixed(0),
            cpi: item.total.opt.cpi.toFixed(2),
            registers: item.total.opt.registers.toFixed(0),
            cohort_register_rate: (item.total.opt.cohort_register_rate * 100).toFixed(2) + '%',
            d1_cohort_register_rate: (item.total.opt.d1_cohort_register_rate * 100).toFixed(2) + '%',
            d2_retention_rate: (item.total.opt.d2_retention_rate * 100).toFixed(2) + '%',
            d7_retention_rate: (item.total.opt.d7_retention_rate * 100).toFixed(2) + '%',
            cost_per_d2_retention: item.total.opt.cost_per_d2_retention.toFixed(2),
            cost_per_d7_retention: item.total.opt.cost_per_d7_retention.toFixed(2),
            date: key
          }
          rec.children.push(original_item, opt_item)
          item.details.forEach(item => {
            rec.children.push({
              budget: opt_budget,
              object: item.campaign_name,
              cur_budget: item.original.budget.toFixed(0),
              cur_bid: item.original.bid.toFixed(2),
              rec_budget: item.opt.budget.toFixed(0),
              rec_bid: item.opt.bid.toFixed(2),
              spend: `${item.original.spend.toFixed(2)}(${item.opt.spend.toFixed(2)})`,
              installs: `${item.original.installs.toFixed(0)}(${item.opt.installs.toFixed(0)})`,
              cpi: `${item.original.cpi.toFixed(2)}(${item.opt.cpi.toFixed(2)})`,
              registers: `${item.original.registers.toFixed(0)}(${item.opt.registers.toFixed(0)})`,
              cohort_register_rate: `${(item.original.cohort_register_rate * 100).toFixed(2) + '%'}(${(item.opt.cohort_register_rate * 100).toFixed(2) + '%'})`,
              d1_cohort_register_rate: `${(item.original.d1_cohort_register_rate * 100).toFixed(2) + '%'}(${(item.opt.d1_cohort_register_rate * 100).toFixed(2) + '%'})`,
              d2_retention_rate: `${(item.original.d2_retention_rate * 100).toFixed(2) + '%'}(${(item.opt.d2_retention_rate * 100).toFixed(2) + '%'})`,
              d7_retention_rate: `${(item.original.d7_retention_rate * 100).toFixed(2) + '%'}(${(item.opt.d7_retention_rate * 100).toFixed(2) + '%'})`,
              cost_per_d2_retention: `${item.original.cost_per_d2_retention.toFixed(2)}(${item.opt.cost_per_d2_retention.toFixed(2)})`,
              cost_per_d7_retention: `${item.original.cost_per_d7_retention.toFixed(2)}(${item.opt.cost_per_d7_retention.toFixed(2)})`,
              date: key
            })
          })
        }
      })
      // 排序
      rec.children = rec.children.sort((obj1, obj2) => {
        const x = obj1.budget
        const y = obj2.budget
        if (x < y) {
          return -1
        } else if (x > y) {
          return 1
        } else {
          return 0
        }
      })
      // 合并行
      let mergeRow = [[0, 0]] // 内元素 [从第几行（行索引）开始，合并多少行]
      let tempBudget = rec.children[0].budget
      rec.children.forEach((item, index) => {
        if (tempBudget !== item.budget) {
          tempBudget = item.budget
          mergeRow.push([index, 1])
          return
        }
        mergeRow[mergeRow.length - 1][1] += 1
      })
      mergeMap[key] = mergeRow
      results.push(rec)
    })
    // data是map，key是无序的，这里需要对结果排序
    allAdjustArr.value = results.sort((obj1, obj2) => {
      const x = obj1.date
      const y = obj2.date
      if (x < y) {
        return 1
      } else if (x > y) {
        return -1
      } else {
        return 0
      }
    })
    mergeRowMap = mergeMap
    allVisible.value = true
  } else {
    ElMessage.error(message || 'get all adjust failed')
  }
}

const allSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // console.log(row.date, column, rowIndex, columnIndex)
  if (columnIndex === 0) {
    const itemMergeRow = mergeRowMap[row.date]
    for (let item of itemMergeRow) {
      if (rowIndex === item[0]) {
        return {
          rowspan: item[1],
          colspan: 1
        }
      }
    }
    return {
      rowspan: 0,
      colspan: 0
    }
  }
}

onMounted(() => {
  getAllObjectArr()
  getRuleArr()
})
</script>

<style lang="less" scoped></style>
