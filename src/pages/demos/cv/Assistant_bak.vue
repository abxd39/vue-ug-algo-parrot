<template>
  <Breadcrumb />
  <div class="outer-box">
    <div v-if="resultShow">
      <el-card shadow="never" class="asset" style="text-align: center">
        <h5 style="margin: 0">Zero Impression</h5>
        <el-table :data="zeroTableData" style="width: 100%" size="small" border>
          <el-table-column type="expand">
            <template #default="props">
              <el-table :data="props.row.children" border size="small" stripe>
                <el-table-column prop="ad_group_name" label="ad_group_name" width="170" />
                <el-table-column prop="ad_group_r7" label="ad_group_r7" width="100" />
                <el-table-column prop="ad_group_r2" label="ad_group_r2" width="100" />
                <el-table-column prop="ad_group_roas_d1" label="ad_group_roas_d1" width="125" />
                <el-table-column prop="ad_group_roas_d3" label="ad_group_roas_d3" width="125" />
                <el-table-column prop="ad_group_cpi" label="ad_group_cpi" width="120" />
                <el-table-column prop="main_country" label="main_country" width="100" />
                <el-table-column prop="asset_name" label="asset_name" width="500" />
                <el-table-column prop="asset_url" label="asset_url" width="250">
                  <template #default="scope">
                    <span @click="showAsset(scope.row.asset_url)" style="cursor: pointer; color: #409eff">{{ scope.row.asset_url }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="platform" label="platform" width="70" />
                <el-table-column prop="impressions" label="impressions" width="100" />
                <el-table-column prop="video_views" label="video_views" width="100" />
                <el-table-column prop="clicks" label="clicks" width="60" />
                <el-table-column prop="conversions" label="conversions" width="100" />
                <el-table-column prop="spend" label="spend" width="60" />
                <el-table-column prop="installs" label="installs" width="60" />
                <el-table-column prop="in_app_actions" label="in_app_actions" width="110" />
                <el-table-column prop="performance_label" label="performance_label" width="130" />
                <el-table-column prop="review_status" label="review_status" width="100" />
                <el-table-column prop="approval_status" label="approval_status" width="110" />
                <el-table-column prop="cpa" label="cpa" width="80" />
                <el-table-column prop="ctr" label="ctr" width="80" />
                <el-table-column prop="cvr" label="cvr" width="80" />
                <el-table-column prop="agg_start_date" label="agg_start_date" width="110" />
                <el-table-column prop="agg_end_date" label="agg_end_date" width="100" />
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="campaign_region" label="campaign_region" width="150" />
          <el-table-column prop="campaign_type" label="campaign_type" width="150" />
          <el-table-column prop="campaign_name" label="campaign_name" width="500" />
          <el-table-column prop="campaign_spend" label="campaign_spend" />
        </el-table>
      </el-card>
      <el-card shadow="never" class="asset" style="text-align: center">
        <h5 style="margin: 0">Low Performance</h5>
        <el-table :data="lowTableData" style="width: 100%" size="small" border>
          <el-table-column type="expand">
            <template #default="props">
              <el-table :data="props.row.children" border size="small" stripe>
                <el-table-column prop="ad_group_name" label="ad_group_name" width="170" />
                <el-table-column prop="ad_group_r7" label="ad_group_r7" width="100" />
                <el-table-column prop="ad_group_r2" label="ad_group_r2" width="100" />
                <el-table-column prop="ad_group_roas_d1" label="ad_group_roas_d1" width="125" />
                <el-table-column prop="ad_group_roas_d3" label="ad_group_roas_d3" width="125" />
                <el-table-column prop="ad_group_cpi" label="ad_group_cpi" width="120" />
                <el-table-column prop="main_country" label="main_country" width="100" />
                <el-table-column prop="asset_name" label="asset_name" width="500" />
                <el-table-column prop="asset_url" label="asset_url" width="250">
                  <template #default="scope">
                    <span @click="showAsset(scope.row.asset_url)" style="cursor: pointer; color: #409eff">{{ scope.row.asset_url }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="platform" label="platform" width="70" />
                <el-table-column prop="impressions" label="impressions" width="100" />
                <el-table-column prop="video_views" label="video_views" width="100" />
                <el-table-column prop="clicks" label="clicks" width="60" />
                <el-table-column prop="conversions" label="conversions" width="100" />
                <el-table-column prop="spend" label="spend" width="60" />
                <el-table-column prop="installs" label="installs" width="60" />
                <el-table-column prop="in_app_actions" label="in_app_actions" width="110" />
                <el-table-column prop="performance_label" label="performance_label" width="130" />
                <el-table-column prop="review_status" label="review_status" width="100" />
                <el-table-column prop="approval_status" label="approval_status" width="110" />
                <el-table-column prop="cpa" label="cpa" width="80" />
                <el-table-column prop="ctr" label="ctr" width="80" />
                <el-table-column prop="cvr" label="cvr" width="80" />
                <el-table-column prop="agg_start_date" label="agg_start_date" width="110" />
                <el-table-column prop="agg_end_date" label="agg_end_date" width="100" />
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="campaign_region" label="campaign_region" width="150" />
          <el-table-column prop="campaign_type" label="campaign_type" width="150" />
          <el-table-column prop="campaign_name" label="campaign_name" width="500" />
          <el-table-column prop="campaign_spend" label="campaign_spend" />
        </el-table>
      </el-card>
    </div>
    <div v-else>
      <el-card shadow="never" class="asset" style="text-align: center">
        <el-table :data="typeTableData" style="width: 100%" size="small" border>
          <el-table-column type="expand">
            <template #default="props">
              <el-table :data="props.row.children" border size="small" stripe>
                <el-table-column prop="online_date" label="online_date" width="140" />
                <el-table-column prop="campaign_name" label="campaign_name" width="450" />
                <el-table-column prop="ad_group_name" label="ad_group_name" width="150" />
                <el-table-column prop="asset_name" label="asset_name" width="520" />
                <el-table-column prop="asset_url" label="asset_url" width="370">
                  <template #default="scope">
                    <span @click="showAsset(scope.row.asset_url)" style="cursor: pointer; color: #409eff">{{ scope.row.asset_url }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="platform" label="platform" width="70" />
                <el-table-column prop="country_list" label="country_list" width="170" />
              </el-table>
            </template>
          </el-table-column>
          <el-table-column prop="approval_status" label="approval_status" width="150" />
          <el-table-column prop="policy_topic" label="policy_topic" />
        </el-table>
      </el-card>
    </div>
  </div>
  <!-- <el-dialog v-model="assetDialogVisible" :title="currentAssetName" width="40%">
    <el-divider />
    <video :src="currentAssetUrl" controls class="defaultVideo"></video>
    <el-divider />
    <template #footer>
      <span>
        <el-button @click="assetDialogVisible = false">Cancel</el-button>
      </span>
    </template>
  </el-dialog> -->
</template>

<script setup>
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import { formatDate } from '@/utils/common_utils'
import { getCookie } from '@/utils/api_utils'

import { ref, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()
const zeroTableData = ref([])
const lowTableData = ref([])
const resultShow = ref(true)
const typeTableData = ref([])

// 获取昨天的时间
const getLastDay = () => {
  const today = new Date()
  // 默认获取前一天的数据
  const days = 24 * 60 * 60 * 1000
  const lastDayTime = today.getTime() - 1 * days
  return formatDate(new Date(lastDayTime), 'yyyy-mm-dd')
}

// 获取路径参数game_code和dtstatdate
const getParams = () => {
  const hashArr = window.location.hash.split('?')
  if (hashArr.length !== 2) {
    // 给默认参数
    // ElMessage.error('no params')
    // getData('nikke', getLastDay())
    return
  }
  const paramsArr = hashArr[1].split('&')
  if (paramsArr.length !== 2 && paramsArr.length !== 3) {
    ElMessage.error('params err')
    return
  }
  let game_code = ''
  let dtstatdate = ''
  let type = ''
  for (const item of paramsArr) {
    const oneParamArr = item.split('=')
    if (oneParamArr.length !== 2) {
      ElMessage.error('params format err')
      return
    }
    if (oneParamArr[0] === 'game_code') {
      game_code = oneParamArr[1]
    }
    if (oneParamArr[0] === 'dtstatdate') {
      dtstatdate = oneParamArr[1]
    }
    if (oneParamArr[0] === 'type') {
      type = oneParamArr[1]
    }
  }
  if (game_code === '' || dtstatdate === '') {
    ElMessage.error('get game_code or dtstatdate failed')
    return
  }
  getData(game_code, dtstatdate, type)
}

const getData = async (game_code, dtstatdate, type) => {
  const code = getCookie('code')
  if (!code) {
    ElMessage.error('get code err, please login again')
    return
  }
  const resp = await proxy.$api.cv.assistants({
    game_code: game_code,
    dtstatdate: dtstatdate,
    code: code,
    type: type
  })
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    ElMessage.success('get data success')
    if (type === 'restriction_daily') {
      resultShow.value = false
      const typeTempData = []
      const typeTempDict = {}
      data['daily'].forEach(item => {
        if (Object.keys(typeTempDict).includes(item.approval_status + item.policy_topic)) {
          typeTempDict[item.approval_status + item.policy_topic].push(item)
        } else {
          typeTempDict[item.approval_status + item.policy_topic] = [item]
        }
      })
      Object.keys(typeTempDict).forEach(key => {
        typeTempData.push({
          approval_status: typeTempDict[key][0].approval_status,
          policy_topic: typeTempDict[key][0].policy_topic,
          children: typeTempDict[key]
        })
      })
      console.log(typeTempData)
      typeTableData.value = typeTempData
      return
    }
    resultShow.value = true
    const zeroTempData = []
    const zeroTempDict = {}
    data['value_1_list'].forEach(item => {
      // 保留整数部分
      item.video_views = item.video_views.toFixed(0)
      item.impressions = item.impressions.toFixed(0)
      item.clicks = item.clicks.toFixed(0)
      item.conversions = item.conversions.toFixed(0)
      item.installs = item.installs.toFixed(0)
      item.in_app_actions = item.in_app_actions.toFixed(0)
      // 保留小数后2位
      item.campaign_spend = item.campaign_spend.toFixed(2)
      item.spend = item.spend.toFixed(2)
      item.cpa = item.cpa.toFixed(2)
      item.ad_group_cpi = item.ad_group_cpi.toFixed(2)
      // 乘以100，保留2位小数，加%
      item.ad_group_r7 = (item.ad_group_r7 * 100).toFixed(2) + '%'
      // item.avg_ad_group_r2 = (item.avg_ad_group_r2 * 100).toFixed(2) + '%'
      item.ctr = (item.ctr * 100).toFixed(2) + '%'
      item.cvr = (item.cvr * 100).toFixed(2) + '%'
      item.ad_group_r2 = (item.ad_group_r2 * 100).toFixed(2) + '%'
      item.ad_group_roas_d1 = (item.ad_group_roas_d1 * 100).toFixed(2) + '%'
      item.ad_group_roas_d3 = (item.ad_group_roas_d3 * 100).toFixed(2) + '%'
      if (Object.keys(zeroTempDict).includes(item.campaign_name)) {
        zeroTempDict[item.campaign_name].push(item)
      } else {
        zeroTempDict[item.campaign_name] = [item]
      }
    })
    Object.keys(zeroTempDict).forEach(key => {
      zeroTempData.push({
        campaign_region: zeroTempDict[key][0].campaign_region,
        campaign_type: zeroTempDict[key][0].campaign_type,
        campaign_name: key,
        children: zeroTempDict[key],
        campaign_spend: zeroTempDict[key][0].campaign_spend
      })
    })

    const lowTempData = []
    const lowTempDict = {}
    data['value_2_list'].forEach(item => {
      // 保留整数部分
      item.video_views = item.video_views.toFixed(0)
      item.impressions = item.impressions.toFixed(0)
      item.clicks = item.clicks.toFixed(0)
      item.conversions = item.conversions.toFixed(0)
      item.installs = item.installs.toFixed(0)
      item.in_app_actions = item.in_app_actions.toFixed(0)
      // 保留小数后2位
      item.campaign_spend = item.campaign_spend.toFixed(2)
      item.spend = item.spend.toFixed(2)
      item.cpa = item.cpa.toFixed(2)
      item.ad_group_cpi = item.ad_group_cpi.toFixed(2)
      // 乘以100，保留2位小数，加%
      item.ad_group_r7 = (item.ad_group_r7 * 100).toFixed(2) + '%'
      // item.avg_ad_group_r2 = (item.avg_ad_group_r2 * 100).toFixed(2) + '%'
      item.ctr = (item.ctr * 100).toFixed(2) + '%'
      item.cvr = (item.cvr * 100).toFixed(2) + '%'
      item.ad_group_r2 = (item.ad_group_r2 * 100).toFixed(2) + '%'
      item.ad_group_roas_d1 = (item.ad_group_roas_d1 * 100).toFixed(2) + '%'
      item.ad_group_roas_d3 = (item.ad_group_roas_d3 * 100).toFixed(2) + '%'
      if (Object.keys(lowTempDict).includes(item.campaign_name)) {
        lowTempDict[item.campaign_name].push(item)
      } else {
        lowTempDict[item.campaign_name] = [item]
      }
    })
    Object.keys(lowTempDict).forEach(key => {
      lowTempData.push({
        campaign_region: lowTempDict[key][0].campaign_region,
        campaign_type: lowTempDict[key][0].campaign_type,
        campaign_name: key,
        children: lowTempDict[key],
        campaign_spend: lowTempDict[key][0].campaign_spend
      })
    })

    zeroTableData.value = zeroTempData
    lowTableData.value = lowTempData
  } else {
    ElMessage.error(message)
  }
}

getParams()

// const assetDialogVisible = ref(false)
// const currentAssetName = ref('')
// const currentAssetUrl = ref('')
// const showAsset = (asset_name, asset_url) => {
//   currentAssetName.value = asset_name
//   currentAssetUrl.value = asset_url
//   assetDialogVisible.value = true
// }

// youtube连接是一个页面，不能直接用video展示，改成连接跳转
const showAsset = asset_url => {
  if (!asset_url.startsWith('https://')) {
    asset_url = 'https://' + asset_url
  }
  window.open(asset_url, '_blank')
}
</script>
