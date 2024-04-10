<template>
  <Introduction>To summarize game topics to normalized expression from reviews.</Introduction>
  <div class="asset">
    <el-select v-model="select" placeholder="Select Game" size="large">
      <el-option v-for="item in results.games" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <el-date-picker v-model="date.dateArr" type="daterange" range-separator="To" start-placeholder="Start date" end-placeholder="End date" @change="dateChange" size="large" :clearable="false" />
    <el-button type="primary" @click="search">Search</el-button>
  </div>
  <div v-show="showResult">
    <el-row :gutter="15" class="asset">
      <el-col :span="12">
        <el-card shadow="never" :body-style="{ height: '1007px', padding: 0, position: 'relative' }">
          <div style="padding: 20px 20px 0">
            <div class="show-num">
              <div>
                <h5 class="opinion-expression">Category Analyse</h5>
                <el-popover placement="right" title="Color Description" :width="200" trigger="click">
                  <template #reference>
                    <el-icon color="#c8c9cc" :size="14" style="margin-left: 5px"><QuestionFilled /></el-icon>
                  </template>
                  <template #default>
                    <div style="font-size: 12px">
                      <span style="width: 8px; height: 8px; background-color: #ff0000; display: inline-block"></span>
                      avg_sentiment: [1-2.4]
                    </div>
                    <div style="font-size: 12px">
                      <span style="width: 8px; height: 8px; background-color: #ffc000; display: inline-block"></span>
                      avg_sentiment: (2.4-3)
                    </div>
                    <div style="font-size: 12px">
                      <span style="width: 8px; height: 8px; background-color: #92d050; display: inline-block"></span>
                      avg_sentiment: [3-3.8)
                    </div>
                    <div style="font-size: 12px">
                      <span style="width: 8px; height: 8px; background-color: #00b050; display: inline-block"></span>
                      avg_sentiment: [3.8-5]
                    </div>
                  </template>
                </el-popover>
              </div>
              <el-radio-group v-model="categorySelectRadio" @change="categoryRadioChange">
                <el-radio :label="index" size="small" v-for="(item, index) in categoryRadioArr" :key="index">{{ item }}</el-radio>
              </el-radio-group>
              <div v-show="categoryNumShow">
                <span>top num</span>
                <el-select v-model="selectCategoryNum" size="small" @change="categoryRadioChange" style="width: 60px">
                  <el-option v-for="(item, index) in showNum" :key="index" :label="item.label" :value="item.value" />
                </el-select>
              </div>
            </div>
            <el-divider />
          </div>
          <!-- menu -->
          <div class="category-menu" @click="categoryListShow = !categoryListShow">
            <el-icon :size="20"><List /></el-icon>
          </div>
          <div class="category-list" v-show="categoryListShow">
            <ul>
              <li v-for="item in menuList" :key="item.label" :style="menuStyle(item.label, item.color)" @click="showDetailByCategory(item.label, item.color)">{{ item.label }}</li>
            </ul>
          </div>
          <el-empty :image-size="120" v-if="showCategoryEmpty" />
          <!-- 雷达图和柱状图 -->
          <div v-show="!quadrantShow" id="aspect_score" style="height: 100%; width: 100%" v-else></div>
          <!-- 分栏图 -->
          <div v-show="quadrantShow" style="height: 100%; width: 100%">
            <el-row style="height: 50%; overflow: auto; border-bottom: 1px solid #73767a">
              <el-col :span="12" style="border-right: 1px solid #73767a">
                <el-table :data="showQuadrantGood" style="width: 100%; color: #92d050" size="small" border :show-header="false" :span-method="objectSpanMethod" :cell-style="goodCellStyle">
                  <el-table-column prop="judge" label="Judge" width="150" />
                  <el-table-column prop="label" label="Label" />
                </el-table>
              </el-col>
              <el-col :span="12">
                <el-table :data="showQuadrantExcellent" style="width: 100%; color: #00b050" size="small" border :show-header="false" :span-method="objectSpanMethod" :cell-style="excellentCellStyle">
                  <el-table-column prop="judge" label="Judge" width="150" />
                  <el-table-column prop="label" label="Label" />
                </el-table>
              </el-col>
            </el-row>
            <el-row style="height: 50%; overflow: auto">
              <el-col :span="12" style="border-right: 1px solid #73767a">
                <el-table :data="showQuadrantCommon" style="width: 100%; color: #ffc000" size="small" border :show-header="false" :span-method="objectSpanMethod" :cell-style="commonCellStyle">
                  <el-table-column prop="judge" label="Judge" width="150" />
                  <el-table-column prop="label" label="Label" />
                </el-table>
              </el-col>
              <el-col :span="12">
                <el-table :data="showQuadrantBad" style="width: 100%; color: #ff0000" size="small" border :show-header="false" :span-method="objectSpanMethod" :cell-style="badCellStyle">
                  <el-table-column prop="judge" label="Judge" width="150" />
                  <el-table-column prop="label" label="Label" />
                </el-table>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
      <!-- 明细 -->
      <el-col :span="12">
        <el-row>
          <el-col>
            <el-card shadow="never" :body-style="{ height: '150px', overflow: 'auto' }">
              <div class="show-num">
                <div>
                  <h5 class="opinion-expression" v-html="opinionTitle"></h5>
                  <el-popover placement="right" title="Color Description" :width="200" trigger="click">
                    <template #reference>
                      <el-icon color="#c8c9cc" :size="14" style="margin-left: 5px"><QuestionFilled /></el-icon>
                    </template>
                    <template #default>
                      <div style="font-size: 12px">
                        <span style="width: 8px; height: 8px; background-color: #67c23a; display: inline-block"></span>
                        sentiment_score &gt;= 3.8
                      </div>
                      <div style="font-size: 12px">
                        <span style="width: 8px; height: 8px; background-color: #f56c6c; display: inline-block"></span>
                        sentiment_score &lt;= 2.4
                      </div>
                      <div style="font-size: 12px">
                        <span style="width: 8px; height: 8px; background-color: #e6a54b; display: inline-block"></span>
                        rest
                      </div>
                    </template>
                  </el-popover>
                </div>
                <el-radio-group v-model="opinionSelectRadio" @change="opinionRadioChange">
                  <el-radio :label="index" size="small" v-for="(item, index) in opinionRadioArr" :key="index">{{ item }}</el-radio>
                </el-radio-group>
                <div v-show="opinionNumShow">
                  <span>top num</span>
                  <el-select v-model="selectOpinionNum" size="small" @change="opinionRadioChange" style="width: 60px">
                    <el-option v-for="(item, index) in showNum" :key="index" :label="item.label" :value="item.value" />
                  </el-select>
                </div>
              </div>
              <el-divider />
              <el-tag
                v-for="(item, index) in results.showOpinion"
                :key="index"
                :type="item.type"
                :effect="item.effect"
                round
                size="large"
                @click="showDetail(item.title, item.count, index, item.type)"
                style="cursor: pointer"
              >
                {{ item.title }}({{ item.count }})
              </el-tag>
              <el-empty :image-size="30" v-show="showOpinionEmpty" />
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col>
            <el-card v-show="showDetailResult" class="expression-detail" shadow="never" v-loading="detailLoading">
              <!-- <div style="text-align: center"><h5>Expression Detail</h5></div> -->
              <div class="detail-header">
                <h5 v-html="detailTitle"></h5>
                <div style="font-size: 12px">
                  <span style="width: 8px; height: 8px; background-color: #f3d19e; display: inline-block"></span>
                  aspect_term
                  <span style="width: 8px; height: 8px; background-color: #b3e19d; display: inline-block; margin-left: 10px"></span>
                  opinion_term
                </div>
              </div>
              <el-divider />
              <div style="overflow: auto; height: 650px">
                <div v-for="(item, index) in results.details" :key="index">
                  <p v-html="item.content"></p>
                  <!-- <span v-show="item.longContent" style="cursor: pointer; color: #409eff; font-size: 12px" @click="showRest(index)">>>more</span> -->
                  <div class="detail-item">
                    <span>insert_time: {{ item.insert_time }}</span>
                    <span>|</span>
                    <span>sentiment_score: {{ item.sentiment_score }}</span>
                  </div>
                  <el-divider />
                </div>
              </div>
              <div class="pagination-box">
                <el-pagination
                  layout="total, sizes, prev, pager, next"
                  :page-sizes="[5, 6, 7, 8, 9, 10]"
                  :total="queryInfo.total"
                  v-model:page-size="queryInfo.pagesize"
                  :currentPage="queryInfo.pagenum"
                  @current-change="currentChange"
                  @size-change="handleSizeChange"
                />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import Introduction from '@/components/introduction/Introduction.vue'
import { ref, reactive, getCurrentInstance, onMounted, onBeforeUnmount, onBeforeMount, nextTick } from 'vue'
import { nanoid } from 'nanoid'
import { formatDate } from '@/utils/common_utils'

let mCharts, loadingInstance, resizeObserver
// --------------------公共变量和方法--------------------
const { proxy } = getCurrentInstance()
// top num数
const showNum = [
  {
    label: '5',
    value: 5
  },
  {
    label: '10',
    value: 10
  },
  {
    label: '15',
    value: 15
  },
  {
    label: 'all',
    value: 'all'
  }
]
// 处理数据库返回的时间, 2022-11-14T22:01:11+08:00
const fomartTime = timeStr => {
  const timeArr = timeStr.split('T')
  const formatTimeArr = [timeArr[0], timeArr[1].split('+')[0]]
  return formatTimeArr.join(' ')
}
// 请求absa后台响应相关数据
const results = reactive({
  games: [],
  categoryRespDone: false, // 分类是否响应成功
  categoryResults: [],
  opinionRespDone: false, // 印象是否响应成功
  allOpinion: [], // 响应的所有opinion
  positiveOpinion: [], // 所有积极地
  positiveExpression: [], // 所有积极的词
  negativeOpinion: [], // 所有消极的
  negativeExpression: [], // 所有消极的词
  neutralOpinion: [], // 所有中立的
  neutralExpression: [], // 所有中立的词
  showOpinion: [], // 根据选择展示的top num所展示的opinion
  details: []
})

// ------------------------------选择游戏和日期相关------------------------------
const select = ref('')
const date = reactive({
  dateArr: [],
  startDate: '',
  endDate: ''
})

// 获取当前时间
const getCurrentDate = () => {
  const today = new Date()
  // 默认获取前一天的数据
  const days = 24 * 60 * 60 * 1000
  const startTime = today.getTime() - 7 * days
  const endTime = today.getTime()
  date.dateArr[0] = new Date(startTime)
  date.dateArr[1] = new Date(endTime)

  date.startDate = formatDate(date.dateArr[0], 'yyyy-mm-dd')
  date.endDate = formatDate(date.dateArr[1], 'yyyy-mm-dd')
}

// date改变
const dateChange = value => {
  // console.log(value)
  if (value) {
    date.startDate = formatDate(date.dateArr[0], 'yyyy-mm-dd')
    date.endDate = formatDate(date.dateArr[1], 'yyyy-mm-dd')
    // 这里不用自动更新数据
  } else {
    date.startDate = ''
    date.endDate = ''
  }
}

// 获取业务列表信息（从七彩石获取游戏列表信息，获取首次登录的opinion和category）
const getBusiness = async () => {
  let envName = 'local'
  if (window.location.hostname === 'algo.intltest11.com') {
    envName = 'dev'
  } else if (window.location.hostname === 'algo.intlgame.com') {
    envName = 'pro'
  }
  const resp = await proxy.$api.rainbow.rainbow({
    app_id: 'e1eaa1f0-0d45-4c98-8f6b-29cdc4e16c95',
    group: 'ug-algo-service.portal.absa',
    env_name: envName
  })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, items, ret_msg } = resp.data
  if (ret_code === 0) {
    if (items.length >= 1) {
      const item = items[0].kvs.kvs[0]
      results.games = JSON.parse(item.value)
      select.value = results.games[3].id
      getCategory()
      getOpinion()
    }
  } else {
    ElMessage.error(ret_msg || 'get rainbow data failed')
  }
}

// ------------------------------Opinion for Category相关------------------------------
const showResult = ref(false) // 是否展示左边部分
const showOpinionEmpty = ref(false) // 展示opinion为空
const opinionNumShow = ref(false) // 是否展示top num选择框
const opinionRadioArr = ['All', 'Positive', 'Negative', 'Neutral'] // 头部radio选择器
const opinionSelectRadio = ref(0) // 选择的radio label，默认all
const selectOpinionNum = ref(10) // 展示opinion条数
const currentOpinionIndex = ref(0) // 当前点击opinion的index，主要做加深颜色处理
const categoryListShow = ref(false) // 显示category菜单
const opinionTitle = ref('Opinion for Category <span style="color: #909399">ALL</span>')
const extraOpinionParams = reactive({
  opinion_expression: ['ABSA_ALL'],
  aspect_category: ['ABSA_ALL']
})

// 获取大家印象
const getOpinion = async () => {
  // 请求之前把detail清掉
  showDetailResult.value = false
  results.details = []
  const resp = await proxy.$api.nlp.opinionExpression({
    request_id: nanoid(),
    unified_id: select.value,
    opinion_expression: extraOpinionParams.opinion_expression,
    aspect_category: extraOpinionParams.aspect_category,
    date: {
      gte: date.startDate,
      lte: date.endDate
    }
  })
  // 请求出错
  if (typeof resp === 'string') {
    results.opinionRespDone = true
    // 两个请求完成才关闭加载
    if (results.categoryRespDone && results.opinionRespDone) {
      loadingInstance.close()
    }
    ElMessage.error(resp)
    return
  }
  const { ret_code, message, data } = resp.data
  if (ret_code === '0') {
    results.opinionRespDone = true
    // 两个请求完成才关闭加载
    if (results.categoryRespDone && results.opinionRespDone) {
      loadingInstance.close()
    }
    if (data === null || JSON.stringify(data) === '{}' || JSON.stringify(data.results) === '{}') {
      results.showOpinion = []
      showOpinionEmpty.value = true
      opinionNumShow.value = false
      return
    }
    showOpinionEmpty.value = false
    opinionNumShow.value = true
    // results降序排序
    const allResults = []
    const positiveResults = []
    const negativeResults = []
    const neutralResults = []
    let allTotal = 0
    let positiveTotal = 0
    let negativeTotal = 0
    let neutralTotal = 0
    Object.keys(data.results).forEach(key => {
      const score = data.results[key].sentiment_score
      const item = {
        label: key,
        count: data.results[key].count,
        score: data.results[key].sentiment_score
      }
      allResults.push(item)
      allTotal += item.count
      if (score > 3.8) {
        positiveResults.push(item)
        positiveTotal += item.count
        results.positiveExpression.push(key)
      } else if (score < 2.4) {
        negativeResults.push(item)
        negativeTotal += item.count
        results.negativeExpression.push(key)
      } else {
        neutralResults.push(item)
        neutralTotal += item.count
        results.neutralExpression.push(key)
      }
    })
    // 排序
    results.allOpinion = allResults.sort((obj1, obj2) => {
      const x = obj1.count
      const y = obj2.count
      if (x < y) {
        return 1
      } else if (x > y) {
        return -1
      } else {
        return 0
      }
    })
    results.positiveOpinion = positiveResults.sort((obj1, obj2) => {
      const x = obj1.count
      const y = obj2.count
      if (x < y) {
        return 1
      } else if (x > y) {
        return -1
      } else {
        return 0
      }
    })
    results.negativeOpinion = negativeResults.sort((obj1, obj2) => {
      const x = obj1.count
      const y = obj2.count
      if (x < y) {
        return 1
      } else if (x > y) {
        return -1
      } else {
        return 0
      }
    })
    results.neutralOpinion = neutralResults.sort((obj1, obj2) => {
      const x = obj1.count
      const y = obj2.count
      if (x < y) {
        return 1
      } else if (x > y) {
        return -1
      } else {
        return 0
      }
    })
    // 添加all标签
    results.allOpinion.unshift({
      label: 'ALL',
      count: allTotal,
      score: 10
    })
    results.positiveOpinion.unshift({
      label: 'ALL',
      count: positiveTotal,
      score: 10
    })
    results.negativeOpinion.unshift({
      label: 'ALL',
      count: negativeTotal,
      score: 10
    })
    results.neutralOpinion.unshift({
      label: 'ALL',
      count: neutralTotal,
      score: 10
    })
    updateAllOpinion()
  } else {
    results.opinionRespDone = true
    // 两个请求完成才关闭加载
    if (results.categoryRespDone && results.opinionRespDone) {
      loadingInstance.close()
    }
    ElMessage.error(message || 'get opinion failed')
  }
}

// opinion的tag展示类型
const genType = num => {
  if (num === 10) {
    return 'info'
  }
  if (num >= 3.8) {
    return 'success'
  } else if (num <= 2.4) {
    return 'danger'
  } else {
    return 'warning'
  }
}

// 根据top num截取opinion
const updateAllOpinion = () => {
  detailTitle.value = 'Detail for Opinion <span style="color: #909399">ALL</span>'
  const tagData = []
  let showExpressionArr = []
  if (selectOpinionNum.value == 'all') {
    showExpressionArr = results.allOpinion
  } else {
    // ALL标签不能算在里面
    if (selectOpinionNum.value >= results.allOpinion.length - 1) {
      showExpressionArr = results.allOpinion
    } else {
      showExpressionArr = results.allOpinion.slice(0, selectOpinionNum.value + 1)
    }
  }
  showExpressionArr.forEach((item, index) => {
    tagData.push({
      title: item.label,
      count: item.count,
      type: genType(item.score),
      effect: index === currentOpinionIndex.value ? 'dark' : 'plain'
    })
  })
  results.showOpinion = tagData
  if (results.showOpinion.length > 0) {
    showDetail(results.showOpinion[0].title, results.showOpinion[0].count, 0)
  }
}

const updatePositiveOpinion = () => {
  detailTitle.value = 'Detail for Opinion <span style="color: #909399">Positive ALL</span>'
  const tagData = []
  let showExpressionArr = []
  if (selectOpinionNum.value == 'all') {
    showExpressionArr = results.positiveOpinion
  } else {
    // ALL标签不能算在里面
    if (selectOpinionNum.value >= results.positiveOpinion.length - 1) {
      showExpressionArr = results.positiveOpinion
    } else {
      showExpressionArr = results.positiveOpinion.slice(0, selectOpinionNum.value + 1)
    }
  }
  showExpressionArr.forEach((item, index) => {
    tagData.push({
      title: item.label,
      count: item.count,
      type: genType(item.score),
      effect: index === currentOpinionIndex.value ? 'dark' : 'plain'
    })
  })
  results.showOpinion = tagData
  if (results.showOpinion.length > 0) {
    showDetail(results.showOpinion[0].title, results.showOpinion[0].count, 0)
  }
}

const updateNegativeOpinion = () => {
  detailTitle.value = 'Detail for Opinion <span style="color: #909399">Negative ALL</span>'
  const tagData = []
  let showExpressionArr = []
  if (selectOpinionNum.value == 'all') {
    showExpressionArr = results.negativeOpinion
  } else {
    // ALL标签不能算在里面
    if (selectOpinionNum.value >= results.negativeOpinion.length - 1) {
      showExpressionArr = results.negativeOpinion
    } else {
      showExpressionArr = results.negativeOpinion.slice(0, selectOpinionNum.value + 1)
    }
  }
  showExpressionArr.forEach((item, index) => {
    tagData.push({
      title: item.label,
      count: item.count,
      type: genType(item.score),
      effect: index === currentOpinionIndex.value ? 'dark' : 'plain'
    })
  })
  results.showOpinion = tagData
  if (results.showOpinion.length > 0) {
    showDetail(results.showOpinion[0].title, results.showOpinion[0].count, 0)
  }
}

const updateNeutralOpinion = () => {
  detailTitle.value = 'Detail for Opinion <span style="color: #909399">Neutral ALL</span>'
  const tagData = []
  let showExpressionArr = []
  if (selectOpinionNum.value == 'all') {
    showExpressionArr = results.neutralOpinion
  } else {
    // ALL标签不能算在里面
    if (selectOpinionNum.value >= results.neutralOpinion.length - 1) {
      showExpressionArr = results.neutralOpinion
    } else {
      showExpressionArr = results.neutralOpinion.slice(0, selectOpinionNum.value + 1)
    }
  }
  showExpressionArr.forEach((item, index) => {
    tagData.push({
      title: item.label,
      count: item.count,
      type: genType(item.score),
      effect: index === currentOpinionIndex.value ? 'dark' : 'plain'
    })
  })
  results.showOpinion = tagData
  if (results.showOpinion.length > 0) {
    showDetail(results.showOpinion[0].title, results.showOpinion[0].count, 0)
  }
}

// radio变化
const opinionRadioChange = () => {
  switch (opinionSelectRadio.value) {
    case 0:
      updateAllOpinion()
      break
    case 1:
      updatePositiveOpinion()
      break
    case 2:
      updateNegativeOpinion()
      break
    case 3:
      updateNeutralOpinion()
      break
    default:
      break
  }
}

// ------------------------------Category Analyse相关------------------------------
const showCategoryEmpty = ref(false) // 展示Category为空
const categoryNumShow = ref(false) // 是否展示top num选择框
const selectCategoryNum = ref(10) // 展示分类条数
const categoryRadioArr = ['Radar', 'Bar-Line', 'Quadrant'] // 头部radio选择器
const categorySelectRadio = ref(0) // 选择的radio label，默认all
const quadrantShow = ref(false) // 分栏图是否展示
const quadrantResult = reactive({
  quadrantExcellent: [],
  quadrantGood: [],
  quadrantCommon: [],
  quadrantBad: []
})
const showQuadrantExcellent = ref([])
const showQuadrantGood = ref([])
const showQuadrantCommon = ref([])
const showQuadrantBad = ref([])
const menuList = ref([]) // 左侧的小菜单
const currentMenuLabel = ref('ALL')
// 获取分类的色彩
const getCategoryColor = score => {
  switch (true) {
    case score >= 1 && score <= 2.4:
      return '#ff0000'
    case score > 2.4 && score < 3:
      return '#ffc000'
    case score >= 3 && score < 3.8:
      return '#92d050'
    case score >= 3.8 && score <= 5:
      return '#00b050'
    default:
      return '#909399'
  }
}

// 获取分类
const getCategory = async () => {
  loadingInstance = ElLoading.service({ target: document.getElementById('opinion'), lock: true, text: 'Loading' })
  // 执行搜索网络请求
  const resp = await proxy.$api.nlp.aspectScore({
    request_id: nanoid(),
    unified_id: select.value,
    aspect_category: ['ABSA_ALL'],
    date: {
      gte: date.startDate,
      lte: date.endDate
    }
  })
  // 请求出错
  if (typeof resp === 'string') {
    results.categoryRespDone = true
    // 两个请求完成才关闭加载
    if (results.categoryRespDone && results.opinionRespDone) {
      loadingInstance.close()
    }
    ElMessage.error(resp)
    return
  }
  const { ret_code, message, data } = resp.data
  if (ret_code === '0') {
    results.categoryRespDone = true
    // 两个请求完成才关闭加载
    if (results.categoryRespDone && results.opinionRespDone) {
      loadingInstance.close()
    }
    // 这里必须要先show出来
    showResult.value = true
    if (JSON.stringify(data.category_results) === '{}') {
      showCategoryEmpty.value = true
      categoryNumShow.value = false
      return
    }
    showCategoryEmpty.value = false
    categoryNumShow.value = true
    // 对category_results做处理并降序排序
    // categorySingleAll = { label: 'ALL', color: '#909399', total: data.overall_result.count_pos + data.overall_result.count_neg + data.overall_result.count_neu }
    const categoryArr = []
    quadrantResult.quadrantExcellent = []
    quadrantResult.quadrantGood = []
    quadrantResult.quadrantCommon = []
    quadrantResult.quadrantBad = []
    Object.keys(data.category_results).forEach(key => {
      let score = data.category_results[key].avg_total
      let item = {
        label: key,
        avg_total: score,
        count_total: data.category_results[key].count_neg + data.category_results[key].count_neu + data.category_results[key].count_pos
      }
      categoryArr.push(item)
      // 情感分类数据，这里就先不排序了
      switch (true) {
        case score >= 1 && score <= 2.4:
          quadrantResult.quadrantBad.push(item)
          break
        case score > 2.4 && score < 3:
          quadrantResult.quadrantCommon.push(item)
          break
        case score >= 3 && score < 3.8:
          quadrantResult.quadrantGood.push(item)
          break
        case score >= 3.8 && score <= 5:
          quadrantResult.quadrantExcellent.push(item)
          break
        default:
          break
      }
    })
    results.categoryResults = categoryArr.sort((obj1, obj2) => {
      const x = obj1.count_total
      const y = obj2.count_total
      if (x < y) {
        return 1
      } else if (x > y) {
        return -1
      } else {
        return 0
      }
    })
    // 更新雷达图
    nextTick(() => {
      updateRadar()
    })
  } else {
    results.categoryRespDone = true
    // 两个请求完成才关闭加载
    if (results.categoryRespDone && results.opinionRespDone) {
      loadingInstance.close()
    }
    ElMessage.error(message || 'get score failed')
  }
}

// 雷达图
const updateRadar = () => {
  const indicator = []
  const seriesDataValue = []
  let showCategoryArr = []
  if (selectCategoryNum.value == 'all') {
    showCategoryArr = results.categoryResults
  } else {
    const len = results.categoryResults.length
    if (selectCategoryNum.value >= len) {
      showCategoryArr = results.categoryResults
    } else {
      showCategoryArr = results.categoryResults.slice(0, selectCategoryNum.value)
    }
  }
  showCategoryArr.forEach(item => {
    // 给雷达图设置数量和颜色
    let name = item.label
    if (selectCategoryNum.value <= 15) {
      name = `${item.label}(${item.count_total})`
    }
    indicator.push({ name: name, max: 5, color: getCategoryColor(item.avg_total) })
    seriesDataValue.push(item.avg_total)
  })
  // console.log(indicator, seriesDataValue)
  let lengendItem = ''
  for (const item of results.games) {
    if (item.id == select.value) {
      lengendItem = item.name
      break
    }
  }
  // 切换数据的时候mCharts不展示问题以及多实例问题
  if (mCharts) {
    mCharts.dispose()
  }
  mCharts = proxy.$echarts.init(document.getElementById('aspect_score'))
  const option = {
    radar: {
      center: ['50%', '50%'],
      radius: '55%',
      indicator: indicator,
      // splitNumber: 3,
      axisLabel: {
        show: true,
        showMinLabel: false,
        showMaxLabel: true,
        // 隐藏重叠标签
        hideOverlap: true
      },
      axisTick: {
        show: true,
        length: 3
      }
      // axisName: {
      //   overflow: 'breakAll'
      // }
    },
    title: {
      text: 'Analyse game performance by different categories',
      textStyle: {
        fontSize: 15,
        // fontWeight: 'normal',
        color: '#909399'
      },
      textAlign: 'center',
      left: '50%',
      top: 30
    },
    legend: {
      data: [lengendItem],
      // orient: 'vertical',
      // right: 10,
      // top: 'center'
      bottom: 100
    },
    tooltip: {
      trigger: 'item',
      formatter: function () {
        const head = `
        <tr>
            <th style="padding: 1px 3px; text-align: center">category</th>
            <th style="padding: 1px 3px; text-align: center">frequency</th>
            <th style="padding: 1px 3px; text-align: center">avg_sentiment</th>
        </tr>`
        const bodyArr = showCategoryArr.map(item => {
          const color = getCategoryColor(item.avg_total)
          return `
          <tr>
            <td style="padding: 1px 3px; text-align: center; color: ${color}">${item.label}</td>
            <td style="padding: 1px 3px; text-align: center">${item.count_total}</td>
            <td style="padding: 1px 3px; text-align: center">${item.avg_total}</td>
          </tr>`
        })
        const body = bodyArr.join('')
        return `
        <table border="1" align="center" style="border-collapse: collapse; font-size: 10px">
          ${head}${body}
        </table>`
      },
      // 解决提示框太长被父元素截断的问题
      appendToBody: true
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            name: lengendItem,
            value: seriesDataValue
          }
        ]
      }
    ]
  }
  mCharts.setOption(option)
  // 左侧小菜单
  updateCategoryMenu(showCategoryArr)
}

// 柱状线性图
const updateBar = () => {
  // 获取数据
  const frequencyArr = []
  const avgSentimentArr = []
  const labelArr = []
  let showCategoryArr = []
  if (selectCategoryNum.value == 'all') {
    showCategoryArr = results.categoryResults
  } else {
    const len = results.categoryResults.length
    if (selectCategoryNum.value >= len) {
      showCategoryArr = results.categoryResults
    } else {
      showCategoryArr = results.categoryResults.slice(0, selectCategoryNum.value)
    }
  }
  showCategoryArr.forEach(item => {
    labelArr.push(item.label)
    frequencyArr.push(item.count_total)
    avgSentimentArr.push(item.avg_total)
  })
  // bar-line图表参数
  const barOption = {
    title: {
      text: 'HOk不同category情感分/频次表现',
      textAlign: 'center',
      left: '50%',
      textStyle: {
        fontWeight: 'normal',
        fontSize: 14
      }
    },
    legend: {
      data: ['frequency', 'avg_sentiment']
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    grid: {
      show: true,
      // 解决坐标系左边文字被隐藏掉了
      left: 100,
      right: 100,
      bottom: 280,
      top: 100
    },
    legend: {
      bottom: 100
    },
    xAxis: [
      {
        name: 'category',
        data: labelArr,
        type: 'category',
        axisPointer: {
          type: 'shadow'
        },
        nameTextStyle: {
          color: '#303133',
          fontStyle: 'italic',
          fontSize: 13,
          padding: 5
        },
        nameLocation: 'start',
        nameGap: 30,
        axisTick: {
          alignWithLabel: true,
          interval: 0
        },
        axisLabel: {
          rotate: 45,
          margin: 10
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: 'frequency',
        nameTextStyle: {
          color: '#303133',
          fontStyle: 'italic',
          fontSize: 13,
          padding: 5
        },
        // 是否显示坐标轴轴线
        // axisLine: { show: true },
        // 是否显示坐标轴分隔线
        splitLine: { show: false }
      },
      {
        type: 'value',
        name: 'avg_sentiment',
        nameTextStyle: {
          color: '#303133',
          fontStyle: 'italic',
          fontSize: 13,
          padding: 5
        },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: 'frequency',
        type: 'bar',
        yAxisIndex: 0,
        barWidth: '15%',
        data: frequencyArr,
        label: {
          show: true,
          position: 'top'
        }
      },
      {
        name: 'avg_sentiment',
        type: 'line',
        yAxisIndex: 1,
        data: avgSentimentArr,
        label: {
          show: true
        },
        // 标记线
        markLine: {
          data: [
            {
              name: 'nagative',
              yAxis: 2.6
            },
            {
              name: 'positive',
              yAxis: 3.5
            }
          ],
          label: {
            // position: 'middle',
            formatter: '{c}({b})'
          },
          lineStyle: {
            color: '#E6A23C'
          }
        }
      }
    ]
  }
  if (mCharts) {
    mCharts.dispose()
  }
  mCharts = proxy.$echarts.init(document.getElementById('aspect_score'))
  mCharts.setOption(barOption)
  // 左侧小菜单
  updateCategoryMenu(showCategoryArr)
}

// echart尺寸改变
const chartAdapter = () => {
  if (mCharts) {
    mCharts.resize()
  }
}

// 分栏图
const updateQuadrant = () => {
  // 排序
  quadrantResult.quadrantExcellent = quadrantResult.quadrantExcellent.sort((obj1, obj2) => {
    const x = obj1.count_total
    const y = obj2.count_total
    if (x < y) {
      return 1
    } else if (x > y) {
      return -1
    } else {
      return 0
    }
  })
  quadrantResult.quadrantGood = quadrantResult.quadrantGood.sort((obj1, obj2) => {
    const x = obj1.count_total
    const y = obj2.count_total
    if (x < y) {
      return 1
    } else if (x > y) {
      return -1
    } else {
      return 0
    }
  })
  quadrantResult.quadrantCommon = quadrantResult.quadrantCommon.sort((obj1, obj2) => {
    const x = obj1.count_total
    const y = obj2.count_total
    if (x < y) {
      return 1
    } else if (x > y) {
      return -1
    } else {
      return 0
    }
  })
  quadrantResult.quadrantBad = quadrantResult.quadrantBad.sort((obj1, obj2) => {
    const x = obj1.count_total
    const y = obj2.count_total
    if (x < y) {
      return 1
    } else if (x > y) {
      return -1
    } else {
      return 0
    }
  })
  if (selectCategoryNum.value == 'all') {
    showQuadrantExcellent.value = quadrantResult.quadrantExcellent
    showQuadrantGood.value = quadrantResult.quadrantGood
    showQuadrantCommon.value = quadrantResult.quadrantCommon
    showQuadrantBad.value = quadrantResult.quadrantBad
  } else {
    if (selectCategoryNum.value >= quadrantResult.quadrantExcellent.length) {
      showQuadrantExcellent.value = quadrantResult.quadrantExcellent
    } else {
      showQuadrantExcellent.value = quadrantResult.quadrantExcellent.slice(0, selectCategoryNum.value)
    }
    //
    if (selectCategoryNum.value >= quadrantResult.quadrantGood.length) {
      showQuadrantGood.value = quadrantResult.quadrantGood
    } else {
      showQuadrantGood.value = quadrantResult.quadrantGood.slice(0, selectCategoryNum.value)
    }
    //
    if (selectCategoryNum.value >= quadrantResult.quadrantCommon.length) {
      showQuadrantCommon.value = quadrantResult.quadrantCommon
    } else {
      showQuadrantCommon.value = quadrantResult.quadrantCommon.slice(0, selectCategoryNum.value)
    }
    //
    if (selectCategoryNum.value >= quadrantResult.quadrantBad.length) {
      showQuadrantBad.value = quadrantResult.quadrantBad
    } else {
      showQuadrantBad.value = quadrantResult.quadrantBad.slice(0, selectCategoryNum.value)
    }
  }
  // 添加judge
  showQuadrantExcellent.value.forEach(item => {
    item.judge = '表现优异'
  })
  showQuadrantGood.value.forEach(item => {
    item.judge = '表现不错'
  })
  showQuadrantCommon.value.forEach(item => {
    item.judge = '表现稍有不⾜'
  })
  showQuadrantBad.value.forEach(item => {
    item.judge = '需提升'
  })
}

// category radio 点击修改时
const categoryRadioChange = () => {
  // 雷达图
  if (categorySelectRadio.value == 0) {
    quadrantShow.value = false
    nextTick(() => {
      updateRadar()
    })
  } else if (categorySelectRadio.value == 1) {
    quadrantShow.value = false
    nextTick(() => {
      updateBar()
    })
  } else {
    quadrantShow.value = true
    updateQuadrant()
  }
}

// 设置表格的单元格合并
const objectSpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  // 只合并第一列budget
  if (columnIndex === 0) {
    if (rowIndex === 0) {
      return {
        rowspan: results.categoryResults.length,
        colspan: 1
      }
    }
    return {
      rowspan: 0,
      colspan: 0
    }
  }
}

// 设置表格的单元格样式
const excellentCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    return {
      color: '#000',
      backgroundColor: '#00b050'
    }
  }
}
const goodCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    return {
      color: '#000',
      backgroundColor: '#92d050'
    }
  }
}
const commonCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    return {
      color: '#000',
      backgroundColor: '#ffc000'
    }
  }
}
const badCellStyle = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    return {
      color: '#000',
      backgroundColor: '#ff0000'
    }
  }
}

// 展示左侧菜单列表
const updateCategoryMenu = showCategoryArr => {
  const showList = []
  // 先添加所有的那一条菜单
  showList.push({ label: 'ALL', color: '#909399' })
  showCategoryArr.forEach(item => {
    showList.push({ label: item.label, color: getCategoryColor(item.avg_total) })
  })
  menuList.value = showList
}

// 小菜单的背景色，点击后需要加背景色
const menuStyle = (label, color) => {
  if (label === currentMenuLabel.value) {
    return {
      color: color,
      backgroundColor: '#e9e9eb'
    }
  }
  return {
    color: color
  }
}

// ------------------------------右边Detail for Opinion相关------------------------------
const showDetailResult = ref(false) // 是否展示明细部分
const detailTitle = ref('Detail for Opinion')
const queryInfo = reactive({
  total: 0,
  pagesize: 7,
  pagenum: 1,
  opinion_expression: [],
  aspect_category: []
})
const detailLoading = ref(false)

// 展示多余的评论
const showRest = index => {
  results.details[index].content = results.details[index].longContent
  delete results.details[index].longContent
}

// 绑定原始点击事件
const addOriginalClick = () => {
  const spans = document.getElementsByClassName('detail-more')
  for (const span of spans) {
    const index = parseInt(span.title)
    span.onclick = function () {
      showRest(index)
    }
  }
}

// 获取印象评分细节
const getDetail = async () => {
  detailLoading.value = true
  const resp = await proxy.$api.nlp.contentDetail({
    request_id: nanoid(),
    unified_id: select.value,
    opinion_expression: queryInfo.opinion_expression,
    aspect_category: queryInfo.aspect_category,
    date: {
      gte: date.startDate,
      lte: date.endDate
    },
    argv: {
      limit: queryInfo.pagesize,
      offset: (queryInfo.pagenum - 1) * queryInfo.pagesize
    }
  })
  detailLoading.value = false
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message, data } = resp.data
  if (ret_code === '0') {
    results.details = data.results.map((item, index) => {
      const content = item.content
      const aspect_term = item.aspect_term
      const opinion_term = item.opinion_term
      let aspect_term_index, opinion_term_index
      const handeleObj = {}
      const aspectRe = new RegExp(aspect_term, 'i')
      const opinionRe = new RegExp(opinion_term, 'i')
      let originalAspectText = ''
      let originalopinionText = ''
      if (aspect_term) {
        aspect_term_index = content.search(aspectRe)
        if (aspect_term_index !== -1) {
          handeleObj['aspect_term_index'] = aspect_term_index
          originalAspectText = content.slice(aspect_term_index, aspect_term_index + aspect_term.length)
        }
      }
      if (opinion_term) {
        opinion_term_index = content.search(opinionRe)
        if (opinion_term_index !== -1) {
          handeleObj['opinion_term_index'] = opinion_term_index
          originalopinionText = content.slice(opinion_term_index, opinion_term_index + opinion_term.length)
        }
      }
      if (Object.keys(handeleObj).length === 2) {
        // 如果aspect_term和opinion_term有交叉，都以aspect_term为主
        if (
          (aspect_term_index >= opinion_term_index && aspect_term_index <= opinion_term_index + opinion_term.length) ||
          (opinion_term_index >= aspect_term_index && opinion_term_index <= aspect_term_index + aspect_term.length)
        ) {
          delete handeleObj['opinion_term_index']
        }
      }
      if (content.length > 250) {
        let shortContent = content.slice(0, 250)
        let longContent = content
        Object.keys(handeleObj).forEach(key => {
          if (key == 'aspect_term_index') {
            shortContent = shortContent.replace(aspectRe, `<span style="background-color: #f3d19e">${originalAspectText}</span>`)
            longContent = longContent.replace(aspectRe, `<span style="background-color: #f3d19e">${originalAspectText}</span>`)
          } else if (key == 'opinion_term_index') {
            shortContent = shortContent.replace(opinionRe, `<span style="background-color: #b3e19d">${originalopinionText}</span>`)
            longContent = longContent.replace(opinionRe, `<span style="background-color: #b3e19d">${originalopinionText}</span>`)
          }
        })
        shortContent += `<span style="cursor: pointer; color: #409eff; font-size: 12px" class="detail-more" title="${index}">>>more</span>`
        return {
          insert_time: fomartTime(item.insert_time),
          content: shortContent,
          longContent: longContent,
          sentiment_score: item.sentiment_score
        }
      }
      let longContent = content
      Object.keys(handeleObj).forEach(key => {
        if (key == 'aspect_term_index') {
          longContent = longContent.replace(aspectRe, `<span style="background-color: #f3d19e">${originalAspectText}</span>`)
        } else if (key == 'opinion_term_index') {
          longContent = longContent.replace(opinionRe, `<span style="background-color: #b3e19d">${originalopinionText}</span>`)
        }
      })
      return {
        insert_time: fomartTime(item.insert_time),
        content: longContent,
        sentiment_score: item.sentiment_score
      }
    })
    nextTick(() => {
      addOriginalClick()
    })
  } else {
    ElMessage.error(message || 'get detail failed')
  }
}

// 点击某个opinion展示detail
const showDetail = (title, count, index, type = '') => {
  // 其余变透明
  for (let i in results.showOpinion) {
    if (i == index) {
      results.showOpinion[i].effect = 'dark'
    } else {
      if (results.showOpinion[i].effect !== 'plain') {
        results.showOpinion[i].effect = 'plain'
      }
    }
  }
  // 发送detail请求
  // detailTitle.value = 'Opinion Expression Detail'
  queryInfo.pagenum = 1
  if (title === 'ALL') {
    switch (opinionSelectRadio.value) {
      case 0:
        queryInfo.opinion_expression = ['ABSA_ALL']
        break
      case 1:
        queryInfo.opinion_expression = results.positiveExpression
        break
      case 2:
        queryInfo.opinion_expression = results.negativeExpression
        break
      case 3:
        queryInfo.opinion_expression = results.neutralExpression
        break
      default:
        queryInfo.opinion_expression = []
        break
    }
  } else {
    queryInfo.opinion_expression = [title]
  }
  // 分类category
  if (currentMenuLabel.value === 'ALL') {
    queryInfo.aspect_category = ['ABSA_ALL']
  } else {
    queryInfo.aspect_category = [currentMenuLabel.value]
  }
  queryInfo.total = count
  // 查询明细
  getDetail()
  showDetailResult.value = true
  currentOpinionIndex.value = index
  // 根据type detail标签变色
  if (type) {
    let detailColor = ''
    switch (type) {
      case 'info':
        detailColor = '#909399'
        break
      case 'success':
        detailColor = '#67C23A'
        break
      case 'danger':
        detailColor = '#F56C6C'
        break
      case 'warning':
        detailColor = '#E6A23C'
        break
      default:
        detailColor = '#909399'
        break
    }
    detailTitle.value = `Detail for Opinion <span style="color: ${detailColor}">${title}</span>`
  }
}

// 点击category小菜单，展示的category
const showDetailByCategory = (title, color) => {
  currentMenuLabel.value = title
  if (title === 'ALL') {
    opinionTitle.value = `Opinion for Category <span style="color: ${color}">ALL</span>`
    extraOpinionParams.aspect_category = ['ABSA_ALL']
  } else {
    opinionTitle.value = `Opinion for Category <span style="color: ${color}">${title}</span>`
    extraOpinionParams.aspect_category = [title]
  }
  // 查询明细
  opinionSelectRadio.value = 0
  currentOpinionIndex.value = 0
  getOpinion()
  showDetailResult.value = true
}

// 修改页码detail
const currentChange = currentPage => {
  queryInfo.pagenum = currentPage
  getDetail()
}

// 修改每页显示的detail
const handleSizeChange = page => {
  queryInfo.pagenum = 1
  queryInfo.pagesize = page
  getDetail()
}

// ------------------------------生命周期函数或者主方法------------------------------
// 点击搜索
const search = () => {
  categoryListShow.value = false //  菜单隐藏
  results.categoryRespDone = false
  results.opinionRespDone = false
  selectCategoryNum.value = 10
  selectOpinionNum.value = 10
  currentOpinionIndex.value = 0
  currentMenuLabel.value = 'ALL'
  opinionSelectRadio.value = 0
  categorySelectRadio.value = 0
  quadrantShow.value = false
  getCategory()
  getOpinion()
}

onBeforeMount(() => {
  getCurrentDate()
})

onMounted(() => {
  getBusiness()
  // 监听windows不够，左侧菜单收缩windows大小没有变化，图形也不会resize
  resizeObserver = new ResizeObserver(chartAdapter)
  resizeObserver.observe(document.getElementById('opinion'))
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
  if (mCharts) {
    mCharts.dispose()
  }
})
</script>

<style lang="less" scoped>
.expression-detail {
  height: 800px;
  margin-top: 15px;
  position: relative;
  p {
    font-family: PingFang SC;
    font-size: 13px;
  }
  .detail-item {
    text-align: right;
    span {
      color: #909399;
      padding: 0 3px;
      font-size: 12px;
    }
  }
}

.el-select {
  margin-right: 10px;
  margin-top: -5px;
}

.el-button {
  margin-top: -5px;
  margin-left: 10px;
  height: 38px;
}

.search-header {
  margin-top: 15px;
  vertical-align: middle;
}

.picker {
  display: inline-block;
  margin-top: 18px;
}
h5 {
  margin: 0;
}

.opinion-expression {
  display: inline-block;
}

.show-num {
  display: flex;
  justify-content: space-between;
  span {
    font-size: 12px;
    margin-right: 3px;
    color: #909399;
  }
}

.detail-header {
  display: flex;
  justify-content: space-between;
}

.pagination-box {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
}

.category-menu {
  position: absolute;
  top: 60px;
  right: 0;
  background-color: #dedfe0;
  width: 20px;
  height: 22px;
  opacity: 0.5;
  cursor: pointer;
  z-index: 10;
}

.category-list {
  position: absolute;
  top: 82px;
  right: 0;
  max-width: 200px;
  max-height: 400px;
  background-color: #fff;
  border: 1px solid #dedfe0;
  border-radius: 5px 0 0 5px;
  border-right: none;
  overflow: auto;
  z-index: 10;
  ul {
    padding: 5px;
    font-size: 13px;
    li {
      padding: 3px;
      cursor: pointer;
    }
  }
}
</style>
