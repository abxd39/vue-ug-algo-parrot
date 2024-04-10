<template>
  <Breadcrumb />
  <div class="outer-box">
    <el-form :model="form" label-width="80px" label-position="left">
      <el-form-item label="Style:">
        <el-select v-model="form.style" placeholder="Select Style" @change="styleChange" clearable>
          <el-option v-for="(item, index) in styleArr" :key="index" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.style === styleArr[1]" label="Clothes:">
        <el-radio-group v-model="form.clothes">
          <el-radio v-for="(item, index) in clothesArr" :key="index" :label="item" />
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-row :gutter="15">
      <el-col :span="16">
        <el-upload
          drag
          action="/sd/img2img"
          accept=".png,.jpg,.jpeg"
          :on-success="handleSuccess"
          :on-error="handleError"
          :before-upload="beforeUpload"
          v-loading="loading"
          :on-progress="onProgress"
          :show-file-list="false"
          :data="{ style: form.style.toLowerCase().split(' ').join('_'), clothes: form.clothes.toLowerCase().split(' ').join('_') }"
        >
          <el-icon class="el-icon--upload" style="font-size: 100px"><upload-filled /></el-icon>
          <div class="el-upload__text" style="font-size: 16px">Drop file here or <em>click to upload</em></div>
          <template #tip>
            <div class="el-upload__tip" style="color: #e6a23c">jpg/jpeg/png file with a size less than 10M.</div>
          </template>
        </el-upload>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never" :body-style="{ height: '174px', overflow: 'auto' }">
          <h4 style="margin: 0">Progress<span style="font-size: 13px; font-weight: 400; color: #e6a23c; padding-left: 5px">(It takes about 10 seconds)</span></h4>
          <el-divider />
          <div style="text-align: center">
            <el-progress type="circle" :percentage="progress.percentage" :status="progress.status" />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="15" class="asset">
      <el-col :span="6">
        <el-card shadow="never" :body-style="{ height: '392px', overflow: 'auto' }">
          <h4 style="margin: 0">Raw Image</h4>
          <el-divider />
          <div v-if="raw_file_url" style="display: flex; justify-content: flex-start; flex-wrap: wrap">
            <!-- <img :src="raw_file_url" height="130" style="margin-right: 20px" /> -->
            <div class="image-border">
              <img :src="raw_file_url" style="width: 100%" />
            </div>
            <el-descriptions :column="1">
              <el-descriptions-item label="name:">{{ fileDes.name }}</el-descriptions-item>
              <el-descriptions-item label="type:">{{ fileDes.type }}</el-descriptions-item>
              <el-descriptions-item label="size:">{{ fileDes.size }}</el-descriptions-item>
            </el-descriptions>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-card shadow="never" :body-style="{ height: '392px', overflow: 'auto' }">
          <h4 style="margin: 0">Result</h4>
          <el-divider />
          <div style="display: flex; justify-content: flex-start; flex-wrap: wrap">
            <div v-for="(image, index) in images" :key="index" class="image-border">
              <img :src="image" style="width: 100%" />
              <a @click="downloadImg(image)">
                <el-icon><Download /></el-icon>
              </a>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import { UploadFilled } from '@element-plus/icons-vue'
import axios from 'axios'

const imageTypeArr = ['image/png', 'image/jpeg']
const imageSizeLimit = 10 * 1024 * 1024
//const styleArr = ['March 7th', 'PUBGM Holy Clothes']
const styleArr = ['', '']
// pubgm特定选项
const clothesArr = ['Jacket 1']
const form = reactive({
  style:'',
  clothes: clothesArr[0]
})
const raw_file_url = ref('')
const images = ref([])
const fileDes = reactive({
  name: '',
  type: '',
  size: ''
})
const loading = ref(false)
const progress = reactive({
  percentage: 0,
  status: ''
})
let timer

const clearResult = () => {
  images.value = []
  raw_file_url.value = ''
  progress.percentage = 0
  progress.status = ''
}

const styleChange = value => {
  // 回到最初的选择
  if (value === styleArr[0]) {
    form.clothes = clothesArr[0]
  }
  clearResult()
}


const beforeUpload = rawFile => {
  clearResult()
  // console.log(rawFile)
  const fileType = rawFile.type
  const fileSize = rawFile.size
  if (!imageTypeArr.includes(fileType)) {
    ElMessage.error('image type must be png or jpg or jpeg')
    return false
  }
  if (fileSize > imageSizeLimit) {
    ElMessage.error('image size must less than 10M')
    return false
  }
  fileDes.name = rawFile.name
  fileDes.type = fileType
  fileDes.size = (fileSize / 1024).toFixed(2) + 'kb'
}

const onProgress = () => {
  loading.value = true
  if (timer) {
    clearInterval(timer)
  }
  timer = setInterval(() => {
    if (progress.percentage < 90) {
      progress.percentage += 5
    }
  }, 600)
}

const handleSuccess = resp => {
  loading.value = false
  const { ret_code, message, data } = resp
  if (ret_code === '0') {
    clearTimer('success')
    images.value = data.to_image_url
    raw_file_url.value = data.raw_file_url
  } else {
    clearTimer('warning')
    ElMessage.error(message)
  }
}

const handleError = error => {
  clearTimer('exception')
  loading.value = false
  ElMessage.error(error.message)
}

const clearTimer = status => {
  if (timer) {
    clearInterval(timer)
  }
  progress.percentage = 100
  progress.status = status
}

const downloadImg = img => {
  if (img) {
    img = img.slice(54) // 去掉https://ua-sg-1300342648.cos.ap-singapore.myqcloud.com
    const filename = img.split('/').pop()
    let x = new XMLHttpRequest()
    x.open('GET', img, true)
    x.responseType = 'blob'
    x.onload = function (e) {
      let url = window.URL.createObjectURL(x.response)
      let a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
    }
    x.send()
  }
}

// const downloadImg = img => {
//   console.log(img)
//   var imgurl=img
//   if (img) {
//     img = img.slice(54) // 去掉https://ua-sg-1300342648.cos.ap-singapore.myqcloud.com
//     const filename = img.split('/').pop()
//     axios(
//       {
//         responseType:'blob',
//         url:imgurl,
//         method:'get'
//       }
//     ).then(response=>{
//       const url = URL.createObjectURL(response)
//     const link = document.createElement('a') // 创建a标签
//     link.href = url
    
//     // 下载文件名一般会用响应头'content-disposition'中的filename属性值。其格式一般为：Content-Disposition: attachment; filename="filename.jpg"。
//     //const filename = response.headers["content-disposition"].split("filename=")[1]
//     link.download = decodeURIComponent(filename) // 如果需要自定义下载文件名，则手动设置 
//     link.click()
//     URL.revokeObjectURL(url) // 释放内存
//     })
//   }
// }
</script>

<style lang="less" scoped>
.image-border {
  width: 200px;
  height: 350px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #dedfe0;
  position: relative;
  a {
    position: absolute;
    right: 0;
    top: 0;
    font-size: 20px;
    color: #409eff;
  }
}
</style>
