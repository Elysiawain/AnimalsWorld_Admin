<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAdminListApi } from '@/api/Admin';
const adminList = ref<any[]>([]);
const getAdminList = async () => {
    const res = await getAdminListApi();
    adminList.value = res.data;
};
onMounted(() => {
    getAdminList()
})
</script>

<template>
    <div class="container">
        <h1>统计数据展示区</h1>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
}
</style>