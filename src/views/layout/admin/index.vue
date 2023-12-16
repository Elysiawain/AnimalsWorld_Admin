<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getAdminListApi, updateAdminStatusApi, deleteAdminApi } from '@/api/Admin'
import { useAdminStore } from '@/stores/admin'
import { ElMessage } from 'element-plus'
const loading=ref(false)
// admim列表接口
interface Admin {
    adminID: string
    createTime: string
    name: string
    status: number
    avatarURL: string
}
// TODO 发送请求获取管理员数据
const adminStore = useAdminStore()
const getAdminList = async () => {
    loading.value=true
    const { data: { data } } = await getAdminListApi()
    setTimeout(() => { loading.value=false }, 200)
    adminData.value = data.adminList
}

const adminData = ref<Admin[]>([])
onMounted(() => getAdminList())
// 页面内动态过滤
const search = ref('')
const filterTableData = computed(() =>
    adminData.value.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)
// 修改账号的状态（只有超级管理员可以）
const handleEdit = async (index: number, row: Admin) => {

    if (adminStore.admin.adminID != 1) {
        ElMessage.error('当前登录账号权限不足！')
        return
    }
    adminData.value.splice(index, 1, { ...row, status: row.status == 1 ? 0 : 1 })
    // 发送修改请求
    let newStatus = row.status == 1 ? 0 : 1
    await updateAdminStatusApi(row.adminID, newStatus)
    // 修改成功后刷新页面
    //getAdminList()
}
// 删除该账号（只有超级管理员可以）
const handleDelete = async (index: number, row: Admin) => {

    if (adminStore.admin.adminID != 1) {
        ElMessage.error('当前登录账号权限不足！')
        return
    }
    const res=await deleteAdminApi(row.adminID)
    if(res.data.code===0){
        ElMessage.error('当前登录账号权限不足！')
        return
    }
}


</script>

<template>
    <div v-loading="loading">
        <el-table :data="filterTableData" stripe style="width: 100%" v-if="adminData.length >= 1">

            <el-table-column label="管理员" prop="name" />
            <el-table-column label="头像" prop="avatarURL">
                <template #default="scope">
                    <el-image :src="scope.row.avatarURL" style="width: 25%;" />
                </template>
            </el-table-column>
            <el-table-column label="创建时间" prop="createTime" />
            <el-table-column label="账号状态" prop="status">
                <!-- 使用插槽动态判断账号状态 -->
                <template #default="scope">
                    <el-tag effect="light" :type="scope.row.status === 1 ? 'success' : 'danger'">
                        {{ scope.row.status === 1 ? '正常' : '禁用中' }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column align="right">
                <template #header>
                    <el-input v-model="search" class="w-50 m-2" placeholder="搜索" :prefix-icon="Search"
                        style="width: 80%;" />
                </template>
                <template #default="scope">
                    <el-button size="small" :type="scope.row.status == 1 ? 'primary' : 'warning'" plain
                        @click="handleEdit(scope.$index, scope.row)">{{ scope.row.status === 1 ? '禁用' : '启用' }}</el-button>
                    <el-button size="small" type="danger" plain
                        @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-empty description="这里什么也没有哟~" v-else />
    </div>
</template>

<style scoped></style>