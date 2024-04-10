<template>
  <Breadcrumb />
  <div class="outer-box">
    <div class="add-user">
      <span>Users({{ total }})</span>
      <el-button type="primary" @click="addUser">Add User</el-button>
    </div>
    <el-row :gutter="3" class="asset">
      <el-col :span="5">
        <el-input v-model="queryInfo.query" placeholder="search user" clearable @clear="getUserList" />
      </el-col>
      <el-col :span="3">
        <el-button type="primary" @click="searchUser">Search</el-button>
      </el-col>
    </el-row>
    <el-card shadow="hover" class="permission-data">
      <el-table :data="tableData" style="width: 100%" stripe>
        <el-table-column type="index" :index="indexMethod" />
        <el-table-column prop="username" label="UserName" />
        <!-- <el-table-column prop="cn_name" label="ChineseName" width="180" /> -->
        <el-table-column prop="role_id" label="RoleName">
          <template #default="scope">
            <el-tag size="small">{{ roleMap[scope.row.role_id] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="CreateTime" />
        <el-table-column prop="update_time" label="UpdateTime" />
        <el-table-column label="Operation">
          <!-- <template #default="scope">
            <el-tooltip class="box-item" effect="dark" content="edit" placement="top">
              <el-button type="primary" :icon="Edit" circle @click="updateUser(scope.row)" />
            </el-tooltip>
            <el-tooltip class="box-item" effect="dark" content="delete" placement="top">
              <el-button type="danger" :icon="Delete" circle @click="delUser(scope.row.username)" />
            </el-tooltip>
          </template> -->
          <template #default="scope">
            <el-button type="primary" @click="updateUser(scope.row)" size="small">Edit</el-button>
            <el-button type="danger" @click="delUser(scope.row.username)" size="small">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-pagination background layout="prev, pager, next" :total="total" :page-size="queryInfo.pagesize" :currentPage="queryInfo.pagenum" @current-change="currentChange" />
  </div>
  <!-- 添加用户的弹框 -->
  <el-dialog v-model="addDialogVisible" title="Add User" width="30%">
    <el-form label-position="left" label-width="150px" :model="addFromData" :rules="addRules" ref="addForm">
      <el-form-item label="UserName" prop="username">
        <el-input v-model="addFromData.username" />
      </el-form-item>
      <el-form-item label="ChineseName">
        <el-input v-model="addFromData.cn_name" />
      </el-form-item>
      <el-form-item label="RoleName">
        <el-select v-model="addFromData.role_id" placeholder="role">
          <el-option v-for="item in roleArr" :label="item.label" :value="item.value" :key="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="handleAddCancle">Cancel</el-button>
        <el-button type="primary" @click="handleAddConfirm">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 编辑用户的弹框 -->
  <el-dialog v-model="editDialogVisible" title="Edit User" width="30%">
    <el-form label-position="left" label-width="150px" :model="editFromData">
      <el-form-item label="UserName">
        <el-input v-model="editFromData.username" disabled />
      </el-form-item>
      <el-form-item label="ChineseName">
        <el-input v-model="editFromData.cn_name" />
      </el-form-item>
      <el-form-item label="RoleName">
        <el-select v-model="editFromData.role_id" placeholder="role">
          <el-option v-for="item in roleArr" :label="item.label" :value="item.value" :key="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span>
        <el-button @click="handleEditCancle">Cancel</el-button>
        <el-button type="primary" @click="handleEditConfirm">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 删除用户的弹框 -->
  <el-dialog v-model="delDialogVisible" title="Warning" width="30%" center>
    <span>This operation will permanently delete the user. Do you want to continue?</span>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handledelCancle">Cancel</el-button>
        <el-button type="primary" @click="handleDelConfirm">Confirm</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted } from 'vue'
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.vue'
import { roleMap } from '@/utils/api_utils'

// 通过roleMap生成权限数组
const roleArr = ref([])
const genRole = () => {
  const tempArr = []
  for (const key in roleMap) {
    tempArr.push({
      label: roleMap[key],
      value: parseInt(key)
    })
  }
  roleArr.value = tempArr
}
genRole()

const { proxy } = getCurrentInstance()
const tableData = ref([])
const queryInfo = reactive({
  query: '',
  pagenum: 1,
  pagesize: 10
})
const total = ref(0) // 数据条数

const indexMethod = index => {
  return index + 1 + (queryInfo.pagenum - 1) * queryInfo.pagesize
}
// 获取用户列表
const getUserList = async () => {
  const resp = await proxy.$api.permission.searchUser(queryInfo)
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  const { ret_code, data, message } = resp.data
  if (ret_code === '0') {
    // ElMessage.success(resp.data.message || 'get users success')
    // 获取用户列表
    tableData.value = data
    total.value = resp.data.total
  } else {
    ElMessage.error(message || 'get user list failed')
  }
}

// 添加用户
const addDialogVisible = ref(false)
const addFromData = reactive({
  username: '',
  cn_name: '',
  role_id: 4
})
const addRules = reactive({
  username: [{ required: true, message: 'Please input username', trigger: 'blur' }]
  // role_id: [{ required: true, message: 'Please input chinese name', trigger: 'blur' }]
})
// 点击添加按钮
const addUser = () => {
  addDialogVisible.value = true
}
// 取消
const handleAddCancle = () => {
  addDialogVisible.value = false
  // 清空表单
  proxy.$refs.addForm.resetFields()
  //   选项卡上面清不掉
  addFromData.role_id = 4
  addFromData.cn_name = ''
}
// 提交
const handleAddConfirm = () => {
  // 提交表单数据
  proxy.$refs.addForm.validate(async valid => {
    // 如果验证通过，发送请求
    if (valid) {
      const resp = await proxy.$api.permission.addUser({
        username: addFromData.username,
        cn_name: addFromData.cn_name,
        role_id: addFromData.role_id
      })
      //   请求出错
      if (typeof resp === 'string') {
        ElMessage.error(resp)
        return
      }
      if (resp.data.ret_code === '0') {
        ElMessage.success(resp.data.message || 'add success')
        // 回到第一页
        queryInfo.pagenum = 1
        // 获取用户列表
        getUserList()
        addDialogVisible.value = false
        proxy.$refs.addForm.resetFields()
        addFromData.role_id = 4
        addFromData.cn_name = ''
      } else {
        ElMessage.error(resp.data.message || 'add failed')
      }
    }
  })
}

// 分页器
const currentChange = currentPage => {
  queryInfo.pagenum = currentPage
  getUserList()
}

// 删除用户
const delDialogVisible = ref(false)
const delUserName = ref('')
const delUser = username => {
  delUserName.value = username
  delDialogVisible.value = true
}
const handledelCancle = () => {
  delDialogVisible.value = false
}
const handleDelConfirm = async () => {
  const resp = await proxy.$api.permission.delUser({
    username: delUserName.value
  })
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  if (resp.data.ret_code === '0') {
    ElMessage.success(resp.data.message || 'del success')
    // 回到第一页
    queryInfo.pagenum = 1
    // 获取用户列表
    getUserList()
    delDialogVisible.value = false
  } else {
    ElMessage.error(resp.data.message || 'delete user failed')
  }
}

// 更新用户
const editDialogVisible = ref(false)
const editFromData = reactive({
  username: '',
  cn_name: '',
  role_id: 0
})
// const editRules = reactive({
//   username: [{ required: true, message: 'Please input username', trigger: 'blur' }]
//   //   cn_name: [{ required: true, message: 'Please input chinese name', trigger: 'blur' }]
// })
const updateUser = userObj => {
  editFromData.username = userObj.username
  editFromData.cn_name = userObj.cn_name
  editFromData.role_id = userObj.role_id
  editDialogVisible.value = true
}
const handleEditCancle = () => {
  editDialogVisible.value = false
}
const handleEditConfirm = async () => {
  const resp = await proxy.$api.permission.updateUser({
    username: editFromData.username,
    cn_name: editFromData.cn_name,
    role_id: editFromData.role_id
  })
  //   请求出错
  if (typeof resp === 'string') {
    ElMessage.error(resp)
    return
  }
  if (resp.data.ret_code === '0') {
    ElMessage.success(resp.data.message || 'update success')
    // 回到第一页
    queryInfo.pagenum = 1
    // 获取用户列表
    getUserList()
    editDialogVisible.value = false
  } else {
    ElMessage.error(resp.data.message || 'update user failed')
  }
}

// 查询用户
const searchUser = () => {
  if (queryInfo.query.trim() === '') {
    ElMessage.error('The input value cannot be empty')
  } else {
    getUserList()
  }
}

// 页面加载完后获取
onMounted(() => {
  getUserList()
})
</script>

<style lang="less" scoped>
.permission-data {
  margin: 20px 0;
}

.add-user {
  display: flex;
  justify-content: space-between;
}
</style>
