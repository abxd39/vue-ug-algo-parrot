<template>
  <Introduction>
    This service can effectively support Chinese/English/multi-language named entity recognition ability, currently can identify the text of the company and the name of the game two entities.
  </Introduction>
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
        <div ref="ner" style="height: 100%; width: 100%"></div>
      </el-card>
    </el-col>
  </el-row>
  <div v-show="resultShow" class="asset">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never">
          <h4>NER Analyse Result</h4>
          <el-divider />
          <div>
            <template v-for="(item, index) in results" :key="index">
              <span v-if="typeof item === 'string'">{{ item }}</span>
              <el-tag v-else :type="item.type" size="large">{{ item.name }}</el-tag>
            </template>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <h4>Legend</h4>
          <el-divider />
          <div>
            <el-tag v-for="(item, index) in legend" :key="index" :type="item.type" size="large">{{ item.name }}</el-tag>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import Introduction from '@/components/introduction/Introduction.vue'

const { proxy } = getCurrentInstance()
const radioItems = reactive(['Multi-Language', 'English', 'Chinese'])
const radio = ref(0)
const input = ref('The monster-themed action/adventure/strategy game “Kaiju Commander” has just been announced for PC')
const resultShow = ref(false)
const disabled = ref(false)
const legend = reactive([
  { name: 'game', type: '' },
  { name: 'company', type: 'success' }
])
const results = ref([])
let mCharts, resizeObserver

// 点击发送请求
const analyse = async () => {
  if (input.value.trim() === '') {
    ElMessage.error('The input value cannot be empty')
  } else {
    const loadingInstance = ElLoading.service({ target: document.getElementById('comprehension'), lock: true, text: 'Loading' })
    // 禁用按钮
    disabled.value = true
    // 执行搜索网络请求
    const requestData = { contents: input.value }
    if (radio.value === 1) {
      requestData.language = 'en'
    } else if (radio.value === 2) {
      requestData.language = 'cn'
    }
    const resp = await proxy.$api.nlp.ner(requestData)
    // 请求出错
    if (typeof resp === 'string') {
      // 解开按钮
      disabled.value = false
      loadingInstance.close()
      ElMessage.error(resp)
      return
    }
    const { status_code, contents, game, company } = resp.data
    if (status_code === 200) {
      // 没有接口文档，暂时这样处理
      var gameStr = ''
      var companyStr = ''
      const contentStr = contents[0]
      if (game[0].length > 0) {
        gameStr = game[0][0]
      }
      if (company[0].length > 0) {
        companyStr = company[0][0]
      }
      var contentArr = [contentStr]
      if (gameStr) {
        contentArr = contentStr.split(gameStr)
      }
      //   拆分后
      if (contentArr.length > 1) {
        // 需要填的缝隙数
        const i = contentArr.length - 1
        for (let j = 1; j <= i; j++) {
          contentArr.splice(2 * j - 1, 0, {
            name: gameStr,
            type: ''
          })
        }
      }
      // console.log(contentArr)
      //   公司的拆分ToDo
      results.value = contentArr
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
}

// echarts
const getRadar = () => {
  mCharts = proxy.$echarts.init(proxy.$refs['ner'])
  const option = {
    radar: {
      center: ['50%', '70%'],
      indicator: [
        { name: 'Precision', min: 0.87 },
        { name: 'Recall', min: 0.87 },
        { name: 'F Score', min: 0.87 }
      ],
      axisLabel: {
        show: true,
        formatter: function (value, index) {
          // console.log(value, index)
          const allowIndex = [0, 3, 5]
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
      text: 'NER能力展示\n(English latency: 651.688ms, QPS: 1227)',
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
      data: ['Chinese', 'English'],
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
            name: 'Chinese',
            value: [0.9039, 0.9094, 0.9067]
          },
          {
            name: 'English',
            value: [0.9458, 0.8899, 0.9168]
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
  // 监听windows不够，左侧菜单收缩windows大小没有变化，图形也不会resize
  resizeObserver = new ResizeObserver(chartAdapter)
  resizeObserver.observe(document.getElementById('comprehension'))
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
  mCharts.dispose()
})
</script>
