<template>
  <Breadcrumb />
  <div class="outer-box" id="analysis">
    <el-row :gutter="15">
      <el-col :span="12">
        <el-card shadow="never" :body-style="{ height: '750px', overflow: 'auto' }">
          <h4 style="margin: 0">request params<span style="color: #e6a23c; font-size: 13px; padding-left: 30px">(*You do not need to select parameters that are not required)</span></h4>
          <el-divider />
          <el-form :model="requestForm" label-width="150px" label-position="left" ref="paramsRef" :rules="rules">
            <el-form-item label="Keyword" prop="keyword">
              <el-input v-model="requestForm.keyword" placeholder="Keyword" style="width: 50%" />
              <span style="color: #b1b3b8; font-size: 10px; padding-left: 10px">(usually the name of the game)</span>
            </el-form-item>
            <el-form-item label="Geo">
              <el-button @click="clickGeo">select geo</el-button>
            </el-form-item>
            <el-form-item label="Channel">
              <el-button @click="clickChannel">select channel</el-button>
            </el-form-item>
            <el-form-item label="Category">
              <el-button @click="clickCategory">select category</el-button>
            </el-form-item>
            <el-form-item label="Theme">
              <el-button @click="clickTheme">select theme</el-button>
            </el-form-item>
            <el-form-item label="Creative Type">
              <el-select v-model="requestForm.creative_type" placeholder="Creative Type" clearable>
                <el-option v-for="(item, index) in socialPeta.creativeTypeArr" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="Order By">
              <el-select v-model="requestForm.order_by" placeholder="Creative Type" clearable>
                <el-option v-for="(item, index) in socialPeta.orderByArr" :key="index" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item label="Begin">
              <el-date-picker v-model="requestForm.begin" type="date" placeholder="Pick a day" />
            </el-form-item>
            <el-form-item label="End">
              <el-date-picker v-model="requestForm.end" type="date" placeholder="Pick a day" />
            </el-form-item>
            <h4>extra params</h4>
            <el-divider />
            <el-form-item label="Max Num Creatives" prop="max_num_creatives">
              <el-input v-model.number="requestForm.max_num_creatives" placeholder="Max Num Creatives" style="width: 50%" />
            </el-form-item>
            <el-form-item label="First Seen">
              <el-select v-model="requestForm.first_seen_select" clearable size="small">
                <el-option v-for="(item, index) in socialPeta.firstSeenSelect" :key="index" :label="item.label" :value="item.value" />
              </el-select>
              <el-date-picker v-model="requestForm.first_seen" type="date" placeholder="Pick a day" />
            </el-form-item>
            <el-form-item label="Output Excel Name">
              <el-input v-model="requestForm.excel_name" placeholder="Output Excel Name" style="width: 50%" />
              <span style="margin-left: 2px; color: #409eff">.xlsx</span>
              <el-button size="small" style="margin-left: 20px" type="info" @click="copyKeyword">copy from keyword</el-button>
            </el-form-item>
          </el-form>
          <div style="text-align: center">
            <el-button type="primary" @click="preSubmit" :disabled="submitDisabled">Submit</el-button>
            <el-button @click="reset">Reset</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" v-show="result.logShow" :body-style="{ height: '750px', overflow: 'auto' }">
          <h4 style="margin: 0">progress</h4>
          <el-divider />
          <div style="text-align: center">
            <el-progress type="circle" :percentage="result.percentage" :width="200" :status="percentageStatus">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}%</span>
                <span class="percentage-label">{{ percentageText }}</span>
              </template>
            </el-progress>
          </div>
          <div class="log-header">
            <h4>log</h4>
            <el-button type="success" size="small" v-if="result.status === 2"><a :href="result.cos_url">download excel</a></el-button>
          </div>
          <el-divider />
          <div style="font-size: 12px; color: #909399; overflow: auto; height: 450px" id="log_parent">
            <ul id="log_child">
              <li v-for="(item, index) in result.logs" :key="index">
                <el-tag :type="item.type">{{ item.level }}</el-tag>
                <el-tag>{{ item.time }}</el-tag>
                {{ item.text }}
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
  <!-- 渠道的dialog -->
  <el-dialog v-model="channelVisible" title="Select Channels" width="50%" align-center>
    <el-table ref="channelTableRef" :data="channelArr" style="width: 100%; height: 400px" @selection-change="selectChannelChange" stripe>
      <el-table-column type="selection" width="55" />
      <el-table-column property="region" label="region" width="120" />
      <el-table-column property="channel" label="channel" width="120" sortable />
      <el-table-column property="description" label="description" show-overflow-tooltip />
      <!-- <el-table-column align="right">
        <template #header>
          <div class="channel-header">
            <el-input v-model="searchChannelStr" size="small" placeholder="search channel by description" clearable @clear="clearChannelSearch" />
            <el-button :icon="Search" size="small" type="primary" style="margin-left: 3px" @click="searchChannel" />
          </div>
        </template>
      </el-table-column> -->
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSelectChannel">Cancel</el-button>
        <el-button type="primary" @click="channelVisible = false"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 国家的dialog -->
  <el-dialog v-model="geoVisible" title="Select Geos" width="50%" align-center>
    <el-table ref="geoTableRef" :data="geoArr" style="width: 100%; height: 400px" @selection-change="selectGeoChange" stripe>
      <el-table-column type="selection" width="55" />
      <el-table-column property="geo" label="geo" width="120" sortable />
      <el-table-column property="description" label="description" show-overflow-tooltip />
      <!-- <el-table-column align="right">
        <template #header>
          <div class="channel-header">
            <el-input v-model="searchGeoStr" size="small" placeholder="search geo by geo" clearable @clear="clearGeoSearch" />
            <el-button :icon="Search" size="small" type="primary" style="margin-left: 3px" @click="searchGeo" />
          </div>
        </template>
      </el-table-column> -->
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSelectGeo">Cancel</el-button>
        <el-button type="primary" @click="geoVisible = false"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- category的dialog -->
  <el-dialog v-model="categoryVisible" title="Select Category" width="50%" align-center>
    <el-table ref="categoryTableRef" :data="categoryArr" style="width: 100%; height: 400px" @selection-change="selectCategoryChange" stripe>
      <el-table-column type="selection" width="55" />
      <el-table-column property="business" label="business" width="120" />
      <el-table-column property="value" label="category" width="150" sortable />
      <el-table-column property="label" label="description" show-overflow-tooltip />
      <!-- <el-table-column align="right">
        <template #header>
          <div class="channel-header">
            <el-input v-model="searchCategoryStr" size="small" placeholder="search category by description" clearable @clear="clearCategorySearch" />
            <el-button :icon="Search" size="small" type="primary" style="margin-left: 3px" @click="searchCategory" />
          </div>
        </template>
      </el-table-column> -->
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSelectCategory">Cancel</el-button>
        <el-button type="primary" @click="categoryVisible = false"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- theme的dialog -->
  <el-dialog v-model="themeVisible" title="Select Theme" width="50%" align-center>
    <el-table ref="themeTableRef" :data="themeArr" style="width: 100%; height: 400px" @selection-change="selectThemeChange" stripe>
      <el-table-column type="selection" width="55" />
      <el-table-column property="value" label="theme" width="150" sortable />
      <el-table-column property="label" label="description" show-overflow-tooltip />
      <!-- <el-table-column align="right">
        <template #header>
          <div class="channel-header">
            <el-input v-model="searchThemeStr" size="small" placeholder="search theme by description" clearable @clear="clearThemeSearch" />
            <el-button :icon="Search" size="small" type="primary" style="margin-left: 3px" @click="searchTheme" />
          </div>
        </template>
      </el-table-column> -->
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSelectTheme">Cancel</el-button>
        <el-button type="primary" @click="themeVisible = false"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 预提交的dialog -->
  <el-dialog v-model="preSubmitVisible" width="40%" align-center>
    <el-descriptions title="Params Info" :column="1" border size="small">
      <el-descriptions-item v-for="(item, index) in preParams" :key="index" :label="item.label">{{ item.value }}</el-descriptions-item>
    </el-descriptions>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="preSubmitVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmSubmit"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, computed, onBeforeUnmount, nextTick } from 'vue'
import axios from 'axios'

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import { Search } from '@element-plus/icons-vue'
import socialPeta from './socialPeta'
import { formatDate } from '@/utils/common_utils'
import { getCookie } from '@/utils/api_utils'

const { proxy } = getCurrentInstance()
// 请求参数表单数据
const requestForm = reactive({
  keyword: '',
  channel: '',
  channelDes: '',
  category: '',
  categoryDes: '',
  theme: '',
  themeDes: '',
  geo: '',
  geoDes: '',
  creative_type: '',
  order_by: '',
  begin: '',
  end: '',
  // 额外数据筛选的参数
  max_num_creatives: '',
  first_seen_select: '',
  first_seen: '',
  excel_name: ''
})

// max_num_creatives>0校验
const checkMaxNum = (rule, value, callback) => {
  if (value <= 0) {
    return callback(new Error('max_num_creatives must greater than 0'))
  }
  callback()
}

// 表单校验规则
const rules = reactive({
  // keyword: [{ required: true, message: 'please input keyword', trigger: 'blur' }],
  max_num_creatives: [
    { required: true, message: 'please input max num creatives', trigger: 'blur' },
    { type: 'number', message: 'must be a number' },
    { validator: checkMaxNum, trigger: 'blur' }
  ]
})

// 复制关键字
const copyKeyword = () => {
  if (requestForm.keyword) {
    requestForm.excel_name = requestForm.keyword
  }
}

const submitDisabled = ref(false)
// 预提交的时候参数展示
const preParams = computed(() => {
  const preParamsArr = []
  if (requestForm.keyword && requestForm.keyword.trim()) {
    preParamsArr.push({
      label: 'Keyword',
      value: requestForm.keyword.trim()
    })
  }
  if (requestForm.channel) {
    preParamsArr.push({
      label: 'Channel',
      value: requestForm.channelDes
    })
  }
  if (requestForm.geo) {
    preParamsArr.push({
      label: 'Geo',
      value: requestForm.geoDes
    })
  }
  if (requestForm.category) {
    preParamsArr.push({
      label: 'Category',
      value: requestForm.categoryDes
    })
  }
  if (requestForm.theme) {
    preParamsArr.push({
      label: 'Theme',
      value: requestForm.themeDes
    })
  }
  if (requestForm.creative_type === 0 || requestForm.creative_type) {
    let value = ''
    for (let item of socialPeta.creativeTypeArr) {
      if (item.value === requestForm.creative_type) {
        value = item.label
        break
      }
    }
    preParamsArr.push({
      label: 'Creative Type',
      value: value
    })
  }
  if (requestForm.order_by) {
    let value = ''
    for (let item of socialPeta.orderByArr) {
      if (item.value === requestForm.order_by) {
        value = item.label
        break
      }
    }
    preParamsArr.push({
      label: 'Order By',
      value: value
    })
  }
  if (requestForm.begin) {
    preParamsArr.push({
      label: 'Begin',
      value: formatDate(requestForm.begin, 'yyyy-mm-dd')
    })
  }
  if (requestForm.end) {
    preParamsArr.push({
      label: 'End',
      value: formatDate(requestForm.end, 'yyyy-mm-dd')
    })
  }
  if (requestForm.max_num_creatives) {
    preParamsArr.push({
      label: 'Max Num Creatives',
      value: requestForm.max_num_creatives
    })
  }
  if (requestForm.first_seen_select && requestForm.first_seen) {
    let value = ''
    for (let item of socialPeta.firstSeenSelect) {
      if (item.value === requestForm.first_seen_select) {
        value = item.label
        break
      }
    }
    preParamsArr.push({
      label: 'First Seen',
      value: value + ' ' + formatDate(requestForm.first_seen, 'yyyy-mm-dd')
    })
  }
  if (requestForm.excel_name) {
    preParamsArr.push({
      label: 'Output Excel Name',
      value: requestForm.excel_name + '.xlsx'
    })
  }
  return preParamsArr
})

// channel相关
const channelArr = ref(socialPeta.channelArr)
const channelVisible = ref(false)
const clickChannel = () => {
  channelVisible.value = true
}
// 搜索channel
const searchChannelStr = ref('')
const searchChannel = () => {
  if (searchChannelStr.value.trim() === '') {
    channelArr.value = socialPeta.channelArr
  } else {
    channelArr.value = channelArr.value.filter(item => {
      return item.description.toLocaleLowerCase().indexOf(searchChannelStr.value.trim().toLocaleLowerCase()) == 0
    })
  }
}
const clearChannelSearch = () => {
  channelArr.value = socialPeta.channelArr
}
// 选择channel的变化的时候
const selectChannelChange = selection => {
  const channelSelectArr = selection.map(item => {
    return item.channel
  })
  const channelDesArr = selection.map(item => {
    return item.description
  })
  requestForm.channel = channelSelectArr.join(',')
  requestForm.channelDes = channelDesArr.join(',')
}
// 取消选择
const cancelSelectChannel = () => {
  channelVisible.value = false
  proxy.$refs['channelTableRef'].clearSelection()
  requestForm.channel = ''
  requestForm.channelDes = ''
}

// geo相关
const geoArr = ref(socialPeta.geoArr)
const geoVisible = ref(false)
const clickGeo = () => {
  geoVisible.value = true
}
// 搜索geo
const searchGeoStr = ref('')
const searchGeo = () => {
  if (searchGeoStr.value.trim() === '') {
    geoArr.value = socialPeta.geoArr
  } else {
    geoArr.value = geoArr.value.filter(item => {
      return item.geo.toLocaleLowerCase().indexOf(searchGeoStr.value.trim().toLocaleLowerCase()) == 0
    })
  }
}
const clearGeoSearch = () => {
  geoArr.value = socialPeta.geoArr
}
// 选择geo的变化的时候
const selectGeoChange = selection => {
  const geoSelectArr = selection.map(item => {
    return item.geo
  })
  const geoDesArr = selection.map(item => {
    return item.description
  })
  requestForm.geo = geoSelectArr.join(',')
  requestForm.geoDes = geoDesArr.join(',')
}
const cancelSelectGeo = () => {
  geoVisible.value = false
  proxy.$refs['geoTableRef'].clearSelection()
  requestForm.geo = ''
  requestForm.geoDes = ''
}

// category相关
const categoryArr = ref(socialPeta.category)
const categoryVisible = ref(false)
const clickCategory = () => {
  categoryVisible.value = true
}
// 搜索category
const searchCategoryStr = ref('')
const searchCategory = () => {
  if (searchCategoryStr.value.trim() === '') {
    categoryArr.value = socialPeta.category
  } else {
    categoryArr.value = categoryArr.value.filter(item => {
      return item.label.indexOf(searchCategoryStr.value.trim()) == 0
    })
  }
}
const clearCategorySearch = () => {
  categoryArr.value = socialPeta.category
}
// 选择category的变化的时候
const selectCategoryChange = selection => {
  const categorySelectArr = selection.map(item => {
    return item.value
  })
  const categoryDesArr = selection.map(item => {
    return item.label
  })
  requestForm.category = categorySelectArr.join(',')
  requestForm.categoryDes = categoryDesArr.join(',')
}
const cancelSelectCategory = () => {
  categoryVisible.value = false
  proxy.$refs['categoryTableRef'].clearSelection()
  requestForm.category = ''
  requestForm.categoryDes = ''
}

// theme相关
const themeArr = ref(socialPeta.theme)
const themeVisible = ref(false)
const clickTheme = () => {
  themeVisible.value = true
}
// 搜索theme
const searchThemeStr = ref('')
const searchTheme = () => {
  if (searchThemeStr.value.trim() === '') {
    themeArr.value = socialPeta.theme
  } else {
    themeArr.value = themeArr.value.filter(item => {
      return item.label.indexOf(searchThemeStr.value.trim()) == 0
    })
  }
}
const clearThemeSearch = () => {
  themeArr.value = socialPeta.theme
}
// 选择theme的变化的时候
const selectThemeChange = selection => {
  const themeSelectArr = selection.map(item => {
    return item.value
  })
  const themeDesArr = selection.map(item => {
    return item.label
  })
  requestForm.theme = themeSelectArr.join(',')
  requestForm.themeDes = themeDesArr.join(',')
}
const cancelSelectTheme = () => {
  themeVisible.value = false
  proxy.$refs['themeTableRef'].clearSelection()
  requestForm.theme = ''
  requestForm.themeDes = ''
}

// 预提交
const preSubmitVisible = ref(false)
const preSubmit = () => {
  proxy.$refs.paramsRef.validate(valid => {
    if (valid) {
      preSubmitVisible.value = true
    }
  })
}
// 重置
const reset = () => {
  Object.keys(requestForm).forEach(key => {
    requestForm[key] = ''
  })
  if (proxy.$refs['channelTableRef']) {
    proxy.$refs['channelTableRef'].clearSelection()
  }
  if (proxy.$refs['geoTableRef']) {
    proxy.$refs['geoTableRef'].clearSelection()
  }
  if (proxy.$refs['categoryTableRef']) {
    proxy.$refs['categoryTableRef'].clearSelection()
  }
  if (proxy.$refs['themeTableRef']) {
    proxy.$refs['themeTableRef'].clearSelection()
  }
}

// 请求结果
const result = reactive({
  logShow: false,
  db_id: 0,
  percentage: 0,
  logs: [],
  status: 0,
  timer: '',
  cos_url: ''
})
const percentageText = computed(() => {
  if (result.status === 0) {
    return 'waiting'
  } else if (result.status === 1) {
    return 'running'
  } else if (result.status === 2) {
    return 'success'
  } else {
    return 'error'
  }
})
const percentageStatus = computed(() => {
  if (result.status === 0) {
    return ''
  } else if (result.status === 1) {
    return ''
  } else if (result.status === 2) {
    return 'success'
  } else {
    return 'exception'
  }
})

// 确认提交
const confirmSubmit = () => {
  submitDisabled.value = true
  result.percentage = 0
  result.status = 0
  result.logs = []
  preSubmitVisible.value = false
  getCreatives()
}

const getCreatives = async () => {
  Object.keys(requestForm).forEach(key => {
    if (!requestForm[key]) {
      delete requestForm[key]
    }
  })
  const tempForm = Object.assign({}, requestForm)
  tempForm.username = getCookie('user_name')
  if (requestForm.begin) {
    tempForm.begin = formatDate(requestForm.begin, 'yyyy-mm-dd')
  }
  if (requestForm.end) {
    tempForm.end = formatDate(requestForm.end, 'yyyy-mm-dd')
  }
  if (requestForm.first_seen_select && requestForm.first_seen) {
    tempForm.first_seen = formatDate(requestForm.first_seen, 'yyyy-mm-dd')
  }
  const resp = await proxy.$api.testing.retrieval(tempForm)
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    submitDisabled.value = false
    result.logShow = false
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    result.db_id = data.db_id
    ElMessage.success('submit success')
    result.logShow = true
    // 定时获取任务状态
    if (result.timer) {
      clearInterval(result.timer)
    }
    result.timer = setInterval(getProgress, 3000)
  } else {
    ElMessage.error(message || 'get data failed')
    result.logShow = false
  }
}

// const sleep = ms => {
//   return new Promise(resolve => setTimeout(resolve, ms))
// }

const logScroll = () => {
  const parent = document.getElementById('log_parent')
  const child = document.getElementById('log_child')
  if (child.offsetHeight > parent.offsetHeight) {
    parent.scrollTop = child.offsetHeight - parent.offsetHeight
  }
}

const getProgress = () => {
  if (!result.db_id) {
    clearInterval(result.timer)
    ElMessage.error('no db_id')
    return
  }
  axios
    .get(`/api/v1/creatives/progress/${result.db_id}`)
    .then(res => {
      const { ret_code, message, data } = res.data
      if (ret_code === '0') {
        result.percentage = data.progress
        result.status = data.status
        result.logs = data.logs.map(item => {
          const itemArr = item.split('|')
          const level = itemArr[0]
          let type
          if (level === 'info') {
            type = 'info'
          } else if (level === 'warning') {
            type = 'warning'
          } else if (level === 'error') {
            type = 'danger'
          } else {
            type = 'success'
          }
          return {
            level: level,
            time: itemArr[1],
            text: itemArr[2],
            type: type
          }
        })
        if (data.progress === 100) {
          clearInterval(result.timer)
          submitDisabled.value = false
          result.cos_url = data.cos_url
        }
        // 控制日志滚动条
        nextTick(() => {
          logScroll()
        })
      } else {
        clearInterval(result.timer)
        ElMessage.error(message || 'get progress failed')
      }
    })
    .catch(err => {
      clearInterval(result.timer)
      ElMessage.error(err.message)
    })
}

// 下载excel
// const downloadExcelLink = computed(() => {
//   return `/api/v1/creatives/excel_data/${result.db_id}`
// })

onBeforeUnmount(() => {
  if (result.timer) {
    clearInterval(result.timer)
  }
})
</script>

<style lang="less" scoped>
.channel-header {
  display: flex;
}

.percentage-value {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
.percentage-label {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}

.log-header {
  h4 {
    margin: 0;
  }
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  a {
    color: #fff;
  }
}
</style>
