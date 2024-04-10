<template>
  <Introduction>
    Game sentiment analysis: Through qualitative sentiment analysis on store reviews of games and user posts on social media, it helps business to understand user reputation and public opinion of
    games, so as to facilitate business monitoring and decision-making.
  </Introduction>
  <el-row :gutter="20" class="asset">
    <el-col :span="12">
      <el-card shadow="never" :body-style="{ textAlign: 'center' }">
        <el-radio-group v-model="selectLangLabel" @change="changeLang">
          <el-radio :label="item" v-for="item in langOption" :key="item">{{ item }}</el-radio>
        </el-radio-group>
        <!-- <el-input v-model="input" maxlength="512" placeholder="Please enter a keyword" show-word-limit type="textarea" @keyup.enter.native="analyse" resize="none" /> -->
        <el-input v-model="input" maxlength="512" placeholder="Please enter a keyword" show-word-limit type="textarea" resize="none" />
        <el-button type="primary" @click="analyse" :disabled="disabled" class="asset">Analyse</el-button>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card shadow="never" :body-style="{ height: '242px' }">
        <div ref="sentiment" style="height: 100%; width: 100%"></div>
      </el-card>
    </el-col>
  </el-row>
  <div v-show="resultShow" class="result">
    <el-row :gutter="15" class="asset">
      <!-- <el-col :span="8">
        <el-card shadow="never" style="text-align: center">
          <h2>Language Recognition</h2>
          <el-divider />
          <el-table :data="langData" style="width: 100%">
            <el-table-column prop="category" label="Category" />
            <el-table-column prop="output" label="Algorithm Output" />
          </el-table>
        </el-card>
      </el-col> -->
      <el-col :span="12">
        <el-card shadow="never" style="text-align: center">
          <h2>Analyse Result</h2>
          <el-divider />
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="category" label="Category" />
            <el-table-column prop="output" label="Algorithm Output" />
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="never" style="text-align: center">
          <h2>Sentiment Analyse</h2>
          <el-divider />
          <div class="sentiment-pic">
            <div class="pic-item" :style="happyStyle">
              <el-tooltip class="box-item" effect="dark" :content="happyContent" placement="top">
                <img src="https://img.icons8.com/ios/100/000000/happy--v1.png" />
              </el-tooltip>
              <span>正面</span>
            </div>
            <div class="pic-item" :style="neutralStyle">
              <el-tooltip class="box-item" effect="dark" :content="neutralContent" placement="top">
                <img src="https://img.icons8.com/ios-glyphs/100/000000/neutral-emoticon--v1.png" />
              </el-tooltip>
              <span>中性</span>
            </div>
            <div class="pic-item" :style="sadStyle">
              <el-tooltip class="box-item" effect="dark" :content="sadContent" placement="top">
                <img src="https://img.icons8.com/ios/100/000000/sad.png" />
              </el-tooltip>
              <span>负面</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, reactive, onBeforeUnmount } from 'vue'
import Introduction from '@/components/introduction/Introduction.vue'

const langOption = ['en', 'pt', 'tr', 'ar', 'zh', 'ko', 'ja', 'es', 'ms', 'fr']
const langInputMap = {
  en: "It's a good game, and I want play it every day!",
  zh: '好游戏值得慢慢等待',
  ja: '#リゼロス 虹扉も信用出来ない､､､ ベア子演出も信用出来ない､､､ そして茶扉もすり抜け､､､ それなのに普通のガチャチケで確定は､､､心折れるて､､､',
  ko: '원신 진짜 재밌네요 스토리도 재밌고 캐릭터도 귀여워요',
  pt: 'Pensem em porque outros desistam de outros jogos para jogar este produto defeito',
  es: 'Yo también deseo eso porque es el primer moba que me llamo la atención y me gustó y también corrí la suerte de probar el beta',
  tr: 'Şu Adminlere bak hiçbir şeye yaramıyorlar. Bir açıklama dahi yapamıyorlar. Her şeyde tr olarak gerideyiz. Ulan bari sitede ki tr dil desteği neden kalktı onu söyleyin. Oyun bize çıkmaycaksa boşuna beklemeyelim.',
  ar: 'لعبه محترمه برضة',
  fr: 'Honor Of Kings est le jeu mobile le plus populaire en 2022',
  ms: 'Ala sis pubg i xreti sgt. I suka game like Mobile Legends tu. I suka game mcm tu sbb bila u main boleh atur strategik siap2. Hahahah'
}
const selectLangLabel = ref('en')
const { proxy } = getCurrentInstance()
const input = ref(langInputMap[selectLangLabel.value])
const changeLang = () => {
  input.value = langInputMap[selectLangLabel.value]
}
const resultShow = ref(false)
const disabled = ref(false)
// const langData = ref([])
const tableData = ref([])
// 控制表情的透明度
const happyStyle = reactive({})
const neutralStyle = reactive({})
const sadStyle = reactive({})
// 表情的提示框
const happyContent = ref('')
const neutralContent = ref('')
const sadContent = ref('')
// echarts
let mCharts, resizeObserver

// 点击发送请求
const analyse = async () => {
  if (input.value.trim() === '') {
    ElMessage.error('The input value cannot be empty')
  } else {
    const loadingInstance = ElLoading.service({ target: document.getElementById('opinion'), lock: true, text: 'Loading' })
    // 禁用按钮
    disabled.value = true
    // 先获取语言
    // const resp = await proxy.$api.nlp.langDetection({ content: [input.value] })
    // // 请求出错
    // if (typeof resp === 'string') {
    //   ElMessage.error(resp)
    //   // 解开按钮
    //   disabled.value = false
    //   loadingInstance.close()
    //   return
    // }
    // const { status_code, tags, tags_probability } = resp.data
    // let language = ''
    // if (status_code === 200) {
    //   language = tags[0]
    //   langData.value = [
    //     {
    //       category: 'tags',
    //       output: language
    //     },
    //     {
    //       category: 'probability',
    //       output: tags_probability[0]
    //     }
    //   ]
    // } else {
    //   disabled.value = false
    //   loadingInstance.close()
    //   ElMessage.error('language detection failed')
    //   return
    // }
    // 执行解析
    const senResp = await proxy.$api.nlp.sentiment({ content: input.value, language: selectLangLabel.value })
    // console.log(input.value, language)
    // console.log(senResp)
    // 请求出错
    if (typeof senResp === 'string') {
      // 解开按钮
      disabled.value = false
      loadingInstance.close()
      ElMessage.error(senResp)
      return
    }
    if (senResp.data.status_code === 200) {
      // console.log(senResp.data)
      const { score, label } = senResp.data
      const scoreArr = []
      Object.keys(score).forEach(key => {
        if (key === '1') {
          scoreArr.push({
            category: '1(负面)',
            output: score[key]
          })
          sadContent.value = '负面概率' + score[key]
          if (label === key) {
            sadStyle.opacity = 1
          } else {
            sadStyle.opacity = 0.2
          }
        } else if (key === '3') {
          scoreArr.push({
            category: '3(中性)',
            output: score[key]
          })
          neutralContent.value = '中性概率' + score[key]
          if (label === key) {
            neutralStyle.opacity = 1
          } else {
            neutralStyle.opacity = 0.2
          }
        } else {
          scoreArr.push({
            category: '5(正面)',
            output: score[key]
          })
          happyContent.value = '正面概率' + score[key]
          if (label === key) {
            happyStyle.opacity = 1
          } else {
            happyStyle.opacity = 0.2
          }
        }
      })
      // 评分
      scoreArr.push({
        category: 'label(评分)',
        output: label
      })
      tableData.value = scoreArr
      loadingInstance.close()
      // 展示结果区域
      resultShow.value = true
    } else {
      ElMessage.error('analyse failed')
      loadingInstance.close()
    }
    // 解开按钮
    disabled.value = false
  }
}

// echarts
const getRadar = () => {
  mCharts = proxy.$echarts.init(proxy.$refs['sentiment'])
  const option = {
    radar: {
      center: ['60%', '60%'],
      indicator: [
        { name: 'Precision', min: 0.7 },
        { name: 'Recall', min: 0.7 },
        { name: 'F Score', min: 0.7 }
      ],
      axisLabel: {
        show: true,
        formatter: function (value, index) {
          // console.log(value, index)
          const allowIndex = [0, 2, 5]
          return allowIndex.includes(index) ? value : ''
        },
        showMinLabel: true,
        showMaxLabel: true,
        hideOverlap: true
      },
      axisTick: {
        show: true,
        length: 3
      }
    },
    title: {
      text: '情感分析能力展示\nChinese (latency: 0.078s, QPS: 227)\nEnglish (latency: 0.0767s, QPS: 227)\nArabic (latency: 0.087s, QPS: 227)',
      textStyle: {
        fontSize: 12,
        fontWeight: 'normal',
        color: '#909399'
      },
      textAlign: 'center',
      left: 100,
      top: 20
    },
    legend: {
      data: ['Chinese', 'English', 'Arabic'],
      // orient: 'vertical',
      // right: 10,
      // top: 'center'
      bottom: 0
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            name: 'Chinese',
            value: [0.859, 0.859, 0.8597]
          },
          {
            name: 'English',
            value: [0.824, 0.82, 0.8204]
          },
          {
            name: 'Arabic',
            value: [0.747, 0.749, 0.7458]
          }
        ]
      }
    ]
  }
  mCharts.setOption(option)
}

// echart尺寸改变
const chartAdapter = () => {
  mCharts.resize()
}

onMounted(() => {
  getRadar()
  resizeObserver = new ResizeObserver(chartAdapter)
  resizeObserver.observe(document.getElementById('opinion'))
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
  mCharts.dispose()
})
</script>

<style lang="less">
.sentiment-pic {
  display: flex;
  justify-content: space-between;

  .pic-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
