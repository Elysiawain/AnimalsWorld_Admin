<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {Search} from '@element-plus/icons-vue'
import {getUserApi, updateUserStatusApi} from '@/api/Admin'
import {ElMessage, ElMessageBox} from 'element-plus'
import type {User} from "@/interfaces/User";

const loading = ref(false)
const pageData = ref<any>({
  page: 1,
  pageSize: 10,
  userID: '',
  userName: '',
})
const total = ref(0)
const userData = ref<User[]>() //用户数据
//  发送请求获取用户数据
const getUserList = async () => {
  loading.value = true
  const res = await getUserApi(pageData.value.page, pageData.value.pageSize)
  loading.value = false
  console.log(res.data.data)
  userData.value = res.data.data
  total.value = res.total
}


onMounted(async () => getUserList())
// 页面内动态过滤
const search = ref('')
// 搜索用户只需发送请求时添加用户的姓名
const searchUser = () => {
  pageData.value.userName = search.value

  search.value = ''
  getUserList()
}
// 修改账号的状态（只有超级管理员可以）
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
</script>

<template>
  <div v-loading="loading" class="container">
    <el-table v-if="userData?.length>0" :data="userData" stripe style="width: 100%">
      <el-table-column label="用户" prop="username"/>
      <el-table-column label="头像" prop="avatarURL">
        <template #default="scope">
          <el-avatar :src="scope.row.avatarURL" size="large"/>
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
      <el-table-column label="创建时间" prop="createTime"/>
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
          <el-input v-model="search" :prefix-icon="Search" class="w-50 m-2" placeholder="搜索"
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
    </el-table>
    <el-empty v-else description="这里什么也没有哟~"/>
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