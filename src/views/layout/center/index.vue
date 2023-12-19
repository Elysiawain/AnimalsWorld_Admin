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
    console.log(adminDetail.value)

}
onMounted(() => getAdminDetail())
</script>

<template>
    <div class="container">
        <div class="content">
            个人中心路由
        </div>
    </div>
</template>

<style scoped lang="scss">  
.container {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .content{
        display: flex;
        justify-content: center;
        width: 75%;
        height: 200px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
        background-color: $adminCenterBgcColor;

    }

}
</style>