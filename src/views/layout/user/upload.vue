<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {getAuditListApi, updateAuditApi} from '@/api/Admin'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useCounterStore} from '@/stores/counter'
import AnimalDetail from '@/components/AnimalDetail.vue'
import type {Audit} from "@/interfaces/Audit";
import type {Animal} from "@/interfaces/Animal";
import {getUserAnimalDetail} from "@/api/Audit";

const loading = ref(false)
const pageData = ref({
  page: 1,
  pageSize: 10,
  status: 0,
})
const total = ref(0)
const auditData = ref<Audit[]>([]) //审核数据
const rowIndex = ref<number>(0)
//  发送请求获取审核数据
const getAuditList = async () => {
  try {
    const res = await getAuditListApi(pageData.value.page, pageData.value.pageSize, pageData.value.status)
    auditData.value = res.data.data
    total.value = res.data.data.total
    loading.value = false
  } catch (error) {
    ElMessage.error('获取审核数据失败')
    loading.value = false
    return
  }

}

onMounted(() => getAuditList())
// 修改审核状态
//徽标数字提醒
const countStore = useCounterStore()
const handleEdit = async (index: number, row: Audit, status: 0 | 1) => {
  // 弹出确认框
  await ElMessageBox.confirm(status === 1 ? '确定通过该条数据审核吗？' : '确定不通过该条数据审核吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const res = await updateAuditApi(row.id, status)
    if (res.code !== '1') {
      ElMessage.error(res.data.msg || '修改失败')
      return
    }
    if (index === -1) {
      dialogVisible.value = false
    }
    // 修改成功后刷新页面
    await getAuditList()
    ElMessage.success('操作成功！')
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
const currentAnimal = ref<Animal>()
const viewDetail = async (row: Audit) => {
  console.log(row)
  dialogVisible.value = true
  currentRow.value = row
  // 获取当前查看的上传动物数据
  const res = await getUserAnimalDetail(row.id)
  currentAnimal.value = res.data
  // 获取当前行的索引
  rowIndex.value = auditData.value.findIndex((item: any) => item.auditID === row.auditID)
}
</script>

<template>
  <div v-loading="loading" class="container">
    <el-table v-if="auditData?.length > 0" :data="auditData" stripe style="width: 100%;color: #6C6E72;"
              @row-click="viewDetail">

      <el-table-column label="上传用户ID" prop="uploader"/>
      <el-table-column class="detail" label="动物详情">
        点击查看
      </el-table-column>
      <el-table-column label="审核id" prop="id">
      </el-table-column>
      <el-table-column label="上传时间" prop="createTime"/>
      <el-table-column label="审核状态" prop="status">
        <!-- 使用插槽动态判断账号状态 -->
        <template #default="scope">
          <el-tag :type="scope.row.status===1?'success':scope.row.status===0?'warning':'danger'" effect="light">
            {{ scope.row.status === 1 ? "已通过" : scope.row.status === 0 ? '待审核' : "未通过" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button plain size="small" type='success' v-if="scope.row.status !== 1"
                     @click.stop="handleEdit(scope.$index, scope.row, 1)">通过
            <el-icon>
              <DocumentChecked/>
            </el-icon>
          </el-button>
          <el-button plain size="small" type='danger'
                     @click.stop="handleEdit(scope.$index, scope.row, 0)">{{ scope.row.status===1?'撤回':'不通过' }}
            <el-icon>
              <CloseBold/>
            </el-icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-empty v-else description="这里什么也没有哟~"/>
    <div v-if="auditData?.length >= 1" class="pagination-block">
      <el-pagination v-model:current-page="pageData.page" v-model:page-size="pageData.pageSize"
                     :background="false" :disabled="pageDisabled" :page-sizes="[10, 20, 30, 40]"
                     :total="total" layout="total, sizes, prev, pager, next, jumper,slot">
      </el-pagination>
    </div>
    <!-- 弹出审核详情框 -->
    <el-dialog v-model="dialogVisible" center title="上传详情" width="60%">
      <AnimalDetail :animals-data="currentAnimal" :upload-time="auditData[rowIndex].createTime"
                    :upload-user="auditData[rowIndex].uploader"/>
      <template #footer>
                <span class="dialog-footer">
                    <el-button plain type="success" @click="handleEdit(-1, currentRow, 1)">
                        通过
                    </el-button>
                    <el-button  plain type="danger" @click="handleEdit(-1, currentRow, 0)">不通过</el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
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
</style>@/interface/audit