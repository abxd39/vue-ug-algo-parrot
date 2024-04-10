<template>
  <Introduction>Help users experience the search box, auto-completion, search capabilities and more.</Introduction>
  <el-row class="asset">
    <el-col :span="12">
      <el-card shadow="hover">
        <el-radio-group v-model="radio">
          <el-radio :label="index" v-for="(item, index) in radioItems" :key="index">{{ item }}</el-radio>
        </el-radio-group>
        <el-row :gutter="5">
          <el-col :span="18">
            <!-- <el-input v-model="commonInput" placeholder="Please enter a keyword" @input="handleInputSearch" @blur="handleBlur" @focus="handleFocus" @keyup.enter.native="sendCommonSearch" />
              <el-card v-show="showSearchTemp">
                <p v-for="(item, index) in searchTemp" :key="index">{{ item }}</p>
              </el-card> -->
            <el-select v-model="value" filterable remote reserve-keyword placeholder="Please enter a keyword" :remote-method="remoteMethod" :loading="loading" clearable>
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="sendCommonSearch" :disabled="commonDisabled">Search</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
  </el-row>
  <el-card shadow="hover" v-show="commonResultShow" class="asset">
    <h4>Search Result</h4>
    <el-divider />
    <ul class="my-ul">
      <li v-for="(item, index) in commonResults" :key="index">{{ item }}</li>
    </ul>
  </el-card>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'

import Introduction from '@/components/introduction/Introduction.vue'

const { proxy } = getCurrentInstance()
// 普通查询
// 单选框组
const radioItems = ['All', 'Mobile', 'PC', 'Console', 'Company']
const radio = ref(0)
// 普通查询搜索框
const commonDisabled = ref(false)
const commonResultShow = ref(false)
const commonResults = ref([])
// const commonInput = ref('')
// let searchTemp = ref([])
// const showSearchTemp = ref(false)

// const handleInputSearch = async (value) => {
//   if (value.trim() === '') {
//     showSearchTemp.value = false
//     searchTemp.value = []
//   } else {
//     let resp = await proxy.$api.nplSearch({ count: 12, text: value })
//     if (typeof resp === 'string') {
//       ElMessage({
//         message: resp,
//         grouping: true,
//         type: 'error'
//       })
//       return
//     }
//     searchTemp.value = resp.data.completions
//     if (searchTemp.value.length > 0) {
//       showSearchTemp.value = true
//     }
//   }
// }
// const handleBlur = () => {
//   showSearchTemp.value = false
// }
// const handleFocus = () => {
//   if (searchTemp.value.length > 0) {
//     showSearchTemp.value = true
//   }
// }

// const sendCommonSearch = () => {
//   if (commonInput.value.trim() === '') {
//     ElMessage.error('The input value cannot be empty')
//   } else {
//     commonDisabled.value = true
//     // 执行搜索网络请求
//     commonInput.value = ''
//     // 拿到结果对相关参数赋值

//     // 展示结果区域
//     commonResultShow.value = true
//     commonDisabled.value = false
//   }
// }

const value = ref('')
const options = ref([])
const loading = ref(false)
// 自动搜索
const remoteMethod = async query => {
  if (query && query.trim()) {
    loading.value = true
    let resp = await proxy.$api.nlp.autoSearch({ count: 12, text: query.trim() })
    loading.value = false
    if (typeof resp === 'string') {
      ElMessage({
        message: resp,
        grouping: true,
        type: 'error'
      })
      return
    }
    const optionArr = []
    resp.data.completions.forEach(item => {
      optionArr.push({ label: item, value: item })
    })
    options.value = optionArr
  } else {
    options.value = []
  }
}

// 发送请求
// const token = ref('')
const sendCommonSearch = async () => {
  if (value.value.trim() === '') {
    ElMessage.error('The input value cannot be empty')
  } else {
    const loadingInstance = ElLoading.service({ target: document.getElementById('search'), lock: true, text: 'Loading' })
    // search按钮禁用
    commonDisabled.value = true
    // 执行搜索网络请求
    options.value = []
    // 获取token
    // if (!token.value) {
    //   const resp = await proxy.$api.nlp.searchToken({
    //     login_type: 'Basic',
    //     user_name: 'jasonzxyin',
    //     password: '123456'
    //   })
    //   if (typeof resp === 'string') {
    //     ElMessage.error(resp)
    //     // 取消按钮禁用
    //     commonDisabled.value = false
    //     return
    //   }
    //   const { code } = resp.data
    //   if (code === 200) {
    //     token.value = resp.headers.authorization
    //   } else {
    //     ElMessage.error('get token failed')
    //     return
    //   }
    // }
    // 发送搜索请求
    const entityType = radioItems[radio.value].toLowerCase()
    const resp = await proxy.$api.nlp.search(
      {
        keyword: value.value,
        entity_type: entityType,
        system_type: ''
      }
      // { token: token.value }
    )
    if (typeof resp === 'string') {
      // 取消按钮禁用
      commonDisabled.value = false
      loadingInstance.close()
      ElMessage.error(resp)
      return
    }
    const { data, code } = resp.data
    if (code === 0) {
      const results = data.map(item => item.entity_name)
      commonResults.value = results
      loadingInstance.close()
      // 展示结果区域
      commonResultShow.value = true
    } else {
      loadingInstance.close()
      ElMessage.error('search failed')
    }
    // 取消按钮禁用
    commonDisabled.value = false
  }
}
</script>

<style lang="less" scoped>
.el-select {
  width: 100%;
}

.my-ul {
  font-size: 13px;
  color: #606266;
  li:nth-child(2n + 1) {
    background-color: #f0f9eb;
  }
}
</style>
