<template>
  <Breadcrumb v-if="breadcrumbDisabled" />
  <div class="outer-box" id="automation">
    <el-tabs v-model="activeName" @tab-click="tabClick">
      <!-- 添加rule -->
      <el-tab-pane name="first" label="Set Target">
        <div class="outer-box">
          <el-form :model="ruleAddForm" label-width="150px" label-height="100px" label-position="left" :rules="addRules" ref="ruleAddFormRef">
            <el-form-item label="Game:" prop="game_code">
              <el-select v-model="ruleAddForm.game_code" placeholder="select game" @change="gameChange" :disabled="gameCodeDisabled" style="width: 30%">
                <el-option v-for="item in gameArr" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="Optimization  Level:" prop="opt_level">
              <el-radio-group v-model="ruleAddForm.opt_level" @change="RuleAddOnclickRadio">
                <el-radio label="campaign">campaign</el-radio>
                <el-radio label="media">media</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Campaign Type:" prop="campaign_type">
              <el-radio-group v-model="ruleAddForm.campaign_type" @change="campainTypeChange">
                <el-radio label="2">newinstall</el-radio>
                <el-radio label="3">reattribution</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Scope:" prop="openid">
              <el-radio-group v-model="ruleAddForm.openid" :disabled="openidDisabled">
                <el-radio label="1">all users</el-radio>
                <!--el-radio label="2">Existing Openid</el-radio-->
                <el-radio label="3">new users</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="ruleAddForm.campaign_type == 2" label="Tracking Basis:" prop="tracking_basis">
              <el-radio-group v-model="ruleAddForm.tracking_basis" :disabled="trackingBasisDisabled" @change="addTrackChange">
                <el-radio label="1">install</el-radio>
                <el-radio label="2">register</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-else label="Tracking Basis:" prop="tracking_basis">
              <el-radio-group v-model="ruleAddForm.tracking_basis" :disabled="trackingBasisDisabled" @change="addTrackChange">
                <el-radio label="3">deviceid</el-radio>
                <el-radio label="4">openid</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Optimization Target:" prop="target">
              <el-select v-model="ruleAddForm.target" placeholder="select target" style="width: 30%" :disabled="targetDisabled" @visible-change="InitTrackChange">
                <el-option v-for="item in addTargetArr" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="Campaigns:" prop="object">
              <div style="display: flex; justify-content: space-between">
                <el-button :disabled="objectDisabled" @click="clickObject">select campaign</el-button>
                <el-button v-if="ruleAddForm.object.length > 0" @click="clearAddObject" type="danger" plain>clear</el-button>
              </div>
            </el-form-item>
            <el-form-item v-if="ruleAddForm.object.length == 0 ? false : true">
              <ul>
                <li v-for="item in ruleAddForm.object" :key="item">
                  <el-tag type="info" closable @close="delObjectTag(item)">{{ item }}</el-tag>
                </li>
              </ul>
            </el-form-item>
            <el-form-item v-if="ruleAddForm.target === 22" label="Constraint:" prop="constraint" :rules="[{ required: true, message: 'please select constraint', trigger: 'blur' }]">
              <el-button @click="addConstraint" type="primary" plain :icon="Plus" :disabled="constraintDisabled" />
            </el-form-item>
            <el-form-item v-else label="Constraint:">
              <el-button @click="addConstraint" type="primary" plain :icon="Plus" :disabled="constraintDisabled" />
            </el-form-item>
            <el-form-item v-for="item in ruleAddForm.constraint" :key="item.id" :prop="item.id" :rules="[{ validator: checkConstraint, trigger: 'blur' }]">
              <el-select v-model="item.constraint_select" placeholder="select constraint" style="width: 180px">
                <el-option v-for="item in addConstraintArr" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-select-v2 v-if="ruleAddForm.opt_level=='campaign'"  style="width: 500px;padding-left: 10px;"
              v-model="item.select_campaign"
              :options="options"
              placeholder="All Campaign"
              multiple
              collapse-tags
              collapse-tags-tooltip
              @change="val=>{selectCampaignChange(val,item.id)}"
              >
            </el-select-v2>
              <span v-text="lessArr.includes(item.constraint_select) ? '<' : '>'" style="padding-left: 10px; font-weight: bold"></span>
              <el-input v-model="item.constraint_value" placeholder="input rule constraint value" style="width: 150px; padding-left: 10px" />
              <el-button @click="delConstraint(item.id)" type="danger" plain :icon="Minus" style="margin-left: 20px"></el-button>
            </el-form-item>
           
            
            <el-form-item v-if="ruleAddForm.target !== 22" label="Budget:" prop="budget">
              <el-input v-model.number="ruleAddForm.budget" placeholder="input budget" style="width: 30%" />
            </el-form-item>
            <el-button @click="addAdvanced" type="primary" size="small"> Advanced option</el-button>
            <el-form-item label="Country:" prop="country" v-if="ruleAddForm.showClass == true">
              <el-select v-model="ruleAddForm.country" placeholder="select country" filterable clearable>
                <el-option v-for="item in countryArr" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="Time Range:" v-if="ruleAddForm.showClass == true">
              <div data-tip="The time range of data that you'd like to include for optimization">
                <el-date-picker
                  v-model="ruleAddForm.date"
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
            <div style="height: 30px">
              <el-dialog width="30%" height="20%" title="Create a name for this rule" center v-model="dialogAddVisible" :show-close="false">
                <el-input v-model="ruleAddForm.rule_name" placeholder="input rule name" class="dialog-form-item-rule-name-input" />
                <template #footer>
                  <span>
                    <!--el-button @click="dialogVisible = false">Cancel</!--el-button-->
                    <el-button style="margin: 20px; padding: 20px" type="primary" @click="handleRuleNameConfirm" class="dialog-footer-button"> Confirm </el-button>
                  </span>
                </template>
              </el-dialog>
            </div>
            <div style="text-align: center; width: 40%">
              <el-button size="large" type="primary" @click="handleSubmit">Submit</el-button>
              <el-button size="large" @click="handleCancel">Cancel</el-button>
            </div>
          </el-form>
        </div>
      </el-tab-pane>
      <!-- 查询rule -->
      <el-tab-pane name="second" label="Optimization Rules">
        <div class="outer-box">
          <el-table v-fit-columns :data="ruleArr" style="width: 100%" id="ruleSearchTable" border>
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
            <el-table-column prop="object" label="Campaigns" width="500">
              <template #default="scope">
                <ul>
                  <li v-for="item in scope.row.object">
                    <el-tag type="info">{{ item }}</el-tag>
                  </li>
                </ul>
              </template>
            </el-table-column>
            <el-table-column prop="creator" label="Creator" />
            <el-table-column prop="create_time" label="Create Time">
              <template #default="scope">
                {{ scope.row.create_time.slice(0, 19) }}
              </template>
            </el-table-column>
            <el-table-column label="Operation" width="560">
              <template #default="scope">
                <el-button size="default" type="primary" @click="editRule(scope.row)" :title="hoverInfo.editTitle">edit</el-button>
                <el-button type="success" size="default" @click="optimize_new(scope.row.rule_id, scope.row.campaign_type, scope.row.target, scope.row.constraint)" :title="hoverInfo.optimzeTitle"
                  >optimize</el-button
                >
                <el-button color="#626aef" size="default" @click="historyNew(scope.row.rule_id, scope.row.campaign_type, scope.row.target, scope.row.constraint)" :title="hoverInfo.historyTitle"
                  >history</el-button
                >
                <el-button
                  v-if="scope.row.subscribe === 'unsubscribe'"
                  color="#000000"
                  size="default"
                  :title="hoverInfo.subscribeTitle"
                  @click="subscribeClick(scope.$index, scope.row.rule_id, 'subscribe')"
                  >subscribe</el-button
                >
                <el-button v-else size="default" icon="Bell" @click="subscribeClick(scope.$index, scope.row.rule_id, 'unsubscribe')">subscribed</el-button>
                <el-button type="danger" size="default" @click="delRule(scope.row.rule_id)" :title="hoverInfo.deleteTitle">delete</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
  <!-- object选择 -->
  <ObjectSelect ref="addObjectRef" :game_code="ruleAddForm.game_code" :campaign_type="ruleAddForm.campaign_type" :code="code" @updateObject="updateAddObject" />
  <!-- 编辑rule的弹框 -->
  <AutomationEdit ref="automzationEditRef" :permissionCode="code" @updateRuleArr="modifyAfterUpdateRuleArr"/>
 
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
  <Optimize ref="optimizeRef" />
  <HistoryNew ref="historyNewRef" />
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import { Plus, Minus } from '@element-plus/icons-vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import ObjectSelect from '../../components/tools/automation/ObjectSelect.vue'
import AutomationEdit from '../../components/tools/automation/AutomationEdit.vue'
import Optimize from '@/components/tools/automation/Optimize.vue'
import HistoryNew from '@/components/tools/automation/History.vue'
import { sendUserAction, getCookie } from '@/utils/api_utils'
import { nanoid } from 'nanoid'
import { formatDate } from '@/utils/common_utils'
import moment from 'moment'
// 常量
import { campainTypeArr, openidArr, targetArr, trackingBasisArr, countryArr, constraintTempArr } from '../../components/tools/automation/data'
const onDayTime = 24 * 60 * 60 * 1000
// 业务
const gameArr = ref([])

const hoverInfo = ref({
  editTitle: 'Edit the current optimization rule',
  optimzeTitle: 'Optimize the current rule',
  historyTitle: 'View the history of optimization records',
  subscribeTitle: 'Trough subscription, a corresponding notification will be sent when there is sigificant optimization in the current rule',
  deleteTitle: 'Delete the current optimization rule'
})
// const addTrackingBasis = ref(1)

// constraint
const constraintArr = constraintTempArr.map(item => {
  return {
    label: item,
    value: item.toLocaleLowerCase().split(' ').join('_')
  }
})

// 小于号的constraint_value
const lessArr = ['cpi', 'cpr']

// portrait标签的颜色
const portraitColor = {
  fresh: '',
  cost_wave: 'success',
  cpi_wave: 'info',
  not_enough_spend: 'warning',
  compete: 'danger'
}

// 用户名
const username = getCookie('user_name')
const code = getCookie('code')

// tab相关
const activeName = ref('first')
// tab点击的时候触发
const tabClick = context => {
  sendUserAction({ page_name: context.props.label })
}

// rule add相关
const { proxy } = getCurrentInstance()

const gameCodeDisabled = ref(false)
const campainTypeDisabled = ref(false)
const openidDisabled = ref(false)
const trackingBasisDisabled = ref(false)
const targetDisabled = ref(false)
const constraintDisabled = ref(false)
const objectDisabled = ref(false)

const dialogAddVisible = ref(false)

//aix 页面跳转逻辑

const subscribeClick = (index, rule_id, subscribeType) => {
  var func = async () => {
    const resp = await proxy.$api.automation.subscribe({ rule_id: rule_id, code: code, subscribe: subscribeType })
    if (typeof resp === 'string') {
      ElMessage.error(subscribeType + ' fail')
      return
    }
    const { ret_code, data, message } = resp.data
    if (ret_code === '0') {
      ElMessage.success(subscribeType + ' success')
      //console.log(subscribeType)
      if (subscribeType === 'subscribe') {
        //已经订阅
        ruleArr.value[index].subscribe = 'unsubscribe' //显示已经订阅
      } else {
        //还没订阅
        ruleArr.value[index].subscribe = 'subscribe' //显示可以订阅
      }
      //console.log(ruleArr.value[index].subscribe)
      // 提交成功后需要提醒查询重新获取ruleArr
      getRuleArr()
    }
  }
  func()
}

const redirectWhenLogined = () => {
  let url = new URL(window.location.href.replace('#', 'a'))
  let args = new URLSearchParams(url.search)
  let from = args.get('from')
  let username = getCookie('user_name')
  let isNotInFrame = window.self === window.top
  if (username && isNotInFrame) {
    if (from === 'aix') {
      window.location.href = 'https://aix.intlgame.com/v2/trade/optimization/autoplanning'
    } else if (from === 'aix_exp') {
      window.location.href = 'https://exp.aix.intlgame.com/v2/trade/optimization/autoplanning'
    }
  }
}

//如果是带有参数from=aix 的url 需要掩藏侧边栏
const breadcrumbDisabled = ref(true)
let url = new URL(window.location.href.replace('#', 'a'))
let args = new URLSearchParams(url.search)
let where = args.get('from')
if (where && where.includes('aix')) {
  dialogAddVisible.value = false
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
      ruleAddForm.game_code = gameArr.value[0].value
    } else {
      gameCodeDisabled.value = true
      campainTypeDisabled.value = true
    }
  } else {
    ElMessage.error(message || 'get permission err')
  }
}

getPermission()


let allCampaignArr=[]

// rule表单
const ruleAddForm = reactive({
  game_code: '',
  opt_level: 'campaign',
  rule_name: '',
  target: '',
  campaign_type: '',
  openid: '',
  constraint: [],
  object: [],
  object_status: {},
  budget: 0,
  tracking_basis: '',
  country: '',
  date: [],
  showClass: false
})

const DateDisabled = ref(false)
const options=ref([])

// constraint


//TODO debug 
const selectCampaignChange=(args,id)=>{
//   let arr= ruleAddForm.constraint
//  let newarr= arr.filter(function(elem,index, arr){
//     return elem.id==id
//   })
//   console.log(newarr);
//   console.log(id);
//   console.log(args);
}

//opt_level
const RuleAddOnclickRadio = radioValue => {
  ruleAddForm.opt_level = radioValue
}


const addTargetArr = ref([])
const addConstraintArr = ref([])
// game发生变化时
const gameChange = () => {
  proxy.$refs.addObjectRef.getAllObjectArr(ruleAddForm.game_code, ruleAddForm.campaign_type, code,ruleAddForm.object)
  ruleAddForm.constraint = []
  clearAddObject()
  GameDemoDate()
}

// campain发送change时
const campainTypeChange = () => {
  proxy.$refs.addObjectRef.getAllObjectArr(ruleAddForm.game_code, ruleAddForm.campaign_type, code,ruleAddForm.object)
  objectDisabled.value = false
  clearAddObject()
  // 连带下级禁止
  ruleAddForm.tracking_basis = ''
  ruleAddForm.target = ''
  targetDisabled.value = false
  ruleAddForm.constraint = []
  constraintDisabled.value = false
  if (ruleAddForm.campaign_type == 2) {
    ruleAddForm.openid = ''
    openidDisabled.value = false
    // basis值不同
    ruleAddForm.tracking_basis = ''
    trackingBasisDisabled.value = false
  } else if (ruleAddForm.campaign_type == 3) {
    ruleAddForm.openid = ''
    openidDisabled.value = true
    // basis值不同
    ruleAddForm.tracking_basis = ''
    trackingBasisDisabled.value = false
  }
}

// tracking basis发生改变时
const addTrackChange = () => {
  ruleAddForm.target = ''
  ruleAddForm.constraint = []
  constraintDisabled.value = false
  if (ruleAddForm.tracking_basis == 1) {
    const targetFilterValue = [1, 2, 3, 5, 7, 8, 10, 11, 13, 15, 16, 19, 20, 22]
    addTargetArr.value = targetArr.filter(item => targetFilterValue.includes(item.value))
    const constraintFilter = ['CPI', 'Installs', 'D2 Retention Rate', 'D7 Retention Rate', 'D1 ROAS', 'D3 ROAS', 'D7 ROAS']
    addConstraintArr.value = constraintArr.filter(item => constraintFilter.includes(item.label))
  } else if (ruleAddForm.tracking_basis == 2) {
    const targetFilterValue = [3, 5, 10, 11, 13, 15, 16, 19, 20, 22]
    addTargetArr.value = targetArr.filter(item => targetFilterValue.includes(item.value))
    const constraintFilter = ['CPR', 'Registers', 'D2 Retention Rate', 'D7 Retention Rate', 'D1 ROAS', 'D3 ROAS', 'D7 ROAS']
    addConstraintArr.value = constraintArr.filter(item => constraintFilter.includes(item.label))
  } else {
    const targetFilterValue = [4, 6, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22]
    addTargetArr.value = targetArr.filter(item => targetFilterValue.includes(item.value))
    addConstraintArr.value = constraintArr.filter(item => item.value == 'cpr')
  }
}

const InitTrackChange = () => {
  if (ruleAddForm.tracking_basis == 1) {
    const targetFilterValue = [1, 2, 3, 5, 7, 8, 10, 11, 13, 15, 16, 19, 20, 22]
    addTargetArr.value = targetArr.filter(item => targetFilterValue.includes(item.value))
    const constraintFilter = ['CPI', 'Installs', 'D2 Retention Rate', 'D7 Retention Rate', 'D1 ROAS', 'D3 ROAS', 'D7 ROAS']
    addConstraintArr.value = constraintArr.filter(item => constraintFilter.includes(item.label))
  } else if (ruleAddForm.tracking_basis == 2) {
    const targetFilterValue = [3, 5, 10, 11, 13, 15, 16, 19, 20, 22]
    addTargetArr.value = targetArr.filter(item => targetFilterValue.includes(item.value))
    const constraintFilter = ['CPR', 'Registers', 'D2 Retention Rate', 'D7 Retention Rate', 'D1 ROAS', 'D3 ROAS', 'D7 ROAS']
    addConstraintArr.value = constraintArr.filter(item => constraintFilter.includes(item.label))
  } else {
    const targetFilterValue = [4, 6, 9, 10, 11, 12, 13, 14, 16, 17, 18, 19, 20, 21, 22]
    addTargetArr.value = targetArr.filter(item => targetFilterValue.includes(item.value))
    addConstraintArr.value = constraintArr.filter(item => item.value == 'cpr')
  }
}

// 添加约束
let addFormConstraintArr = []
const addConstraint = () => {
  // 当第一次添加的时候，页面上面还没有props对应值的元素时，（如果校验数组为空时，会校验表单所有字段）会报警告ElementPlusError: [ElForm] please pass correct props!, 所以第一次不用验证
  //在此需要获取数据吗？
  
  //addTrackChange()
  const nId = nanoid()
  const item = {
    id: nId,
    constraint_select: '',
    constraint_value: '',
    select_campaign: ruleAddForm.object?ruleAddForm.object:[],
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
  
  //addTrackChange()
  // addRules[nId] = [{ validator: checkConstraint, trigger: 'blur' }]
}

//advanced 选项
const addAdvanced = () => {
  ruleAddForm.showClass = !ruleAddForm.showClass
  //检查game 是否为demo 如果是demo 则date 为固定日期且不能修改
  GameDemoDate()
}

const GameDemoDate = () => {
  //检查game 是否为demo 如果是demo 则date 为固定日期且不能修改
  if (ruleAddForm.game_code === 'demo') {
    DateDisabled.value = true
    ruleAddForm.date = ['2023-08-15', '2023-08-30']
  } else {
    DateDisabled.value = false
    ruleAddForm.date = []
  }
}


// 删除约束
const delConstraint = id => {
  addFormConstraintArr = addFormConstraintArr.filter(item => item !== id)
  delete ruleAddForm[id]
  ruleAddForm.constraint = ruleAddForm.constraint.filter(item => {
    return item.id !== id
  })
}

// #####################################################处理object###############################################

const selectObjectStatusUpdate = () => {
  proxy.$refs.editObjectRef.updateObjectStatus()
}

const clickObject = () => {
  proxy.$refs.addObjectRef.getAllObjectArr(ruleAddForm.game_code, ruleAddForm.campaign_type, code,ruleAddForm.object)
  proxy.$refs.addObjectRef.clickObject()
}

// 清空object
const clearAddObject = () => {
  proxy.$refs.addObjectRef.clearObject()
}

const initObject = () => {
  //proxy.$refs.addObjectRef.getAllObjectArr(ruleAddForm.game_code, ruleAddForm.campaign_type, code)
}

// 删除object tag
const delObjectTag = tag => {
  ruleAddForm.constraint.forEach(item=>{
    item.select_campaign= item.select_campaign.filter(campaign =>{
      return campaign!=tag
    })
  })
  proxy.$refs.addObjectRef.delObjectTag(tag)
}

// 给子组件调用的
const updateAddObject = (selectObjectArr, budgetSum) => {
  // ruleAddForm.object = selectObjectArr  // 直接赋值会导致响应失效
  ruleAddForm.object = ref(selectObjectArr)
  ruleAddForm.budget = budgetSum

  options.value=Array.from({ length: ruleAddForm.object.length }).map((_, idx) => ({
  value: `${ruleAddForm.object[idx%ruleAddForm.object.length]}`,
  label: `${ruleAddForm.object[idx%ruleAddForm.object.length]}`,
}))
}

const modifyAfterUpdateRuleArr=()=>{
  getRuleArr()
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

const handleRuleNameConfirm = () => {
  dialogAddVisible.value = false
  //请求接口提交数据
  handleSubmitNew()
}

const handleSubmit = () => {
  proxy.$refs.ruleAddFormRef.validate(async valid => {
    if (valid) {
      dialogAddVisible.value = true
      ruleAddForm.rule_name = ''
      let start = moment().format('YYYYMMDD')
      var names = []
      //Google-EU-AND-230515-UAC3.0_PLTV-EU-newinstall-EU 有的是下划线。先替换为连字符- 在分割字符串
      ruleAddForm.object.forEach(item => {
        var arr = item.toString().replace('_', '-').split('-')
        if (arr.length != 0) {
          names.push(arr[0] + '-' + arr[1])
        }
      })
      names = unique(names)
      names.forEach(item => {
        ruleAddForm.rule_name += '/' + item
      })
      //创建名字的时候的格式改一下，用campaign名字用-分割，取第一个-第二个-opt-{ruleAddForm.campaign_type}-当天日期（20280802）
      var campaignTypeStr = ''
      if (ruleAddForm.campaign_type === '2') {
        campaignTypeStr = campainTypeArr[0].label
      }
      if (ruleAddForm.campaign_type === '3') {
        campaignTypeStr = campainTypeArr[1].label
      }
      ruleAddForm.rule_name += '-' + campaignTypeStr + '_opt_' + start
      ruleAddForm.rule_name = ruleAddForm.rule_name.substr(1)
    }
  })
}

//字符串数组去重
const unique = arr => {
  return arr.reduce((prev, cur) => (prev.includes(cur) ? prev : [...prev, cur]), [])
}

const handleSubmitNew = () => {
  proxy.$refs.ruleAddFormRef.validate(async valid => {
    if (valid) {
      if (!code) {
        ElMessage.error('get code err, please login again')
        return
      }
      // 构造请求参数
      const requestData = { object_status: {}, opt_target: {}, opt_constraint: [], creator: username, start_date: '', end_date: '' }
      requestData.game_code = ruleAddForm.game_code
      requestData.rule_name = ruleAddForm.rule_name
      requestData.opt_level = ruleAddForm.opt_level
      requestData.opt_target.openid = ruleAddForm.openid
      requestData.opt_target.metric = ruleAddForm.target
      ruleAddForm.constraint.forEach(item => {
        if (item.select_campaign.length==0){
          item.select_campaign.push(...allCampaignArr)
        }
        requestData.opt_constraint.push({
          value:Number(item.constraint_value, 10),
          scope:item.select_campaign,
          key:item.constraint_select
        })
      })
      requestData.opt_objects = ruleAddForm.object
      ruleAddForm.object.forEach(element => {
        //默认值active
        requestData.object_status[String(element)] = 'active'
      })
      requestData.opt_budget = ruleAddForm.budget
      requestData.tracking_basis = ruleAddForm.tracking_basis
      requestData.country = ruleAddForm.country
      requestData.code = code
      requestData.campaign_type = ruleAddForm.campaign_type
      // 添加日期
      if (ruleAddForm.date && ruleAddForm.date.length === 2) {
        requestData.start_date = formatDate(ruleAddForm.date[0], 'yyyy-mm-dd')
        requestData.end_date = formatDate(ruleAddForm.date[1], 'yyyy-mm-dd')
      }
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
  ruleAddForm.game_code = gameArr.value.length > 0 ? gameArr.value[0].value : ''
  ruleAddForm.rule_name = ''
  ruleAddForm.opt_level = 'campaign'
  ruleAddForm.campaign_type = '2'
  if (gameArr.value.length > 0) {
    ruleAddForm.game_code = gameArr.value[0].value
  } else {
    ruleAddForm.game_code = ''
    gameCodeDisabled.value = true
    campainTypeDisabled.value = true
  }
  ruleAddForm.target = ''
  ruleAddForm.openid = '1'
  ruleAddForm.constraint = []
  clearAddObject()
  ruleAddForm.tracking_basis = ''
  ruleAddForm.country = ''
  ruleAddForm.date = []
  openidDisabled.value = true
  trackingBasisDisabled.value = true
  targetDisabled.value = true
  constraintDisabled.value = true
  objectDisabled.value = true
}

// rule查询相关
const ruleArr = ref()
const getRuleArr = async () => {
  if (!code) {
    ElMessage.error('get code err, please login again')
    return
  }
  // 根据用户名查询rule
  const resp = await proxy.$api.automation.ruleQuery({ creator: username, code: code })
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    ruleArr.value = data.map(item => {
      const constraint = []
      item.opt_constraint.forEach(item => {
          constraint.push({
            id: nanoid(),
            constraint_select: item.key,
            constraint_value:item.value,
            select_campaign:item.scope? item.scope:[]
          })
        
      })
      return {
        rule_id: item.rule_id,
        game_code: item.game_code,
        rule_name: item.rule_name,
        opt_level: item.opt_level,
        target: item.opt_target.metric,
        openid: item.opt_target.openid,
        constraint: constraint,
        object: item.opt_objects,
        object_status: item.object_status,
        budget: item.opt_budget,
        creator: item.creator,
        create_time: item.create_time,
        tracking_basis: item.tracking_basis === 0 ? '' : item.tracking_basis,
        country: item.country,
        campaign_type: item.campaign_type,
        start_date: item.start_date,
        end_date: item.end_date,
        subscribe: item.subscribe ? item.subscribe : 'unsubscribe'
      }
    })
  } else {
    ElMessage.error(message || 'get rule failed')
  }
}


const editRule = row => {
  proxy.$refs.automzationEditRef.automationEditInit(row)
}

const newAdjustDialogVisible = ref(false)
const optimize_new = (rule_id, campaign_type, target, constraint) => {
  proxy.$refs.optimizeRef.display()
  proxy.$refs.optimizeRef.constructionOptimize(rule_id, campaign_type, target, constraint)
}

const historyNew = (rule_id, campaign_type, target, constraint) => {
  proxy.$refs.historyNewRef.historyNew(rule_id, campaign_type, target, constraint)
}
//-------------------------编辑  editRuleForm-----------------------------

// 删除rule
const delRuleDialogVisible = ref(false)
const delRuleId = ref(0)
const delRule = rule_id => {
  delRuleId.value = rule_id
  delRuleDialogVisible.value = true
}
const handleDelConfirm = async () => {
  if (!code) {
    ElMessage.error('get code err, please login again')
    return
  }
  // 通过rule id删除rule
  const resp = await proxy.$api.automation.ruleDel({ rule_id: delRuleId.value, code: code })
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

onMounted(() => {
  redirectWhenLogined()
  getRuleArr()
  addTrackChange()
  //页面加载时获取数据

})
</script>

<style lang="less" scoped>
.dialog-footer-button button:first-child {
  margin-right: 15%;
}
</style>
