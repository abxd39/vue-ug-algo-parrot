<template>
  <Introduction>
    With the ability of deep learning, the multi-language chat text can be monitored in real time by the plug-in sales text. This interface can effectively identify multiple languages of external
    sales text, can quickly help the game attack external sales channels and purify the chat environment.
  </Introduction>
  <el-row :gutter="20" class="asset">
    <el-col :span="12">
      <el-card shadow="never" :body-style="{ textAlign: 'center' }">
        <!-- <el-input v-model="input" maxlength="512" placeholder="Please enter a keyword" show-word-limit type="textarea" @keyup.enter.native="analyse" resize="none" /> -->
        <el-input v-model="input" maxlength="512" placeholder="Please enter a keyword" show-word-limit type="textarea" resize="none" />
        <el-button type="primary" @click="analyse" :disabled="disabled" class="asset">Analyse</el-button>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card shadow="never" :body-style="{ height: '210px' }">
        <div ref="hack" style="height: 100%; width: 100%"></div>
      </el-card>
    </el-col>
  </el-row>
  <el-card v-show="resultShow" class="asset" shadow="never">
    <h2>Analyse Result</h2>
    <el-table :data="tableData" style="width: 30%">
      <el-table-column prop="plug" label="Plug Probability" />
      <el-table-column prop="noplug" label="Non-Plug Probability" />
    </el-table>
  </el-card>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import Introduction from '@/components/introduction/Introduction.vue'

const { proxy } = getCurrentInstance()
const input = ref('自制透.追踪挂，有需要的可以查战绩，信誉卖家！包更包售后！')
const resultShow = ref(false)
const disabled = ref(false)
const tableData = ref([])
let mCharts, resizeObserver

// 点击发送请求
const analyse = async () => {
  if (input.value.trim() === '') {
    ElMessage.error('The input value cannot be empty')
  } else {
    const loadingInstance = ElLoading.service({ target: document.getElementById('security'), lock: true, text: 'Loading' })
    // 禁用按钮
    disabled.value = true
    // 执行搜索网络请求
    const requestData = { contents: input.value }
    const resp = await proxy.$api.nlp.hack(requestData)
    // 请求出错
    if (typeof resp === 'string') {
      // 解开按钮
      disabled.value = false
      loadingInstance.close()
      ElMessage.error(resp)
      return
    }
    const { status_code, score } = resp.data
    if (status_code === 200) {
      tableData.value = [
        {
          plug: score.yes,
          noplug: score.no
        }
      ]
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
  mCharts = proxy.$echarts.init(proxy.$refs['hack'])
  const option = {
    radar: {
      center: ['50%', '70%'],
      indicator: [{ name: 'Precision' }, { name: 'Recall' }, { name: 'F Score' }],
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
      text: '外挂能力展示\nMulti-Language (latency: 65.578ms, QPS: 1524)',
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
      data: ['Multi-Language'],
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
            value: [0.98, 0.98, 0.98]
          }
        ]
      }
    ]
  }
  mCharts.setOption(option)
  // 监听窗口变化
  window.onresize = function () {
    // 调用echarts实例对象的resize方法
    mCharts.resize()
  }
}

// echart尺寸改变
const chartAdapter = () => {
  mCharts.resize()
}

onMounted(() => {
  getRadar()
  resizeObserver = new ResizeObserver(chartAdapter)
  resizeObserver.observe(document.getElementById('security'))
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
  mCharts.dispose()
})
</script>
