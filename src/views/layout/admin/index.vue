<script setup lang="ts">
import { ref } from 'vue'
const adminList = ref([])
</script>

<template>
        <div>
            <div v-if="adminList.length> 1">
                动物数据二级路由
            </div>
            <el-empty description="这里什么也没有哟~" v-else />
        </div>
</template>

<style scoped></style>