<template>
  <Breadcrumb />
  <div class="outer-box">
    <el-card shadow="never" v-loading="loading">
      <el-form ref="generateRef" :model="form" label-width="150px" label-position="left" :rules="rules">
        <el-form-item>
          <el-alert title="Text Only English" type="warning" show-icon :closable="false" />
        </el-form-item>
        <el-form-item label="Text:" prop="text">
          <el-input v-model="form.text" type="textarea" placeholder="Please input content" maxlength="250" show-word-limit style="width: 50%" />
        </el-form-item>
        <el-form-item label="Style:" prop="style">
          <el-radio-group v-model="form.style" @change="RadioChange(form)">
            <template v-for="item in styleArr" :key="item.label">
              <el-tooltip effect="dark" :content="item.trans" placement="top">
                <el-radio :label="item.label" />
              </el-tooltip>
            </template>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="Upload Source Audio:" width="80px">
          <el-upload
            ref="upload"
            accept=".wav,.mp3,.ogg,.webm,.m4a,.aifc"
            :action="cvUrl.cv.audio"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="beforeUpload"
            :v-loading="loading"
            :show-file-list="true"
            :file-list="file_list"
            :auto-upload="true"
            :disabled="uploadDisabled"
          >
            <el-button type="primary" @click="Onclick" :disabled="uploadDisabled">select audio</el-button>
            <template #tip>
              <div class="el-upload__tip" style="color: #e6a23c">the recommended duration is between 3s-15s, the longest not exceeding 1min</div>
            </template>
          </el-upload>
        </el-form-item>
        <el-form-item label="Emotion:">
          <el-col :span="3">
            <el-select v-model="emotionCurrent" placeholder="select emotion" @change="emotionChange" :disabled="emotionDisabled" style="width: 100%">
              <el-option v-for="item in emotion" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-col>
          <el-col :span="1"></el-col>
          <el-col :span="5">
            <el-form-item label="Speech Rate" label-width="100px">
              <el-slider :step="0.1" :min="0" v-model="speechValue" :max="2" style="width: 80%" @change="speechChange" :disabled="speechDisabled" />
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submit" :disabled="submitDisabled">Submit</el-button>
          <el-button @click="reset">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-progress :percentage="progress.percentage" :status="progress.status" />
    <el-card v-if="audioUrl" shadow="never" class="asset">
      <h4 style="margin: 0">Result</h4>
      <el-divider />
      <audio :src="audioUrl" controls></audio>
    </el-card>
  </div>
</template>

<script setup>
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import { ref, reactive, getCurrentInstance } from 'vue'
import { nanoid } from 'nanoid'
import cvUrl from '@/api/url'
const { proxy } = getCurrentInstance()
const styleArr = [
  {
    label: 'standard male voice',
    trans: '标准男音'
  },
  {
    label: 'standard female voice',
    trans: '标准女音'
  },
  {
    label: 'linzhiling voice',
    trans: '林志玲'
  },
  {
    label: 'trump voice',
    trans: '川普'
  },
  {
    label: 'taylor swift voice',
    trans: '霉霉'
  },
  {
    label: 'customization voice',
    trans: '自定义音频'
  }
]

const emotion = [
  {
    label: 'Neutral',
    value: 1
  },
  {
    label: 'Happy',
    value: 2
  },
  {
    label: 'Sad',
    value: 3
  },
  {
    label: 'Surprise',
    value: 4
  },
  {
    label: 'Angry',
    value: 5
  },
  {
    label: 'Dull',
    value: 6
  }
]
const audioSizeLimit = 10 * 1024 * 1024
const audioUrl = ref('')
const raw_file_url = ref('')
const source_audio_url = ref('')
const submitDisabled = ref(false)
const file_list = ref([])
const uploadDisabled = ref(true)
const emotionCurrent = ref(1)
const speechValue = ref(1.0)
// const fileList = ref([])
const speechDisabled=ref(true)
const emotionDisabled=ref(true)
const form = reactive({
  text: '',
  style: ''
})
const loading = ref(false)
const progress = reactive({
  percentage: 0,
  status: ''
})

const fileDes = reactive({
  name: '',
  type: '',
  size: ''
})
let timer
const AudioTypeArr = ['audio/x-m4a', 'audio/mpeg', 'audio/ogg', 'audio/rn-mpeg', 'audio/mp3', 'audio/wav', 'audio/x-ms-wax', 'audio/x-ms-wma', 'audio/x-musicnet-stream', 'audio/aiff']

const rules = reactive({
  text: [{ required: true, message: 'The text should not be empty!', trigger: 'blur' }],
  style: [{ required: true, message: 'please select style', trigger: 'blur' }]
})

const submit = () => {
  proxy.$refs.generateRef.validate(async valid => {
    if (valid) {
      loading.value = true
      audioUrl.value = ''
      progress.percentage = 0
      progress.status = ''
      if (timer) {
        clearInterval(timer)
      }
      timer = setInterval(() => {
        if (progress.percentage < 95) {
          progress.percentage += 5
        }
      }, 500)
      var filePath = ''
      if (source_audio_url.length != 0) {
        filePath = source_audio_url.value.toString().split('com/')[1]
      }
      var emotionStr=''
      for (let i=0;i<emotion.length;i++){
        if (emotion[i].value===emotionCurrent.value){
          emotionStr=emotion[i].label
          break
        }
      }
      
      const resp = await proxy.$api.nlp.audioGenerate({
        request_body: {
          request_id: nanoid(),
          content: form.text.trim(),
          predefine_mode: form.style,
          customization_voice: filePath ? filePath.toString() : '',
          emotion:  filePath ? emotionStr : '',
          speed:filePath ? speechValue.value : 0
        },
        session_data: {}
      })
      loading.value = false
      // 请求出错
      if (typeof resp === 'string') {
        clearTimer('exception')
        ElMessage.error(resp)
        return
      }
      const { ret_code, data, message } = resp.data
      if (ret_code === '0') {
        clearTimer('success')
        audioUrl.value = data.target_audio
      } else {
        clearTimer('warning')
        ElMessage.error(message || 'audio generate err')
      }
    }
  })
}

const clearTimer = status => {
  if (timer) {
    clearInterval(timer)
  }
  progress.percentage = 100
  progress.status = status
}

const Onclick = () => {
  form.style = styleArr[5].label
}

const RadioChange = form => {
  proxy.$refs.upload.clearFiles()
  source_audio_url.value = ''
  submitDisabled.value = false
  if (form.style === 'customization voice') {
    uploadDisabled.value = false
    emotionDisabled.value=false
  speechDisabled.value=false
  } else {
    uploadDisabled.value = true
    emotionDisabled.value=true
  speechDisabled.value=true
    proxy.$refs.upload.clearFiles()
    source_audio_url.value = ''
  }
}

const reset = () => {
  proxy.$refs.upload.clearFiles()
  source_audio_url.value = ''
  form.text = ''
  form.style = ''
  audioUrl.value = ''
  progress.percentage = 0
  progress.status = ''
  emotionDisabled.value=true
  speechDisabled.value=true
  uploadDisabled.value=true
}

const handleError = error => {
  loading.value = false
  submitDisabled.value = false
  ElMessage.error(error.message)
}

const handleSuccess = resp => {
  loading.value = false
  submitDisabled.value = false
  const { ret_code, message, cos_url } = resp
  if (ret_code === '0') {
    source_audio_url.value = cos_url
  } else {
    ElMessage.error(message)
  }
}

const beforeUpload = rawFile => {
  source_audio_url.value = ''
  const fileType = rawFile.type
  const fileSize = rawFile.size
  if (!AudioTypeArr.includes(fileType)) {
    ElMessage.error('audio type must be .wav .mp3 .ogg .webm .m4a .aifc')
    return false
  }
  if (fileSize > audioSizeLimit) {
    ElMessage.error('the recommended duration is between 3s-15s, the longest not exceeding 1min')
    return false
  }
  fileDes.name = rawFile.name
  fileDes.type = fileType
  fileDes.size = (fileSize / 1024).toFixed(2) + 'kb'
  //在文件上传过程中禁用 submit 按钮
  submitDisabled.value = true
}

const speechChange = val => {
  speechValue.value=val
}

const emotionChange=()=>{
  speechValue.value=1.0
}
</script>

<style scoped>
.el-alert {
  width: 50%;
}
</style>
