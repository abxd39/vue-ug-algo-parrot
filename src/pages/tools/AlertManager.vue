<template>
  <Breadcrumb />
  <div class="outer-box">
    <div class="add-alert">
      <span>Alert({{ total }})</span>
      <el-button type="primary" @click="addAlert">Add Alert</el-button>
    </div>
    <el-card shadow="hover" class="alert-data">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column type="index" :index="indexMethod" />
        <el-table-column prop="service_name" label="Service Name"/>
        <el-table-column prop="service_owner" label="Owner">
        </el-table-column>
        <el-table-column prop="alert_target" label="Alert Target" />
        <el-table-column prop="alert_limit" label="Alert Limit " />
        <el-table-column prop="alert_interval" label="Alert Interval (min)"/>
        <el-table-column prop="wecom_chat_id" label="Wecom Chat Id"/>
        <el-table-column prop="env" label="Env" />
        <el-table-column prop="alert_activeness" label="Status">
          <template #default="scope">
            <el-switch v-model="scope.row.alert_activeness" size="large" active-text="On" inactive-text="Off" @change="updateStatus(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column label="Operation">
          <template #default="scope">
            <el-button type="primary" @click="updateAlert(scope.row)" size="small">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="queryInfo.pagesize" :currentPage="queryInfo.pagenum" @current-change="currentChange" />
  </div>
  <!-- add alert pop up dialog -->
  <el-dialog v-model="addDialogVisible" title="Add Alert" width="30%">
    <el-form label-position="left" label-width="150px" :model="addFormData" :rules="addRules" ref="addForm" >
      <el-form-item label="Environment" prop="env">
        <el-select v-model="addFormData.env" placeholder="env" @change="selectChange">
          <el-option label="Production" value="Production" />
          <el-option label="Development" value="Development" />
        </el-select>
      </el-form-item>
      <el-form-item label="Service Name" prop="service_name" v-show="result.resultShow">
        <el-select v-model="addFormData.service_name" placeholder="Service Name">
          <el-option v-for="item in allData.serviceName" :value="item">{{ item }}</el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Service Owner" prop="service_owner" v-show="result.resultShow">
        <el-input v-model="addFormData.service_owner" placeholder="Enter Service Owner's WeCom Id"/>
      </el-form-item>
      <el-form-item label="Alert Target" prop="alert_target" v-show="result.resultShow">
        <el-select v-model="addFormData.alert_target" placeholder="Alert Target" @change="selectTarget(addFormData.alert_target)">
          <el-option v-for="item in allData.alertType" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item  label="Alert Limit" prop="alert_limit"  v-show="result.resultShow" style="width: 50%">
        <el-input type="number" v-model="addFormData.alert_limit" :placeholder="limit"/> 
      </el-form-item>
      <el-alert title="Duration required for alert limit breaching continuosly in order to send notification, default is 5 min" type="info"
          show-icon :closable="false" v-show="result.resultShow" class="el-alert"/>
      <el-form-item label="Alert Interval"  v-show="result.resultShow">
        <el-input type="number" v-model="addFormData.alert_interval" placeholder="Enter interval in min, Optional"/>
      </el-form-item>
      <el-form-item label="WeCom Chat Id"  v-show="result.resultShow">
        <el-input v-model="addFormData.wecom_chat_id" placeholder="Enter WeCom Chat id, Optional"/>
      </el-form-item>
      <el-form-item label="Active" v-show="result.resultShow">
        <el-switch v-model="addFormData.alert_activeness" size="large" active-text="On" inactive-text="Off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="handleAddCancel">Cancel</el-button>
        <el-button type="primary" @click="handleAddConfirm">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- adit alert pop up dialog -->
  <el-dialog v-model="editDialogVisible" title="Edit Alert" width="30%">
    <el-form label-position="left" label-width="150px" :model="editFormData">
      <el-form-item label="Environment">
        <el-input v-model="editFormData.env" disabled />
      </el-form-item>
      <el-form-item label="Service Name">
        <el-input v-model="editFormData.service_name" disabled />
      </el-form-item>
      <el-form-item label="Service Owner">
        <el-input v-model="editFormData.service_owner" placeholder="Enter Service Owner's WeCom Id"/>
      </el-form-item>
      <el-form-item label="Alert Target">
        <el-input v-model="editFormData.alert_target" disabled />
      </el-form-item>
      <el-form-item label="Alert Limit">
        <el-input type="number" v-model="editFormData.alert_limit" :placeholder="limit"/>
      </el-form-item>
      <el-alert
        title="Duration required for alert limit breaching continuosly in order to send notification, default is 5 min"
        type="info" show-icon :closable="false" class="el-alert" />
      <el-form-item label="Alert Interval">
        <el-input type="number" v-model="editFormData.alert_interval" placeholder="Enter interval in min"/>
      </el-form-item>
      <el-form-item label="WeCom Chat Id">
        <el-input v-model="editFormData.wecom_chat_id" placeholder="Enter WeCom Chat id, Optional"/>
      </el-form-item>
      <el-form-item label="Active" v-show="result.resultShow">
        <el-switch v-model="editFormData.alert_activeness" size="large" active-text="On" inactive-text="Off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="handleEditCancel">Cancel</el-button>
        <el-button type="primary" @click="handleEditConfirm">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'

const alertMap = {
  latency: 'ms',
  error_rate: '%',
}

const paramMap = {
  'Latency': 'latency', 
  'Error Rate': 'error_rate',
}
const { proxy } = getCurrentInstance()
const tableData = ref([])

const queryInfo = reactive({
  pagenum: 1,
  pagesize: 10
})

const alertSwitchInfo = reactive({
  service_name: '',
  alert_target: '',
  alert_activeness:'',
  env:''
})

const total = ref(0) // records totals

const allData = reactive({
  serviceName: [],
  alertType: [{ label: 'Latency', value: 'latency' }, { label: 'Error Rate', value: 'error_rate' }],
})

const indexMethod = index => {
  return index + 1 + (queryInfo.pagenum - 1) * queryInfo.pagesize
}
// retrieve registered alert list
const getAlertList = async () => {
  const resp = await proxy.$api.alert.getAlertList(queryInfo)
  if (resp.data.ret_code === '0') {
    // retrieve alert list
    const alertList = []
    resp.data.data.alert_list.forEach(item => {
      item.alert_limit = item.alert_limit +alertMap[item.alert_target]
      alertList.push(item)
    })
    tableData.value = alertList
    total.value = resp.data.data.total_records
  } else {
    ElMessage.error(resp.data.message || 'get alert list failed')
  }
}

// add new alert
const addDialogVisible = ref(false)
const limit = ref('') // placeholder for alert limit input

const result = reactive({
  resultShow: false
})

const addFormData = reactive({
  env: '',
  service_name: '',
  service_owner: '',
  alert_target: '',
  alert_limit: '',
  alert_interval: '',
  wecom_chat_id: '',
  alert_activeness: true, 
})

const addRules = reactive({
  env: [{ required: true, message: 'Please select service deployed environment', trigger: 'blur' }],
  service_name: [{ required: true, message: 'Please select service name', trigger: 'blur' }],
  service_owner: [{ required: true, message: 'Please enter service owner', trigger: 'blur' }],
  alert_target: [{ required: true, message: 'Please select an alert target', trigger: 'blur' }],
  alert_limit: [{ required: true, message: 'Please enter alert limit', trigger: 'blur' }]
})
// when add alert button click
const addAlert = () => {
  addDialogVisible.value = true
}

//get service list
const selectChange = async () => {
  const resp = await proxy.$api.alert.getServiceName({env:addFormData.env})
  // request failed
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  if (resp.data.ret_code === '0') {
    // retrieve deploy service name
    addFormData.service_name = ''
    const serviceList = []
    resp.data.data.forEach(item => {
      serviceList.push(item)
    })
    allData.serviceName = serviceList
    result.resultShow = true
  } else {
    ElMessage.error(resp.data.message || 'get service list failed')
  }
}

// add cancel button click
const handleAddCancel = () => {
  addDialogVisible.value = false
  // clear form
  proxy.$refs.addForm.resetFields()
  result.resultShow = false
}

// submit
const handleAddConfirm = () => {
  //validate form data
  proxy.$refs.addForm.validate(async valid => {
    // validate passed, send request
    if (valid) {
      const resp = await proxy.$api.alert.alertCreate(addFormData)
      //  request failed
      if (typeof resp === 'string') {
        ElMessage.error(resp)
        return
      }
      if (resp.data.ret_code === '0') {
        ElMessage.success(resp.data.message || 'add success')
        // back to page 1
        queryInfo.pagenum = 1
        // retrieve alert list
        getAlertList()
        addDialogVisible.value = false
        proxy.$refs.addForm.resetFields()
      } else {
        ElMessage.error(resp.data.message || 'add failed')
      }
    }
  })
}

//alert limit placeholder selection
const limitHint = {
  latency: 'Enter a limit in ms',
  error_rate: 'Enter a limit in %',
}

//alert limit placeholder select
const selectTarget = (alertTarget) => {
  if (alertTarget ==="latency"){
    limit.value = limitHint.latency
  }else{
    limit.value = limitHint.error_rate
  }
}

// alert switch required info 
const updateStatus = (status) => {
  alertSwitchInfo.service_name = status.service_name
  alertSwitchInfo.alert_target = status.alert_target
  alertSwitchInfo.alert_activeness = status.alert_activeness
  alertSwitchInfo.env = status.env
  setStatus()
}

// set new switch status 
const setStatus = async () => {
  const resp = await proxy.$api.alert.alertSwitch(alertSwitchInfo)
  if (resp.data.ret_code === '0') {
    ElMessage.success(resp.data.message || 'switch success')
  } else {
    ElMessage.error(resp.data.message || 'switch failed')
  }
}

// edit alert
const editDialogVisible = ref(false)
const editFormData = reactive({
  env: '',
  service_name: '',
  service_owner: '',
  alert_target: '',
  alert_limit: '',
  alert_interval: '',
  wecom_chat_id: '',
  alert_activeness: true,
})

const targetMap = {
  'latency': 'Latency',
  'error_rate': 'Error Rate',
}

// update alert info
const updateAlert = alertObj => {
  editFormData.env = alertObj.env
  editFormData.service_name = alertObj.service_name
  editFormData.service_owner = alertObj.service_owner
  editFormData.alert_target = targetMap[alertObj.alert_target]
  selectTarget(alertObj.alert_target)
  if (alertObj.alert_target === 'latency')
  {
    editFormData.alert_limit = (alertObj.alert_limit).replace('ms', '')
  }else{
    editFormData.alert_limit = (alertObj.alert_limit).replace('%', '')
  }
  editFormData.alert_interval = alertObj.alert_interval
  editFormData.wecom_chat_id = alertObj.wecom_chat_id
  editFormData.alert_activeness = alertObj.alert_activeness
  editDialogVisible.value = true
}

const handleEditCancel = () => {
  editDialogVisible.value = false
}

//request alert update
const handleEditConfirm = async() => {
  editFormData.alert_target = paramMap[editFormData.alert_target]
  const resp = await proxy.$api.alert.alertCreate(editFormData)
  // request failed
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  if (resp.data.ret_code === '0') {
    ElMessage.success(resp.data.message || 'edit success')
    // back to page 1
    queryInfo.pagenum = 1
    // retrieve alert list
    getAlertList()
    editDialogVisible.value = false
    proxy.$refs.addForm.resetFields()
  } else {
     ElMessage.error(resp.data.message || 'edit failed')
  }
}

// page change
const currentChange = currentPage => {
  queryInfo.pagenum = currentPage
  getAlertList()
}

// get alert records after page mounted 
onMounted(() => {
  getAlertList()
})
</script>

<style lang="less" scoped>
.alert-data {
  margin: 20px 0;
}

.add-alert {
  display: flex;
  justify-content: space-between;
}

.el-alert {
  margin: 10px 0 10px;
}

.el-alert:first-child {
  margin: 0;
}
</style>
