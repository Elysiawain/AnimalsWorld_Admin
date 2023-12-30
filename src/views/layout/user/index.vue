<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { updaeUserStatusApi, getUserApi } from '@/api/Admin'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { User } from '@/pojo/User'
const loading = ref(false)
const pageData = ref<any>({
    page: 1,
    pageSize: 10,
    userID: '',
    userName: '',
})
const total = ref(0)
const userData = ref<User[]>([]) //用户数据
//  发送请求获取用户数据
const getUserList = async () => {
    loading.value = true
    try {
        const { data: { data } } = await getUserApi(pageData.value.page, pageData.value.pageSize, pageData.value.userID, pageData.value.userName)
        loading.value = false
        userData.value = data.userList
        total.value = data.total
    } catch (error) {
        ElMessage.error('获取用户列表失败')
        loading.value = false
        return
    }

}


onMounted(() => getUserList())
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
        userData.value.splice(index, 1, { ...row, status: row.status == 1 ? 0 : 1 })
        // 发送修改请求
        let newStatus = row.status == 1 ? 0 : 1
        const res = await updaeUserStatusApi(row.uesrID, newStatus)
        if (res.data.code !== '1') {
            ElMessage.error(res.data.msg || '修改失败')
            return
        }

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
        <el-table :data="userData" stripe style="width: 100%" v-if="userData.length >= 1">

            <el-table-column label="用户" prop="userName" />
            <el-table-column label="头像" prop="avatarURL">
                <template #default="scope">
                    <el-image :src="scope.row.avatarURL" style="width: 25%;" />
                </template>
            </el-table-column>
            <el-table-column label="上传次数" prop="contribution">
                <template #default="scope">
                    <div>
                        <el-icon style="margin: 10px;">
                            <UploadFilled />
                        </el-icon>{{ scope.row.contribution }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" />
            <el-table-column label="账号状态" prop="status">
                <!-- 使用插槽动态判断账号状态 -->
                <template #default="scope">
                    <el-tag effect="light" :type="scope.row.status === 1 ? 'success' : 'danger'">
                        <el-icon v-if="scope.row.status === 0">
                            <Lock />
                        </el-icon>
                        <el-icon v-else>
                            <Unlock />
                        </el-icon>
                        {{ scope.row.status === 1 ? '正常' : '禁用中' }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" class="w-50 m-2" placeholder="搜索" :prefix-icon="Search" style="width: 80%;"
                        @change="searchUser" />
                </template>
                <template #default="scope">
                    <el-button size="small" :type="scope.row.status == 1 ? 'primary' : 'warning'" plain
                        @click="handleEdit(scope.$index, scope.row)">{{ scope.row.status === 1 ? '禁用' : '启用' }}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-empty description="这里什么也没有哟~" v-else />
        <div class="pagination-block">
            <el-pagination v-model:current-page="pageData.page" v-model:page-size="pageData.pageSize"
                :page-sizes="[10, 20, 30, 40]" :disabled="pageDisabled" :background="false"
                layout="total, sizes, prev, pager, next, jumper,slot" :total="total">
            </el-pagination>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    .pagination-block {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>