<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {Search} from '@element-plus/icons-vue'
import {getUserApi, updateUserStatusApi} from '@/api/Admin'
import {ElMessage, ElMessageBox} from 'element-plus'
import type {User} from "@/interfaces/User";
import {formatDate} from "../../../utils/time";

const loading = ref(false)
const pageData = ref({
  page: 1,
  pageSize: 10,
  keyword: ''
})
const total = ref(0)
const userData = ref<User[]>([]) //用户数据
//  发送请求获取用户数据
const getUserList = async () => {
  loading.value = true
  try {
    const res = await getUserApi(pageData.value.page, pageData.value.pageSize, pageData.value.keyword)
    userData.value = res.data.data
    total.value = res.data.total
  } catch (e) {
    ElMessage.error('获取用户列表失败')
  } finally {
    loading.value = false
  }

}


onMounted(async () => getUserList())
// 页面内动态过滤
const search = ref('')
// 搜索用户只需发送请求时添加用户的姓名
const searchUser = () => {
  pageData.value.keyword = search.value
  getUserList()
}
// 修改账号的状态
const handleEdit = async (index: number, row: User) => {
  // 弹出确认框
  await ElMessageBox.confirm('确定要修改该用户的账号状态吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    userData.value?.splice(index, 1, {...row, status: row.status == 1 ? 0 : 1})
    // 发送修改请求
    let newStatus = row.status == 1 ? 0 : 1
    const res = await updateUserStatusApi(row.userID, newStatus)
    // 修改成功后刷新页面
    //getAdminList() */
    ElMessage.success('修改状态成功')
  }).catch(() => {
    ElMessage.info('已取消修改')
  })
}

// 分页
const pageDisabled = ref(false)
// 监听每页最大数和页数的变化
watch(pageData.value, () => {
  // 发送请求
  getUserList()
})

/**
 * 当某一行被点击时会触发该事件
 */
const handleClickRow = (row: any, column: any) => {
  console.log('row', row)
  console.log('column', column)
  // 确定点击用户
  if (column.property == 'userID') {
    // 复制该id
    copyToClipboard(row.userID)
    ElMessage.success('已复制该用户ID')
  } else if (column.property == 'username') {
    copyToClipboard(row.userName)
    ElMessage.success('已复制该用户名')
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
  }).catch(err => {
  })
}
</script>

<template>
  <div v-loading="loading" class="container">
    <el-table :data="userData" height="550" stripe style="width: 100%"
              @row-click="handleClickRow">
      <el-table-column label="用户ID" prop="userID"/>
      <el-table-column label="用户名" prop="username"/>
      <el-table-column label="头像" prop="avatarURL">
        <template #default="scope">
          <el-avatar :src="scope.row.avatarURL" size="large">
            {{ scope.row.username.substring(0, 1) }}
          </el-avatar>
        </template>
      </el-table-column>
      <!--      <el-table-column label="上传次数" prop="uploadCount">-->
      <!--        <template #default="scope">-->
      <!--          <div>-->
      <!--            <el-icon style="margin: 10px;">-->
      <!--              <UploadFilled/>-->
      <!--            </el-icon>-->
      <!--            {{ scope.row.contribution }}-->
      <!--          </div>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
      <el-table-column label="创建时间">
        <template #default="scope">
          {{ formatDate(scope.row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="账号状态" prop="status">
        <!-- 使用插槽动态判断账号状态 -->
        <template #default="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" effect="light">
            <el-icon v-if="scope.row.status === 0">
              <Lock/>
            </el-icon>
            <el-icon v-else>
              <Unlock/>
            </el-icon>
            {{ scope.row.status === 1 ? '正常' : '禁用中' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="right">
        <template #header>
          <el-input v-model="search" :prefix-icon="Search" class="w-50 m-2" placeholder="用户名或ID"
                    style="width: 80%;" @change="searchUser"/>
        </template>
        <template #default="scope">
          <el-button :type="scope.row.status == 1 ? 'primary' : 'warning'" plain size="small"
                     @click="handleEdit(scope.$index, scope.row)">{{
              scope.row.status === 1 ? '禁用' : '启用'
            }}
          </el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="search.length>0?'没有搜索到该用户哟~':'这里什么也没有哟~'"/>
      </template>
    </el-table>
    <div class="pagination-block">
      <el-pagination v-model:current-page="pageData.page" v-model:page-size="pageData.pageSize"
                     :background="false" :disabled="pageDisabled" :page-sizes="[10, 20, 30, 40]"
                     :total="total" layout="total, sizes, prev, pager, next, jumper,slot">
      </el-pagination>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  .pagination-block {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>@/interface/User