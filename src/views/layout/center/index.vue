<script lang="ts" setup>
import {markRaw, onMounted, ref} from 'vue'
import {useAdminStore} from '@/stores/admin'
import {getAdminDetailCenterApi, updateAdminApi} from '@/api/Admin'
import {Plus, Warning} from '@element-plus/icons-vue'
import type {UploadProps} from 'element-plus'
import {ElMessage, ElMessageBox} from 'element-plus'
import {getAnimalByIdApi} from '@/api/Animals'
import {upload} from '@/api/Common'
import type {AdminDetailData} from "@/interfaces/AdminDetail";
import type {Admin} from "@/interfaces/Admin";

const loading = ref(false)
const adminStore = useAdminStore()
// 获取管理员详细信息
const adminDetail = ref<AdminDetailData>({} as AdminDetailData)
const getAdminDetail = async () => {
  loading.value = true
  try {
    const {data} = await getAdminDetailCenterApi()
    adminDetail.value = data
    newAdminInfo.value = data
    /*        auditAnimalList.value = await getAnimalList(adminDetail.value.audit.toString()) // 获取审核动物列表
            addAnimalList.value = await getAnimalList(adminDetail.value.addCount.toString()) // 获取新增动物列表
            editAnimalList.value = await getAnimalList(adminDetail.value.editCount.toString()) // 获取修改动物列表*/
    loading.value = false
  } catch (error: any) {
    ElMessage.error('获取数据失败！')
    loading.value = false
    return
  }
}
onMounted(() => getAdminDetail())

// 编辑信息
const drawer = ref(false)
const direction = ref('rtl')
const newAdminInfo = ref<Admin>({} as Admin)

const editAdmin = () => {
  console.log(888)
  drawer.value = true
}
const checkImg = ref<any>(true)
const beforeImgUpload: UploadProps['beforeUpload'] = (rawFile) => {
  console.log(1)

  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('上传图片大小不能超过 2MB!')
    checkImg.value = false
    return false
  }
  checkImg.value = true
  return true
}
const uploadImg = () => {
}
const imgChange = async (uploadFile: any) => {
  let url = URL.createObjectURL(uploadFile.raw)
  const {data} = await upload(uploadFile.raw)
  newAdminInfo.value.avatarURL = url
  //newAdminInfo.value.avatarURL = data.data.imgURL
}
// 关闭前提醒
const beforeClose = () => {
  ElMessageBox.confirm('当前数据未保存确认关闭？', '提示',
      {

        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
        icon: markRaw(Warning)
      })
      .then(() => {
        drawer.value = false
        editBgc.value = false
        return true
      })
      .catch(() => {
        // catch error
      })
}
const cancel = () => {
  drawer.value = false
  ElMessage.info('已取消保存')
}
const confirm = async () => {
  if (!newAdminInfo.value.name || !newAdminInfo.value.message) {
    ElMessage.error('请将信息填写完整')
    return
  }
  drawer.value = false
  // 发送保存请求
  const res = await updateAdminApi(newAdminInfo.value.name, newAdminInfo.value.avatarURL, newAdminInfo.value.message, '')
  if (res.code.toString() !== '1') {
    ElMessage.error(res.message || '保存失败')
    return
  }
  newAdminInfo.value = {} as Admin
  ElMessage.success('保存成功')


}
const title = ref(['我的审核', '我的添加', '我的修改'])

/**
 * 根据动物id获取对应动物数据
 * @param ids
 */
const getAnimalList = async (ids: string) => {
  const res = await getAnimalByIdApi(Number(ids))
  return res.data
}
//修改背景
const editBgc = ref<any>(false)
const editBgcImg = () => {
  editBgc.value = true //打开抽屉
}
const confirmBgc = async () => {
  if (!newAdminInfo.value.bgImg) {
    ElMessage.error('请选择背景图片!')
    return
  }
  // 发送保存请求
  const res = await updateAdminApi('', '', '', newAdminInfo.value.bgImg)
  editBgc.value = false//关闭抽屉
  if (res.code.toString() !== '1') {
    ElMessage.error(res.message || '保存失败')
    return
  }
  newAdminInfo.value = {} as Admin
  ElMessage.success('修改成功')
}
const cancelBgc = () => {

  editBgc.value = false //关闭抽屉
}
const bgcImgChange = async (uploadFile: any) => {
  beforeImgUpload(uploadFile)

  if (!checkImg.value) {
    return
  }
  let url = URL.createObjectURL(uploadFile.raw)
  console.log(url)
  const {data} = await upload(uploadFile.raw)
  newAdminInfo.value.bgImg = url
  //newAdminInfo.value.bgcImgURL = data.data.imgURL
}

// 关闭抽屉重新刷新
const closeEditDrawer = async () => {
  await getAdminDetail()
}
</script>

<template>
  <div v-loading="loading" class="container">
    <div class="content">
      <div :style="{ 'backgroundImage': 'url(' + adminDetail?.bgImg+ ')' }" class="info">
<!--        <div class="edit-bgcImg" @click="editBgcImg">修改背景</div>-->
        <div class="admin-detail">
          <div class="info-avatar"><img :src="adminDetail?.avatarURL" alt="" width="100px"></div>
          <div class="info-name">{{ adminDetail?.name }}</div>
          <div class="info-ID"> 账号ID：{{ adminDetail?.adminID }}</div>
          <div class="info-message">{{ adminDetail?.message }}</div>
        </div>
        <div class="info-statistic">
          <el-row :gutter="60">
            <!-- <el-col :span="8"> -->
            <div class="statistic-card">
              <el-statistic :value="adminDetail?.addCount" style=" margin-right: 20px;">
                <template #title>
                  <div style="display: inline-flex; align-items: center;font-size: 20px;">
                    <div style="display: flex; align-items: center;">
                      总审核数
                      <el-tooltip content="该账号审核用户上传数据总数" effect="dark" placement="top">

                        <el-icon :size="16" style="margin-left: 4px; color: #85ce61;">
                          <Warning/>
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </div>
                </template>
                <template #suffix>
                  <el-icon style="vertical-align: -0.125em;color: #85ce61;">
                    <DocumentChecked/>
                  </el-icon>
                </template>
              </el-statistic>
            </div>
            <!-- </el-col> -->
            <!-- <el-col :span="8"> -->
            <div class="statistic-card">
              <el-statistic :value="adminDetail?.addCount" style=" margin-right: 20px;">
                <template #title>
                  <div style="display: inline-flex; align-items: center;font-size: 20px;">
                    <div style="display: flex; align-items: center;">

                      总添加数
                      <el-tooltip content="当前账号添加动物总数" effect="dark" placement="top">
                        <el-icon :size="16" style="margin-left: 4px;color: #85ce61;">
                          <Warning/>
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </div>
                </template>
                <template #suffix>
                  <el-icon style="vertical-align: -0.125em;color: #409EFF;">
                    <Upload/>
                  </el-icon>
                </template>
              </el-statistic>
            </div>
            <!-- </el-col> -->
            <!-- <el-col :span="8"> -->
            <div class="statistic-card">
              <el-statistic :value="adminDetail?.addCount" style=" margin-right: 20px;">
                <template #title>
                  <div style="display: inline-flex; align-items: center;font-size: 20px;">
                    <div style="display: flex; align-items: center;">

                      总修改数
                      <el-tooltip content="当前账号修改动物总数" effect="dark" placement="top">
                        <el-icon :size="16" style="margin-left: 4px;color: #85ce61;">
                          <Warning/>
                        </el-icon>
                      </el-tooltip>
                    </div>
                  </div>
                </template>
                <template #suffix>
                  <el-icon style="vertical-align: -0.125em;color: #85ce61;">
                    <Edit/>
                  </el-icon>
                </template>
              </el-statistic>
            </div>
            <!-- </el-col> -->
          </el-row>
        </div>
        <div class="admin-edit" @click="editAdmin()">编辑
          <el-icon>
            <Edit/>
          </el-icon>
        </div>
        <!-- 编辑抽屉 -->
        <el-drawer v-model="drawer" :before-close="beforeClose" :direction="direction">
          <template #header>
            <div style="font-size: 20px;">
              修改信息
              <el-icon style="margin-left: 5px;">
                <EditPen/>
              </el-icon>
            </div>
          </template>
          <div class="edit-form" style="display: flex;flex-direction: column;">
            管理员姓名
            <el-input v-model="newAdminInfo.name" placeholder="请输入管理员姓名"
                      style="width: 300px;margin:10px 0px 10px 0px;"
                      type="text"/>
            留言内容
            <el-input v-model="newAdminInfo.message" :rows="4" placeholder="请输入留言内容"
                      style="width: 300px;margin:10px 0px 10px 0px;"
                      type="textarea"/>
            修改头像
            <el-upload :before-upload="beforeImgUpload" :http-request="uploadImg" :on-change="imgChange"
                       :show-file-list="false" action="#" class="avatar-uploader"
                       style="width: 300px;margin:10px 0px 10px 0px;">
              <img v-if="newAdminInfo.avatarURL" :src="newAdminInfo.avatarURL" class="avatar" width="140px"/>
              <el-icon v-else class="avatar-uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </div>
          <template #footer>
            <div style="flex: auto">
              <el-button @click="cancel">取消修改</el-button>
              <el-button type="primary" @click="confirm">保存修改</el-button>
            </div>
          </template>
        </el-drawer>


<!--        &lt;!&ndash; 修改背景 &ndash;&gt;
        <el-drawer v-model="editBgc" :before-close="beforeClose" :direction="direction">
          <template #header>
            <div style="font-size: 20px;">
              修改背景
              <el-icon style="margin-left: 5px;">
                <EditPen/>
              </el-icon>
            </div>
          </template>
          <div class="edit-form" style="display: flex;flex-direction: column;">

            <el-upload :before-upload="beforeImgUpload" :http-request="uploadImg" :on-change="bgcImgChange"
                       :show-file-list="false" action="#" class="avatar-uploader"
                       style="width: 300px;margin:10px 0px 10px 0px;">
              <img v-if="newAdminInfo.bgImg" :src="newAdminInfo.bgImg" class="avatar" width="140px"/>
              <el-icon v-else class="avatar-uploader-icon">
                <Plus/>
              </el-icon>
            </el-upload>
          </div>
          <template #footer>
            <div style="flex: auto">
              <el-button @click="cancelBgc">取消修改</el-button>
              <el-button type="primary" @click="confirmBgc">保存修改</el-button>
            </div>
          </template>
        </el-drawer>-->

      </div>
    </div>

    <div class="content data">
      <AdminDetail :animal-data="adminDetail.auditList" :title="title[0]"
                   @close-edit-drawer="closeEditDrawer"></AdminDetail>
      <AdminDetail :animal-data="adminDetail.addList" :title="title[1]"
                   @close-edit-drawer="closeEditDrawer"></AdminDetail>
      <AdminDetail :animal-data="adminDetail.editList" :title="title[2]"
                   @close-edit-drawer="closeEditDrawer"></AdminDetail>

    </div>
  </div>
</template>

<style lang="scss" scoped>  .container {
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

      .edit-bgcImg {
        position: absolute;
        top: 5%;
        left: 2%;
        font-size: larger;
        font-weight: bold;

        &:hover {
          color: #6b6d71;
        }
      }

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

    .edit-form {
      display: flex;
      flex-direction: column;

      .avatar-uploader .avatar {
        width: 178px;
        height: 178px;
        display: block;
      }
    }
  }
}
</style>