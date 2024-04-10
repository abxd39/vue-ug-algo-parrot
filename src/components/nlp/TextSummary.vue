<template>
  <Introduction>
    Public opinion needs to pay attention to what topics players discuss in stores or social media platforms, and conduct timely analysis and tracking based on these topics. Public opinion topic
    identification is mainly based on the model to predict each comment and identify the corresponding topic.
  </Introduction>
  <el-card shadow="never" class="asset">
    <el-row>
      <el-col :span="4">Game</el-col>
      <el-col :span="10">
        <el-radio-group v-model="formData.game">
          <el-radio :label="index" v-for="(item, index) in formData.gameArr" :key="index">{{ item }}</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">Secondary Subject</el-col>
      <el-col :span="10">
        <el-radio-group v-model="formData.subject">
          <el-radio :label="index" v-for="(item, index) in formData.subjectArr" :key="index">{{ item }}</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row class="asset">
      <el-col :span="4">Start Date</el-col>
      <el-col :span="10">
        <el-date-picker v-model="formData.startDate" type="date" placeholder="Pick a day" />
      </el-col>
    </el-row>
    <el-row class="asset">
      <el-col :span="4">End Date</el-col>
      <el-col :span="10">
        <el-date-picker v-model="formData.endDate" type="date" placeholder="Pick a day" />
      </el-col>
    </el-row>
    <el-button type="primary" @click="analyse" :disabled="disabled" class="asset">Submit</el-button>
  </el-card>
  <el-card v-show="resultShow" class="asset" shadow="never">
    <h2>Details</h2>
    <el-divider />
    <el-table :data="result.details" stripe height="250">
      <el-table-column prop="comment_uin" label="Comment_Uin" width="300" />
      <el-table-column prop="content" label="Comment_Content" />
    </el-table>
    <h2>Tier 3 Topics</h2>
    <el-divider />
    <el-table :data="result.topics" stripe height="250">
      <el-table-column prop="tier3_topic" label="Tier 3 Topics" width="200" />
      <el-table-column prop="content" label="Comment_Content" />
    </el-table>
    <h2>Summary Results</h2>
    <el-divider />
    <el-table :data="result.summary" stripe>
      <el-table-column prop="class" label="Classification" width="200" />
      <el-table-column prop="content" label="Content" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, getCurrentInstance, reactive, onMounted } from 'vue'
import Introduction from '@/components/introduction/Introduction.vue'
import { formatDate } from '@/utils/common_utils'

const { proxy } = getCurrentInstance()
const resultShow = ref(false)
const disabled = ref(true)
const formData = reactive({
  gameArr: ['MLBB', 'AOV', 'PUBGM'],
  game: 0,
  subjectArr: ['Lag'],
  subject: 0,
  startDate: null,
  endDate: null
})
const result = reactive({
  details: [],
  topics: [],
  summary: []
})

// 点击发送请求
const analyse = async () => {
  // console.log(typeof formData.startDate)
  const loadingInstance = ElLoading.service({ target: document.getElementById('summary'), lock: true, text: 'Loading' })
  // 处理时间
  const startDate = formatDate(formData.startDate, 'yyyy-mm-dd')
  const endDate = formatDate(formData.endDate, 'yyyy-mm-dd')
  // 禁用按钮
  disabled.value = true
  // 执行搜索网络请求
  const resp = await proxy.$api.nlp.summary({
    game_name: formData.gameArr[formData.game],
    tier2_topic: 'lag',
    start_time: startDate + ' 00:00:00',
    end_time: endDate + ' 00:00:00'
  })
  // 请求出错
  if (typeof resp === 'string') {
    // 解开按钮
    disabled.value = false
    loadingInstance.close()
    ElMessage.error(resp)
    return
  }
  const { status_code, comments, comment2topic, topic2summary, tier3_topic } = resp.data
  if (status_code === 200) {
    result.details = comments
    result.topics = comment2topic
    const summaryArr = []
    tier3_topic.forEach((item) => {
      summaryArr.push({
        class: item,
        content: topic2summary[item]
      })
    })
    result.summary = summaryArr
    loadingInstance.close()
    // 展示结果区域
    resultShow.value = true
  } else {
    loadingInstance.close()
    ElMessage.error('analyse failed')
  }
  // 解开按钮
  disabled.value = false
}

const getCurrentDate = () => {
  const today = new Date()
  //   const currentDate = formatDate(today, 'yyyy-mm-dd')
  formData.startDate = today
  formData.endDate = today
}

onMounted(() => {
  getCurrentDate()
})
</script>

<style lang="less" scoped>
.label {
  margin-top: 80px;
}
</style>
