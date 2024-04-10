<template>
  <Breadcrumb />
  <div class="outer-box">
    <el-empty v-if="allTableData.length === 0" :image-size="200" />
    <div v-else>
      <el-card v-for="item in allTableData" shadow="never" class="asset" style="text-align: center" :key="item.head">
        <h5 style="margin: 0">{{ item.head }}</h5>
        <el-table v-if="item.mergeColumns.length > 0" :data="item.data" style="width: 100%" size="small" border stripe :header-cell-style="headerCellStyle">
          <el-table-column type="expand">
            <template #default="props">
              <el-table :data="props.row.children" border size="small" stripe>
                <el-table-column v-for="sub in item.columns" :prop="sub.name" :label="sub.name" :min-width="sub.width" :key="sub.name">
                  <template v-if="sub.name === 'asset_url'" #default="scope">
                    <span @click="showAsset(scope.row.asset_url)" style="cursor: pointer; color: #409eff">{{ scope.row.asset_url }}</span>
                  </template>
                  <template v-else #default="scope">
                    <span v-if="scope.row.display_remark" :style="{ color: scope.row.display_remark }">{{ scope.row[sub.name] }}</span>
                    <span v-else>{{ scope.row[sub.name] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <template v-for="sub in item.mergeColumns" :key="sub.name">
            <el-table-column v-if="sub.name === 'number'" :prop="sub.name" :label="sub.name" />
            <el-table-column v-else :prop="sub.name" :label="sub.name" :width="sub.width" />
          </template>
        </el-table>
        <el-table v-else :data="item.data" style="width: 100%" size="small" border stripe :header-cell-style="headerCellStyle">
          <el-table-column v-for="sub in item.columns" :prop="sub.name" :label="sub.name" :min-width="sub.width" :key="sub.name">
            <template v-if="sub.name === 'asset_url'" #default="scope">
              <span @click="showAsset(scope.row.asset_url)" style="cursor: pointer; color: #409eff">{{ scope.row.asset_url }}</span>
            </template>
            <template v-else #default="scope">
              <span v-if="scope.row.display_remark" :style="{ color: scope.row.display_remark }">{{ scope.row[sub.name] }}</span>
              <span v-else>{{ scope.row[sub.name] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div style="text-align: center; margin-top: 30px">
        <img v-if="like === 1" :src="getImgSrc('like.svg')" width="25" style="margin-right: 20px; cursor: pointer" @click="clickLike" />
        <img v-else :src="getImgSrc('like-fill.svg')" width="25" style="margin-right: 20px; cursor: pointer" @click="clickLike" />
        <img v-if="dislike === 1" :src="getImgSrc('dislike.svg')" width="22" style="cursor: pointer" @click="clickDislike" />
        <img v-else :src="getImgSrc('dislike-fill.svg')" width="22" style="cursor: pointer" @click="clickDislike" />
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import { getCookie } from '@/utils/api_utils'

import { ref, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

const excludedColumns = ['dtstatdate', 'removal_logic', 'compo_id']
const restrictMerge = ['approval_status', 'policy_topic']
const removalMerge = ['campaign_region', 'campaign_type', 'campaign_name', 'campaign_spend']

const allTableData = ref([])
let game_code = ''
let dtstatdate = ''
let type = ''

let currentId = 0
const like = ref(1)
const dislike = ref(1)

const getImgSrc = name => {
  return new URL(`../../../assets/images/${name}`, import.meta.url).href
}

const getLikeStatus = async () => {
  const code = getCookie('code')
  if (!code) {
    ElMessage.error('get code err, please login again')
    return
  }
  const resp = await proxy.$api.cv.assistantsLikeStauts({
    game_code: game_code,
    dtstatdate: dtstatdate,
    code: code,
    type: type
  })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    currentId = data.id
    like.value = data.like
    dislike.value = data.dislike
  } else {
    ElMessage.error(message)
  }
}

const clickLike = async () => {
  const resp = await proxy.$api.cv.assistantsLike({
    id: currentId
  })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message } = resp.data
  if (ret_code === '0') {
    getLikeStatus()
  } else {
    ElMessage.error(message)
  }
}

const clickDislike = async () => {
  const resp = await proxy.$api.cv.assistantsDislike({
    id: currentId
  })
  // 请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, message } = resp.data
  if (ret_code === '0') {
    getLikeStatus()
  } else {
    ElMessage.error(message)
  }
}

// 获取路径参数game_code和dtstatdate
const getParams = () => {
  const hashArr = window.location.hash.split('?')
  if (hashArr.length !== 2) {
    return
  }
  const paramsArr = hashArr[1].split('&')
  if (paramsArr.length !== 2 && paramsArr.length !== 3) {
    ElMessage.error('params err')
    return
  }
  for (const item of paramsArr) {
    const oneParamArr = item.split('=')
    if (oneParamArr.length !== 2) {
      ElMessage.error('params format err')
      return
    }
    if (oneParamArr[0] === 'game_code') {
      game_code = oneParamArr[1]
    }
    if (oneParamArr[0] === 'dtstatdate') {
      dtstatdate = oneParamArr[1]
    }
    if (oneParamArr[0] === 'type') {
      type = oneParamArr[1]
    }
  }
  if (game_code === '' || dtstatdate === '' || type === '') {
    ElMessage.error('get game_code or dtstatdate or type failed')
    return
  }
  getData(game_code, dtstatdate, type)
}

const getData = async (game_code, dtstatdate, type) => {
  const code = getCookie('code')
  if (!code) {
    ElMessage.error('get code err, please login again')
    return
  }
  const resp = await proxy.$api.cv.assistants({
    game_code: game_code,
    dtstatdate: dtstatdate,
    code: code,
    type: type
  })
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    // ElMessage.success('get data success')
    const typeArr = type.split(',')
    const allData = []
    for (const item of typeArr) {
      const tableInfo = {
        head: '',
        data: [],
        columns: [],
        mergeColumns: []
      }
      tableInfo.head = item.trim().split('-')[1].toUpperCase().replaceAll('_', ' ')
      const tableData = data[item.trim()]
      const mergeColumsIndex = []
      const columnsIndex = []
      let isRestrict = true
      let isRemoval = true
      for (const item of restrictMerge) {
        if (!tableData.columns.includes(item)) {
          isRestrict = false
          break
        }
      }
      for (const item of removalMerge) {
        if (!tableData.columns.includes(item)) {
          isRemoval = false
          break
        }
      }
      tableData.columns.forEach((item, index) => {
        if (isRestrict && restrictMerge.includes(item)) {
          mergeColumsIndex.push(index)
        } else if (isRemoval && removalMerge.includes(item)) {
          mergeColumsIndex.push(index)
        } else {
          if (!excludedColumns.includes(item)) {
            columnsIndex.push(index)
          }
        }
      })
      // 判断是否有需要合并的项目
      const columnsWidthMap = {}
      if (mergeColumsIndex.length === 0) {
        tableData.rows.forEach(row => {
          const rowData = {}
          columnsIndex.forEach(index => {
            const columnName = tableData.columns[index]
            rowData[columnName] = row.value[index]
            // 获取所有列的数据，最后取最大长度，包括列字符串本身
            if (columnName in columnsWidthMap) {
              columnsWidthMap[columnName].push(row.value[index])
            } else {
              columnsWidthMap[columnName] = [columnName, row.value[index]]
            }
          })
          tableInfo.data.push(rowData)
        })
      } else {
        // 有合并项
        const tempData = []
        const rowMergeStrMap = {}
        tableData.rows.forEach(row => {
          const mergeRowData = {}
          let rowMergeStr = ''
          mergeColumsIndex.forEach(index => {
            const columnName = tableData.columns[index]
            if (columnName in columnsWidthMap) {
              columnsWidthMap[columnName].push(row.value[index])
            } else {
              columnsWidthMap[columnName] = [columnName, row.value[index]]
            }
            mergeRowData[columnName] = row.value[index]
            rowMergeStr += row.value[index]
          })
          mergeRowData['rowMergeStr'] = rowMergeStr
          if (!(rowMergeStr in rowMergeStrMap)) {
            rowMergeStrMap[rowMergeStr] = []
            tempData.push(mergeRowData)
          }

          const rowData = {}
          columnsIndex.forEach(index => {
            const columnName = tableData.columns[index]
            // 获取所有列的数据，最后取最大长度，包括列字符串本身
            if (columnName in columnsWidthMap) {
              columnsWidthMap[columnName].push(row.value[index])
            } else {
              columnsWidthMap[columnName] = [columnName, row.value[index]]
            }
            rowData[columnName] = row.value[index]
          })
          rowMergeStrMap[rowMergeStr].push(rowData)
        })
        // 合成数据
        for (const index in tempData) {
          tempData[index].children = rowMergeStrMap[tempData[index].rowMergeStr]
          tempData[index].number = tempData[index].children.length
        }
        tableInfo.data = tempData
      }
      // 计算字段宽度
      Object.keys(columnsWidthMap).forEach(key => {
        let maxLength = 0
        columnsWidthMap[key].forEach(item => {
          if (item.length > maxLength) {
            maxLength = item.length
          }
        })
        if (maxLength <= 5) {
          columnsWidthMap[key] = maxLength * 15
        } else if (maxLength > 5 && maxLength <= 20) {
          columnsWidthMap[key] = maxLength * 10
        } else if (maxLength > 20 && maxLength <= 50) {
          columnsWidthMap[key] = maxLength * 9
        } else if (maxLength > 50 && maxLength <= 60) {
          columnsWidthMap[key] = maxLength * 7
        } else {
          columnsWidthMap[key] = maxLength * 8.5
        }
      })
      mergeColumsIndex.forEach(index => {
        if (index === mergeColumsIndex[mergeColumsIndex.length - 1]) {
          tableInfo.mergeColumns.push({
            name: tableData.columns[index],
            width: columnsWidthMap[tableData.columns[index]]
          })
          tableInfo.mergeColumns.push({
            name: 'number',
            width: 100
          })
        } else {
          tableInfo.mergeColumns.push({
            name: tableData.columns[index],
            width: columnsWidthMap[tableData.columns[index]]
          })
        }
      })
      columnsIndex.forEach(index => {
        const name = tableData.columns[index]
        if (name !== 'display_remark') {
          tableInfo.columns.push({
            name: name,
            width: columnsWidthMap[tableData.columns[index]]
          })
        }
      })
      allData.push(tableInfo)
    }
    allTableData.value = allData
    // 查询点赞情况
    getLikeStatus()
  } else {
    ElMessage.error(message)
  }
}

const headerCellStyle = () => {
  return {
    color: '#000000',
    backgroundColor: '#dedfe0'
    // fontSize: '14px'
  }
}

getParams()

// youtube连接是一个页面，不能直接用video展示，改成连接跳转
const showAsset = asset_url => {
  if (!asset_url.startsWith('https://')) {
    asset_url = 'https://' + asset_url
  }
  window.open(asset_url, '_blank')
}
</script>
