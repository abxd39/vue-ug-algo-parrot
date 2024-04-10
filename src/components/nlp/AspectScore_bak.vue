<template>
  <Introduction>To summarize game topics to normalized expression from reviews.</Introduction>
  <div class="asset">
    <el-select v-model="select" placeholder="Select Game" size="large">
      <el-option v-for="item in results.games" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>
    <el-date-picker v-model="date.dateArr" type="daterange" range-separator="To" start-placeholder="Start date" end-placeholder="End date" @change="dateChange" size="large" :clearable="false" />
    <el-button type="primary" class="my-button" @click="search">Search</el-button>
  </div>
  <div v-show="showResult">
    <el-row :gutter="15">
      <el-col :span="12">
        <el-row class="asset">
          <el-col>
            <el-card shadow="never" :body-style="{ height: '200px', overflow: 'auto' }">
              <div class="show-num">
                <div>
                  <h5 class="opinion-expression">Opinion Expression</h5>
                  <el-popover placement="right" title="Color Description" :width="200" trigger="click">
                    <template #reference>
                      <el-icon color="#c8c9cc" :size="14" style="margin-left: 5px"><QuestionFilled /></el-icon>
                    </template>
                    <template #default>
                      <div style="font-size: 12px">
                        <span style="width: 8px; height: 8px; background-color: #67c23a; display: inline-block"></span>
                        sentiment_score &gt; 3.8
                      </div>
                      <div style="font-size: 12px">
                        <span style="width: 8px; height: 8px; background-color: #f56c6c; display: inline-block"></span>
                        sentiment_score &lt; 2.4
                      </div>
                      <div style="font-size: 12px">
                        <span style="width: 8px; height: 8px; background-color: #909399; display: inline-block"></span>
                        rest
                      </div>
                    </template>
                  </el-popover>
                </div>
                <div v-show="selectExpressionShow">
                  <span>select top num</span>
                  <el-select v-model="selectExpression" size="small" @change="selectExpressionChange">
                    <el-option v-for="(item, index) in showNum" :key="index" :label="item.label" :value="item.value" />
                  </el-select>
                </div>
              </div>
              <el-divider />
              <el-tag
                v-for="(item, index) in results.expressions"
                :key="index"
                :type="item.type"
                :effect="item.effect"
                round
                size="large"
                @click="showDetail(item.title, item.count, index)"
                style="cursor: pointer"
              >
                {{ item.title }}({{ item.count }})
              </el-tag>
              <el-empty :image-size="30" v-show="showExpressionEmpty" />
            </el-card>
          </el-col>
        </el-row>
        <el-row class="asset">
          <el-col>
            <el-card shadow="never" :body-style="{ height: '545px', padding: 0 }">
              <div style="padding: 20px 20px 0">
                <div class="show-num">
                  <h5>Category Analyse</h5>
                  <div v-show="selectCategoryShow">
                    <span>select top num</span>
                    <el-select v-model="selectCategory" size="small" @change="selectCategoryChange">
                      <el-option v-for="(item, index) in showNum" :key="index" :label="item.label" :value="item.value" />
                    </el-select>
                  </div>
                </div>
                <el-divider />
              </div>
              <el-empty :image-size="120" v-if="showScoreEmpty" />
              <div id="aspect_score" style="height: 100%; width: 100%" v-else></div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
      <!-- 明细 -->
      <el-col :span="12">
        <el-card v-show="showDetailResult" class="expression-detail" shadow="never">
          <!-- <div style="text-align: center"><h5>Expression Detail</h5></div> -->
          <div class="detail-header">
            <h5>Expression Detail</h5>
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
  </div>
</template>

<script setup>
import Introduction from '@/components/introduction/Introduction.vue'

import { ref, reactive, getCurrentInstance, onMounted, onBeforeUnmount, onBeforeMount, nextTick } from 'vue'
import { nanoid } from 'nanoid'

import { formatDate } from '@/utils/common_utils'

let mCharts, loadingInstance, resizeObserver
const { proxy } = getCurrentInstance()
const select = ref('')
const showResult = ref(false)
const showDetailResult = ref(false)
// 展示雷达图为空
const showScoreEmpty = ref(false)
// 展示印象为空
const showExpressionEmpty = ref(false)
const results = reactive({
  games: [],
  categoryResults: [],
  // 分类是否响应成功
  categoryResultsDone: false,
  allExpressions: [],
  expressions: [],
  // 印象是否响应成功
  expressionsDone: false,
  details: []
})
const date = reactive({
  dateArr: [],
  startDate: '',
  endDate: ''
})
const queryInfo = reactive({
  total: 0,
  pagesize: 7,
  pagenum: 1,
  opinion_expression: ''
})

// 雷达图展示top条数
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
const selectCategory = ref(10)
const selectExpression = ref(10)
const selectCategoryChange = () => {
  updateRadar()
}
const selectExpressionChange = () => {
  updateOpinionExpression()
}
const selectCategoryShow = ref(false)
const selectExpressionShow = ref(false)
// 评论的index
const currentDetailIndex = ref()
// 展示多余的评论
const showRest = index => {
  results.details[index].content = results.details[index].longContent
  delete results.details[index].longContent
}

// 获取业务列表信息
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
      getAspectScore()
      getOpinionExpression()
    }
  } else {
    ElMessage.error(ret_msg || 'get rainbow data failed')
  }
}

// 获取印象评分
const getAspectScore = async () => {
  loadingInstance = ElLoading.service({ target: document.getElementById('opinion'), lock: true, text: 'Loading' })
  // 执行搜索网络请求
  const resp = await proxy.$api.nlp.aspectScore({
    request_id: nanoid(),
    unified_id: select.value,
    date: {
      gte: date.startDate,
      lte: date.endDate
    }
  })
  // 请求出错
  if (typeof resp === 'string') {
    results.categoryResultsDone = true
    // 两个请求完成才关闭加载
    if (results.categoryResultsDone && results.expressionsDone) {
      loadingInstance.close()
    }
    ElMessage.error(resp)
    return
  }
  const { ret_code, message, data } = resp.data
  if (ret_code === '0') {
    results.categoryResultsDone = true
    // 两个请求完成才关闭加载
    if (results.categoryResultsDone && results.expressionsDone) {
      loadingInstance.close()
    }
    // 这里必须要先show出来
    showResult.value = true
    if (JSON.stringify(data.category_results) === '{}') {
      showScoreEmpty.value = true
      selectCategoryShow.value = false
      return
    }
    showScoreEmpty.value = false
    selectCategoryShow.value = true
    // 对category_results做处理并降序排序
    const categoryArr = []
    Object.keys(data.category_results).forEach(key => {
      categoryArr.push({
        label: key,
        avg_total: data.category_results[key].avg_total,
        count_total: data.category_results[key].count_neg + data.category_results[key].count_neu + data.category_results[key].count_pos
      })
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
    results.categoryResultsDone = true
    // 两个请求完成才关闭加载
    if (results.categoryResultsDone && results.expressionsDone) {
      loadingInstance.close()
    }
    ElMessage.error(message || 'get score failed')
  }
}

const genType = num => {
  if (num > 3.8) {
    return 'success'
  } else if (num < 2.4) {
    return 'danger'
  } else {
    return 'info'
  }
}

// 处理数据库返回的时间, 2022-11-14T22:01:11+08:00
const fomartTime = timeStr => {
  const timeArr = timeStr.split('T')
  const formatTimeArr = [timeArr[0], timeArr[1].split('+')[0]]
  return formatTimeArr.join(' ')
}

// 获取大家印象
const getOpinionExpression = async () => {
  // 请求之前把detail清掉
  showDetailResult.value = false
  results.details = []
  const resp = await proxy.$api.nlp.opinionExpression({
    request_id: nanoid(),
    unified_id: select.value,
    date: {
      gte: date.startDate,
      lte: date.endDate
    }
  })
  // 请求出错
  if (typeof resp === 'string') {
    results.expressionsDone = true
    // 两个请求完成才关闭加载
    if (results.categoryResultsDone && results.expressionsDone) {
      loadingInstance.close()
    }
    ElMessage.error(resp)
    return
  }
  const { ret_code, message, data } = resp.data
  if (ret_code === '0') {
    results.expressionsDone = true
    // 两个请求完成才关闭加载
    if (results.categoryResultsDone && results.expressionsDone) {
      loadingInstance.close()
    }
    if (data === null || JSON.stringify(data) === '{}' || JSON.stringify(data.results) === '{}') {
      results.expressions = []
      showExpressionEmpty.value = true
      selectExpressionShow.value = false
      return
    }
    showExpressionEmpty.value = false
    selectExpressionShow.value = true
    // results降序排序
    const tempResults = []
    Object.keys(data.results).forEach(key => {
      tempResults.push({
        label: key,
        count: data.results[key].count,
        score: data.results[key].sentiment_score
      })
    })
    results.allExpressions = tempResults.sort((obj1, obj2) => {
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
    updateOpinionExpression()
    if (results.expressions.length > 0) {
      showDetail(results.expressions[0].title, results.expressions[0].count, 0)
    }
  } else {
    results.expressionsDone = true
    // 两个请求完成才关闭加载
    if (results.categoryResultsDone && results.expressionsDone) {
      loadingInstance.close()
    }
    ElMessage.error(message || 'get expression failed')
  }
}

const updateOpinionExpression = () => {
  const tagData = []
  let showExpressionArr = []
  if (selectExpression.value == 'all') {
    showExpressionArr = results.allExpressions
  } else {
    if (selectExpression.value >= results.allExpressions.length) {
      showExpressionArr = results.allExpressions
    } else {
      showExpressionArr = results.allExpressions.slice(0, selectExpression.value)
    }
  }
  showExpressionArr.forEach((item, index) => {
    tagData.push({
      title: item.label,
      count: item.count,
      type: genType(item.score),
      effect: index === currentDetailIndex.value ? 'dark' : 'plain'
    })
  })
  results.expressions = tagData
}

// 获取印象评分细节
const getContentDetail = async () => {
  const resp = await proxy.$api.nlp.contentDetail({
    request_id: nanoid(),
    unified_id: select.value,
    opinion_expression: queryInfo.opinion_expression,
    date: {
      gte: date.startDate,
      lte: date.endDate
    },
    argv: {
      limit: queryInfo.pagesize,
      offset: (queryInfo.pagenum - 1) * queryInfo.pagesize
    }
  })
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

// 雷达图
const updateRadar = () => {
  const indicator = []
  const seriesDataValue = []
  let showCategoryArr = []
  if (selectCategory.value == 'all') {
    showCategoryArr = results.categoryResults
  } else {
    const len = results.categoryResults.length
    if (selectCategory.value >= len) {
      showCategoryArr = results.categoryResults
    } else {
      showCategoryArr = results.categoryResults.slice(0, selectCategory.value)
    }
  }
  showCategoryArr.forEach(item => {
    indicator.push({ name: item.label, max: 5 })
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
      center: ['50%', '42%'],
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
        fontSize: 12,
        fontWeight: 'normal',
        color: '#909399'
      },
      textAlign: 'center',
      left: '50%',
      top: 0
    },
    legend: {
      data: [lengendItem],
      // orient: 'vertical',
      // right: 10,
      // top: 'center'
      bottom: 80
    },
    tooltip: {
      trigger: 'item'
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
}

// echart尺寸改变
const chartAdapter = () => {
  if (mCharts) {
    mCharts.resize()
  }
}

// data改变
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

// 搜索
const search = () => {
  results.categoryResultsDone = false
  results.expressionsDone = false
  selectCategory.value = 10
  selectExpression.value = 10
  currentDetailIndex.value = ''
  getAspectScore()
  getOpinionExpression()
}

// 展示细节
const showDetail = (title, count, index) => {
  queryInfo.pagenum = 1
  // 其余变透明
  for (let i in results.expressions) {
    if (i == index) {
      results.expressions[i].effect = 'dark'
    } else {
      if (results.expressions[i].effect !== 'plain') {
        results.expressions[i].effect = 'plain'
      }
    }
  }
  queryInfo.opinion_expression = title
  queryInfo.total = count
  // 查询明细
  getContentDetail()
  showDetailResult.value = true
  currentDetailIndex.value = index
}

// 修改页码
const currentChange = currentPage => {
  queryInfo.pagenum = currentPage
  getContentDetail()
}
const handleSizeChange = page => {
  queryInfo.pagenum = 1
  queryInfo.pagesize = page
  getContentDetail()
}

onBeforeMount(() => {
  getCurrentDate()
})

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
</style>
