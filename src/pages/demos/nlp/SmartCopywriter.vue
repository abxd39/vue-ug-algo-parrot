<template>
  <Breadcrumb />
  <div class="outer-box" v-loading="loading">
    <el-card shadow="never">
      <el-form :model="copyForm" label-width="120px" :rules="rules" ref="copywriterFormRef" label-position="left">
        <el-form-item label="Length" prop="length">
          <el-radio-group v-model="copyForm.length">
            <el-radio v-for="item in lengthArr" :key="item" :label="item">{{ item }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="Quantity" prop="quantity">
          <el-input v-model.number="copyForm.quantity" style="width: 10%" />
        </el-form-item>
        <el-form-item label="Language" prop="language">
          <el-select v-model="copyForm.language" filterable placeholder="please select language">
            <el-option v-for="item in languageArr" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="Keyword">
          <el-button @click="addKeyword" type="primary" plain :icon="Plus" />
        </el-form-item>
        <el-form-item v-for="item in copyForm.keywords" :key="item.id">
          <el-input v-model="item.value" placeholder="input keyword" style="width: 30%" />
          <el-button @click="delKeyword(item.id)" type="danger" plain :icon="Minus" style="margin-left: 20px" />
        </el-form-item>
        <el-form-item label="Theme">
          <el-select v-model="copyForm.themes" multiple filterable placeholder="please select theme">
            <el-option v-for="item in themeArr" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">Generate</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="asset" v-show="copyArr.length > 0" shadow="never">
      <div style="display: flex; justify-content: flex-start; align-items: center">
        <input type="checkbox" @change="allCheckedChange" v-model="allChecked" />
        <h4 style="margin: 0">Result</h4>
        <el-button v-if="hasChecked" style="margin-left: 20px" size="small" type="primary" plain @click="copywriter">copy</el-button>
      </div>
      <el-divider />
      <div v-for="(item, index) in copyArr" :key="item.copy_number">
        <div style="display: flex; justify-content: flex-start; align-items: center">
          <input type="checkbox" v-model="item.checked" @change="checkedChange" />
          <p>{{ item.copy }}</p>
          <div style="margin-left: 10px; cursor: pointer; color: #409eff">
            <el-icon v-if="item.showReason" @click="hideReason(index)"><ArrowUp /></el-icon>
            <el-icon v-else @click="showReason(index)"><ArrowDown /></el-icon>
          </div>
        </div>
        <p v-if="item.showReason" style="color: #67c23a"><span class="title">reason:</span> {{ item.reason }}</p>
        <!-- <span v-else style="color: #409eff; cursor: pointer" @click="showReason(index)">show reason >></span> -->
        <el-divider />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, computed } from 'vue'
import { Plus, Minus } from '@element-plus/icons-vue'

import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'

import { nanoid } from 'nanoid'

const { proxy } = getCurrentInstance()

const lengthArr = [30, 110]
const languageArr = ['English', 'Brazil Portuguese', 'LATAM Spanish', 'Russian', 'Turkish', 'German', 'French', 'Arabic', 'Indonesian', 'Malay', 'Thai', 'Traditional Chinese', 'Vietnam', 'Bengali']
const themeArr = [
  {
    label: '无',
    value: ''
  },
  {
    label: 'aftermath',
    value: 'aftermath'
  },
  {
    label: 'alan walker',
    value: 'alan walker'
  },
  {
    label: 'a计划',
    value: 'a计划'
  },
  {
    label: 'baby shark',
    value: 'baby shark'
  },
  {
    label: 'blackpink',
    value: 'blackpink'
  },
  {
    label: 'eva',
    value: 'eva'
  },
  {
    label: 'gun',
    value: 'gun'
  },
  {
    label: 'ignition',
    value: 'ignition'
  },
  {
    label: 'line friend',
    value: 'line friend'
  },
  {
    label: 'livik',
    value: 'livik'
  },
  {
    label: 'nusa',
    value: 'nusa'
  },
  {
    label: '冰雪节',
    value: '冰雪节'
  },
  {
    label: '卡拉金',
    value: '卡拉金'
  },
  {
    label: '咒术回战',
    value: '咒术回战'
  },
  {
    label: '哥斯拉',
    value: '哥斯拉'
  },
  {
    label: '四周年',
    value: '四周年'
  },
  {
    label: '圣托里尼',
    value: '圣托里尼'
  },
  {
    label: '圣装',
    value: '圣装'
  },
  {
    label: '埃及',
    value: '埃及'
  },
  {
    label: '奖励',
    value: '奖励'
  },
  {
    label: '感染模式',
    value: '感染模式'
  },
  {
    label: '斋月',
    value: '斋月'
  },
  {
    label: '海岛',
    value: '海岛'
  },
  {
    label: '特斯拉',
    value: '特斯拉'
  },
  {
    label: '空中玩法',
    value: '空中玩法'
  },
  {
    label: '维寒迪',
    value: '维寒迪'
  },
  {
    label: '蜘蛛侠',
    value: '蜘蛛侠'
  },
  {
    label: '角色技能主题',
    value: '角色技能主题'
  },
  {
    label: '足球玩法',
    value: '足球玩法'
  },
  {
    label: '通用',
    value: '通用'
  },
  {
    label: '重火力',
    value: '重火力'
  }
]

const copyArr = ref([])
const allChecked = ref(true)
const hasChecked = computed(() => {
  for (const item of copyArr.value) {
    if (item.checked) {
      return true
    }
  }
  return false
})

const copyForm = reactive({
  length: lengthArr[0],
  quantity: 1,
  language: languageArr[0],
  keywords: [],
  themes: []
})

// 加载
const loading = ref(false)

// 添加关键字
const addKeyword = () => {
  copyForm.keywords.push({
    id: nanoid(),
    value: ''
  })
}

// 删除关键字
const delKeyword = id => {
  copyForm.keywords = copyForm.keywords.filter(item => item.id !== id)
}

const checkQuantity = (rule, value, callback) => {
  if (value < 1 || value > 8) {
    return callback(new Error('quantity should be more than 0 and less than 8'))
  }
  callback()
}

const rules = reactive({
  length: [{ required: true, message: 'please select length', trigger: 'blur' }],
  quantity: [
    { required: true, message: 'please input quantity', trigger: 'blur' },
    { type: 'number', message: 'must be a number' },
    { validator: checkQuantity, trigger: 'blur' }
  ],
  language: [{ required: true, message: 'please select language', trigger: 'blur' }]
})

const handleSubmit = () => {
  copyArr.value = []
  proxy.$refs.copywriterFormRef.validate(async valid => {
    if (valid) {
      // 构造请求参数
      const requestData = { request_body: {}, session_data: {} }
      const requestBody = JSON.parse(JSON.stringify(copyForm))
      requestBody.keywords = requestBody.keywords.map(item => item.value)
      requestBody.request_id = nanoid()
      requestData.request_body = requestBody
      // 构建参数并提交rule
      loading.value = true
      const resp = await proxy.$api.nlp.copywrite(requestData)
      loading.value = false
      // 请求出错
      if (typeof resp === 'string') {
        ElMessage.error(resp)
        return
      }
      const { ret_code, message, data } = resp.data
      if (ret_code === '0') {
        copyArr.value = data.copies.map(item => {
          // 默认全选，不显示原因
          item.checked = true
          item.showReason = false
          return item
        })
      } else {
        ElMessage.error(message || 'generate failed')
      }
    }
  })
}

const resetForm = () => {
  copyForm.length = lengthArr[0]
  copyForm.quantity = 1
  copyForm.language = languageArr[0]
  copyForm.keywords = []
  copyForm.themes = []
  copyArr.value = []
}

const showReason = index => {
  copyArr.value[index].showReason = true
}

const hideReason = index => {
  copyArr.value[index].showReason = false
}

// 全选改变
const allCheckedChange = () => {
  for (const index in copyArr.value) {
    copyArr.value[index].checked = allChecked.value
  }
}

// 某一个选择改变
const checkedChange = () => {
  for (const item of copyArr.value) {
    if (!item.checked) {
      allChecked.value = false
      return
    }
  }
  allChecked.value = true
}

// 复制选择的内容
const copywriter = () => {
  let text = ''
  copyArr.value.forEach(item => {
    if (item.checked) {
      text += item.copy + '\n'
    }
  })
  var textareaC = document.createElement('textarea')
  textareaC.setAttribute('readonly', 'readonly') //设置只读属性防止手机上弹出软键盘
  textareaC.value = text
  document.body.appendChild(textareaC) //将textarea添加为body子元素
  textareaC.select()
  document.execCommand('copy')
  document.body.removeChild(textareaC) //移除DOM元素
}
</script>

<style lang="less" scoped>
p {
  font-family: PingFang SC;
  font-size: 13px;
  color: #909399;
}

.title {
  padding-right: 5px;
  color: #606266;
  font-weight: bold;
  font-size: 14px;
}

.asset {
  input {
    margin-right: 10px;
  }
}
</style>
