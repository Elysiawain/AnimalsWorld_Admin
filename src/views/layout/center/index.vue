<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { getAdminDetailApi } from '@/api/Admin'
const adminStore = useAdminStore()
// 获取管理员详细信息
const adminDetail = ref<any>({})
const getAdminDetail = async () => {
    const { data: { data } } = await getAdminDetailApi(adminStore.admin.adminID)
    adminDetail.value = data.admin

}
onMounted(() => getAdminDetail())

</script>

<template>
    <div class="container">
        <div class="content">
            <div class="info" :style="{'backgroundImage': 'url(' + adminDetail.bgcImgURL + ')'}">
                <div class="info-avatar"><img :src="adminStore.admin.avatarURL" alt="" width="100px"></div>
                <div class="info-name">{{ adminStore.admin.name }}</div>
                <div class="info-message">{{ adminDetail.message }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">  .container {
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;

      .content {

          display: flex;
          justify-content: center;
          width: 1000px;
          height: 300px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          border-radius: 10px;
          background-color: $adminCenterBgcColor;
          .info{
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: start;
            flex-direction: column;
            width: 100%;
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;
            .info-avatar{
                width: 100px;
                height: 100px;
                border-radius: 50%;
                overflow: hidden;
                img{
                    width: 100%;
                    height: 100%;
                }
            }
          }

      }

  }
</style>