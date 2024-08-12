<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {getAuditListApi, updateAuditApi} from '@/api/Admin'
import {ElMessage, ElMessageBox} from 'element-plus'
import AnimalDetail from '@/components/AnimalDetail.vue'
import type {Audit} from "@/interfaces/Audit";
import type {AuditAnimal} from "@/interfaces/Animal";
import {closingAuditApi, getHistoryAuditListApi, getUserAnimalDetail} from "@/api/Audit";
import {onBeforeRouteLeave} from "vue-router";
import {RefreshRight, Search} from "@element-plus/icons-vue";

const loading = ref(true)
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
  loading.value = true
  try {
    const res = await getAuditListApi()
    auditData.value = res.data.data
  } catch (error) {
    ElMessage.error('获取审核数据失败')
    return
  } finally {
    loading.value = false
  }

}

onMounted(() => getAuditList())
// 修改审核状态
const handleEdit = async (index: number, row: Audit, status: 0 | 1 | 2) => {
  // 弹出确认框
  await ElMessageBox.confirm(status === 1 ? '确定该条数据通过审核吗？' : '确定该条数据不通过审核吗', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
    const res = await updateAuditApi(row.id, status)
    if (res.code.toString() !== '1') {
      ElMessage.error(res.message || '修改失败')
      return
    }
    if (index === -1) {
      dialogVisible.value = false
    }
    // // 修改成功后刷新页面
    // await getAuditList()
    ElMessage.success('操作成功！')
    if (isAuditing.value === '待审核') {
      // 操作成功后移出该项
      auditData.value.splice(index, 1)
    } else {
      await getHistoryAuditList()
    }

    if (auditData.value.length === 0) {
      await getAuditList()
    }
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
const currentAnimal = ref<AuditAnimal>()
const viewDetail = async (row: Audit) => {
  dialogVisible.value = true
  currentRow.value = row
  // 获取当前查看的上传动物数据
  const res = await getUserAnimalDetail(row.id)
  currentAnimal.value = res.data
  // 获取当前行的索引
  rowIndex.value = auditData.value.findIndex((item: any) => item.auditID === row.id)
}

/**
 *  关闭审核
 */
const closeAudit = async () => {
  // 判断当前是否有未审核的数据
  let ids: number[] = []
  auditData.value.map((item: Audit) => {
    if (item.status === 0) {
      ids.push(item.id)
      return
    }
  })
  if (ids.length === 0) {
    // 全部审核完毕
  } else {
    // 还有待审核数据
    const res = await closingAuditApi(ids.join(','))
    if (res.code.toString() !== '1') {
      return ElMessage.error(res.message || '审核数据异常')
    }

  }
}

// 监听页面刷新和卸载
window.addEventListener('beforeunload', () => {
  closeAudit()
})

onBeforeRouteLeave(() => {
  closeAudit()
})

/*// 刷新
const refreshAudit=()=>{
  getAuditList()
}*/

const isAuditing = ref('待审核')
const getHistoryAuditList = async () => {
  loading.value = true
  const res = await getHistoryAuditListApi(pageData.value.page, pageData.value.pageSize, id.value)
  historyAuditData.value = res.data.data
  total.value = res.data.total
  loading.value = false
}

const historyAuditData = ref<AuditAnimal[]>([])
/**
 * 当点击审核切换后
 */
const onModelChange = async () => {
  loading.value = true
  if (isAuditing.value === '待审核') { // 默认
    await getAuditList()
  } else if (isAuditing.value === '已审核') {
    await closeAudit()
    await getHistoryAuditList()
  }
  loading.value = false
}

// 搜索功能
// 页面内动态过滤
const search = ref()
const id = ref('')
// 搜索用户只需发送请求时添加用户的姓名
const searchUser = () => {
  // 检验是否时数字，入过非数字
  if (isNaN(Number(search.value))) {
    return ElMessage.error('请输入正确的id!')
  }
  id.value = search.value
  // 获取审核数据
  getHistoryAuditList()
}
</script>

<template>
  <el-radio-group v-model="isAuditing" fill="#39c5bb" style="margin-bottom: 10px;margin-left: 20px" text-color="#fff"
                  @change="onModelChange">
    <el-radio-button label="待审核" value="待审核"/>
    <el-radio-button label="已审核" value="已审核"/>
  </el-radio-group>
  <div v-loading="loading" class="container">
    <div v-if="isAuditing==='待审核'">
      <div v-if="auditData?.length > 0">
        <el-table :data="auditData" height="500"
                  stripe
                  style="width: 100%;color: #6C6E72;"
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
          <span v-if="scope.row.status !== 1">
                      <el-button plain size="small" type='success'
                                 @click.stop="handleEdit(scope.$index, scope.row, 1)">通过
            <el-icon>
              <DocumentChecked/>
            </el-icon>
          </el-button>
          </span>

              <el-button plain size="small" type='danger'
                         @click.stop="handleEdit(scope.$index, scope.row, 2)">{{
                  scope.row.status === 1 ? '撤回' : '不通过'
                }}
                <span v-if="scope.row.status === 1">
<el-icon><DocumentDelete/></el-icon>
            </span>
                <span v-if="scope.row.status === 2">
                          <el-icon>
              <CloseBold/>
            </el-icon>
            </span>

              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-else>
        <el-empty description="暂无用户上传数据~">
          <el-button :color="'#39c5bb'" :icon="RefreshRight" plain @click="getAuditList">刷新</el-button>
        </el-empty>
      </div>

    </div>

    <div v-if="isAuditing==='已审核'">
      <el-table :data="historyAuditData" height="520"
                stripe
                style="width: 100%;color: #6C6E72;"
                @row-click="viewDetail">

        <el-table-column label="上传用户ID" prop="creator"/>
        <el-table-column class="detail" label="上传动物名" prop="name">
        </el-table-column>
        <el-table-column label="审核id" prop="auditId">
        </el-table-column>
        <el-table-column label="动物id" prop="animalId">
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
          <template #header>
            <el-input v-model="search" :prefix-icon="Search" placeholder="用户id或审核id"
                      style="width: 100%;" @change="searchUser"/>
          </template>
          <template #default="scope">
          <span v-if="scope.row.status !== 1">
                      <el-button plain size="small" type='success'
                                 @click.stop="handleEdit(scope.$index, scope.row, 1)">通过
            <el-icon>
              <DocumentChecked/>
            </el-icon>
          </el-button>
          </span>

            <el-button plain size="small" type='danger'
                       @click.stop="handleEdit(scope.$index, scope.row, 2)">{{
                scope.row.status === 1 ? '撤回' : '不通过'
              }}
              <span v-if="scope.row.status === 1">
<el-icon><DocumentDelete/></el-icon>
            </span>
              <span v-if="scope.row.status === 2">
                          <el-icon>
              <CloseBold/>
            </el-icon>
            </span>

            </el-button>
          </template>
        </el-table-column>
        <template #empty>
          <el-empty description="暂无历史审核数据~">
            <el-button :color="'#39c5bb'" :icon="RefreshRight" plain @click="getAuditList">刷新</el-button>
          </el-empty>
        </template>
      </el-table>
    </div>

    <div v-if="isAuditing==='已审核'&&historyAuditData?.length >= 1" class="pagination-block">
      <el-pagination v-model:current-page="pageData.page" v-model:page-size="pageData.pageSize"
                     :background="false" :disabled="pageDisabled" :page-sizes="[10, 20, 30, 40]"
                     :total="total" layout="total, sizes, prev, pager, next, jumper,slot">
      </el-pagination>
    </div>
    <!-- 弹出审核详情框 -->
    <el-dialog v-model="dialogVisible" center title="上传详情" width="60%">
      <AnimalDetail :animals-data="currentAnimal!"/>
      <template #footer>
                <span class="dialog-footer">
                    <el-button plain type="success" @click="handleEdit(-1, currentRow, 1)">
                        通过
                    </el-button>
                    <el-button plain type="danger" @click="handleEdit(-1, currentRow, 0)">不通过</el-button>
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