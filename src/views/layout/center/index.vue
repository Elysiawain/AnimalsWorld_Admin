<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { getAdminDetailApi } from '@/api/Admin'
import { Warning, } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import AdminDetail from '@/components/AdminDetail.vue'
const adminStore = useAdminStore()
// 获取管理员详细信息
const adminDetail = ref<any>({})
const getAdminDetail = async () => {
    const { data: { data } } = await getAdminDetailApi(adminStore.admin.adminID)
    adminDetail.value = data.admin

}
onMounted(() => getAdminDetail())

// 编辑信息
const drawer = ref(false)
const direction = ref('rtl')
const editAdmin = () => {
    drawer.value = true
}
// 关闭前提醒
const beforeClose = () => {
    ElMessageBox.confirm('确认关闭？')
        .then(() => {
            ElMessage.success('关闭成功！')
            drawer.value = false
            return true
        })
        .catch(() => {
            // catch error
        })
}
const title=ref(['我的审核','我的添加','我的修改'])
</script>

<template>
    <div class="container">
        <div class="content">
            <div class="info" :style="{ 'backgroundImage': 'url(' + adminDetail.bgcImgURL + ')' }">
                <div class="admin-detail">
                    <div class="info-avatar"><img :src="adminStore.admin.avatarURL" alt="" width="100px"></div>
                    <div class="info-name">{{ adminStore.admin.name }}</div>
                    <div class="info-ID"> 账号ID：{{ adminDetail.adminID }}</div>
                    <div class="info-message">{{ adminDetail.message }}</div>

                </div>
                <div class="info-statistic">
                    <el-row :gutter="16">
                        <el-col :span="8">
                            <div class="statistic-card">
                                <el-statistic :value="adminDetail.audit">

                                    <template #title>
                                        <div style="display: inline-flex; align-items: center;">
                                            总审核数
                                            <el-tooltip effect="dark" content="该账号审核用户上传数据总数" placement="top">

                                                <el-icon style="margin-left: 4px; color: #85ce61;" :size="12">
                                                    <Warning />
                                                </el-icon>
                                            </el-tooltip>
                                        </div>
                                    </template>
                                    <template #suffix>
                                        <el-icon style="vertical-align: -0.125em;color: #85ce61;">
                                            <DocumentChecked />
                                        </el-icon>
                                    </template>
                                </el-statistic>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="statistic-card">
                                <el-statistic :value="adminDetail.addCount">
                                    <template #title>
                                        <div style="display: inline-flex; align-items: center">
                                            总添加数
                                            <el-tooltip effect="dark" content="当前账号添加动物总数" placement="top">
                                                <el-icon style="margin-left: 4px;color: #85ce61;" :size="12">
                                                    <Warning />
                                                </el-icon>
                                            </el-tooltip>
                                        </div>
                                    </template>
                                    <template #suffix>
                                        <el-icon style="vertical-align: -0.125em;color: #409EFF;">
                                            <Upload />
                                        </el-icon>
                                    </template>
                                </el-statistic>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="statistic-card">
                                <el-statistic :value="adminDetail.addCount">
                                    <template #title>
                                        <div style="display: inline-flex; align-items: center;">
                                            总修改数
                                            <el-tooltip effect="dark" content="当前账号修改动物总数" placement="top">
                                                <el-icon style="margin-left: 4px;color: #85ce61;" :size="12">
                                                    <Warning />
                                                </el-icon>
                                            </el-tooltip>
                                        </div>
                                    </template>
                                    <template #suffix>
                                        <el-icon style="vertical-align: -0.125em;color: #85ce61;">
                                            <Edit />
                                        </el-icon>
                                    </template>
                                </el-statistic>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div class="admin-edit" @click="editAdmin()">编辑<el-icon>
                        <Edit />
                    </el-icon>
                </div>
                <!-- 编辑抽屉 -->
                <el-drawer v-model="drawer" title="修改管理员信息" :direction="direction" :before-close="beforeClose">
                    <span>Hi, there!</span>
                </el-drawer>
            </div>
        </div>

        <div class="content data">
            <AdminDetail :titie="title[0]"></AdminDetail>
            <AdminDetail :titie="title[1]"></AdminDetail>
            <AdminDetail :titie="title[2]"></AdminDetail>
        </div>
    </div>
</template>

<style scoped lang="scss">  .container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;

      .content {
          margin-bottom: 10px;
          display: flex;
          justify-content: center;
          width: 1000px;
          height: 300px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          background-color: $adminCenterBgcColor;

          .info {
              padding: 5% 10% 1% 2%;
              display: flex;
              justify-content: space-between;
              align-items: end;
              flex-direction: row;
              width: 100%;
              background-repeat: no-repeat;
              background-size: 100% 100%;
              background-position: center;
              position: relative;

              .info-statistic {
                  display: flex;
                  justify-content: center;
                  align-items: end;
                  width: 50%;
              }

              .admin-edit {
                  font-size: larger;
                  position: absolute;
                  top: 5%;
                  right: 5%;

                  &:hover {
                      color: #a6a9ad;
                  }
              }

              .admin-detail {
                  display: flex;
                  height: 100%;
                  flex-direction: column;
                  align-items: center;
                  justify-content: end;

                  div {
                      margin-bottom: 5px;
                  }

                  .info-avatar {
                      width: 100px;
                      height: 100px;
                      border-radius: 50%;
                      overflow: hidden;

                      img {
                          width: 100%;
                          height: 100%;
                      }
                  }

                  .info-name {
                      color: #6b6d71;
                      font-size: 24px;
                  }

                  .info-ID {
                      font-size: smaller;
                      color: #a6a9ad;
                  }

                  .info-message {
                      font-size: smaller;
                      color: #6C6E72;
                  }

                  .info-statistic {
                      :global(h2#card-usage ~ .example .example-showcase) {
                          background-color: var(--el-fill-color) !important;
                      }

                      .el-statistic {
                          --el-statistic-content-font-size: 28px;
                      }

                      .statistic-card {
                          height: 100%;
                          padding: 20px;
                          border-radius: 4px;
                          background-color: var(--el-bg-color-overlay);
                      }

                      .statistic-footer .footer-item {
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                      }

                      .statistic-footer .footer-item span:last-child {
                          display: inline-flex;
                          align-items: center;
                          margin-left: 4px;
                      }

                      .green {
                          color: var(--el-color-success);
                      }

                      .red {
                          color: var(--el-color-error);
                      }
                  }
              }


          }

      }

      .data {
        height: max-content;
          padding: 2% 0% 2% 2%;
          display: flex;
          justify-content: start;
          flex-direction: column;
          align-items: start;
      }
  }
</style>