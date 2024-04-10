<template>
  <Introduction>The title of game news is used to identify game news and filter whether the game news is related to the game. This service supports English and multi-language models.</Introduction>
  <el-row :gutter="20" class="asset">
    <el-col :span="12">
      <el-card shadow="never" :body-style="{ textAlign: 'center' }">
        <el-radio-group v-model="radio">
          <el-radio :label="index" v-for="(item, index) in radioItems" :key="index">{{ item }}</el-radio>
        </el-radio-group>
        <!-- <el-input v-model="input" maxlength="512" placeholder="Please enter a keyword" show-word-limit type="textarea" @keyup.enter.native="analyse" resize="none" /> -->
        <el-input v-model="input" maxlength="512" placeholder="Please enter a keyword" show-word-limit type="textarea" resize="none" />
        <el-button type="primary" @click="analyse" :disabled="disabled" class="asset">Analyse</el-button>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card shadow="never" :body-style="{ height: '242px' }">
        <div ref="news" style="height: 100%; width: 100%"></div>
      </el-card>
    </el-col>
  </el-row>
  <el-card v-show="resultShow" class="asset" shadow="never">
    <h2>Analyse Result</h2>
    <!-- <el-divider /> -->
    <el-table :data="tableData" style="width: 30%">
      <el-table-column prop="game" label="Game News Probability" />
      <el-table-column prop="nongame" label="Non-game News Probability" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import Introduction from '@/components/introduction/Introduction.vue'

const { proxy } = getCurrentInstance()
const radioItems = reactive(['Multi-Language', 'English'])
const radio = ref(0)
const input = ref('腾讯游戏发行了新游戏')
const resultShow = ref(false)
const disabled = ref(false)
const tableData = ref([])
let mCharts, resizeObserver

// 点击发送请求
const analyse = async () => {
  if (input.value.trim() === '') {
    ElMessage.error('The input value cannot be empty')
  } else {
    // 禁用按钮
    disabled.value = true
    // 执行搜索网络请求
    const requestData = { contents: input.value }
    if (radio.value === 1) {
      requestData.language = 'en'
    }
    const resp = await proxy.$api.nlp.gameTitle(requestData)
    // 请求出错
    if (typeof resp === 'string') {
      ElMessage.error(resp)
      // 解开按钮
      disabled.value = false
      return
    }
    const { status_code, score } = resp.data
    if (status_code === 200) {
      tableData.value = [
        {
          game: score.yes,
          nongame: score.no
        }
      ]
      // 展示结果区域
      resultShow.value = true
    } else {
      ElMessage.error('analyse failed')
    }
    // 解开按钮
    disabled.value = false
  }
}

// echarts
const getRadar = () => {
  mCharts = proxy.$echarts.init(proxy.$refs['news'])
  const option = {
    radar: {
      center: ['50%', '70%'],
      indicator: [
        { name: 'Precision', min: 0.93 },
        { name: 'Recall', min: 0.93 },
        { name: 'F Score', min: 0.93 }
      ],
      axisLabel: {
        show: true,
        formatter: function (value, index) {
          // console.log(value, index)
          const allowIndex = [0, 4]
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
      text: '游戏新闻能力展示\nMulti-Language (latency: 334.414ms, QPS: 299.03)\nEnglish (latency: 72.597ms, QPS: 1377)',
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
      data: ['Multi-Language', 'English'],
      orient: 'vertical',
      right: 10,
      top: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            name: 'Multi-Language',
            value: [0.9442, 0.9477, 0.9459]
          },
          {
            name: 'English',
            value: [0.9518, 0.9499, 0.9507]
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
  // window.addEventListener('resize', resizeChart)
  resizeObserver = new ResizeObserver(chartAdapter)
  resizeObserver.observe(document.getElementById('comprehension'))
})

onBeforeUnmount(() => {
  // window.removeEventListener('resize', resizeChart)
  resizeObserver.disconnect()
  mCharts.dispose()
})
</script>
