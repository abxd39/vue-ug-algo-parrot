<template>
  <el-drawer v-model="drawerVisible" title="Optimization Solution" direction="btt" size="80%">
    <div align="left" style="position: relative; top: 0px; float: left;">
      <el-button type="primary" @click="echartsOptimize">Budget Curve</el-button>
    </div>
    <div style="height: 10px; clear: both"></div>
    <BudgetOptimize ref="budgetoptimizeRef" :data="adjustArr" v-if="echartsDisplay" style="margin: 0px; padding: 0px" />
    <div align="right" style="position: relative; top: 0px; float: right">
      <el-button type="primary" :disabled="disabledDownloadButton"  @click="download">download</el-button>
    </div>

    <div style="height: 20px; clear: both"></div>
    <el-table :data="adjustArr" style="width: 100%" size="small" :span-method="objectSpanMethod" stripe border :header-cell-style="headerCellStyle" v-loading="adjustLoading">
      <el-table-column fixed prop="budget" label="budget" width="150">
        <template #default="scope">
          <span style="display: inline-block; width: 10%">
            <el-icon v-if="scope.row.showOpen === 0" color="#F56C6C"><Warning /></el-icon>
            <el-icon v-else color="#67C23A"><CircleCheck /></el-icon>
          </span>
          <span style="display: inline-block; width: 80%">{{ `${scope.row.budget}${scope.row.label || ''}` }}</span>
          <!-- 0: 不出现，1：向下， 2：向上 -->
          <span style="display: inline-block; width: 10%">
            <el-icon v-show="scope.row.showOpen === 1" style="cursor: pointer" @click="openDetail(scope.$index)"><CaretBottom /></el-icon>
            <el-icon v-show="scope.row.showOpen === 2" style="cursor: pointer" @click="foldDetail(scope.$index)"><CaretTop /></el-icon>
          </span>
          <span>
            <!--h1>哈哈哈</!--h1-->
            <el-tag size="small" v-if="scope.row.goal_improvement == '-1' ? false : true">{{ 'target +' + scope.row.goal_improvement }}</el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column fixed prop="object" label="Object" width="500">
        <template #default="scope">
          <template v-if="scope.row.portrait && scope.row.portrait.length > 0">
            <span>{{ scope.row.object }}</span>
            <div>
              <el-tag v-for="item in scope.row.portrait" :key="item" size="small" :type="item.type">{{ item.value }}</el-tag>
            </div>
          </template>
          <template v-else>
            <span>{{ scope.row.object }}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed prop="media_budget" label="mediaBudget" width="100" />
      <el-table-column fixed prop="cur_budget" label="originBudget" width="100" />
      <el-table-column fixed prop="cur_bid" label="originBid" />
      <el-table-column fixed prop="rec_budget" label="recBudget" width="130">
        <template #default="scope">
          <template v-if="scope.row.rec_bid === '-'">
            <span>{{ scope.row.rec_budget }}</span>
          </template>
          <template v-else>
            <template v-if="scope.row.rec_budget.compare > 0">
              <span style="padding-right: 5px">{{ scope.row.rec_budget.ori }}</span>
              <span style="background-color: #d4001a; color: #fff; padding: 1px">{{ scope.row.rec_budget.compare }}</span>
            </template>
            <template v-else-if="scope.row.rec_budget.compare == 0">
              <span style="padding-right: 5px">{{ scope.row.rec_budget.ori }}</span>
              <span style="background-color: #909190f0; color: #fff; padding: 1px">{{ scope.row.rec_budget.compare }}</span>
            </template>
            <template v-else>
              <span style="padding-right: 5px">{{ scope.row.rec_budget.ori }}</span>
              <span style="background-color: #077d11; color: #fff; padding: 1px">{{ scope.row.rec_budget.compare }}</span>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column fixed prop="rec_bid" label="recBid" width="130">
        <template #default="scope">
          <template v-if="scope.row.rec_bid === '-'">
            <span>{{ scope.row.rec_bid }}</span>
          </template>
          <template v-else>
            <template v-if="scope.row.rec_bid.compare > 0">
              <span style="padding-right: 5px">{{ scope.row.rec_bid.ori }}</span>
              <span style="background-color: #d4001a; color: #fff; padding: 1px">{{ scope.row.rec_bid.compare }}</span>
            </template>
            <template v-else-if="scope.row.rec_bid.compare == 0">
              <span style="padding-right: 5px">{{ scope.row.rec_bid.ori }}</span>
              <span style="background-color: #909190f0; color: #fff; padding: 1px">{{ scope.row.rec_bid.compare }}</span>
            </template>
            <template v-else>
              <span style="padding-right: 5px">{{ scope.row.rec_bid.ori }}</span>
              <span style="background-color: #077d11; color: #fff; padding: 1px">{{ scope.row.rec_bid.compare }}</span>
            </template>
          </template>
        </template>
      </el-table-column>
      <el-table-column v-if="disabledDynamicTarget()" fixed prop="fixed_column" :label="dynamicTargetName + '（Target）'" width="150">
        <template #default="scope">
          <span style="background-color: #f3d19e; font-weight: bold; padding: 2px">{{ scope.row.fixed_column }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="spend" label="Spend" width="140" />
      <template v-if="currentCampaignType === 3">
        <el-table-column prop="reattributions" label="Reattributions" width="100"> </el-table-column>
        <el-table-column prop="cpr" label="CPR" width="100"> </el-table-column>
        <el-table-column prop="d1_retention_rate" label="D1 Retention Rate" width="150"> </el-table-column>
        <el-table-column prop="d2_retention_rate" label="D2 Retention Rate" width="150"> </el-table-column>
        <el-table-column prop="d7_retention_rate" label="D7 Retention Rate" width="150"> </el-table-column>
        <el-table-column prop="d14_retention_rate" label="D14 Retention Rate" width="150"> </el-table-column>
        <el-table-column prop="d1_roas" label="D1 Roas" width="130"> </el-table-column>
        <el-table-column prop="d2_roas" label="D2 Roas" width="130"> </el-table-column>
        <el-table-column prop="d7_roas" label="D7 Roas" width="130"> </el-table-column>
        <el-table-column prop="d14_roas" label="D14 Roas" width="130"> </el-table-column>
      </template>
      <template v-else>
        <el-table-column prop="installs" label="Installs" width="100"> </el-table-column>
        <el-table-column prop="cpi" label="CPI" width="100"> </el-table-column>
        <el-table-column prop="registers" label="Registers" width="100"> </el-table-column>
        <el-table-column prop="cpr" label="CPR" width="100"> </el-table-column>
        <el-table-column prop="cohort_register_rate" label="Cohort Register Rate" width="150"> </el-table-column>
        <el-table-column prop="d1_cohort_register_rate" label="D1 Cohort Register Rate" width="160"> </el-table-column>
        <el-table-column prop="d2_retention_rate" label="D2 Retention Rate" width="150"> </el-table-column>
        <el-table-column prop="d7_retention_rate" label="D7 Retention Rate" width="150"> </el-table-column>
        <el-table-column prop="d1_roas" label="D1 Roas" width="130"> </el-table-column>
        <el-table-column prop="d3_roas" label="D3 Roas" width="130"> </el-table-column>
        <el-table-column prop="d7_roas" label="D7 Roas" width="130"> </el-table-column>
      </template>
      <el-table-column prop="cost_per_d1_retention" label="Cost Per D1 Retention" width="150"> </el-table-column>
      <el-table-column prop="cost_per_d2_retention" label="Cost Per D2 Retention" width="150"> </el-table-column>
      <el-table-column prop="cost_per_d7_retention" label="Cost Per D7 Retention" width="150"> </el-table-column>
      <el-table-column prop="cost_per_d14_retention" label="Cost Per D14 Retention" width="155"> </el-table-column>
    </el-table>
    <div style="width: 50%; margin-top: 20px" v-show="adjustArr.length > 0" v-loading="optimizeNewBudgetLoading">
      <h5>Explore new budget for optimization</h5>
      <el-input style="width: 50%" placeholder="input new budget" v-model.number="optimizeNewBudget"></el-input>
      <el-button style="margin-left: 10px" type="primary" @click="newBudgetOptimize">Submit</el-button>
    </div>
  </el-drawer>
  <DownloadOptimization ref="downloadRef" :adjustArr="downloadData" :dynamicTargetName="dynamicTargetName" :currentCampaignType="currentCampaignType" v-if="downloadDisplay" ></DownloadOptimization>
</template>
<script setup>
import { ref, getCurrentInstance, toRefs, onMounted } from 'vue'
import { sendUserAction, getCookie } from '@/utils/api_utils'
import { campainTypeArr, openidArr, targetArr, trackingBasisArr, countryArr, constraintTempArr } from './data'

const drawerVisible = ref(false)
//图表
const echartsDisplay = ref(false)
const downloadDisplay=ref(false)
const { proxy } = getCurrentInstance()
const username = getCookie('user_name')
const code = getCookie('code')
// portrait标签的颜色
const portraitColor = {
  fresh: '',
  cost_wave: 'success',
  cpi_wave: 'info',
  not_enough_spend: 'warning',
  compete: 'danger'
}
const optimizeNewBudget = ref('')
const optimizeNewBudgetLoading = ref(false)
const adjustLoading = ref(false)
// 表格数据
const adjustArr = ref([])
const downloadData={}
const mergeRow = ref([])
const disabledDownloadButton=ref(true)
// 表格原始数据（刚请求回来的数据）
let openAdjustArr = []
let foldAdjustArr = []
// 合并的表格行
let openMergeRow = []
let foldMergeRow = []
// 当前点击的rule name
let currentRuleId = ''
let currentCampaignType = ref(0)
let currentTarget = 0
let currentConstraint = []
let TargetDisabled = ['Budget', 'CPReattr']
//动态label
const dynamicTargetName = ref('')

const highlightStyle = prop => {
  if (!prop) {
    return {}
  }
  let currentTargetName = ''
  for (const item of targetArr) {
    if (item.value == currentTarget) {
      currentTargetName = item.label.toLocaleLowerCase().split(' ').join('_')
      break
    }
  }
  if (currentTargetName === 'budget') {
    const currentConstraintArr = currentConstraint.map(item => {
      return item.constraint_select
    })
    if (currentConstraintArr.includes(prop)) {
      return {
        backgroundColor: '#f3d19e',
        fontWeight: 'bold',
        padding: '2px'
      }
    }
  } else {
    if (currentTargetName == prop) {
      return {
        backgroundColor: '#f3d19e',
        fontWeight: 'bold',
        padding: '2px'
      }
    }
  }
  return {}
}

const headerCellStyle = () => {
  return {
    color: '#000000',
    backgroundColor: '#dedfe0'
  }
}

const echartsOptimize = () => {
  echartsDisplay.value = !echartsDisplay.value
  if (echartsDisplay.value) {
    setTimeout(() => {
      //调用子组件的方法
      proxy.$refs.budgetoptimizeRef.InitEchart(adjustArr.value, currentTarget)
    }, 10)
  }
}

const download=()=>{
  downloadDisplay.value=true
  downloadData.value=adjustArr.value
  //console.log('optimize ',downloadData.value);
  setTimeout(() => {
    proxy.$refs.downloadRef.disabledDownload()
  },10)
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
  if (adjustArr.value[index].showOpen == 2) {
    return
  }
  let currentRowIndex = 0 // 当前点击对应合并row数组的index
  for (const rowIndex in mergeRow.value) {
    const rowItem = mergeRow.value[rowIndex]
    if (index === rowItem[0]) {
      currentRowIndex = rowIndex
      break
    }
  }

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

// 构造数据的函数
const genData = (item, openArr, foldArr, showOpen) => {
  const opt_budget = item.opt_budget
  var goal_improvement = '-1'
  if (item.goal_improvement && item.goal_improvement != '-1') {
    goal_improvement = (item.goal_improvement * 100).toFixed(2) + '%'
  }
  const original_item = {
    budget: opt_budget,
    goal_improvement: goal_improvement,
    object: 'original',
    media_budget: item.total.original.media_budget ? item.total.original.media_budget.toFixed(0) : '-',
    cur_budget: item.total.original.budget.toFixed(0),
    cur_bid: '-',
    rec_budget: '-',
    rec_bid: '-',
    spend: item.total.original.spend >= 0 ? item.total.original.spend.toFixed(2) : '-',
    installs: item.total.original.installs >= 0 ? item.total.original.installs.toFixed(0) : '-',
    cpi: item.total.original.cpi >= 0 ? item.total.original.cpi.toFixed(2) : '-',
    cpr: item.total.original.cpr >= 0 ? item.total.original.cpr.toFixed(2) : '-',
    registers: item.total.original.registers >= 0 ? item.total.original.registers.toFixed(0) : '-',
    cohort_register_rate: item.total.original.cohort_register_rate >= 0 ? (item.total.original.cohort_register_rate * 100).toFixed(2) + '%' : '-',
    d1_cohort_register_rate: item.total.original.d1_cohort_register_rate >= 0 ? (item.total.original.d1_cohort_register_rate * 100).toFixed(2) + '%' : '-',
    d2_retention_rate: item.total.original.d2_retention_rate >= 0 ? (item.total.original.d2_retention_rate * 100).toFixed(2) + '%' : '-',
    d7_retention_rate: item.total.original.d7_retention_rate >= 0 ? (item.total.original.d7_retention_rate * 100).toFixed(2) + '%' : '-',
    cost_per_d2_retention: item.total.original.cost_per_d2_retention >= 0 ? item.total.original.cost_per_d2_retention.toFixed(2) : '-',
    cost_per_d7_retention: item.total.original.cost_per_d7_retention >= 0 ? item.total.original.cost_per_d7_retention.toFixed(2) : '-',
    reattributions: item.total.original.reattributions >= 0 ? item.total.original.reattributions.toFixed(0) : '-',
    d1_retention_rate: item.total.original.d1_retention_rate >= 0 ? (item.total.original.d1_retention_rate * 100).toFixed(2) + '%' : '-',
    d14_retention_rate: item.total.original.d14_retention_rate >= 0 ? (item.total.original.d14_retention_rate * 100).toFixed(2) + '%' : '-',
    d1_roas: item.total.original.d1_roas >= 0 ? (item.total.original.d1_roas * 100).toFixed(2) + '%' : '-',
    d2_roas: item.total.original.d2_roas >= 0 ? (item.total.original.d2_roas * 100).toFixed(2) + '%' : '-',
    d3_roas: item.total.original.d3_roas >= 0 ? (item.total.original.d3_roas * 100).toFixed(2) + '%' : '-',
    d7_roas: item.total.original.d7_roas >= 0 ? (item.total.original.d7_roas * 100).toFixed(2) + '%' : '-',
    d14_roas: item.total.original.d14_roas >= 0 ? (item.total.original.d14_roas * 100).toFixed(2) + '%' : '-',
    cost_per_d1_retention: item.total.original.cost_per_d1_retention >= 0 ? item.total.original.cost_per_d1_retention.toFixed(2) : '-',
    cost_per_d14_retention: item.total.original.cost_per_d14_retention >= 0 ? item.total.original.cost_per_d14_retention.toFixed(2) : '-',
    showOpen: showOpen, // 开始是否显示open下箭头
    fixed_column: ''
  }
  original_item.fixed_column = dynamicColumn(original_item)
  const opt_item = {
    budget: opt_budget,
    goal_improvement: goal_improvement,
    object: 'opt',
    media_budget: item.total.opt.media_budget ? item.total.opt.media_budget.toFixed(0) : '-',
    cur_budget: '-',
    cur_bid: '-',
    rec_budget: item.total.opt.budget.toFixed(0),
    rec_bid: '-',
    spend: item.total.opt.spend >= 0 ? item.total.opt.spend.toFixed(2) : '-',
    installs: item.total.opt.installs >= 0 ? item.total.opt.installs.toFixed(0) : '-',
    cpi: item.total.opt.cpi >= 0 ? item.total.opt.cpi.toFixed(2) : '-',
    cpr: item.total.opt.cpr >= 0 ? item.total.opt.cpr.toFixed(2) : '-',
    registers: item.total.opt.registers >= 0 ? item.total.opt.registers.toFixed(0) : '-',
    cohort_register_rate: item.total.opt.cohort_register_rate >= 0 ? (item.total.opt.cohort_register_rate * 100).toFixed(2) + '%' : '-',
    d1_cohort_register_rate: item.total.opt.d1_cohort_register_rate >= 0 ? (item.total.opt.d1_cohort_register_rate * 100).toFixed(2) + '%' : '-',
    d2_retention_rate: item.total.opt.d2_retention_rate >= 0 ? (item.total.opt.d2_retention_rate * 100).toFixed(2) + '%' : '-',
    d7_retention_rate: item.total.opt.d7_retention_rate >= 0 ? (item.total.opt.d7_retention_rate * 100).toFixed(2) + '%' : '-',
    cost_per_d2_retention: item.total.opt.cost_per_d2_retention >= 0 ? item.total.opt.cost_per_d2_retention.toFixed(2) : '-',
    cost_per_d7_retention: item.total.opt.cost_per_d7_retention >= 0 ? item.total.opt.cost_per_d7_retention.toFixed(2) : '-',
    reattributions: item.total.opt.reattributions >= 0 ? item.total.opt.reattributions.toFixed(0) : '-',
    d1_retention_rate: item.total.opt.d1_retention_rate >= 0 ? (item.total.opt.d1_retention_rate * 100).toFixed(2) + '%' : '-',
    d14_retention_rate: item.total.opt.d14_retention_rate >= 0 ? (item.total.opt.d14_retention_rate * 100).toFixed(2) + '%' : '-',
    d1_roas: item.total.opt.d1_roas >= 0 ? (item.total.opt.d1_roas * 100).toFixed(2) + '%' : '-',
    d2_roas: item.total.opt.d2_roas >= 0 ? (item.total.opt.d2_roas * 100).toFixed(2) + '%' : '-',
    d3_roas: item.total.opt.d3_roas >= 0 ? (item.total.opt.d3_roas * 100).toFixed(2) + '%' : '-',
    d7_roas: item.total.opt.d7_roas >= 0 ? (item.total.opt.d7_roas * 100).toFixed(2) + '%' : '-',
    d14_roas: item.total.opt.d14_roas >= 0 ? (item.total.opt.d14_roas * 100).toFixed(2) + '%' : '-',
    cost_per_d1_retention: item.total.opt.cost_per_d1_retention >= 0 ? item.total.opt.cost_per_d1_retention.toFixed(2) : '-',
    cost_per_d14_retention: item.total.opt.cost_per_d14_retention >= 0 ? item.total.opt.cost_per_d14_retention.toFixed(2) : '-',
    showOpen: showOpen, // 开始是否显示open下箭头
    fixed_column: ''
  }
  //gei fixed_column 赋值
  opt_item.fixed_column = dynamicColumn(opt_item)
  openArr.push(original_item, opt_item)
  foldArr.push(original_item, opt_item)
  item.details.forEach(item => {
    let portraits = []
    if (item.portrait) {
      portraits = item.portrait.map(item => {
        return { type: portraitColor[item], value: item }
      })
    }
    let obj = {
      budget: opt_budget,
      goal_improvement: goal_improvement,
      object: item.campaign_name,
      portrait: portraits,
      media_budget: item.original.media_budget ? item.original.media_budget.toFixed(0) : '-',
      cur_budget: item.original.budget.toFixed(0),
      cur_bid: item.original.bid.toFixed(2),
      rec_budget: {
        ori: item.opt.budget.toFixed(0),
        compare: item.opt.budget.toFixed(0) - item.original.budget.toFixed(0)
      },
      rec_bid: {
        ori: item.opt.bid.toFixed(2),
        compare: (item.opt.bid.toFixed(2) - item.original.bid.toFixed(2)).toFixed(2)
      },
      spend: `${item.original.spend >= 0 ? item.original.spend.toFixed(2) : '-'} / ${item.opt.spend >= 0 ? item.opt.spend.toFixed(2) : '-'}`,
      installs: `${item.original.installs >= 0 ? item.original.installs.toFixed(0) : '-'} / ${item.opt.installs >= 0 ? item.opt.installs.toFixed(0) : '-'}`,
      cpi: `${item.original.cpi >= 0 ? item.original.cpi.toFixed(2) : '-'} / ${item.opt.cpi >= 0 ? item.opt.cpi.toFixed(2) : '-'}`,
      cpr: `${item.original.cpr >= 0 ? item.original.cpr.toFixed(2) : '-'} / ${item.opt.cpr >= 0 ? item.opt.cpr.toFixed(2) : '-'}`,
      registers: `${item.original.registers >= 0 ? item.original.registers.toFixed(0) : '-'} / ${item.opt.registers >= 0 ? item.opt.registers.toFixed(0) : '-'}`,
      cohort_register_rate: `${item.original.cohort_register_rate >= 0 ? (item.original.cohort_register_rate * 100).toFixed(2) + '%' : '-'} / ${
        item.opt.cohort_register_rate >= 0 ? (item.opt.cohort_register_rate * 100).toFixed(2) + '%' : '-'
      }`,
      d1_cohort_register_rate: `${item.original.d1_cohort_register_rate >= 0 ? (item.original.d1_cohort_register_rate * 100).toFixed(2) + '%' : '-'} / ${
        item.opt.d1_cohort_register_rate >= 0 ? (item.opt.d1_cohort_register_rate * 100).toFixed(2) + '%' : '-'
      }`,
      d2_retention_rate: `${item.original.d2_retention_rate >= 0 ? (item.original.d2_retention_rate * 100).toFixed(2) + '%' : '-'} / ${
        item.opt.d2_retention_rate >= 0 ? (item.opt.d2_retention_rate * 100).toFixed(2) + '%' : '-'
      }`,
      d7_retention_rate: `${item.original.d7_retention_rate >= 0 ? (item.original.d7_retention_rate * 100).toFixed(2) + '%' : '-'} / ${
        item.opt.d7_retention_rate >= 0 ? (item.opt.d7_retention_rate * 100).toFixed(2) + '%' : '-'
      }`,
      cost_per_d2_retention: `${item.original.cost_per_d2_retention >= 0 ? item.original.cost_per_d2_retention.toFixed(2) : '-'} / ${
        item.opt.cost_per_d2_retention >= 0 ? item.opt.cost_per_d2_retention.toFixed(2) : '-'
      }`,
      cost_per_d7_retention: `${item.original.cost_per_d7_retention >= 0 ? item.original.cost_per_d7_retention.toFixed(2) : '-'} / ${
        item.opt.cost_per_d7_retention >= 0 ? item.opt.cost_per_d7_retention.toFixed(2) : '-'
      }`,
      reattributions: `${item.original.reattributions >= 0 ? item.original.reattributions.toFixed(0) : '-'} / ${item.opt.reattributions >= 0 ? item.opt.reattributions.toFixed(0) : '-'}`,
      d1_retention_rate: `${item.original.d1_retention_rate >= 0 ? (item.original.d1_retention_rate * 100).toFixed(2) + '%' : '-'} / ${
        item.opt.d1_retention_rate >= 0 ? (item.opt.d1_retention_rate * 100).toFixed(2) + '%' : '-'
      }`,
      d14_retention_rate: `${item.original.d14_retention_rate >= 0 ? (item.original.d14_retention_rate * 100).toFixed(2) + '%' : '-'} / ${
        item.opt.d14_retention_rate >= 0 ? (item.opt.d14_retention_rate * 100).toFixed(2) + '%' : '-'
      }`,
      d1_roas: `${item.original.d1_roas >= 0 ? (item.original.d1_roas * 100).toFixed(2) + '%' : '-'} / ${item.opt.d1_roas >= 0 ? (item.opt.d1_roas * 100).toFixed(2) + '%' : '-'}`,
      d2_roas: `${item.original.d2_roas >= 0 ? (item.original.d2_roas * 100).toFixed(2) + '%' : '-'} / ${item.opt.d2_roas >= 0 ? (item.opt.d2_roas * 100).toFixed(2) + '%' : '-'}`,
      d3_roas: `${item.original.d3_roas >= 0 ? (item.original.d3_roas * 100).toFixed(2) + '%' : '-'} / ${item.opt.d3_roas >= 0 ? (item.opt.d3_roas * 100).toFixed(2) + '%' : '-'}`,
      d7_roas: `${item.original.d7_roas >= 0 ? (item.original.d7_roas * 100).toFixed(2) + '%' : '-'} / ${item.opt.d7_roas >= 0 ? (item.opt.d7_roas * 100).toFixed(2) + '%' : '-'}`,
      d14_roas: `${item.original.d14_roas >= 0 ? (item.original.d14_roas * 100).toFixed(2) + '%' : '-'} / ${item.opt.d14_roas >= 0 ? (item.opt.d14_roas * 100).toFixed(2) + '%' : '-'}`,
      cost_per_d1_retention: `${item.original.cost_per_d1_retention >= 0 ? item.original.cost_per_d1_retention.toFixed(2) : '-'} / ${
        item.opt.cost_per_d1_retention >= 0 ? item.opt.cost_per_d1_retention.toFixed(2) : '-'
      }`,
      cost_per_d14_retention: `${item.original.cost_per_d14_retention >= 0 ? item.original.cost_per_d14_retention.toFixed(2) : '-'} / ${
        item.opt.cost_per_d14_retention >= 0 ? item.opt.cost_per_d14_retention.toFixed(2) : '-'
      }`,
      fixed_column: '',
      showOpen: showOpen // 开始是否显示open下箭头
    }
    obj.fixed_column = dynamicColumn(obj)
    openArr.push(obj)
  })
}

const disabledDynamicTarget = () => {
  if (TargetDisabled.includes(dynamicTargetName.value)) {
    return false
  }
  return true
}

//动态判断当前target 并赋值给 fixed_column:'-',
const dynamicColumn = item => {
  for (const item of targetArr) {
    if (item.value == currentTarget) {
      dynamicTargetName.value = item.label
    }
  }
  switch (currentTarget) {
    case 1:
      return item.installs ? item.installs : '-'
    case 2:
      return item.cpi ? item.cpi : '-'
    case 3:
      return item.registers ? item.registers : '-'
    case 4:
      return item.reattributions ? item.reattributions : '-'
    case 5:
      return item.cpr ? item.cpr : '-'
    case 6:
      return '-'
    case 7:
      return item.cohort_register_rate ? item.cohort_register_rate : '-'
    case 8:
      return item.d1_cohort_register_rate ? item.d1_cohort_register_rate : '-'
    case 9:
      return item.d1_retention_rate ? item.d1_retention_rate : '-'
    case 10:
      return item.d2_retention_rate ? item.d2_retention_rate : '-'
    case 11:
      return item.d7_retention_rate ? item.d7_retention_rate : '-'
    case 12:
      return item.d14_retention_rate ? item.d14_retention_rate : '-'
    case 13:
      return item.d1_roas ? item.d1_roas : '-'
    case 14:
      return item.d2_roas ? item.d2_roas : '-'
    case 15:
      return item.d3_roas ? item.d3_roas : '-'
    case 16:
      return item.d7_roas ? item.d7_roas : '-'
    case 17:
      return item.d14_roas ? item.d14_roas : '-'
    case 18:
      return item.cost_per_d1_retention ? item.cost_per_d1_retention : '-'
    case 19:
      return item.cost_per_d2_retention ? item.cost_per_d2_retention : '-'
    case 20:
      return item.cost_per_d7_retention ? item.cost_per_d7_retention : '-'
    case 21:
      return item.cost_per_d14_retention ? item.cost_per_d14_retention : '-'
    default:
      return '-'
  }
}

// 对打开和关闭的数组做处理
const handleRawData = (openAdjustArr, foldAdjustArr) => {
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
}

//新增budget
const newBudgetOptimize = async () => {
  // 校验输入字段的合法性
  if (typeof optimizeNewBudget.value === 'string') {
    ElMessage.error('budget can not be string')
    return
  }
  // 校验重复性
  for (const item of foldAdjustArr) {
    if (item.budget === optimizeNewBudget.value) {
      ElMessage.error('budget is exist')
      return
    }
  }
  // 校验code
  if (!code) {
    ElMessage.error('get code err, please login again')
    return
  }
  // 开始发送请求
  optimizeNewBudgetLoading.value = true
  const resp = await proxy.$api.automation.optCalculate({ rule_id: currentRuleId, budget: optimizeNewBudget.value, code: code })
  optimizeNewBudgetLoading.value = false
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message, data } = resp.data
  if (ret_code === '0') {
    if (message === 'success') {
      ElMessageBox.confirm(message, 'Success', {
        confirmButtonText: 'OK',
        type: 'success',
        center: true,
        showCancelButton: false,
        showClose: false
      })
    } else {
      messageBox(message)
    }
    // 返回值校验
    if (data.length !== 1) {
      ElMessage.error('the length of data is not 1')
      return
    }
    const item = data[0]
    if (item.opt_budget !== optimizeNewBudget.value) {
      ElMessage.error('the opt_budget in response data is not equal to ' + optimizeNewBudget.value)
      return
    }
    // 校验成功清空输入框
    optimizeNewBudget.value = ''
    if (!item.solved) {
      // 需要将当前替换成'-'
      let goal_improvement = '-1'
      if (item.goal_improvement && item.goal_improvement != '-1') {
        goal_improvement = (item.goal_improvement * 100).toFixed(2) + '%'
      }
      const adjustItem = {
        budget: item.opt_budget,
        goal_improvement: goal_improvement ? goal_improvement : '-1',
        object: '-',
        media_budget: '-',
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
        fixed_column: '-',
        showOpen: 0
      }
      // 目前修改的逻辑是不排序，直接在尾部添加
      openAdjustArr.push(adjustItem)
      foldAdjustArr.push(adjustItem)
      foldMergeRow.push([foldMergeRow[foldMergeRow.length - 1][0] + foldMergeRow[foldMergeRow.length - 1][1], 1])
      openMergeRow.push([openMergeRow[openMergeRow.length - 1][0] + openMergeRow[openMergeRow.length - 1][1], 1])
      adjustArr.value.push(adjustItem)
      mergeRow.value.push([mergeRow.value[mergeRow.value.length - 1][0] + mergeRow.value[mergeRow.value.length - 1][1], 1])
      //刷新图表
      if (echartsDisplay.value) {
        setTimeout(() => {
          //调用子组件的方法
          proxy.$refs.budgetoptimizeRef.InitEchart(adjustArr.value, currentTarget)
        }, 10)
      }
      return
    }
    // 获取原始展开状态
    const tempOpenArr = []
    const tempFoldArr = []
    // 不用管原来展开还是不展开，统一变为收起
    genData(item, tempOpenArr, tempFoldArr, 1)
    // 目前修改的逻辑是不排序，直接在尾部添加
    openAdjustArr.push(...tempOpenArr)
    foldAdjustArr.push(...tempFoldArr)
    foldMergeRow.push([foldMergeRow[foldMergeRow.length - 1][0] + foldMergeRow[foldMergeRow.length - 1][1], tempFoldArr.length])
    openMergeRow.push([openMergeRow[openMergeRow.length - 1][0] + openMergeRow[openMergeRow.length - 1][1], tempOpenArr.length])
    adjustArr.value.push(...tempFoldArr)
    mergeRow.value.push([mergeRow.value[mergeRow.value.length - 1][0] + mergeRow.value[mergeRow.value.length - 1][1], tempFoldArr.length])
    for (let index of openMergeRow) {
      openDetail(index[0])
    }
    //刷新图表
    if (echartsDisplay.value) {
      setTimeout(() => {
        //调用子组件的方法
        proxy.$refs.budgetoptimizeRef.InitEchart(adjustArr.value, currentTarget)
      }, 10)
    }
  } else {
    ElMessage.error(message || 'adjust failed')
  }
}

const display = () => {
  drawerVisible.value = true
}
const constructionOptimize = async (rule_id, campaign_type, target, constraint) => {
  let temp = await optimizeNew(rule_id, campaign_type, target, constraint)
}

const optimizeNew = async (rule_id, campaign_type, target, constraint) => {
  currentRuleId = rule_id
  currentCampaignType.value = campaign_type
  currentTarget = target
  currentConstraint = constraint
  // 每次都需要将表格清空
  openAdjustArr = []
  foldAdjustArr = []
  drawerVisible.value = true
  adjustLoading.value = true
  echartsDisplay.value = false
  disabledDownloadButton.value=true
  if (!code) {
    ElMessage.error('get code err, please login again')
    return
  }
  const resp = await proxy.$api.automation.optCalculate({ rule_id: rule_id, code: code })
  adjustLoading.value = false
  disabledDownloadButton.value=false
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message, data } = resp.data
  if (ret_code === '0') {
    if (message === 'success') {
      ElMessageBox.confirm(message, 'Success', {
        confirmButtonText: 'OK',
        type: 'success',
        center: true,
        showCancelButton: false,
        showClose: false
      })
    } else {
      messageBox(message)
    }
    if (data.length > 0) {
      // 将结果拆成结果想要的数据结构
      data.forEach(item => {
        if (!item.solved) {
          const adjustItem = {
            budget: item.opt_budget,
            goal_improvement: item.goal_improvement ? item.goal_improvement : '-1',
            object: '-',
            media_budget: '-',
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
            fixed_column: '-',
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
      handleRawData(openAdjustArr, foldAdjustArr)
      if (target !== 22) {
        const labelArr = ['(1.0*budget)']
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
      }
      // 深拷贝
      adjustArr.value = JSON.parse(JSON.stringify(foldAdjustArr))
      mergeRow.value = JSON.parse(JSON.stringify(foldMergeRow))
      for (let index of openMergeRow) {
        openDetail(index[0])
      }
    }
    // console.log(foldMergeRow, openMergeRow)
    //先等待10秒调用图表函数
    // echartsDisplay.value = true
    // setTimeout(() => {
    //   //调用子组件的方法
    //   proxy.$refs.budgetoptimizeRef.InitEchart(adjustArr.value, currentTarget)
    // }, 10)
  } else {
    ElMessageBox.confirm(message || 'optimize failed', 'Error ', {
      confirmButtonText: 'OK',
      type: 'error',
      center: true,
      showCancelButton: false,
      showClose: false
    })
  }
}

const messageBox = msg => {
  let obj = JSON.parse(msg)
  Object.keys(obj).forEach(key => {
    if (obj[key].length == 0) {
      ElMessageBox.confirm(obj[key], 'Success', {
        confirmButtonText: 'OK',
        type: 'success',
        center: true,
        showCancelButton: false,
        showClose: false
      })
    } else {
      ElMessageBox.confirm(obj[key], 'Error', {
        confirmButtonText: 'OK',
        type: 'error',
        center: true,
        showCancelButton: false,
        showClose: false
      })
    }
  })
}
// 暴露变量和方法
defineExpose({
  display,
  constructionOptimize
})
</script>
<style lang="less" scoped>
.dialog-footer-button button:first-child {
  margin-right: 15%;
}
</style>
