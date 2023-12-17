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
    <div class="container">
        <div class="animals-nav">顶部导航</div>
        <div v-if="animalList.length > 1" class="animals-container">
            <AnimalItem v-for="(item) in animalList" :key="item" :animalData="item" class="animal-item" />
        </div>
        <el-empty description="这里什么也没有哟~" v-else />

    </div>
</template>

<style scoped lang="scss">
.container{
    .animals-nav{
        width: 100%;
        background-color: red;
        margin-bottom: 20px;
    }
    .animals-container {
/*     display: flex;
    flex-wrap: wrap;
    justify-content: start; */
    display: grid;
    grid-template-columns: repeat(5,1fr);
    grid-column-gap: 20px;
    grid-row-gap:20px ;
}
}

</style>