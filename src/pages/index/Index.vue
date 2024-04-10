<template>
  <el-breadcrumb :separator-icon="ArrowRight">
    <el-breadcrumb-item>Index</el-breadcrumb-item>
    <el-breadcrumb-item>Index</el-breadcrumb-item>
  </el-breadcrumb>
  <div class="outer-box">
    <h1>▌The home for both algorithm researchers and engineers</h1>
    <p style="color: #303133">
      Welcome to our algorithm portal, which provides access to our team's Polaris metrices, a large number of algorithm service demos, and a variety of tools to improve productivity.
    </p>
    <el-row class="index-row" :gutter="15">
      <el-col :span="8">
        <el-card shadow="never">
          <img :src="getImgSrc('update.svg')" />
          <h4 class="title">Version Update</h4>
          <el-divider />
          <el-timeline>
            <el-timeline-item :timestamp="item.time" placement="top" type="success" v-for="(item, index) in allData.version" :key="index">
              <el-card>
                <h4>{{ item.title }}</h4>
                <ul class="temp-ul">
                  <li v-for="(subItem, subIndex) in item.detail" :key="subIndex">{{ subItem }}</li>
                </ul>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <img :src="getImgSrc('news.svg')" />
          <h4 class="title">News</h4>
          <el-divider />
          <ul class="custom-ul">
            <li v-for="(item, index) in allData.news" :key="index">
              <img :src="getImgSrc('newsItem.svg')" />
              <!--  target="_blank" -->
              <a :href="item.link" target="_blank">{{ item.title }}</a>
            </li>
          </ul>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="never">
          <img :src="getImgSrc('hot.svg')" />
          <h4 class="title">Hot Articles</h4>
          <el-divider />
          <ul class="custom-ul">
            <li v-for="(item, index) in allData.articles" :key="index">
              <img :src="getImgSrc('article.svg')" />
              <!--  target="_blank" -->
              <a :href="item.link" target="_blank">{{ item.title }}</a>
            </li>
          </ul>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { getCurrentInstance, reactive, onMounted } from 'vue'
import { ArrowRight } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()
const allData = reactive({
  version: [],
  news: [],
  articles: []
})

const getImgSrc = name => {
  return new URL(`../../assets/images/${name}`, import.meta.url).href
}

// 获取七彩石首页配置信息
const getData = async () => {
  // dev环境
  let envName = 'local'
  if (window.location.hostname === 'algo.intltest11.com') {
    envName = 'dev'
  } else if (window.location.hostname === 'algo.intlgame.com') {
    envName = 'pro'
  }
  const resp = await proxy.$api.rainbow.rainbow({
    app_id: 'e1eaa1f0-0d45-4c98-8f6b-29cdc4e16c95',
    group: 'ug-algo-service.portal.index',
    env_name: envName
  })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, items, ret_msg } = resp.data
  if (ret_code === 0) {
    if (items.length >= 1) {
      const rows = items[0].tables.rows
      const tempVersion = []
      const tempNews = []
      const tempArticles = []
      rows.forEach(item => {
        const itemObj = JSON.parse(item)
        if (itemObj.is_active === '1') {
          // 版本升级
          if (itemObj.type === '1') {
            tempVersion.push({
              time: itemObj.create_date,
              title: itemObj.title,
              detail: itemObj.content.split('\n')
            })
          } else if (itemObj.type === '2') {
            tempNews.push({
              title: itemObj.title,
              link: itemObj.link
            })
          } else {
            tempArticles.push({
              title: itemObj.title,
              link: itemObj.link
            })
          }
        }
      })
      allData.version = tempVersion.sort(compare)
      allData.news = tempNews
      allData.articles = tempArticles
    }
  } else {
    ElMessage.error(ret_msg || 'get rainbow data failed')
  }
}

// 时间降序排列
const compare = (obj1, obj2) => {
  const time1 = obj1.time
  const time2 = obj2.time
  if (time1 < time2) {
    return 1
  } else if (time1 > time2) {
    return -1
  } else {
    return 0
  }
}

onMounted(() => {
  getData()
})
</script>

<style lang="less" scoped>
h1 {
  font-size: 30px;
  margin: 30px 0;
}

.index-row {
  margin-top: 30px;
  .title {
    display: inline-block;
    margin: 0;
  }
  img {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }
}

.temp-ul {
  list-style: circle;
  color: #606266;
  padding-left: 30px;
  li {
    padding: 5px;
  }
}

.custom-ul {
  li {
    padding: 10px;
    font-size: 14px;
    img {
      width: 16px;
      height: 16px;
    }
    // a:visited {
    //   color: #95d475;
    // }
  }
  li:hover {
    background-color: #f4f4f5;
  }
}
</style>
