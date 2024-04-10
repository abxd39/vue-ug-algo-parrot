<template>
  <Introduction>
    In the game chat scene, there are many malicious texts. This service can effectively combat malicious promotion, racial discrimination, pornography, account transaction, abuse and other texts in
    the multi-language environment, and can effectively help the game business security team to combat game hacking.
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
        <div ref="security" style="height: 100%; width: 100%"></div>
      </el-card>
    </el-col>
  </el-row>
  <el-card v-show="resultShow" class="asset" shadow="never">
    <h2>Analyse Result</h2>
    <el-row>
      <el-col :span="10">
        <el-table :data="tableData">
          <el-table-column prop="dimension" label="Dimension" />
          <el-table-column prop="credibility" label="Credibility" />
        </el-table>
      </el-col>
      <el-col :span="4"> </el-col>
      <el-col :span="6">
        <el-card shadow="hover" class="label">
          <h4>Conclusion</h4>
          <el-divider />
          <el-tag size="large">{{ labelResult }}</el-tag>
        </el-card>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted, onBeforeUnmount } from 'vue'
import Introduction from '@/components/introduction/Introduction.vue'

const { proxy } = getCurrentInstance()
const input = ref('体验服地铁再次上架加油特种兵#需要邀请码进qq团：126275367357')
const resultShow = ref(false)
const disabled = ref(false)
const tableData = ref([])
const labelResult = ref('')
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
    const resp = await proxy.$api.nlp.security({ contents: input.value })
    // 请求出错
    if (typeof resp === 'string') {
      // 解开按钮
      disabled.value = false
      loadingInstance.close()
      ElMessage.error(resp)
      return
    }
    const { status_code, score, label } = resp.data
    if (status_code === 200) {
      labelResult.value = label
      const scoreArr = []
      Object.keys(score).forEach(key => {
        scoreArr.push({
          dimension: key,
          credibility: score[key]
        })
      })
      tableData.value = scoreArr
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
  mCharts = proxy.$echarts.init(proxy.$refs['security'])
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
      text: '内容安全能力展示\nMulti-Language (latency: 18ms, QPS: 1735)',
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
            value: [0.8, 0.81, 0.8]
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
  resizeObserver.observe(document.getElementById('security'))
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
  mCharts.dispose()
})
</script>

<style lang="less" scoped>
.label {
  margin-top: 80px;
}
</style>
