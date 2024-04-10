<template>
  <el-card shadow="hover" :body-style="{ height: '697px', overflow: 'auto' }">
    <el-table :data="deploymentInfo.history" v-on:refresh="setDeploymentHistory" stripe ref="deploymentTable" size="small">
      <el-table-column prop="version" label="Version" min-width="140" />
      <el-table-column prop="environment" label="Env" min-width="80" />
      <el-table-column prop="buildNumber" label="Build" min-width="60" />
      <el-table-column prop="deployedBy" label="Deployed By" min-width="100" />
      <el-table-column prop="finalStatus" label="Final Status" min-width="100">
        <template #default="scope">
          <el-button :type="getStatusColour(scope.row.finalStatus)" size="small" @click="visitPage(scope.row)">{{ scope.row.finalStatus }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="dateTime" label="DateTime" min-width="130" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from 'vue'
import { getCookie } from '@/utils/api_utils'

const { proxy } = getCurrentInstance()
const deploymentInfo = reactive({ history: [] })
const isRedeployDisabled = ref(false)
var username = getCookie('user_name')
if (username == undefined) {
  username = 'mlflow_deployment'
}

const fetchDeploymentHistory = (projectName, modelName) => {
  ;(async () => {
    const resp = await proxy.$api.modelRegistration.deploymentHistory({
      request_body: { project_name: projectName, model_name: modelName }
    })
    setDeploymentHistory(resp?.data?.history ?? [])
  })()
}
const setDeploymentHistory = history => {
  if (history.length == 0) {
    return
  }
  let newList = []
  for (let i = 0; i < history.length; i++) {
    const row = history[i]
    newList.push({
      projectName: row['project_name'],
      modelName: row['model_name'],
      version: row['version'],
      buildNumber: row['build_number'],
      environment: row['environment'],
      deployedBy: row['deployed_by'],
      finalStatus: row['final_status'],
      dateTime: row['date_time']
    })
  }
  deploymentInfo.history = newList
}

const getStatusColour = finalStatus => {
  if (finalStatus == 'Start' || finalStatus == 'AwaitingRancher') {
    return 'primary'
  } else if (finalStatus == 'Completed') {
    return 'success'
  } else {
    return 'danger'
  }
}

const visitPage = row => {
  switch (row.finalStatus) {
    case 'AwaitingRancher':
    case 'Completed':
      const env = row.environment == 'production' ? 'prd' : 'dev'
      const urlSuffix = env == 'prd' ? 'vxmrc' : 'lhvbq'
      window.open(`https://rancher-devops.intlgame.com/p/c-8rj26:p-${urlSuffix}/workload/deployment:mlflow-${env}:${row.modelName}`, '_blank')
      break
    case 'Start':
    case 'Failed':
      window.open(`https://ptc.coding.intlgame.com/p/iegg-ml/ci/job/73746/build/${row.buildNumber}/pipeline`, '_blank')
      break
    default:
      pass
  }
}

const redeployFunc = row => {
  if (row.finalStatus != 'Failed') {
    ElMessage.error(`deployment is still running (build number ${row.buildNumber})`)
    return
  }
  ;(async () => {
    isRedeployDisabled.value = true
    const resp = await proxy.$api.modelRegistration.redeployModel({
      request_body: { username: username, project_name: row.projectName, model_name: row.modelName, env: row.environment, tag: row.version }
    })
    isRedeployDisabled.value = false
    if (typeof resp === 'string' || resp.data.ret_code != 0) {
      ElMessage.error(resp)
      return
    }
    fetchDeploymentHistory(row.projectName, row.modelName)
  })()
}
</script>
