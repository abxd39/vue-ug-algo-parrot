<template>
  <Breadcrumb />
  <div class="outer-box" id="associated">
    <Introduction>
      The Correlative Keyword (CK) is a flexible and efficient foundation tool in public opinion discovery of the game domain. Through it, the game operations are able to understand the most concerned
      things in the game community from multiple perspectives. For example, one can observe the highly mentioned keywords and CKs under different part-of-speech (or other conditions) from General
      Search for knowing the hottest events (sometimes needing to cooperate with the comments and sentiment distribution for detail). In addition, Periodic Statistics presents some key statistics of
      different keywords, keyword pairs, and keyword triplets, from which we can know the dynamic variation of the most concerned things in the game community. Moreover, Network Visualization
      describes more complex and comprehensive correlations, i.e., multi-hop correlations, among more keywords through graphs. To be honest, the CK can not directly provide detailed, informative
      insights, but it is flexible for finding insights into different aspects from different perspectives.
    </Introduction>
    <div style="margin-top: 20px; padding-bottom: 5px">
      <span style="padding-right: 5px">Game:</span>
      <el-select v-model="game" placeholder="Select Game" @change="gameChange">
        <el-option v-for="item in games" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <el-divider content-position="center">General Search</el-divider>
    <div style="margin-top: 30px"></div>
    <div class="asset">
      <div style="display: flex; justify-content: space-between">
        <div>
          <span style="padding-right: 5px">Language:</span>
          <el-select v-model="lang" placeholder="Select Language" size="large">
            <el-option v-for="item in langs" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span style="padding-left: 20px; padding-right: 5px">Date:</span>
          <el-date-picker
            v-model="keywordDate.dateArr"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            @change="keywordDateChange"
            size="large"
            :clearable="false"
          />
          <el-button type="primary" @click="searchPart1" :disabled="disabledSearch1">Search</el-button>
        </div>
        <div>
          <el-select v-model="translationPart1" placeholder="Select Translation" size="small" style="width: 100px">
            <el-option v-for="item in translationArr" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <el-row :gutter="15" class="asset">
        <el-col :span="5">
          <el-card shadow="never" :body-style="{ height: '650px', overflow: 'auto' }">
            <h5 style="margin: 0">Anchor Words<span style="font-weight: normal; padding-left: 5px; color: #909399">(top 50)</span></h5>
            <el-divider />
            <div style="font-size: 14px; margin-bottom: 5px">Part-of-speech:</div>
            <el-radio-group v-model="firstSpeech" @change="firstSpeechChange">
              <el-radio v-for="item in speechArr" :label="item" size="small" :key="item">{{ item }}</el-radio>
            </el-radio-group>
            <el-divider />
            <div v-if="firstWords.length > 0">
              <span v-for="(item, index) in firstWords" :key="index">
                <el-tag v-if="translationPart1 == 'ori'" round :effect="item.effect ? item.effect : 'plain'" @click="clickFirstWord(item.word, index)">{{ item.word + `(${item.count})` }}</el-tag>
                <el-tag v-else-if="translationPart1 == 'en'" round :effect="item.effect ? item.effect : 'plain'" @click="clickFirstWord(item.word, index)">{{
                  item.word_to_en + `(${item.count})`
                }}</el-tag>
                <el-tag v-else round :effect="item.effect ? item.effect : 'plain'" @click="clickFirstWord(item.word, index)">{{ item.word_to_zh + `(${item.count})` }}</el-tag>
              </span>
            </div>
            <div v-else>
              <el-empty :image-size="100" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card shadow="never" :body-style="{ height: '650px', overflow: 'auto' }">
            <h5 style="margin: 0">First Correlation Words<span style="font-weight: normal; padding-left: 5px; color: #909399">(top 50)</span></h5>
            <el-divider />
            <div style="font-size: 14px; margin-bottom: 5px">Part-of-speech:</div>
            <el-radio-group v-model="secondSpeech" @change="secondOptionChange">
              <el-radio v-for="item in speechArr" :label="item" size="small" :key="item">{{ item }}</el-radio>
            </el-radio-group>
            <div style="font-size: 14px; margin-bottom: 5px">
              Distance:
              <el-radio-group v-model="secondDistance" @change="secondOptionChange">
                <el-radio v-for="item in distanceArr" :label="item" size="small" :key="item">{{ item }}</el-radio>
              </el-radio-group>
            </div>
            <div style="font-size: 14px; margin-bottom: 5px">
              Position:
              <el-radio-group v-model="secondPosition" @change="secondOptionChange">
                <el-radio v-for="item in positionArr" :label="item" size="small" :key="item">{{ item }}</el-radio>
              </el-radio-group>
            </div>
            <el-divider />
            <div v-if="secondWords.length > 0">
              <span v-for="(item, index) in secondWords" :key="index">
                <el-tag v-if="translationPart1 == 'ori'" round type="success" :effect="item.effect ? item.effect : 'plain'" @click="clickSecondWord(item.head, item.tail, index)">{{
                  item.head + ',' + item.tail + `(${item.count})`
                }}</el-tag>
                <el-tag v-else-if="translationPart1 == 'en'" round type="success" :effect="item.effect ? item.effect : 'plain'" @click="clickSecondWord(item.head, item.tail, index)">{{
                  item.head_to_en + ',' + item.tail_to_en + `(${item.count})`
                }}</el-tag>
                <el-tag v-else round type="success" :effect="item.effect ? item.effect : 'plain'" @click="clickSecondWord(item.head, item.tail, index)">{{
                  item.head_to_zh + ',' + item.tail_to_zh + `(${item.count})`
                }}</el-tag>
              </span>
            </div>
            <div v-else>
              <el-empty :image-size="100" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="5">
          <el-card shadow="never" :body-style="{ height: '650px', overflow: 'auto' }">
            <h5 style="margin: 0">Second Correlation Words<span style="font-weight: normal; padding-left: 5px; color: #909399">(top 50)</span></h5>
            <el-divider />
            <div style="font-size: 14px; margin-bottom: 5px">Part-of-speech:</div>
            <el-radio-group v-model="thirdSpeech" @change="thirdOptionChange">
              <el-radio v-for="item in speechArr" :label="item" size="small" :key="item">{{ item }}</el-radio>
            </el-radio-group>
            <div style="font-size: 14px; margin-bottom: 5px">
              Distance:
              <el-radio-group v-model="thirdDistance" @change="thirdOptionChange">
                <el-radio v-for="item in distanceArr" :label="item" size="small" :key="item">{{ item }}</el-radio>
              </el-radio-group>
            </div>
            <div style="font-size: 14px; margin-bottom: 5px">
              Position:
              <el-radio-group v-model="thirdPosition" @change="thirdOptionChange">
                <el-radio v-for="item in positionArr" :label="item" size="small" :key="item">{{ item }}</el-radio>
              </el-radio-group>
            </div>
            <el-divider />
            <div v-if="thirdWords.length > 0">
              <span v-for="(item, index) in thirdWords" :key="index">
                <el-tag v-if="translationPart1 == 'ori'" round type="warning" :effect="item.effect ? item.effect : 'plain'" @click="clickThirdWord(item.one, item.two, item.three, index)">{{
                  item.one + ',' + item.two + ',' + item.three + `(${item.count})`
                }}</el-tag>
                <el-tag v-else-if="translationPart1 == 'en'" round type="warning" :effect="item.effect ? item.effect : 'plain'" @click="clickThirdWord(item.one, item.two, item.three, index)">{{
                  item.one_to_en + ',' + item.two_to_en + ',' + item.three_to_en + `(${item.count})`
                }}</el-tag>
                <el-tag v-else round type="warning" :effect="item.effect ? item.effect : 'plain'" @click="clickThirdWord(item.one, item.two, item.three, index)">{{
                  item.one_to_zh + ',' + item.two_to_zh + ',' + item.three_to_zh + `(${item.count})`
                }}</el-tag>
              </span>
            </div>
            <div v-else>
              <el-empty :image-size="100" />
            </div>
          </el-card>
        </el-col>
        <el-col :span="9">
          <el-row>
            <el-col>
              <el-card shadow="never" :body-style="{ height: '393px', overflow: 'auto', position: 'relative' }">
                <h5 style="margin: 0">Comments</h5>
                <el-divider />
                <div v-if="comments.length > 0">
                  <div style="overflow: auto; height: 345px">
                    <div v-for="(item, index) in pageComments" :key="index">
                      <p v-if="translationPart1 == 'ori'">{{ item.content }}</p>
                      <p v-else-if="translationPart1 == 'en'">{{ item.content_to_en }}</p>
                      <p v-else>{{ item.content_to_zh }}</p>
                      <el-divider />
                    </div>
                  </div>
                  <div style="position: absolute; bottom: 5px; text-align: center; left: 50%; transform: translateX(-50%)">
                    <el-pagination
                      small
                      layout="prev, pager, next"
                      :total="commentPageInfo.total"
                      :page-size="commentPageInfo.pageSize"
                      :current-page="commentPageInfo.pageNum"
                      @current-change="pageChange"
                    />
                  </div>
                </div>
                <div v-else>
                  <el-empty :image-size="100" />
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-row class="asset">
            <el-col>
              <!-- 饼图 -->
              <el-card shadow="never" :body-style="{ height: '200px' }">
                <h5 style="margin: 0">Affective distribution</h5>
                <el-divider />
                <div id="associatedPie" style="width: 100%; height: 100%"></div>
              </el-card>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <div style="margin-bottom: 30px"></div>
      <el-divider content-position="center">Periodic Statistics</el-divider>
      <div style="margin-top: 30px"></div>
      <div style="display: flex; justify-content: space-between">
        <div>
          <span style="padding-right: 5px">Language:</span>
          <el-select v-model="part2Lang" placeholder="Select Language" size="large" style="width: 100px">
            <el-option v-for="item in langs" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span style="padding-left: 20px; padding-right: 5px">Part-of-speech:</span>
          <el-select v-model="totalSpeech" placeholder="Select Speech" size="large" style="width: 120px">
            <el-option v-for="item in speechSelectArr" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span style="padding-left: 20px; padding-right: 5px">Distance:</span>
          <el-select v-model="totalDistance" placeholder="Select Distance" size="large" style="width: 100px">
            <el-option v-for="item in distanceSelectArr" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span style="padding-left: 20px; padding-right: 5px">Date:</span>
          <el-date-picker
            v-model="totalDate.dateArr"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            @change="totalDateChange"
            size="large"
            :clearable="false"
          />
          <el-button type="primary" @click="searchPart2" :disabled="disabledSearch2">Search</el-button>
        </div>
        <div>
          <el-select v-model="translationPart2" placeholder="Select Translation" size="small" style="width: 100px">
            <el-option v-for="item in translationArr" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <el-row :gutter="15" class="asset">
        <el-col :span="8">
          <el-card shadow="never" :body-style="{ overflow: 'auto', height: '352px' }">
            <el-table :data="firstTableData" style="width: 100%" size="small" stripe>
              <el-table-column v-if="translationPart2 == 'ori'" prop="word" label="Keyword(top 10)" width="110" />
              <el-table-column v-else-if="translationPart2 == 'en'" prop="word_to_en" label="Keyword(top 10)" width="110" />
              <el-table-column v-else prop="word_to_zh" label="Keyword(top 10)" width="110" />
              <el-table-column prop="count" label="Mentions" width="70" />
              <el-table-column prop="rank" label="Rank" width="50" />
              <el-table-column prop="rank_change" label="QOQ Rank Variation" width="140">
                <template #default="scope">
                  <el-icon v-if="scope.row.rank_icon == 1" color="#67C23A"><Top /></el-icon>
                  <el-icon v-else-if="scope.row.rank_icon == -1" color="#F56C6C"><Bottom /></el-icon>
                  <span v-if="scope.row.rank_change == 'New'" style="color: #e6a23c">{{ scope.row.rank_change }}</span>
                  <span v-else>{{ scope.row.rank_change }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="affective_distribution" label="Sentiment Distribution" min-width="160" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never" :body-style="{ overflow: 'auto', height: '352px' }">
            <el-table :data="secondTableData" style="width: 100%" size="small" stripe>
              <el-table-column v-if="translationPart2 == 'ori'" prop="word" label="Correlative Keyword Pair" width="160" />
              <el-table-column v-else-if="translationPart2 == 'en'" prop="word_to_en" label="Correlative Keyword Pair" width="160" />
              <el-table-column v-else prop="word_to_zh" label="Correlative Keyword Pair" width="160" />
              <el-table-column prop="correlation_degree" label="Correlation" width="80" />
              <el-table-column prop="count" label="Co-occurrence Mentions" width="160" />
              <el-table-column prop="affective_distribution" label="Sentiment Distribution" min-width="160" />
            </el-table>
          </el-card>
        </el-col>
        <el-col :span="8">
          <el-card shadow="never" :body-style="{ overflow: 'auto', height: '352px' }">
            <el-table :data="thirdTableData" style="width: 100%" size="small" stripe>
              <el-table-column v-if="translationPart2 == 'ori'" prop="word" label="Correlative keyword Triplet" width="175" />
              <el-table-column v-else-if="translationPart2 == 'en'" prop="word_to_en" label="Correlative keyword Triplet" width="175" />
              <el-table-column v-else prop="word_to_zh" label="Correlative keyword Triplet" width="175" />
              <el-table-column prop="correlation_degree" label="Correlation" width="80" />
              <el-table-column prop="count" label="Co-occurrence Mentions" width="160" />
              <el-table-column prop="affective_distribution" label="Sentiment Distribution" min-width="160" />
            </el-table>
          </el-card>
        </el-col>
      </el-row>
      <div style="margin-bottom: 30px"></div>
      <el-divider content-position="center">Network Visualization</el-divider>
      <div style="margin-top: 30px"></div>
      <div style="display: flex; justify-content: space-between">
        <div>
          <span style="padding-right: 5px">Language:</span>
          <el-select v-model="part3Lang" placeholder="Select Language" size="large" style="width: 100px">
            <el-option v-for="item in langs" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span style="padding-left: 20px; padding-right: 5px">Date:</span>
          <el-date-picker
            v-model="part3Date.dateArr"
            type="daterange"
            range-separator="To"
            start-placeholder="Start date"
            end-placeholder="End date"
            @change="part3DateChange"
            size="large"
            :clearable="false"
          />
          <el-tooltip>
            <template #content
              >The correlation is measured by PMI (Pointwise Mutual Information).<br />The PMI is the ratio of their co-occurrence frequency in the text to their individual occurrence frequency.<br />The
              value of Min Correlation must be more than 0.5 and less than 20.</template
            >
            <span style="padding-left: 20px; padding-right: 5px">Min Correlation:</span>
          </el-tooltip>
          <el-input v-model="minCorrelation" placeholder="input correlation" style="width: 100px" size="large" @change="minCorrelationChange"></el-input>
          <el-tooltip>
            <template #content>The frequency indicates the individual occurrence frequency of a keyword.<br />The value of Min Frequency must be more than 3.</template>
            <span style="padding-left: 20px; padding-right: 5px">Min Frequency:</span>
          </el-tooltip>

          <el-input v-model.number="minFrequency" placeholder="input frequency" style="width: 100px" size="large" @change="minFrequencyChange"></el-input>
          <el-button type="primary" @click="searchPart3" :disabled="disabledSearch3">Search</el-button>
        </div>
        <div>
          <el-select v-model="translationPart3" placeholder="Select Translation" size="small" style="width: 100px" @change="translationPart3Change">
            <el-option v-for="item in translationArr" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <el-card shadow="hover" :body-style="{ height: '900px' }" class="asset">
        <div v-if="part3Data.length > 0" id="associatedGraph" style="width: 100%; height: 100%"></div>
        <el-empty :image-size="400" />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import Introduction from '@/components/introduction/Introduction.vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import { ref, reactive, getCurrentInstance, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { formatDate } from '@/utils/common_utils'

const { proxy } = getCurrentInstance()

const games = ref([])
const game = ref('')

const translationArr = [
  {
    label: 'Original',
    value: 'ori'
  },
  {
    label: 'Chinese',
    value: 'ch'
  },
  {
    label: 'English',
    value: 'en'
  }
]
const oneDay = 24 * 60 * 60 * 1000
// ################################################# part1 #############################################
let pieChart, resizeObserver
const langs = [
  {
    label: 'all',
    value: 'ALL'
  },
  {
    label: 'en',
    value: 'en'
  },
  {
    label: 'pt',
    value: 'pt'
  },
  {
    label: 'es',
    value: 'es'
  }
]

const positionArr = ['behind', 'before']

const speechArr = ['ALL', 'NOUN', 'ADJ', 'VERB']
const distanceArr = [1, 2, 3]

const translationPart1 = ref(translationArr[0].value)
const lang = ref(langs[0].value)
const keywordDate = reactive({
  dateArr: [],
  startDate: '',
  endDate: ''
})
const firstSpeech = ref(speechArr[0])
const secondSpeech = ref(speechArr[0])
const thirdSpeech = ref(speechArr[0])
const secondDistance = ref(distanceArr[0])
const thirdDistance = ref(distanceArr[0])
const secondPosition = ref(positionArr[0])
const thirdPosition = ref(positionArr[0])

// 具体数据
const firstWords = ref([])
const secondWords = ref([])
const thirdWords = ref([])
// comments
const comments = ref([])
const pageComments = ref([])
// 情感分布占比
const sentimentRating = ref([])
const currentHead = ref('')
const currentTail = ref('')
const currentFirstWord = ref('')
const disabledSearch1 = ref(false)

// comments的分页器
const commentPageInfo = reactive({
  total: 0,
  pageSize: 8,
  pageNum: 1
})

// date改变
const keywordDateChange = value => {
  // console.log(value)
  if (value) {
    const interval = value[1] - value[0]
    if (interval > 30 * oneDay) {
      ElMessage.error('The date interval must be less than 30 days')
      disabledSearch1.value = true
      return
    }
    disabledSearch1.value = false
    keywordDate.startDate = formatDate(keywordDate.dateArr[0], 'yyyy-mm-dd')
    keywordDate.endDate = formatDate(keywordDate.dateArr[1], 'yyyy-mm-dd')
    // 这里不用自动更新数据
  } else {
    keywordDate.startDate = ''
    keywordDate.endDate = ''
  }
}

const pageChange = currentPage => {
  commentPageInfo.pageNum = currentPage
  pageComments.value = comments.value.slice(commentPageInfo.pageSize * (commentPageInfo.pageNum - 1), commentPageInfo.pageSize * commentPageInfo.pageNum)
}

// 初始化饼图
const initPie = () => {
  pieChart = proxy.$echarts.init(document.getElementById('associatedPie'))
  const pieInitOption = {
    tooltip: {
      trigger: 'item'
    },
    legend: {
      bottom: 5,
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    series: [
      {
        type: 'pie',
        label: {
          formatter: function (arg) {
            // console.log(arg)
            return arg.name + '(' + arg.percent + '%' + ')'
          }
        },
        center: ['40%', '45%'],
        // 饼图的设置
        // radius: 40,  // 半径
        radius: '60%', // 百分比参照的是宽度和高度中较小的那一方的一半来进行百分比设置
        // 圆环的设置
        // radius: ['40%', '45%%'], // 第0个元素表示内圆的半径，第1个元素表示外圆的半径
        // 选中效果
        selectedMode: 'single' // 选中后将会偏离原心一小段距离
      }
    ]
  }
  pieChart.setOption(pieInitOption)
}

const updatePie = () => {
  const pieLegend = []
  const pieData = sentimentRating.value
  sentimentRating.value.forEach(item => {
    pieLegend.push(item.name)
  })
  const pieDataOption = {
    legend: {
      data: pieLegend
    },
    series: [
      {
        data: pieData
      }
    ]
  }
  pieChart.setOption(pieDataOption)
}

// 修改三元词选项的清空
const thirdClear = () => {
  thirdWords.value = []
}

// 修改二元词选项的清空
const secondClear = () => {
  thirdClear()
  thirdSpeech.value = speechArr[0]
  thirdDistance.value = distanceArr[0]
  thirdPosition.value = positionArr[0]
  // 具体数据
  secondWords.value = []
  currentHead.value = ''
  currentTail.value = ''
}

// 修改一元词选项的清空
const firstClear = () => {
  secondClear()
  currentFirstWord.value = ''
  secondSpeech.value = speechArr[0]
  secondDistance.value = distanceArr[0]
  secondPosition.value = positionArr[0]
  // 具体数据
  firstWords.value = []
  // comments
  comments.value = []
  // 情感分布占比
  sentimentRating.value = []
  if (pieChart) {
    pieChart.dispose()
  }
  initPie()
}

// part1的清空
const part1Clear = () => {
  firstSpeech.value = speechArr[0]
  firstClear()
}

// 点击part1搜索
const searchFirstWords = async () => {
  const resp = await proxy.$api.nlp.associatedFirstWords({
    unified_id: game.value,
    lang: lang.value,
    start_time: keywordDate.startDate + ' 00:00:00',
    end_time: keywordDate.endDate + ' 23:59:59',
    speech: firstSpeech.value
  })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    firstWords.value = data
  } else {
    ElMessage.error(message)
  }
}

// 查询一元关联词的评论和情感
const searchFirstComments = async word => {
  const resp = await proxy.$api.nlp.associatedFirstComments({
    unified_id: game.value,
    lang: lang.value,
    start_time: keywordDate.startDate + ' 00:00:00',
    end_time: keywordDate.endDate + ' 23:59:59',
    speech: firstSpeech.value,
    word: word
  })
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    comments.value = data.comments
    commentPageInfo.total = comments.value.length
    commentPageInfo.pageNum = 1
    pageComments.value = comments.value.slice(0, commentPageInfo.pageSize)
    sentimentRating.value = data.sentiment_rating
    updatePie()
  } else {
    ElMessage.error(message)
  }
}

// 查询二元关联词
const searchSecondWords = async word => {
  const resp = await proxy.$api.nlp.associatedSecondWords({
    unified_id: game.value,
    lang: lang.value,
    start_time: keywordDate.startDate + ' 00:00:00',
    end_time: keywordDate.endDate + ' 23:59:59',
    first_speech: firstSpeech.value,
    second_speech: secondSpeech.value,
    distance: secondDistance.value,
    word: word,
    position: secondPosition.value
  })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    secondWords.value = data
  } else {
    ElMessage.error(message)
  }
}

// 点击二元词后查找它的评论和情感
const searchSecondComments = async (head, tail) => {
  const resp = await proxy.$api.nlp.associatedSecondComments({
    unified_id: game.value,
    lang: lang.value,
    start_time: keywordDate.startDate + ' 00:00:00',
    end_time: keywordDate.endDate + ' 23:59:59',
    first_speech: firstSpeech.value,
    second_speech: secondSpeech.value,
    distance: secondDistance.value,
    position: secondPosition.value,
    head: head,
    tail: tail
  })
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    comments.value = data.comments
    commentPageInfo.total = comments.value.length
    commentPageInfo.pageNum = 1
    pageComments.value = comments.value.slice(0, commentPageInfo.pageSize)
    sentimentRating.value = data.sentiment_rating
    updatePie()
  } else {
    ElMessage.error(message)
  }
}

// 查询三元关联词
const searchThirdWords = async (head, tail) => {
  const resp = await proxy.$api.nlp.associatedThirdWords({
    unified_id: game.value,
    lang: lang.value,
    start_time: keywordDate.startDate + ' 00:00:00',
    end_time: keywordDate.endDate + ' 23:59:59',
    first_speech: firstSpeech.value,
    second_speech: secondSpeech.value,
    third_speech: thirdSpeech.value,
    second_distance: secondDistance.value,
    third_distance: thirdDistance.value,
    second_position: secondPosition.value,
    third_position: thirdPosition.value,
    head: head,
    tail: tail
  })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    thirdWords.value = data
  } else {
    ElMessage.error(message)
  }
}

// 查询三元关联词的评论和情感
const searchThirdComments = async third_word => {
  const resp = await proxy.$api.nlp.associatedThirdComments({
    unified_id: game.value,
    lang: lang.value,
    start_time: keywordDate.startDate + ' 00:00:00',
    end_time: keywordDate.endDate + ' 23:59:59',
    first_speech: firstSpeech.value,
    second_speech: secondSpeech.value,
    third_speech: thirdSpeech.value,
    second_distance: secondDistance.value,
    third_distance: thirdDistance.value,
    second_position: secondPosition.value,
    third_position: thirdPosition.value,
    head: currentHead.value,
    tail: currentTail.value,
    third_word: third_word
  })
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    comments.value = data.comments
    commentPageInfo.total = comments.value.length
    commentPageInfo.pageNum = 1
    pageComments.value = comments.value.slice(0, commentPageInfo.pageSize)
    sentimentRating.value = data.sentiment_rating
    updatePie()
  } else {
    ElMessage.error(message)
  }
}

// 点击search
const searchPart1 = () => {
  part1Clear()
  searchFirstWords()
}

// 点击一元词
const clickFirstWord = (word, currentIndex) => {
  currentFirstWord.value = word
  // 处理点击的颜色变化
  firstWords.value.forEach((item, index) => {
    if (index === currentIndex) {
      item.effect = 'dark'
    } else {
      item.effect = 'plain'
    }
  })
  searchFirstComments(word)
  searchSecondWords(word)
  // 三元词要清掉
  thirdWords.value = []
}

// 点击二元词
const clickSecondWord = (head, tail, currentIndex) => {
  secondWords.value.forEach((item, index) => {
    if (index === currentIndex) {
      item.effect = 'dark'
    } else {
      item.effect = 'plain'
    }
  })
  currentHead.value = head
  currentTail.value = tail
  searchSecondComments(head, tail)
  searchThirdWords(head, tail)
}

// 点击三元词
const clickThirdWord = (one, two, three, currentIndex) => {
  thirdWords.value.forEach((item, index) => {
    if (index === currentIndex) {
      item.effect = 'dark'
    } else {
      item.effect = 'plain'
    }
  })
  if (thirdPosition.value == 'before') {
    searchThirdComments(one)
  } else {
    searchThirdComments(three)
  }
}

// 一元词选项变化
const firstSpeechChange = () => {
  firstClear()
  searchFirstWords()
}

// 二元词选项变化
const secondOptionChange = () => {
  secondClear()
  if (currentFirstWord.value !== '') {
    searchSecondWords(currentFirstWord.value)
    // 选项修改后没有点击，所以需要修改为原来的一元的评论和情感分布
    searchFirstComments(currentFirstWord.value)
  } else {
    ElMessage.error('please select first word')
  }
}

// 三元词选项变化
const thirdOptionChange = () => {
  thirdClear()
  if (currentHead.value !== '' && currentTail.value !== '') {
    searchThirdWords(currentHead.value, currentTail.value)
    // 回退到二元的评论和关联词
    searchSecondComments(currentHead.value, currentTail.value)
  } else {
    ElMessage.error('please select second word')
  }
}

// ################################################### part2 ##############################################
const speechSelectArr = [
  {
    label: 'ALL',
    value: 'ALL'
  },
  {
    label: 'NOUN',
    value: 'NOUN'
  },
  {
    label: 'ADJ',
    value: 'ADJ'
  },
  {
    label: 'VERB',
    value: 'VERB'
  }
]
const distanceSelectArr = [
  {
    label: 1,
    value: 1
  },
  {
    label: 2,
    value: 2
  },
  {
    label: 3,
    value: 3
  }
]
const translationPart2 = ref(translationArr[0].value)
const totalSpeech = ref(speechSelectArr[0].value)
const totalDistance = ref(distanceSelectArr[0].value)
const totalDate = reactive({
  dateArr: [],
  startDate: '',
  endDate: '',
  lastStartDate: '',
  lastEndDate: ''
})
const disabledSearch2 = ref(false)
const part2Lang = ref(langs[0].value)

const totalDateChange = value => {
  // console.log(value)
  if (value) {
    // 只能选择1天或者7天
    const interval = value[1] - value[0]
    if (interval !== 0 && interval !== 6 * oneDay) {
      ElMessage.error('The date interval must be 1 day or 7 days')
      disabledSearch2.value = true
      return
    }
    disabledSearch2.value = false
    totalDate.startDate = formatDate(totalDate.dateArr[0], 'yyyy-mm-dd')
    totalDate.endDate = formatDate(totalDate.dateArr[1], 'yyyy-mm-dd')

    // 获取上一个时间段的时间
    if (totalDate.startDate == totalDate.endDate) {
      const lastDay = new Date(value[0].getTime() - oneDay)
      totalDate.lastStartDate = formatDate(lastDay, 'yyyy-mm-dd')
      totalDate.lastEndDate = formatDate(lastDay, 'yyyy-mm-dd')
    } else {
      const lastWeekDay1 = new Date(value[0].getTime() - 7 * oneDay)
      const lastWeekDay2 = new Date(value[1].getTime() - 7 * oneDay)
      totalDate.lastStartDate = formatDate(lastWeekDay1, 'yyyy-mm-dd')
      totalDate.lastEndDate = formatDate(lastWeekDay2, 'yyyy-mm-dd')
    }
  } else {
    totalDate.startDate = ''
    totalDate.endDate = ''
  }
}

const firstTableData = ref([])
const secondTableData = ref([])
const thirdTableData = ref([])

// 获取一元统计
const getFirstStatistic = async () => {
  const resp = await proxy.$api.nlp.associatedFirstStatistic({
    unified_id: game.value,
    speech: totalSpeech.value,
    lang: part2Lang.value,
    start_date: totalDate.startDate,
    end_date: totalDate.endDate,
    last_start_date: totalDate.lastStartDate,
    last_end_date: totalDate.lastEndDate
  })
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    firstTableData.value = data.map(item => {
      const sum = item.sentiment_rating[0] + item.sentiment_rating[1] + item.sentiment_rating[2]
      let rank_change = ''
      let rank_icon = 0
      if (item.is_new) {
        rank_change = 'New'
      } else {
        if (item.rank_change > 0) {
          rank_change = `${item.rank_change}`
          rank_icon = 1
        } else if (item.rank_change == 0) {
          rank_change = `${item.rank_change}`
        } else {
          rank_change = `${Math.abs(item.rank_change)}`
          rank_icon = -1
        }
      }
      return {
        word: item.head,
        word_to_en: item.head_to_en,
        word_to_zh: item.head_to_zh,
        count: item.count,
        rank: item.rank,
        rank_change: rank_change,
        affective_distribution: `(${((item.sentiment_rating[0] / sum) * 100).toFixed(2) + '%'}, ${((item.sentiment_rating[1] / sum) * 100).toFixed(2) + '%'}, ${
          ((item.sentiment_rating[2] / sum) * 100).toFixed(2) + '%'
        })`,
        rank_icon: rank_icon
      }
    })
  } else {
    ElMessage.error(message)
  }
}

// 获取二元统计
const getSecondStatistic = async () => {
  const resp = await proxy.$api.nlp.associatedSecondStatistic({
    unified_id: game.value,
    speech: totalSpeech.value,
    lang: part2Lang.value,
    start_date: totalDate.startDate,
    end_date: totalDate.endDate,
    distance: totalDistance.value
  })
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    secondTableData.value = data.map(item => {
      const sum = item.sentiment_rating[0] + item.sentiment_rating[1] + item.sentiment_rating[2]
      return {
        word: `${item.head},${item.second}`,
        word_to_en: `${item.head_to_en},${item.second_to_en}`,
        word_to_zh: `${item.head_to_zh},${item.second_to_zh}`,
        count: item.count,
        correlation_degree: item.correlation_degree.toFixed(2),
        affective_distribution: `(${((item.sentiment_rating[0] / sum) * 100).toFixed(2) + '%'}, ${((item.sentiment_rating[1] / sum) * 100).toFixed(2) + '%'}, ${
          ((item.sentiment_rating[2] / sum) * 100).toFixed(2) + '%'
        })`
      }
    })
  } else {
    ElMessage.error(message)
  }
}

// 获取三元统计
const getThirdStatistic = async () => {
  const resp = await proxy.$api.nlp.associatedThirdStatistic({
    unified_id: game.value,
    speech: totalSpeech.value,
    lang: part2Lang.value,
    start_date: totalDate.startDate,
    end_date: totalDate.endDate,
    distance: totalDistance.value
  })
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    thirdTableData.value = data.map(item => {
      const sum = item.sentiment_rating[0] + item.sentiment_rating[1] + item.sentiment_rating[2]
      return {
        word: `${item.head},${item.second},${item.third}`,
        word_to_en: `${item.head_to_en},${item.second_to_en},${item.third_to_en}`,
        word_to_zh: `${item.head_to_zh},${item.second_to_zh},${item.third_to_zh}`,
        count: item.count,
        correlation_degree: item.correlation_degree.toFixed(2),
        affective_distribution: `(${((item.sentiment_rating[0] / sum) * 100).toFixed(2) + '%'}, ${((item.sentiment_rating[1] / sum) * 100).toFixed(2) + '%'}, ${
          ((item.sentiment_rating[2] / sum) * 100).toFixed(2) + '%'
        })`
      }
    })
  } else {
    ElMessage.error(message)
  }
}

const searchPart2 = () => {
  getFirstStatistic()
  getSecondStatistic()
  getThirdStatistic()
}

// ################################################### part3 ##############################################
let graphChart
const part3Lang = ref(langs[0].value)
const part3Date = reactive({
  dateArr: [],
  startDate: '',
  endDate: ''
})
const disabledSearch3 = ref(false)
const minCorrelation = ref(0.5)
const translationPart3 = ref(translationArr[0].value)
const part3Data = ref([])
const minFrequency = ref(3)

const part3DateChange = value => {
  if (value) {
    // 只能选择1天或者7天
    const interval = value[1] - value[0]
    if (interval !== 0 && interval !== 6 * oneDay) {
      ElMessage.error('The date interval must be 1 day or 7 days')
      disabledSearch3.value = true
      return
    }
    disabledSearch3.value = false
    part3Date.startDate = formatDate(part3Date.dateArr[0], 'yyyy-mm-dd')
    part3Date.endDate = formatDate(part3Date.dateArr[1], 'yyyy-mm-dd')
  } else {
    totalDate.startDate = ''
    totalDate.endDate = ''
  }
}

const getGraph = async () => {
  const resp = await proxy.$api.nlp.associatedGraph({
    unified_id: game.value,
    speech: 'ALL',
    lang: part3Lang.value,
    start_date: part3Date.startDate,
    end_date: part3Date.endDate,
    distance: 1,
    min_correlation: Number(minCorrelation.value, 10),
    min_frequency: minFrequency.value
  })
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    part3Data.value = data
    if (part3Data.value.length > 0) {
      nextTick(() => {
        updateGraph()
      })
    }
  } else {
    ElMessage.error(message)
  }
}

const updateGraph = (translation = 'ori') => {
  if (graphChart) {
    graphChart.dispose()
  }
  graphChart = proxy.$echarts.init(document.getElementById('associatedGraph'))
  const data = []
  const links = []
  const dataIdArr = []
  const linkIdArr = []
  // 归一化节点大小和连线宽度
  const symbolSizeArr = []
  const linkSizeArr = []
  // // 节点的连接关系
  // const nodeLinkMap = {}
  for (const item of part3Data.value) {
    switch (translation) {
      case 'ch':
        item.head = item.head_to_zh
        item.second = item.second_to_zh
        break
      case 'en':
        item.head = item.head_to_en
        item.second = item.second_to_en
        break
      default:
        break
    }
    const id1 = item.head + '1'
    if (!dataIdArr.includes(id1)) {
      const width = Math.log(item.total_head_daily_count)
      data.push({
        id: id1,
        name: item.head,
        symbolSize: width
        // value: item.total_head_daily_count,
      })
      dataIdArr.push(id1)
      symbolSizeArr.push(width)
    }
    const id2 = item.second + '2'
    if (!dataIdArr.includes(id2)) {
      const width = Math.log(item.total_second_daily_count)
      data.push({
        id: id2,
        name: item.second,
        symbolSize: width
        // value: item.total_second_daily_count,
      })
      dataIdArr.push(id2)
      symbolSizeArr.push(width)
    }
    let linkId = id1 + id2
    // linkId字符串本身进行排序
    linkId = [...linkId]
      .sort((a, b) => {
        return a.localeCompare(b, 'zh-CN')
      })
      .join('')
    if (!linkIdArr.includes(linkId)) {
      const width = Math.log(item.correlation_degree)
      const source = item.head + '1'
      const target = item.second + '2'
      links.push({
        source: source,
        target: target,
        value: 100,
        lineStyle: {
          width: width
        }
      })
      linkIdArr.push(linkId)
      linkSizeArr.push(width)
      // // 记录节点
      // if (nodeLinkMap[source] === undefined) {
      //   nodeLinkMap[source] = [target]
      // } else {
      //   nodeLinkMap[source].push(target)
      // }
    }
  }
  // 归一化操作，找出最大值和最小值
  const maxSymbolSize = Math.max(...symbolSizeArr)
  const minSymbolSize = Math.min(...symbolSizeArr)
  const maxLinkSize = Math.max(...linkSizeArr)
  const minLinkSize = Math.min(...linkSizeArr)
  for (const index in data) {
    data[index].symbolSize = ((data[index].symbolSize - minSymbolSize) / (maxSymbolSize - minSymbolSize)) * 60 + 1
  }
  for (const index in links) {
    links[index].lineStyle.width = ((links[index].lineStyle.width - minLinkSize) / (maxLinkSize - minLinkSize)) * 4 + 1
  }
  const option = {
    color: ['#98e288', '#ff9462'],
    series: [
      {
        type: 'graph',
        layout: 'force',
        focus: {
          repulsion: 1000,
          edgeLength: 300,
          gravity: 0,
          friction: 1
        },
        roam: true,
        label: {
          show: true,
          position: 'right'
        },
        draggable: true,
        label: {
          show: true
        },
        emphasis: {
          focus: 'adjacency'
        },
        scaleLimit: {
          min: 1,
          max: 3
        },
        lineStyle: {
          curveness: 0.3
        },
        data: data,
        links: links
      }
    ]
  }
  graphChart.setOption(option)
}

// 最小关联度
const minCorrelationChange = value => {
  // 不能为空
  if (value === '') {
    ElMessage.error('Min Correlation can not be empty')
    disabledSearch3.value = true
    return
  }
  // 必须是数字
  if (isNaN(Number(value, 10))) {
    ElMessage.error('Min Correlation must be number')
    disabledSearch3.value = true
    return
  }
  // 必须在0.5到20之间
  if (Number(value, 10) < 0.5 || Number(value, 10) > 20) {
    ElMessage.error('Min Correlation must be more than 0.5 and less than 20')
    disabledSearch3.value = true
    return
  }
  disabledSearch3.value = false
}

// 最小词频
const minFrequencyChange = value => {
  // 不能为空
  if (value === '') {
    ElMessage.error('Min Frequency can not be empty')
    disabledSearch3.value = true
    return
  }
  // 必须是数字
  if (isNaN(Number(value, 10))) {
    ElMessage.error('Min Frequency must be number')
    disabledSearch3.value = true
    return
  }
  // 必须大于3
  if (value < 3) {
    ElMessage.error('Min Frequency must be more than 3')
    disabledSearch3.value = true
    return
  }
  disabledSearch3.value = false
}

const searchPart3 = () => {
  getGraph()
}

// 切换语言
const translationPart3Change = value => {
  if (part3Data.value.length > 0) {
    nextTick(() => {
      updateGraph(value)
    })
  }
}

// ************** 公共方法 *********************
// 首次进入页面的默认时间
const getKeywordDate = () => {
  const today = new Date()
  // 默认获取前一天的数据
  const startTime = today.getTime() - oneDay
  const endTime = today.getTime() - oneDay
  keywordDate.dateArr[0] = new Date(startTime)
  keywordDate.dateArr[1] = new Date(endTime)

  keywordDate.startDate = formatDate(keywordDate.dateArr[0], 'yyyy-mm-dd')
  keywordDate.endDate = formatDate(keywordDate.dateArr[1], 'yyyy-mm-dd')

  totalDate.dateArr[0] = new Date(startTime)
  totalDate.dateArr[1] = new Date(endTime)

  totalDate.startDate = formatDate(totalDate.dateArr[0], 'yyyy-mm-dd')
  totalDate.endDate = formatDate(totalDate.dateArr[1], 'yyyy-mm-dd')
  const lastTwoDay = new Date(startTime - oneDay)
  totalDate.lastStartDate = formatDate(lastTwoDay, 'yyyy-mm-dd')
  totalDate.lastEndDate = formatDate(lastTwoDay, 'yyyy-mm-dd')

  part3Date.dateArr[0] = new Date(startTime)
  part3Date.dateArr[1] = new Date(endTime)

  part3Date.startDate = formatDate(keywordDate.dateArr[0], 'yyyy-mm-dd')
  part3Date.endDate = formatDate(keywordDate.dateArr[1], 'yyyy-mm-dd')
}
getKeywordDate()

// 全局业务切换
const gameChange = () => {
  // part1
  translationPart1.value = translationArr[0].value
  lang.value = langs[0].value
  getKeywordDate()
  searchPart1()
  // part2
  translationPart2.value = translationArr[0].value
  totalSpeech.value = speechSelectArr[0].value
  totalDistance.value = distanceSelectArr[0].value
  part2Lang.value = langs[0].value
  searchPart2()
  // part3
  part3Lang.value = langs[0].value
  minCorrelation.value = 0.5
  minFrequency.value = 3
  translationPart3.value = translationArr[0].value
  searchPart3()
}

// 主页页面尺寸变化
const chartAdapter = () => {
  if (pieChart) {
    pieChart.resize()
  }
  if (graphChart) {
    graphChart.resize()
  }
}

// 获取游戏
const getGames = async () => {
  const resp = await proxy.$api.nlp.associatedGames({})
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    if (data.length > 0) {
      games.value = data
      game.value = data[0].value
      disabledSearch1.value = false
      disabledSearch2.value = false
      disabledSearch3.value = false
      searchPart1()
      searchPart2()
      searchPart3()
    } else {
      disabledSearch1.value = true
      disabledSearch2.value = true
      disabledSearch3.value = true
    }
  } else {
    ElMessage.error(message)
    disabledSearch1.value = true
    disabledSearch2.value = true
    disabledSearch3.value = true
  }
}

onMounted(() => {
  // 获取games
  getGames()
  resizeObserver = new ResizeObserver(chartAdapter)
  resizeObserver.observe(document.getElementById('associated'))
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
  if (pieChart) {
    pieChart.dispose()
  }
  if (graphChart) {
    graphChart.dispose()
  }
})
</script>

<style lang="less" scoped>
.el-select {
  margin-right: 10px;
  margin-top: -5px;
}

.el-button {
  margin-top: -5px;
  margin-left: 10px;
  height: 38px;
}

.el-radio-group {
  padding-left: 10px;
}

.el-radio {
  margin-right: 15px;
}

p {
  font-family: PingFang SC;
  font-size: 12px;
  color: #909399;
  margin-top: 5px;
  margin-bottom: 5px;
}

.el-tag {
  cursor: pointer;
  margin: 3px;
}

.el-input {
  margin-top: -5px;
}
</style>
