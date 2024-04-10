<template>
  <el-card shadow="hover" v-on:refresh="setStatus" ref="statusTable" :body-style="{ height: '315px', overflow: 'auto' }">
    <el-tabs v-model="activeName">
      <el-tab-pane name="production" label="Production">
        <el-descriptions :column="1" size="small" border>
          <el-descriptions-item label="Status"
            ><el-button :type="getStatusColour(deploymentStatus.production.status)" size="small" @click="visitPage('production')">{{
              deploymentStatus.production.status
            }}</el-button></el-descriptions-item
          >
          <el-descriptions-item label="Replicas">{{ deploymentStatus.production.readyReplicas }} / {{ deploymentStatus.production.replicas }}</el-descriptions-item>
        </el-descriptions>
        <el-divider />
        <el-table :data="deploymentStatus.production.endpoints" size="small" border>
          <el-table-column prop="serviceId" label="Service ID" min-width="120" />
          <el-table-column prop="ip" label="IP" min-width="110" />
          <el-table-column prop="port" label="Port" min-width="50" />
        </el-table>
      </el-tab-pane>
      <el-tab-pane name="staging" label="Staging">
        <el-descriptions :column="1" size="small" border>
          <el-descriptions-item label="Status"
            ><el-button :type="getStatusColour(deploymentStatus.staging.status)" size="small" @click="visitPage('staging')">{{ deploymentStatus.staging.status }}</el-button></el-descriptions-item
          >
          <el-descriptions-item label="Replicas">{{ deploymentStatus.staging.readyReplicas }} / {{ deploymentStatus.staging.replicas }}</el-descriptions-item>
        </el-descriptions>
        <el-divider />
        <el-table :data="deploymentStatus.staging.endpoints" size="small" border>
          <el-table-column prop="serviceId" label="Service ID" min-width="120" />
          <el-table-column prop="ip" label="IP" min-width="110" />
          <el-table-column prop="port" label="Port" min-width="50" />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup>
import { reactive, ref, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const deploymentStatus = reactive({
  modelName: '',
  production: {
    readyReplicas: 0,
    replicas: 0,
    status: 'active/updating',
    endpoints: []
  },
  staging: {
    readyReplicas: 0,
    replicas: 0,
    status: 'active/updating',
    endpoints: []
  }
})
const activeName = ref('production')

const getStatusColour = status => {
  if (status == 'active') {
    return 'success'
  } else {
    return 'primary'
  }
}

const visitPage = environment => {
  const env = environment == 'production' ? 'prd' : 'dev'
  const urlSuffix = environment == 'production' ? 'vxmrc' : 'lhvbq'
  window.open(`https://rancher-devops.intlgame.com/p/c-8rj26:p-${urlSuffix}/workload/deployment:mlflow-${env}:${deploymentStatus.modelName}`, '_blank')
}

const setStatus = (modelName, status) => {
  deploymentStatus.modelName = modelName

  deploymentStatus.production.readyReplicas = status.production?.ready_replicas
  deploymentStatus.production.replicas = status.production?.replicas
  deploymentStatus.production.status = status.production?.status
  deploymentStatus.production.endpoints = status.production?.endpoints

  deploymentStatus.staging.readyReplicas = status.staging.ready_replicas
  deploymentStatus.staging.replicas = status.staging.replicas
  deploymentStatus.staging.status = status.staging.status
  deploymentStatus.staging.endpoints = status.staging?.endpoints

  if (deploymentStatus.production.status == undefined) {
    activeName.value = 'staging'
  } else if (deploymentStatus.staging.status == undefined) {
    activeName.value = 'production'
  }
}
</script>
