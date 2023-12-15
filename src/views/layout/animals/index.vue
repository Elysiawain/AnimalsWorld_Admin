<script setup lang="ts">
import { ref } from 'vue'
const animals = ref<any>([])
</script>

<template>
    <div>
        <div v-if="animals.length > 1">
            动物数据二级路由
        </div>
        <el-empty description="这里什么也没有哟~" v-else />
    </div>
</template>

<style scoped lang="scss"></style>