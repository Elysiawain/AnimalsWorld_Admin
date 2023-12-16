<script setup lang="ts">
import { ref, computed } from 'vue'
import { Search } from '@element-plus/icons-vue'
// admim列表接口
interface Admin {
    date: string
    name: string
    status: number
}
// TODO 发送请求获取管理员数据

const adminData = ref<Admin[]>([
    {
        date: '2016-05-03',
        name: 'Tom',
        status: 1
    },
    {
        date: '2016-05-02',
        name: 'John',
        status: 1
    },
    {
        date: '2016-05-04',
        name: 'Morgan',
        status: 1
    },
    {
        date: '2016-05-01',
        name: 'Jessy',
        status: 0
    },
])
// 页面内动态过滤
const search = ref('')
const filterTableData = computed(() =>
    adminData.value.filter(
        (data) =>
            !search.value ||
            data.name.toLowerCase().includes(search.value.toLowerCase())
    )
)
// 修改账号的状态
const handleEdit = (index: number, row: Admin) => {
    adminData.value.splice(index, 1, { ...row, status: row.status == 1 ? 0 : 1 })
    console.log(adminData.value)
}
const handleDelete = (index: number, row: Admin) => {
    console.log(index, row)
}


</script>

<template>
    <div>
        <el-table :data="filterTableData" stripe style="width: 100%" v-if="adminData.length > 1">

            <el-table-column label="管理员" prop="name" />
            <el-table-column label="创建时间" prop="date" />
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