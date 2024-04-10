<template>
    <el-drawer v-model="allVisible" title="All Rule Adjust" direction="btt" size="70%">
        <el-table :data="allAdjustArr" style="width: 100%" size="small" stripe>
          <el-table-column type="expand">
            <template #default="props">
              <el-table :data="props.row.children" size="small" :span-method="allSpanMethod" border :header-cell-style="headerCellStyle">
                <el-table-column fixed prop="budget" label="budget" width="120">
                  <template #default="scope">
                    <span style="display: inline-block; width: 15%">
                      <el-icon v-if="scope.row.solved" color="#67C23A"><CircleCheck /></el-icon>
                      <el-icon v-else color="#F56C6C"><Warning /></el-icon>
                    </span>
                    <span style="display: inline-block; width: 85%">{{ scope.row.budget }}</span>
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
                <el-table-column fixed prop="cur_budget" label="curBudget" />
                <el-table-column fixed prop="cur_bid" label="curBid" />
                <el-table-column fixed prop="rec_budget" label="recBudget" width="130">
                  <template #default="scope">
                    <template v-if="scope.row.rec_bid === '-'">
                      <span>{{ scope.row.rec_budget }}</span>
                    </template>
                    <template v-else>
                      <template v-if="scope.row.rec_budget.compare >= 0">
                        <span style="padding-right: 5px">{{ scope.row.rec_budget.ori }}</span>
                        <span style="background-color: #d4001a; color: #fff; padding: 1px">{{ scope.row.rec_budget.compare }}</span>
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
                      <template v-if="scope.row.rec_bid.compare >= 0">
                        <span style="padding-right: 5px">{{ scope.row.rec_bid.ori }}</span>
                        <span style="background-color: #d4001a; color: #fff; padding: 1px">{{ scope.row.rec_bid.compare }}</span>
                      </template>
                      <template v-else>
                        <span style="padding-right: 5px">{{ scope.row.rec_bid.ori }}</span>
                        <span style="background-color: #077d11; color: #fff; padding: 1px">{{ scope.row.rec_bid.compare }}</span>
                      </template>
                    </template>
                  </template>
                </el-table-column>
                <el-table-column prop="spend" label="Spend" width="140" />
                <template v-if="currentCampaignType === 3">
                  <el-table-column prop="reattributions" label="Reattributions" width="100">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.reattributions }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="cpr" label="CPR" width="100">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.cpr }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="d1_retention_rate" label="D1 Retention Rate" width="150">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.d1_retention_rate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="d2_retention_rate" label="D2 Retention Rate" width="150">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.d2_retention_rate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="d7_retention_rate" label="D7 Retention Rate" width="150">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.d7_retention_rate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="d14_retention_rate" label="D14 Retention Rate" width="150">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.d14_retention_rate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="d1_roas" label="D1 Roas" width="130">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.d1_roas }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="d2_roas" label="D2 Roas" width="130">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.d2_roas }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="d7_roas" label="D7 Roas" width="130">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.d7_roas }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="d14_roas" label="D14 Roas" width="130">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.d14_roas }}</span>
                    </template>
                  </el-table-column>
                </template>
                <template v-else>
                  <el-table-column prop="installs" label="Installs" width="100">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.installs }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="cpi" label="CPI" width="100">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.cpi }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="registers" label="Registers" width="100">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.registers }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="cpr" label="CPR" width="100">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.cpr }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="cohort_register_rate" label="Cohort Register Rate" width="150">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.cohort_register_rate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="d1_cohort_register_rate" label="D1 Cohort Register Rate" width="160">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.d1_cohort_register_rate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="d2_retention_rate" label="D2 Retention Rate" width="150">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.d2_retention_rate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="d7_retention_rate" label="D7 Retention Rate" width="150">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.d7_retention_rate }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="d1_roas" label="D1 Roas" width="130">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.d1_roas }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="d3_roas" label="D3 Roas" width="130">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.d3_roas }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="d7_roas" label="D7 Roas" width="130">
                    <template #default="scope">
                      <span :style="highlightStyle(scope.column.property)">{{ scope.row.d7_roas }}</span>
                    </template>
                  </el-table-column>
                </template>
                <el-table-column prop="cost_per_d1_retention" label="Cost Per D1 Retention" width="150">
                  <template #default="scope">
                    <span :style="highlightStyle(scope.column.property)">{{ scope.row.cost_per_d1_retention }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="cost_per_d2_retention" label="Cost Per D2 Retention" width="150">
                  <template #default="scope">
                    <span :style="highlightStyle(scope.column.property)">{{ scope.row.cost_per_d2_retention }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="cost_per_d7_retention" label="Cost Per D7 Retention" width="150">
                  <template #default="scope">
                    <span :style="highlightStyle(scope.column.property)">{{ scope.row.cost_per_d7_retention }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="cost_per_d14_retention" label="Cost Per D14 Retention" width="155">
                  <template #default="scope">
                    <span :style="highlightStyle(scope.column.property)">{{ scope.row.cost_per_d14_retention }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="Date" prop="date" />
        </el-table>
      </el-drawer>
</template>
<script setup>
import { ref, getCurrentInstance, toRefs ,onMounted} from 'vue'
import { sendUserAction, getCookie } from '@/utils/api_utils'
import { campainTypeArr, openidArr, targetArr, trackingBasisArr, countryArr, constraintTempArr } from './data'
const { proxy } = getCurrentInstance()
const username = getCookie('user_name')
const code = getCookie('code')
const allAdjustArr = ref([])
const allVisible = ref(false)
let mergeRowMap = {}

// 当前点击的rule name
let currentRuleId = ''
let currentCampaignType = ref(0)
let currentTarget = 0
let currentConstraint = []
// portrait标签的颜色
const portraitColor = {
  fresh: '',
  cost_wave: 'success',
  cpi_wave: 'info',
  not_enough_spend: 'warning',
  compete: 'danger'
}


const historyNew=(rule_id, campaign_type, target, constraint)=>{
    history(rule_id, campaign_type, target, constraint)
}

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


const history = async (rule_id, campaign_type, target, constraint) => {
  if (!code) {
    ElMessage.error('get code err, please login again')
    return
  }
  // currentRuleId = rule_id
  currentCampaignType.value = campaign_type
  currentTarget = target
  currentConstraint = constraint
  const resp = await proxy.$api.automation.optQuery({ rule_id: rule_id, code: code })
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
            date: key,
            solved: item.solved
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
            date: key,
            solved: item.solved
          }
          const opt_item = {
            budget: opt_budget,
            object: 'opt',
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
            date: key,
            solved: item.solved
          }
          rec.children.push(original_item, opt_item)
          item.details.forEach(item => {
            let portraits = []
            if (item.portrait) {
              portraits = item.portrait.map(item => {
                return { type: portraitColor[item], value: item }
              })
            }
            rec.children.push({
              budget: opt_budget,
              object: item.campaign_name,
              portrait: portraits,
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
              date: key,
              solved: item.solved
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

const headerCellStyle = () => {
  return {
    color: '#000000',
    backgroundColor: '#dedfe0'
  }
}

defineExpose({
    headerCellStyle,
    allSpanMethod,
    historyNew
})

</script>