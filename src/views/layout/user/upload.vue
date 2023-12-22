<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { getAuditListApi, updateAuditApi } from '@/api/Admin'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { audit } from '@/pojo/audit'
import AnimalDetail from '@/components/AnimalDetail.vue'
const loading = ref(false)
const pageData = ref<any>({
    page: 1,
    pageSize: 10,
    status: 0,
})
const total = ref(0)
const auditData = ref<audit[]>([]) //审核数据
const rowIndex = ref<number>(0)
//  发送请求获取审核数据
const getAuditList = async () => {
    const res = await getAuditListApi(pageData.value.page, pageData.value.pageSize, pageData.value.status)
    auditData.value = res.data.data.auditList
    total.value = res.data.data.total
}

onMounted(() => getAuditList())
// 修改审核状态
const handleEdit = async (index: number, row: any, status: number) => {
    // 弹出确认框
    await ElMessageBox.confirm('确定通过该条数据审核吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
    }).then(async () => {
        const res = await updateAuditApi(row.auditID, row.adminID, status)
        if (res.data.code !== '1') {
            ElMessage.error(res.data.msg || '修改失败')
            return
        }
        if (index === -1) {
            dialogVisible.value = false
        }
        // 修改成功后刷新页面
        //getAdminList() */
        ElMessage.success('审核通过修改完成')
    }).catch(() => {
        ElMessage.info('已取消修改')
    })
}

// 分页
const pageDisabled = ref(false)
// 监听每页最大数和页数的变化
watch(pageData.value, () => {
    // 发送请求
    getAuditList()
})
// 弹出详情
const dialogVisible = ref(false)
const currentRow = ref<any>({})
const viewDetail = (row: any) => {
    dialogVisible.value = true
    currentRow.value = row
    console.log(row)
    // 获取当前行的索引
    rowIndex.value = auditData.value.findIndex((item: any) => item.auditID === row.auditID)


}
</script>

<template>
    <div v-loading="loading" class="container">
        <el-table :data="auditData" stripe style="width: 100%" v-if="auditData?.length >= 1" @row-click="viewDetail">

            <el-table-column label="上传用户ID" prop="uploadUser" />
            <el-table-column label="动物详情" class="detail">
                点击查看
            </el-table-column>
            <el-table-column label="审核id" prop="auditID">
            </el-table-column>
            <el-table-column label="上传时间" prop="uploadTime" />
            <el-table-column label="审核状态" prop="status">
                <!-- 使用插槽动态判断账号状态 -->
                <template #default>
                    <el-tag effect="light" type='warning'>
                        待审核
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作">
                <template #default="scope">
                    <el-button size="small" type='success' plain
                        @click="handleEdit(scope.$index, scope.row, 1)">通过<el-icon><DocumentChecked /></el-icon></el-button>
                    <el-button size="small" type='danger' plain
                        @click="handleEdit(scope.$index, scope.row, 0)">不通过<el-icon><DocumentDelete /></el-icon></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-empty description="这里什么也没有哟~" v-else />
        <div class="pagination-block" v-if="auditData?.length >= 1">
            <el-pagination v-model:current-page="pageData.page" v-model:page-size="pageData.pageSize"
                :page-sizes="[10, 20, 30, 40]" :disabled="pageDisabled" :background="false"
                layout="total, sizes, prev, pager, next, jumper,slot" :total="total">
            </el-pagination>
        </div>
        <!-- 弹出审核详情框 -->
        <el-dialog v-model="dialogVisible" title="上传详情" width="60%" center>
            <AnimalDetail :animas-data="auditData[rowIndex].animalsData" :upload-user="auditData[rowIndex].uploadUser" :upload-time="auditData[rowIndex].uploadTime" />
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="success" @click="handleEdit(-1, currentRow, 1)" plain>
                        通过
                    </el-button>
                    <el-button @click="handleEdit(-1, currentRow, 0)" type="danger" plain>不通过</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped lang="scss">
.container {
    .detail {
        &:hover {
            color: #a6a9ad;
        }
    }

    .pagination-block {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
    }
}
</style>