<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Search, Delete } from '@element-plus/icons-vue'
import { getAdminListApi, updateAdminStatusApi, deleteAdminApi, getAdminDetailApi } from '@/api/Admin'
import { useAdminStore } from '@/stores/admin'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { Admin } from '@/pojo/Admin'
const loading = ref(false)

// TODO 发送请求获取管理员数据
const adminStore = useAdminStore()
const getAdminList = async () => {
    loading.value = true
    const { data: { data } } = await getAdminListApi()
    setTimeout(() => { loading.value = false }, 200)
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
    const res = await deleteAdminApi(row.adminID)
    if (res.data.code === 0) {
        ElMessage.error('当前登录账号权限不足！')
        return
    }
}
// 点击查看详情
const viewDetail = async (row: Admin) => {
    loading.value = true
    // 1、获取当前行的管理员id
    const { data: { data } } = await getAdminDetailApi(row.adminID)
    let adminDetail: any = data.admin
    loading.value = false
    // 2、根据id获取管理员详情
    // 3、将管理员详情展示到弹出框
    ElMessageBox.alert(
        ` <div
        style="
        display: flex;
        justify-content: end;
        align-items: end;
        flex-direction: column;
        width: 350px;
        height: 350px;
        border: 1px dashed rgb(213, 253, 157);
        background-image: url(${adminDetail.bgcImgURL});
        background-position: top center;
        background-size: 100% 40%;
        background-repeat: no-repeat;
        position: relative;
      "
    >
      <img
        src="${row.avatarURL}"
        alt=""
        width="70px"
        height="70px"
        style="
          background-color: rgba(135, 206, 235, 0.5);
          border-radius: 50%;
          position: absolute;
          top: 40%;
          left: 2%;
          transform: translate(0, -50%);
        "
      />
      <div style="position: absolute; top: 55%; left: 6%">${row.name}</div>
      <div style="width: 65%; height: 75px; margin-bottom: 15px">
        ${adminDetail.message}
      </div>
      <div
        style="
          display: flex;
          justify-content: space-around;
          align-items: center;
          width: 100%;
          height: 100px;
        "
      >
        <div
          style="
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            flex: 1;
          "
        >
        <div style="display: flex; width: 100%; justify-content: center">
          总审核数
          <svg style="width: 20px;color:#85ce61;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-ea893728=""><path fill="currentColor" d="M805.504 320 640 154.496V320zM832 384H576V128H192v768h640zM160 64h480l256 256v608a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32m318.4 582.144 180.992-180.992L704.64 510.4 478.4 736.64 320 578.304l45.248-45.312z"></path></svg>
        </div>
          <div style="font-size: 28px">${adminDetail.audit.length}</div>
        </div>
        <div
          style="
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            flex: 1;
          "
        >
        <div style="display: flex; width: 100%; justify-content: center">
          总添加数
          <svg style="width: 20px ;color:#66b1ff;" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" data-v-ea893728=""><path fill="currentColor" d="M160 832h704a32 32 0 1 1 0 64H160a32 32 0 1 1 0-64m384-578.304V704h-64V247.296L237.248 490.048 192 444.8 508.8 128l316.8 316.8-45.312 45.248z"></path></svg>
        </div>
          <div style="font-size: 28px">${adminDetail.addCount.length}</div>
        </div>
        <div
          style="
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            flex: 1;
          "
        >
          <div style="display: flex; width: 100%; justify-content: center">
            总修改数<svg
              style="width: 20px"
              color="#85ce61"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1024 1024"
              data-v-ea893728=""
            >
              <path
                fill="currentColor"
                d="M832 512a32 32 0 1 1 64 0v352a32 32 0 0 1-32 32H160a32 32 0 0 1-32-32V160a32 32 0 0 1 32-32h352a32 32 0 0 1 0 64H192v640h640z"
              ></path>
              <path
                fill="currentColor"
                d="m469.952 554.24 52.8-7.552L847.104 222.4a32 32 0 1 0-45.248-45.248L477.44 501.44l-7.552 52.8zm422.4-422.4a96 96 0 0 1 0 135.808l-331.84 331.84a32 32 0 0 1-18.112 9.088L436.8 623.68a32 32 0 0 1-36.224-36.224l15.104-105.6a32 32 0 0 1 9.024-18.112l331.904-331.84a96 96 0 0 1 135.744 0z"
              ></path>
            </svg>
          </div>
          <div style="font-size: 28px">${adminDetail.editCount.length}</div>
        </div>
      </div>
    </div>`,
        '详情',
        {
            dangerouslyUseHTMLString: true,
            center: true,
        }
    )

}

</script>

<template>
    <div v-loading="loading">
        <el-table :data="filterTableData" stripe style="width: 100%" v-if="adminData.length >= 1" @row-click="viewDetail">

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
                    <el-button size="small" type="danger" :icon="Delete" circle plain
                        @click="handleDelete(scope.$index, scope.row)"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-empty description="这里什么也没有哟~" v-else />
    </div>
</template>

<style scoped></style>