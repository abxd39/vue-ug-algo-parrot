<template>
  <Breadcrumb />
  <div class="outer-box" v-loading="loading" id="summarization">
    <Introduction> Text summarization is a service that can give a sentence for summarizing a batch of comments. This demo is to show the summary results and facilitate modification. </Introduction>
    <div class="asset">
      <el-select v-model="game" placeholder="Select Game" size="large">
        <el-option v-for="item in games" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-date-picker :disabled-date="expireTimeOption" v-model="date.date" @change="dateChange" type="daterange" unlink-panels range-separator="To" start-placeholder="Start date" end-placeholder="End date" size="large" clearable />
      <span style="padding-left: 20px; padding-right: 5px">Channel Type:</span>
      <el-select v-model="channelType" placeholder="Select Channel" size="large" style="width: 150px">
        <el-option v-for="item in channelTypeArr" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <!--
      <span style="padding-left: 20px; padding-right: 5px">Sentiment Type:</span>
      <el-select v-model="sentimentType" placeholder="Select Sentiment" size="large" style="width: 160px">
        <el-option v-for="item in sentimentTypeArr" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      -->
      <span style="padding-left: 20px; padding-right: 5px">Language:</span>
      <el-select v-model="language" placeholder="Select Language" size="large" style="width: 160px">
        <el-option v-for="item in languageArr" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button type="primary" @click="search" :disabled="searchDisabled">Search</el-button>
    </div>
    <div v-show="showResult">
      <el-row :gutter="15" class="asset">
        <el-col :span="12">
          <el-card shadow="never" :body-style="{ height: '1137px', overflow: 'auto' }">
            <!-- <h4 style="margin: 0">
              sentences
              <span style="font-weight: normal; padding-left: 5px; color: #909399">(total {{ sentenceArr.length }})</span>
            </h4> -->

            <el-row>
              <el-button type="primary" :plain="plainTotal" @click="totalClick"> Total </el-button>
              <el-button type="primary" :plain="plainPositive" @click="positiveClick"> Positive </el-button>
              <el-button type="primary" :plain="plainNegative" @click="negativeClick"> Negative </el-button>
            </el-row>

            <el-divider />
            <ul v-if="sentenceArr.length > 0">
              <li v-for="item in sentenceArr" :key="item.id" @click="clickSentence(item.id, item.keywords, item.comment_uins, item.info, item.event_flag)" :style="divStyle(item.isvalid)">
                <div class="history">
                  <div style="max-width: 90%">
                    <span v-if="item.event_flag === 1" style="color: #67c23a; font-size: 13px; padding-right: 5px">New</span>
                    <span>
                      <img v-if="item.sentiment_rating == 5" src="../../../assets/images/Positive.svg" alt="情感评分" class="icon_src" style="width: 24px; height: 24px" />
                      <img v-if="item.sentiment_rating == 3" src="../../../assets/images/Neutral.svg" alt="情感评分" class="icon_src" style="width: 24px; height: 24px" />
                      <img v-if="item.sentiment_rating == 1" src="../../../assets/images/Negative.svg" alt="情感评分" class="icon_src" style="width: 24px; height: 24px" />【{{
                        item.cluster_tittle
                      }}】<img v-if="item.new_icon == 1" title="" src="../../../assets/images/New-icon.svg" alt="new" class="icon_src" style="width: 24px; height: 24px" />
                      <img v-if="item.hot_icon == 1" src="../../../assets/images/Hot-icon.svg" alt="hot" class="icon_src" style="width: 24px; height: 24px" />
                      <img v-if="item.rise_icon == 1" src="../../../assets/images/Rising-icon.svg" alt="rising" class="icon_src" style="width: 24px; height: 24px"
                    /></span>
                    <span :style="sentenceStyle(item.id, item.isvalid)" class="sentence">{{ item.sentence }}</span>
                  </div>
                  <div>
                    <div v-if="item.isvalid === 1">
                      <el-icon
                        @click="modifySentence(item.idd, item.event_id, item.insert_time, item.sentence, item.cluster_tittle, item.cluster_id, item.new_icon, item.hot_icon, item.rise_icon)"
                        color="#409EFF"
                        style="padding-right: 10px; cursor: pointer"
                        ><Edit
                      /></el-icon>
                      <el-icon @click="delSentence(item.event_id, item.insert_time)" color="#F56C6C" style="cursor: pointer"><CircleClose /></el-icon>
                    </div>
                    <el-icon v-else @click="updateSentence(item.event_id, item.insert_time)" style="cursor: pointer"><RefreshLeft /></el-icon>
                  </div>
                  <!-- <el-button type="primary" @click.stop="modifySentence(item.event_id, item.insert_time, item.sentence)" style="width: 55px; height: 26px; margin-top: 5px; font-size: 13px"
                    >modify</el-button> -->
                </div>
                <el-divider />
              </li>
            </ul>
            <el-empty v-else :image-size="200" />
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col>
              <el-card shadow="never" :body-style="{ height: '80px' }">
                <h4 style="margin: 0">keywords</h4>
                <el-divider />
                <p v-if="details.keywords">{{ details.keywords }}</p>
                <div v-else style="text-align: center; font-size: 14px; color: #909399; margin-top: 30px">
                  <span>No Data</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row class="asset">
            <el-col>
              <el-card shadow="never" :body-style="{ height: '300px' }">
                <div style="display: flex; justify-content: space-between">
                  <h4 style="margin: 0">trends</h4>
                  <el-radio-group v-model="dateRange" @change="dateRangeChange">
                    <el-radio :label="item" size="small" v-for="item in dateRangeArr" :key="item">{{ item }}</el-radio>
                  </el-radio-group>
                </div>
                <el-divider />
                <div v-if="details.event_flag === 2" id="summaryTrends" style="width: 100%; height: 100%"></div>
                <el-empty v-else :image-size="100" />
              </el-card>
            </el-col>
          </el-row>
          <el-row class="asset">
            <el-col>
              <el-card shadow="never">
                <h4 style="margin: 0">comments<span style="font-weight: normal; padding-left: 5px; color: #909399">(top 60)</span></h4>
                <el-divider />
                <div style="overflow: auto; height: 602px" v-if="details.commemts.length > 0">
                  <div v-for="item in details.commemts" :key="item.md5_uin">
                    <p><span class="title">content:</span>{{ item.content }}</p>
                    <p style="color: #409eff"><span class="title">content_to_zh:</span> {{ item.content_to_zh }}</p>
                    <p style="color: #67c23a"><span class="title">content_to_en:</span> {{ item.content_to_en }}</p>
                    <el-divider />
                  </div>
                </div>
                <el-empty :image-size="200" v-else style="height: 602px" />
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
  </div>
  <el-dialog v-model="modifyDialogVisible" title="Modify event infomation" width="50%" center top="30vh">
    <el-form :data="editSentenceOnclickRadio">
      <el-form-item label="Tittle:" prop="tittle">
        <el-input v-model="editSentenceOnclickRadio.eventTittle" style="width: 30%"></el-input>
      </el-form-item>
      <el-form-item label="Icon:" prop="icon">
        <el-checkbox-group v-model="editSentenceOnclickRadio.icon" @change="sentenceOnclickRadio">
          <el-checkbox label="new"><img src="../../../assets/images/New-icon.svg" alt="new" class="icon_src" style="width: 24px; height: 24px" /></el-checkbox>
          <el-checkbox label="rise"><img src="../../../assets/images/Rising-icon.svg" alt="rise" class="icon_src" style="width: 24px; height: 24px" /></el-checkbox>
          <el-checkbox label="hot"><img src="../../../assets/images/Hot-icon.svg" alt="hot" class="icon_src" style="width: 24px; height: 24px" /></el-checkbox>
          <el-checkbox label="delete">delete</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <div>
        <el-card style="text-align: left" shadow="never">
          <el-table :data="historyData.value" style="width: 100%" v-fit-columns :show-header="false">
            <el-table-column label="value">
              <template width="90" v-slot="scope">
                <el-tag type="success" v-if="scope.row.type === 'delete'">{{ scope.row.value }}</el-tag>
                <img v-else :src="scope.row.value" style="width: 24px; height: 24px; border: none" />
              </template>
            </el-table-column>
            <el-table-column prop="creator" label="creator" />
            <el-table-column prop="insert_time" label="insert_time" />
          </el-table>
        </el-card>
      </div>
      <el-form-item label="Sentence:" prop="sentence">
        <el-input v-model="editSentenceOnclickRadio.sentence" type="textarea" autosize style="margin-top: 10px; margin-bottom: 10px"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="modifyDialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="confirmModify">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import Introduction from '@/components/introduction/Introduction.vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import { ref, reactive, getCurrentInstance, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { formatDate } from '@/utils/common_utils'
import { getCookie } from '@/utils/api_utils'

const plainTotal = ref(false)
const plainPositive = ref(true)
const plainNegative = ref(true)

const { proxy } = getCurrentInstance()
let trendsChart, resizeObserver
const code = getCookie('code')
const dateRangeArr = ['1 week', '1 month', 'all']
const day = 24 * 60 * 60 * 1000

//const dateRange = ref(dateRangeArr[0])
const dateRange = ref('')
const negativeImage = ref('')
const historyData = reactive([])
const historyDataMap = new Map()
const date = reactive({
  date: [],
  startDate: '',
  endDate: ''
})
const loading = ref(false)

const editSentenceOnclickRadio = reactive({
  icon: [],
  sentence: '',
  eventTittle: ''
})

const sentenceOnclickRadio = args => {
  // for(let item of args){
  //   if (item=='delete'){
  //     editSentenceOnclickRadio.icon.push('delete')
  //     return
  //   }
  // }
  editSentenceOnclickRadio.icon = args
}
const expireTimeOption=(date)=>{
      return date.getTime() > Date.now();

}

// 获取当前时间
const getCurrentDate = () => {
  const today = new Date()
  // 默认获取前1天的数据
  const startTime = today.getTime() - day
  date.date.push(formatDate(new Date(startTime), 'yyyy-mm-dd'))
  date.date.push(formatDate(today, 'yyyy-mm-dd'))

  date.startDate = formatDate(new Date(startTime), 'yyyy-mm-dd') + ' 00:00:00'
  // 目前的需求是传递的endDate是要比页面显示的大一天
  date.endDate = formatDate(today, 'yyyy-mm-dd') + ' 00:00:00'
}

const dateChange = value => {
  // console.log(value)
  if (value) {
    date.startDate = formatDate(date.date[0], 'yyyy-mm-dd') + ' 00:00:00'
    // 目前的需求是传递的endDate是要比页面显示的大一天
    const endTime = date.date[1].getTime() + 24 * 60 * 60 * 1000
    date.endDate = formatDate(new Date(endTime), 'yyyy-mm-dd') + ' 00:00:00'
    // 这里不用自动更新数据
  } else {
    date.startDate = ''
    date.endDate = ''
  }
}

const showResult = ref(false)
const sentenceArr = ref([])
const channelTypeArr = ref([])
const sentimentTypeArr = ref([])
const languageArr = ref([])
const channelType = ref('')
const sentimentType = ref('')
const language = ref('')
const searchDisabled = ref(false)
const games = ref([])
const game = ref('')

// 获取查询参数
const getParams = async () => {
  const resp = await proxy.$api.nlp.summaryParams({})
  loading.value = false
  //   请求出错
  if (typeof resp === 'string') {
    searchDisabled.value = true
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    channelTypeArr.value = data.channel_type.value
    sentimentTypeArr.value = data.data_sentiment.value
    languageArr.value = data.data_language.value
    games.value = data.game.value
    channelType.value = channelTypeArr.value[0].value
    sentimentType.value = sentimentTypeArr.value[0].value
    language.value = languageArr.value[0].value
    game.value = games.value[0].value
    searchDisabled.value = false
    getSentence()
  } else {
    searchDisabled.value = true
    ElMessage.error(message)
  }
}

// 获取sentence和评论
const getSentence = async () => {
  loading.value = true
  const gamestrArr = game.value.split('|')
  const resp = await proxy.$api.nlp.summaryText({
    unified_id: gamestrArr[0],
    edition_id: gamestrArr[1],
    start_time: date.startDate,
    end_time: date.endDate,
    channel_type: channelType.value,
    data_sentiment: sentimentType.value,
    data_language: language.value
  })
  loading.value = false
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    showResult.value = true
    sentenceArr.value = data.map(item => {
      item.idd = item.id
      item.id = item.event_id + item.insert_time
      return item
    })
    if (sentenceArr.value.length > 0) {
      clickSentence(sentenceArr.value[0].id, sentenceArr.value[0].keywords, sentenceArr.value[0].comment_uins, sentenceArr.value[0].info, sentenceArr.value[0].event_flag)
    }
  } else {
    ElMessage.error(message)
  }
}

const details = reactive({
  keywords: '',
  info: '',
  event_flag: 0,
  commemts: []
})
const currentSentenceId = ref('')
// 点击某条sentence
const clickSentence = (id, keywords, comment_uins, info, event_flag) => {
  currentSentenceId.value = id
  details.keywords = keywords
  //details.event_flag = event_flag
  details.event_flag = 2
  dateRange.value = dateRangeArr[0]
  if (event_flag === 1) {
    details.info = ''
  } else {
    if (info === '') {
      details.info = ''
    } else {
      //const infoObj = JSON.parse(JSON.parse(info))
      const infoObj = JSON.parse(info)
      console.log(infoObj)
      // 获取到所有的日期
      const days = Object.keys(infoObj).sort()
      // 进行日期填充
      const startDay = new Date(days[0])
      const endDay = new Date(days[days.length - 1])
      // 间隔天数
      const intervalDay = (endDay - startDay) / day
      // 日期填充
      const fullDays = [days[0]]
      for (let i = 1; i <= intervalDay; i++) {
        const dayTime = new Date(startDay.getTime() + day * i)
        fullDays.push(formatDate(dayTime, 'yyyy-mm-dd'))
      }
      details.info = {}
      for (const key of fullDays) {
        if (key in infoObj) {
          if (infoObj[key][0] !== '-1' && infoObj[key][1] !== '-1') {
            details.info[key] = [Number(infoObj[key][0], 10), Number(infoObj[key][1], 10)]
          } else {
            details.info[key] = ['-', '-']
          }
        } else {
          details.info[key] = ['-', '-']
        }
      }

      nextTick(() => {
        setTimeout(() => {
          trends()
        }, 10)
      })
    }
  }
  getComments(comment_uins)
}

const sentenceStyle = (id, isvalid) => {
  if (isvalid === 1) {
    if (currentSentenceId.value === id) {
      return {
        color: '#409eff',
        backgroundColor: '#E6E8EB'
      }
    }
    return {
      color: '#303133'
    }
  } else {
    if (currentSentenceId.value === id) {
      return {
        color: '#a8abb2',
        backgroundColor: '#E6E8EB'
      }
    }
    return {
      color: '#a8abb2'
    }
  }
}

const divStyle = isvalid => {
  if (isvalid === 1) {
    return {}
  }
  return {
    backgroundColor: '#f4f4f5'
  }
}

// 获取某条sentence的具体comments
const getComments = async comment_uins => {
  details.commemts = []
  const gamestrArr = game.value.split('|')
  const resp = await proxy.$api.nlp.summaryComments({
    unified_id: gamestrArr[0],
    edition_id: gamestrArr[1],
    start_time: date.startDate,
    end_time: date.endDate,
    comment_uins: comment_uins
  })
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    details.commemts = data
  } else {
    ElMessage.error(message)
  }
}

// 修改相关
const modifyDialogVisible = ref(false)
const modifyData = reactive({})

// 修改sentence
const modifySentence = (id, event_id, insert_time, sentence, tittle, clusterId, newIcon, hotIcon, riseIcon) => {
  modifyDialogVisible.value = true
  const gamestrArr = game.value.split('|')
  modifyData.unified_id = gamestrArr[0]
  modifyData.edition_id = gamestrArr[1]
  modifyData.event_id = event_id
  modifyData.insert_time = insert_time
  modifyData.cluster_id = clusterId
  editSentenceOnclickRadio.eventTittle = tittle
  editSentenceOnclickRadio.sentence = sentence
  editSentenceOnclickRadio.icon = []
  if (newIcon === 1) {
    editSentenceOnclickRadio.icon.push('new')
  }
  if (hotIcon === 1) {
    editSentenceOnclickRadio.icon.push('hot')
  }
  if (riseIcon === 1) {
    editSentenceOnclickRadio.icon.push('rise')
  }
  var currentHistoryData = historyDataMap.get(id)

  currentHistoryData?.sort(function (a, b) {
    return a.insert_time < b.insert_time ? 1 : -1
  })
  historyData.value = currentHistoryData
  //todo=
}

// 确认修改
const confirmModify = async () => {
  if (editSentenceOnclickRadio.sentence.trim() === '') {
    ElMessage.error('new sentence can not be empty')
    return
  }
  if (!code) {
    ElMessage.error('get code err, please login again')
    return
  }
  modifyData.sentence = editSentenceOnclickRadio.sentence
  modifyData.code = code
  modifyData.cluster_tittle = editSentenceOnclickRadio.eventTittle
  modifyData.new_icon = -1
  modifyData.hot_icon = -1
  modifyData.rise_icon = -1
  for (let item of editSentenceOnclickRadio.icon) {
    if (item == 'new') {
      modifyData.new_icon = 1
    }
    if (item == 'hot') {
      modifyData.hot_icon = 1
    }
    if (item == 'rise') {
      modifyData.rise_icon = 1
    }
    if (item == 'delete') {
      modifyData.rise_icon = 0
      modifyData.hot_icon = 0
      modifyData.new_icon = 0
      break
    }
  }
  modifyData.start_time = date.startDate
  modifyData.end_time = date.endDate
  modifyData.data_sentiment = sentimentType.value
  modifyData.channel_type = channelType.value
  modifyData.data_language = language.value
  const resp = await proxy.$api.nlp.summaryModify(modifyData)
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    ElMessage.success('modify sentence success')
    getSentence()
    modifyDialogVisible.value = false
    history()
  } else {
    ElMessage.error(message)
  }
}

// 逻辑删除
const delSentence = async (event_id, insert_time) => {
  if (!code) {
    ElMessage.error('get code err, please login again')
    return
  }
  const gamestrArr = game.value.split('|')
  const resp = await proxy.$api.nlp.summaryDel({
    unified_id: gamestrArr[0],
    edition_id: gamestrArr[1],
    event_id: event_id,
    insert_time: insert_time,
    code: code
  })
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message } = resp.data
  if (ret_code === '0') {
    ElMessage.success('update sentence success')
    getSentence()
  } else {
    ElMessage.error(message)
  }
}

// 撤销删除
const updateSentence = async (event_id, insert_time) => {
  if (!code) {
    ElMessage.error('get code err, please login again')
    return
  }
  const gamestrArr = game.value.split('|')
  const resp = await proxy.$api.nlp.summaryRecover({
    unified_id: gamestrArr[0],
    edition_id: gamestrArr[1],
    event_id: event_id,
    insert_time: insert_time,
    code: code
  })
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message } = resp.data
  if (ret_code === '0') {
    ElMessage.success('update sentence success')
    getSentence()
  } else {
    ElMessage.error(message)
  }
}

// 画图
//\"2023-08-19\": [3, 64], \"2023-08-20\": [5, 20]}"
const trends = () => {
  if (details.info === '') {
    return
  }
  if (trendsChart) {
    trendsChart.dispose()
  }
  trendsChart = proxy.$echarts.init(document.getElementById('summaryTrends'))
  const dateArr = []
  const countArr = []
  const rankArr = []
  let trendsData = {}
  switch (dateRange.value) {
    case 'all':
      trendsData = details.info
      break
    case '1 week':
      const today1 = new Date(date.endDate)
      const days1 = [formatDate(today1, 'yyyy-mm-dd')]
      for (let i = 1; i < 7; i++) {
        const dayTime = new Date(today1.getTime() - day * i)
        days1.push(formatDate(dayTime, 'yyyy-mm-dd'))
      }
      days1.sort()
      days1.forEach(key => {
        if (key in details.info) {
          trendsData[key] = details.info[key]
        }
      })
      break
    case '1 month':
      const today2 = new Date(date.endDate)
      const days2 = [formatDate(today2, 'yyyy-mm-dd')]
      for (let i = 1; i < 30; i++) {
        const dayTime = new Date(today2.getTime() - day * i)
        days2.push(formatDate(dayTime, 'yyyy-mm-dd'))
      }
      days2.sort()
      days2.forEach(key => {
        if (key in details.info) {
          trendsData[key] = details.info[key]
        }
      })
      break
    default:
      trendsData = details.info
      break
  }
  for (const key in trendsData) {
    dateArr.push(key)
    let rank = details.info[key][0]
    let count = details.info[key][1]
    rankArr.push(rank)
    countArr.push(count)
  }
  // 获取rank最大值
  let maxRank = 0
  rankArr.forEach(item => {
    if (item !== '-' && item > maxRank) {
      maxRank = item
    }
  })
  if (maxRank === 0) {
    maxRank = 1 + 1
  } else {
    maxRank = maxRank + 1
  }
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      },
      // 解决提示框太长被父元素截断的问题
      appendToBody: true
    },
    legend: {
      bottom: 0
    },
    legend: {
      data: ['rank', 'count']
    },
    grid: {
      bottom: 100
    },
    xAxis: [
      {
        type: 'category',
        axisPointer: {
          type: 'shadow'
        },
        name: 'date',
        nameTextStyle: {
          color: '#303133',
          fontStyle: 'italic',
          fontSize: 13,
          padding: 5
        },
        nameLocation: 'start',
        nameGap: 20,
        axisTick: {
          alignWithLabel: true,
          interval: 0
        },
        axisLabel: {
          rotate: 30,
          margin: 15
        },
        data: dateArr
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'rank',
        nameLocation: 'start',
        nameTextStyle: {
          color: '#303133',
          fontStyle: 'italic',
          fontSize: 13,
          padding: 5
        },
        splitLine: { show: false },
        min: 1,
        max: maxRank,
        inverse: true,
        minInterval: 1
      },
      {
        type: 'value',
        name: 'count',
        nameTextStyle: {
          color: '#303133',
          fontStyle: 'italic',
          fontSize: 13,
          padding: 5
        },
        splitLine: { show: false },
        min: 1
      }
    ],
    series: [
      {
        name: 'rank',
        type: 'line',
        yAxisIndex: 0,
        symbolSize: 2,
        data: rankArr
      },
      {
        name: 'count',
        type: 'line',
        yAxisIndex: 1,
        symbolSize: 2,
        data: countArr
      }
    ]
  }
  trendsChart.setOption(option)
}

// trends图时间切换
const dateRangeChange = () => {
  if (details.event_flag === 1) {
    return
  }
  trends()
}

// 点击search
const search = () => {
  showResult.value = false
  sentenceArr.value = false
  details.keywords = ''
  details.commemts = []
  details.event_flag = 0
  details.info = ''
  dateRange.value = dateRangeArr[0]
  getSentence()
}

const totalClick = () => {
  plainTotal.value = false
  plainPositive.value = true
  plainNegative.value = true
  sentimentType.value = 'total'
  getSentence()
}
const positiveClick = () => {
  plainTotal.value = true
  plainPositive.value = false
  plainNegative.value = true
  sentimentType.value = 'positive'
  getSentence()
}
const negativeClick = () => {
  plainTotal.value = true
  plainPositive.value = true
  plainNegative.value = false
  sentimentType.value = 'negative'
  getSentence()
}

// echart尺寸改变
const chartAdapter = () => {
  if (trendsChart) {
    trendsChart.dispose()
  }
}

const history = async () => {
  if (!code) {
    ElMessage.error('get code err, please login again')
    return
  }

  const gamestrArr = game.value.split('|')
  const resp = await proxy.$api.nlp.summaryHistory({})
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    //历史数据处理
    historyDataMap.clear()
    for (let item of data) {
      let after = JSON.parse(item.after_value)
      let before = JSON.parse(item.before_value)
      let list = []

      if (after.hot_icon != before.hot_icon) {
        let obj = {
          value: '',
          creator: item.creator,
          insert_time: item.insert_time
        }
        if (after.hot_icon == 0) {
          obj.value = 'deleted'
          obj.type = 'delete'
          list.push(obj)
        } else if (after.hot_icon == 1) {
          obj.value = new URL('../../../assets/images/Hot-icon.svg', import.meta.url).href
          obj.type = 'hot_icon'
          list.push(obj)
        } else if (before.hot_icon == 1 && after.hot_icon == -1) {
          obj.value = 'hot (deleted)'
          obj.type = 'delete'
          list.push(obj)
        }
      }
      if (after.new_icon != before.new_icon) {
        let obj = {
          value: '',
          creator: item.creator,
          insert_time: item.insert_time
        }
        if (after.new_icon == 0) {
          obj.value = 'deleted'
          obj.type = 'delete'
          list.push(obj)
        } else if (after.new_icon == 1) {
          obj.value = new URL('../../../assets/images/New-icon.svg', import.meta.url).href
          obj.type = 'new_icon'
          list.push(obj)
        } else if (before.new_icon == 1 && after.new_icon == -1) {
          obj.value = 'new (deleted)'
          obj.type = 'delete'
          list.push(obj)
        }
      }
      if (after.rise_icon != before.rise_icon) {
        let obj = {
          value: '',
          creator: item.creator,
          insert_time: item.insert_time
        }
        if (after.rise_icon == 0) {
          //勾选了删除标签。所有标签都为deleted
          obj.value = 'deleted'
          obj.type = 'delete'
          list.push(obj)
        } else if (after.rise_icon == 1) {
          obj.value = new URL('../../../assets/images/Rising-icon.svg', import.meta.url).href
          obj.type = 'rise_icon'
          list.push(obj)
        } else if (before.rise_icon == 1 && after.rise_icon == -1) {
          obj.value = 'Rising (deleted)'
          obj.type = 'delete'
          list.push(obj)
        }
      }
      if (historyDataMap.has(after.id)) {
        let valuse = historyDataMap.get(after.id)
        valuse.push(...list)
        historyDataMap.set(after.id, valuse)
      } else {
        historyDataMap.set(after.id, list)
      }
    }
  } else {
    ElMessage.error(message)
  }
}

// 组件create时期执行的方法
history()
getCurrentDate()
getParams()

onMounted(() => {
  resizeObserver = new ResizeObserver(chartAdapter)
  resizeObserver.observe(document.getElementById('summarization'))
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
  if (trendsChart) {
    trendsChart.resize()
  }
})
</script>

<style lang="less" scoped>
.el-select {
  margin-right: 10px;
}

.el-button {
  margin-left: 10px;
  height: 38px;
}

.history {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .sentence {
    cursor: pointer;
    padding: 5px;
    font-size: 13px;
    border-radius: 3px;
    display: inline-block;
    max-width: 90%;
  }
}

p {
  font-family: PingFang SC;
  font-size: 13px;
  color: #909399;
}

.title {
  padding-right: 5px;
  color: #606266;
  font-weight: bold;
}

.icon:hover {
  color: rgb(81, 255, 0);
  size: 100px;
}

.is-active .icon_src {
  filter: drop-shadow(1000px 0 0 #fff);
  transform: translate(-1000px);
}
</style>
