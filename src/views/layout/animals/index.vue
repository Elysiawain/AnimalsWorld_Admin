<script setup lang="ts">
import AnimalItem from '@/components/AnimalItem.vue'
import { ref, onMounted } from 'vue'
import { getAnimalListApi } from '@/api/Animals'
const animalList = ref<any>([])
const getAnimalList = async () => {
    const { data: { data } } = await getAnimalListApi(1, 10, '哺乳动物')
    animalList.value = data.AWList
}
onMounted(() => getAnimalList())
</script>

<template>
    <div>
        <div v-if="animalList.length > 1" class="animals-container">
            <AnimalItem v-for="(item) in animalList" :key="item" :animalData="item" class="animal-item" />
        </div>
        <el-empty description="这里什么也没有哟~" v-else />

    </div>
</template>

<style scoped lang="scss">
.animals-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    .animal-item {
        margin:10px 2%;

    }
}
</style>