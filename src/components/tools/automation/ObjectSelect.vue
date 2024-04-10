<template>
  <el-dialog v-model="objectVisible" title="Select Campaigns" width="60%" align-center draggable :show-close="false" :close-on-click-modal="false" :close-on-press-escape="false">
    <el-table :data="showObjectArr" style="width: 100%; height: 500px" stripe size="small">
      <el-table-column width="50">
        <template #header>
          <!-- 这里绑定的事件应该为change事件，而不是click事件 -->
          <input type="checkbox" @change="selectAllObject" v-model="allChecked" />
        </template>
        <template #default="scope">
          <!-- 这里绑定的事件应该为change事件，而不是click事件 -->
          <input type="checkbox" v-model="scope.row.checked" @change="selectObject(scope.row)" />
        </template>
      </el-table-column>
      <!-- <el-table-column type="selection" width="55" /> -->
      <el-table-column property="name" label="campaign name" width="600" sortable />
      <el-table-column property="budget" label="media budget" width="100" show-overflow-tooltip />
      <el-table-column align="right" width="300">
        <template #header>
          <div style="display: flex">
            <el-input v-model="searchObjectStr" size="small" placeholder="search campaign" clearable @clear="clearObjectSearch" />
            <el-button :icon="Search" size="small" type="primary" style="margin-left: 3px" @click="searchObject" />
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="cancelSelectObject">Cancel</el-button>
        <el-button type="primary" @click="confirmSelectObject"> Confirm </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, getCurrentInstance, toRefs } from 'vue'
import { Search } from '@element-plus/icons-vue'

const { proxy } = getCurrentInstance()

const objectVisible = ref(false)
const allObjectArr = ref([])
const showObjectArr = ref([])
const allChecked = ref(false)
const searchObjectStr = ref('')
let selectObjectArr = [] //点击Cancel 恢复原来的选择
let selectObjectNew = [] //新的变更

//let budgetSum = 0

// 父组件传递过来的参数
const props = defineProps({
  game_code: {
    type: String,
    required: true
  },
  campaign_type: {
    type: [Number, String],
    required: true
  },
  code: {
    type: String,
    required: true
  }
})

const { game_code, campaign_type, code } = toRefs(props)

// 触发父组件的方法
const emits = defineEmits(['updateObject'])

// 获取当前所有的object
// 这里不能直接用上面传递的三个参数，值是更新之前的，目前还没找到原因
const getAllObjectArr = async (game_code, campaign_type, code, oldObjectArr) => {
  if (game_code === '' || campaign_type === '') {
    return
  }
  if (!code) {
    ElMessage.error('get code err, please login again')
    return
  }
  const resp = await proxy.$api.automation.campaign({ game_code: game_code, campaign_type: campaign_type, code: code })
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    if (selectObjectArr.length === 0) {
      allObjectArr.value = data
      showObjectArr.value = allObjectArr.value
    }

    if (oldObjectArr) {
      selectObjectArr = oldObjectArr
      showObjectArr.value.forEach(item => {
        if (selectObjectArr.includes(item.name)) {
          item.checked = true
        }
      })
      checkIsAllChecked()
    }
  } else {
    ElMessage.error(message || 'get objects err')
  }
}

// 搜索框搜索object
const queryObject = async campaign_name => {
  if (!code.value) {
    ElMessage.error('get code err, please login again')
    return
  }
  const resp = await proxy.$api.automation.campaign({
    game_code: game_code.value,
    campaign_type: campaign_type.value,
    campaign_name: campaign_name,
    code: code.value
  })
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    showObjectArr.value = data
    // 需要标记出选择的
    showObjectArr.value.forEach(item => {
      if (selectObjectArr.includes(item.name)) {
        item.checked = true
      }
    })
    checkIsAllChecked()
  } else {
    ElMessage.error(message || 'get objects err')
  }
}

// 搜索object
const searchObject = () => {
  if (searchObjectStr.value.trim() === '') {
    clearObjectSearch()
  } else {
    queryObject(searchObjectStr.value.trim())
  }
}

// 检查是否全选
const checkIsAllChecked = () => {
  let isAllChecked = true
  for (const item of showObjectArr.value) {
    if (!selectObjectArr.includes(item.name)) {
      isAllChecked = false
      break
    }
  }
  allChecked.value = isAllChecked
}

// 选择框修改的时候触发
const selectObject = row => {
  if (row.checked) {
    //如果没有需要加入
    if (!selectObjectNew.includes(row.name)) {
      selectObjectNew.push(row.name)
    }
  } else {
    //如果存在需要删掉
    if (selectObjectNew.includes(row.name)) {
      selectObjectNew.splice(selectObjectNew.indexOf(row.name), 1)
    }
  }
  //checkIsAllChecked()
}

// 清空搜索框
const clearObjectSearch = () => {
  showObjectArr.value = allObjectArr.value
  //checkIsAllChecked()
}

// 取消选择
const cancelSelectObject = () => {
  objectVisible.value = false
  // 搜索恢复原状
  if (searchObjectStr.value !== '') {
    searchObjectStr.value = ''
    showObjectArr.value = allObjectArr.value
  }
  //选中的
  var budgetSum = 0
  for (const item of showObjectArr.value) {
    if (selectObjectArr.includes(item.name)) {
      budgetSum += item.budget
    }
  }
  allChecked.value = false
  emits('updateObject', selectObjectArr, budgetSum)
}
const updateObjectStatus = () => {
  var budgetSum = 0
  var selectStatus=[] //showObjectArr 下的所有选中的
  for (const item of showObjectArr.value) {
    if (item.checked) {
      selectStatus.push(item.name)
      budgetSum += item.budget
      //item.checked = false
    }
  }
  //allChecked.value = false
  emits('updateObject', selectStatus, budgetSum)
}

// 确认选择object
const confirmSelectObject = () => {
  objectVisible.value = false
  // 搜索恢复原状
  if (searchObjectStr.value !== '') {
    searchObjectStr.value = ''
    clearObjectSearch()
  }
  var budgetSum = 0
  var selectArr=[]
  // 更新勾选状态
  for (const item of showObjectArr.value) {
    if (selectObjectNew.includes(item.name)) {
      item.checked = true
      budgetSum += item.budget
      selectArr.push(item.name)
    } else {
      item.checked = false
    }

    //
  }
  emits('updateObject', selectArr, budgetSum)
}

// object全选和取消全选
const selectAllObject = () => {
  // 全选
  if (allChecked.value) {
    showObjectArr.value.forEach(item => {
      item.checked = true
      if (!selectObjectArr.includes(item.name)) {
        selectObjectNew.push(item.name)
      }
    })
    // 取消全选 把之前选择的都清空
  } else {
    showObjectArr.value.forEach(item => {
      item.checked = false
      selectObjectNew = []
    })
  }
}

// 父组件触发
const clickObject = () => {
  objectVisible.value = true
  // 需要标记出选择的
  showObjectArr.value.forEach(item => {
    if (selectObjectArr.includes(item.name)) {
      item.checked = true
    }
  })
  //全部copy 到新的变量
  selectObjectNew=selectObjectArr.slice()
}

// 清空object
const clearObject = () => {
  selectObjectArr = []
  var budgetSum = 0
  for (const item of showObjectArr.value) {
    if (item.checked) {
      item.checked = false
    }
  }
  allChecked.value = false
  emits('updateObject', selectObjectArr, budgetSum)
}

// 删除object tag
const delObjectTag = tag => {
  // 删除tag，并且要将object表格中选中的改为未选中
  var budgetSum = 0
  selectObjectArr=[]
  selectObjectNew = selectObjectNew.filter(item => item != tag)
  for (const item of showObjectArr.value) {
    if (item.name === tag) {
      item.checked = false
      break
    }
   
  }
  allChecked.value = false
  for (const item of showObjectArr.value) {
      if (item.checked){
        budgetSum += item.budget
        selectObjectArr.push(item.name)
      }
    //
  }

  emits('updateObject', selectObjectArr, budgetSum)
}

// 暴露变量和方法
defineExpose({
  getAllObjectArr,
  clickObject,
  clearObject,
  delObjectTag,
  updateObjectStatus
})
</script>

<style lang="less" scoped></style>
