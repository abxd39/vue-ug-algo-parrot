<template>
  <Introduction>
    Public opinion needs to pay attention to what topics players discuss in stores or social media platforms, and conduct timely analysis and tracking based on these topics. Public opinion topic
    identification is mainly based on the model to predict each comment and identify the corresponding topic.
  </Introduction>
  <el-card shadow="never" :body-style="{ textAlign: 'center' }" class="asset">
    <el-radio-group v-model="radio">
      <el-radio :label="index" v-for="(item, index) in radioItems" :key="index">{{ item }}</el-radio>
    </el-radio-group>
    <el-input v-model="input" maxlength="512" placeholder="Please enter a keyword" show-word-limit type="textarea" resize="none" />
    <el-button type="primary" @click="analyse" :disabled="disabled" class="asset">Analyse</el-button>
  </el-card>
  <el-card v-show="resultShow" class="asset" shadow="never">
    <h2>Analyse Result</h2>
    <el-row>
      <el-col :span="10">
        <el-table :data="tableData">
          <el-table-column prop="category" label="Category" />
          <el-table-column prop="output" label="Algorithm Output" />
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
import { ref, getCurrentInstance, reactive } from 'vue'
import Introduction from '@/components/introduction/Introduction.vue'

const { proxy } = getCurrentInstance()
const input = ref('this game lag too much! please fix it!')
const resultShow = ref(false)
const disabled = ref(false)
const tableData = ref([])
const labelResult = ref('')
const radioItems = reactive(['English'])
const radio = ref(0)

// 点击发送请求
const analyse = async () => {
  if (input.value.trim() === '') {
    ElMessage.error('The input value cannot be empty')
  } else {
    const loadingInstance = ElLoading.service({ target: document.getElementById('opinion'), lock: true, text: 'Loading' })
    // 禁用按钮
    disabled.value = true
    // 执行搜索网络请求
    const resp = await proxy.$api.nlp.topic({ content: input.value, language: 'en' })

    // 请求出错
    if (typeof resp === 'string') {
      // 解开按钮
      disabled.value = false
      loadingInstance.close()
      ElMessage.error(resp)
      return
    }
    const { status_code, tags_probability, tags } = resp.data
    if (status_code === 200) {
      labelResult.value = tags
      const tagArr = []
      Object.keys(tags_probability).forEach(key => {
        tagArr.push({
          category: key,
          output: tags_probability[key]
        })
      })
      tableData.value = tagArr
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
</script>

<style lang="less" scoped>
.label {
  margin-top: 80px;
}
</style>
