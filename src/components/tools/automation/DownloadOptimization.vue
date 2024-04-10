<template>
  <el-dialog v-model="objectVisible" width="700px" title="select download info" center draggable>
    <div class="outer-box" style="height: 150px">
      <el-form ref="downloadRef" :model="optimizationStly" label-width="200px" label-height="100px" label-position="left" :rules="downloadRules" id="selectForm">
        <el-form-item label="File Type：" prop="fileType">
          <el-radio-group v-model="optimizationStly.fileType" size="large">
            <el-radio label="xlsx" border>xlsx</el-radio>
            <el-radio label="csv" border>csv</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Downdload Content：" prop="content">
          <el-radio-group v-model="optimizationStly.content" size="large">
            <el-radio label="settings" border>settings</el-radio>
            <el-radio label="settings_metrics" border>settings+metrics</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="downloaCancel" size="large">Cancel</el-button>
        <el-button type="primary" @click="downloadConfirm" size="large">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, reactive, getCurrentInstance, toRefs, onMounted } from 'vue'
//import CsvExportor from 'csv-exportor'
import { ExportExcelFile, ExortCSVFile } from '@/utils/exportExcelFile.js'
const { proxy } = getCurrentInstance()
const objectVisible = ref(true)
const optimizationStly = reactive({
  fileType: '',
  content: ''
})
// 父组件传递过来的参数
const props = defineProps({
  adjustArr: {
    type: Object,
    required: true
  },
  dynamicTargetName: {
    type: String,
    required: true
  },
  currentCampaignType: {
    type: Number,
    required: true
  }
})

const { adjustArr, dynamicTargetName, currentCampaignType } = toRefs(props)

const header = []
const headerDisplay = []
const downloaCancel = () => {
  header.value = []
  headerDisplay.value = []
  objectVisible.value = false
}

const downloadConfirm = () => {
  proxy.$refs.downloadRef.validate(async valid => {
    if (valid) {
      objectVisible.value = false
      let data = contentTypeChange(optimizationStly.content)
      if (optimizationStly.fileType == 'xlsx') {
        downloadExcel(data)
      } else if (optimizationStly.fileType == 'csv') {
        downloadCsv(data)
      }
    }
  })
}
const disabledDownload = () => {
  header.value = []
  headerDisplay.value = []
  optimizationStly.content = ''
  optimizationStly.fileType = ''
  objectVisible.value = true
}
const downloadRules = reactive({
  fileType: [{ required: true, message: 'please select file type', trigger: 'blur' }],
  content: [{ required: true, message: 'please select export content', trigger: 'blur' }]
})

const downloadExcel = (data) => {
  ExportExcelFile(data, 'optimization solution data', header.value, headerDisplay.value)
}

const downloadCsv = (data) => {
  ExortCSVFile(data, 'optimization solution data', header.value, headerDisplay.value)
}

const contentTypeChange = args => {
  if (args == 'settings') {
    header.value = ['budget', 'object', 'media_budget', 'cur_budget', 'cur_bid', 'rec_budget', 'rec_bid']
    headerDisplay.value = {
      budget: 'budget',
      object: 'Object',
      media_budget: 'mediaBudget',
      cur_budget: 'originBudget',
      cur_bid: 'originBid',
      rec_budget: 'recBudget',
      rec_bid: 'recBid'
      //fixed_column: dynamicTargetName.value + '（Target）'
    }
    let data = JSON.parse(JSON.stringify(adjustArr.value))
    var downloadData = []
    for (let item of data.value) {
      let rec_budget = ''
      if (item.rec_bid === '-') {
        rec_budget = item.rec_budget
      } else {
        rec_budget = item.rec_budget.ori ? item.rec_budget.ori : '-'
      }
      var obj = {
        budget: item.budget,
        object: item.object,
        media_budget: item.media_budget,
        cur_budget: item.cur_budget,
        cur_bid: item.cur_bid,

        rec_budget: rec_budget,
        rec_bid: item.rec_bid.ori ? item.rec_bid.ori : '-'
        //fixed_column: item.fixed_column
      }
      downloadData.push(obj)
    }
    return downloadData
  }

  if (args == 'settings_metrics') {
    if (currentCampaignType.value === 3) {
      return currentCampaignType_3Data()
    } else {
      return currentCampaignTypeOtherData()
    }
  }
}

const currentCampaignType_3Data = () => {
  header.value = [
    'budget',
    'object',
    'media_budget',
    'cur_budget',
    'cur_bid',
    'rec_budget',
    'rec_bid',
    'fixed_column',
    'spend',
    'reattributions',
    'cpr',
    'd1_retention_rate',
    'd2_retention_rate',
    'd7_retention_rate',
    'd14_retention_rate',
    'd1_roas',
    'd2_roas',
    'd7_roas',
    'd14_roas',
    'cost_per_d1_retention',
    'cost_per_d2_retention',
    'cost_per_d7_retention',
    'cost_per_d14_retention'
  ]
  headerDisplay.value = {
    budget: 'budget',
    object: 'Object',
    media_budget: 'mediaBudget',
    cur_budget: 'originBudget',
    cur_bid: 'originBid',
    rec_budget: 'recBudget',
    rec_bid: 'recBid',
    fixed_column: dynamicTargetName.value + '（Target）',
    spend: 'Spend',
    reattributions: 'Reattributions',
    cpr: 'CPR',
    d1_retention_rate: 'D1 Retention Rate',
    d2_retention_rate: 'D2 Retention Rate',
    d7_retention_rate: 'D7 Retention Rate',
    d14_retention_rate: 'D14 Retention Rate',
    d1_roas: 'D1 Roas',
    d2_roas: 'D2 Roas',
    d7_roas: 'D7 Roas',
    d14_roas: 'D14 Roas',
    cost_per_d1_retention: 'Cost Per D1 Retention',
    cost_per_d2_retention: 'Cost Per D2 Retention',
    cost_per_d7_retention: 'Cost Per 7 Retention',
    cost_per_d14_retention: 'Cost Per D14 Retention'
  }
  let data = JSON.parse(JSON.stringify(adjustArr.value))
  var downloadData = []
  for (let item of data.value) {
    let rec_budget = ''
    if (item.rec_bid === '-') {
      rec_budget = item.rec_budget
    } else {
      rec_budget = item.rec_budget.ori ? item.rec_budget.ori : '-'
    }
    var obj = {
      budget: item.budget,
      object: item.object,
      media_budget: item.media_budget,
      cur_budget: item.cur_budget,
      cur_bid: item.cur_bid,
      rec_budget: rec_budget,
      rec_bid: item.rec_bid.ori ? item.rec_bid.ori : '-',
      fixed_column: item.fixed_column,
      spend: item.spend,
      reattributions: item.reattributions,
      cpr: item.cpr,
      d1_retention_rate: item.d1_retention_rate,
      d2_retention_rate: item.d2_retention_rate,
      d7_retention_rate: item.d7_retention_rate,
      d14_retention_rate: item.d14_retention_rate,
      d1_roas: item.d1_roas,
      d2_roas: item.d2_roas,
      d7_roas: item.d7_roas,
      d14_roas: item.d14_roas,
      cost_per_d1_retention: item.cost_per_d1_retention,
      cost_per_d2_retention: item.cost_per_d2_retention,
      cost_per_d7_retention: item.cost_per_d7_retention,
      cost_per_d14_retention: item.cost_per_d14_retention
    }
    return downloadData.push(obj)
  }
}

const currentCampaignTypeOtherData = () => {
  header.value = [
    'budget',
    'object',
    'media_budget',
    'cur_budget',
    'cur_bid',
    'rec_budget',
    'rec_bid',
    'fixed_column',
    'spend',
    'installs',
    'cpi',
    'registers',
    'cpr',
    'cohort_register_rate',
    'd1_cohort_register_rate',
    'd2_retention_rate',
    'd7_retention_rate',
    'd1_roas',
    'd3_roas',
    'd7_roas',
    'cost_per_d1_retention',
    'cost_per_d2_retention',
    'cost_per_d7_retention',
    'cost_per_d14_retention'
  ]
  headerDisplay.value = {
    budget: 'budget',
    object: 'Object',
    media_budget: 'mediaBudget',
    cur_budget: 'originBudget',
    cur_bid: 'originBid',
    rec_budget: 'recBudget',
    rec_bid: 'recBid',
    fixed_column: dynamicTargetName.value + '（Target）',
    spend: 'Spend',
    installs: 'Installs',
    cpi: 'CPI',
    registers: 'Registers',
    cpr: 'CPR',
    cohort_register_rate: 'Cohort Register Rate',
    d1_cohort_register_rate: 'D1 Cohort Register Rate',
    d2_retention_rate: 'D2 Retention Rate',
    d7_retention_rate: 'D7 Retention Rate',
    d1_roas: 'D1 Roas',
    d3_roas: 'D3 Roas',
    d7_roas: 'D7 Roas',
    cost_per_d1_retention: 'Cost Per D1 Retention',
    cost_per_d2_retention: 'Cost Per D2 Retention',
    cost_per_d7_retention: 'Cost Per 7 Retention',
    cost_per_d14_retention: 'Cost Per D14 Retention'
  }
  let data = JSON.parse(JSON.stringify(adjustArr.value))
  var downloadData = []
  for (let item of data.value) {
    let rec_budget = ''
    if (item.rec_bid === '-') {
      rec_budget = item.rec_budget
    } else {
      rec_budget = item.rec_budget.ori ? item.rec_budget.ori : '-'
    }
    var obj = {
      budget: item.budget,
      object: item.object,
      media_budget: item.media_budget,
      cur_budget: item.cur_budget,
      cur_bid: item.cur_bid,
      rec_budget: rec_budget,
      rec_bid: item.rec_bid.ori ? item.rec_bid.ori : '-',
      fixed_column: item.fixed_column,
      spend: item.spend,
      installs: item.installs,
      cpi: item.cpi,
      registers: item.registers,
      cpr: item.cpr,
      cohort_register_rate: item.cohort_register_rate,
      d1_cohort_register_rate: item.d1_cohort_register_rate,
      d2_retention_rate: item.d2_retention_rate,
      d7_retention_rate: item.d7_retention_rate,
      d1_roas: item.d1_roas,
      d3_roas: item.d3_roas,
      d7_roas: item.d7_roas,
      cost_per_d1_retention: item.cost_per_d1_retention,
      cost_per_d2_retention: item.cost_per_d2_retention,
      cost_per_d7_retention: item.cost_per_d7_retention,
      cost_per_d14_retention: item.cost_per_d14_retention
    }
    downloadData.push(obj)
  }
  return downloadData
}

defineExpose({
  disabledDownload
})
onMounted(() => {})
</script>
<style scoped>
.el-radio-group {
  margin-right: 12px;
}
#selectForm :deep(.el-form-item__label) {
  font-size: 17px;
}
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
