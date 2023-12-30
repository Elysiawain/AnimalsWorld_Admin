<script setup lang="ts">
const props=defineProps({
    dataList:[]
})
</script>

<template>
    <div v-for="item in dataList" :key="item">
        {{ item }}
    </div>
</template>

<style scoped></style>