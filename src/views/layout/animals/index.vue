<script setup lang="ts">
import AnimalItem from '@/components/AnimalItem.vue'
import { ref, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { getAnimalListApi, getAnimalClassificationApi } from '@/api/Animals'



const animalList = ref<any>([])
const getAnimalList = async () => {
    const { data: { data } } = await getAnimalListApi(1, 10, '哺乳动物')
    animalList.value = data.AWList
    return data.AWList
}
onMounted(() => getAnimalList())

// 导航栏
const nav_index = ref('1')
const handleSelect = (key: string) => {
    const newIndex = key.split('-')[1]
    if (newIndex !== undefined) {
        clIndex.value = Number(newIndex)
    }
    //TODO 发送请求重新渲染
}
// 获取动物分类
const clIndex = ref<number>(0)
const classificationList = ref<[]>([])
const getAnimalClassification = async () => {
    const res = await getAnimalClassificationApi()
    console.log(res)
    classificationList.value = res.data.data.classificationList
}
getAnimalClassification()
// 搜索框
const search = ref('')
const startSeach=()=>{
    //TODO 发送请求，根据输入框搜索，

    // 重新渲染页面
    
}
// 触底加载
const disabled=ref(false)
const loadMore = async () => {
    console.log('触底加载')
     const { data: { data } } = await getAnimalListApi(1, 10, '哺乳动物')
    // page++
    
    if(data.AWList.length==0){
        disabled.value=true
        return
    }
    // 拼接数组
    animalList.value=[...animalList.value,...data.AWList]
    console.log(animalList.value)
    
}
</script>

<template>
    <div class="container">
        <div class="animals-nav">
            <el-menu  :default-active="nav_index" class="el-menu-demo" mode="horizontal" background-color="#545c64"
                text-color="#fff" active-text-color="rgb(213,253,157)" @select="handleSelect">
                <el-menu-item index="1">全部</el-menu-item>
                <el-sub-menu index="2">
                    <template #title>{{ classificationList[clIndex] }}</template>
                    <el-menu-item v-for="(item, index) in classificationList" :index="'2-' + index" :key="item">{{ item
                    }}</el-menu-item>
                </el-sub-menu>
                <el-menu-item index="3">导航三</el-menu-item>
                <el-menu-item index="4">导航四</el-menu-item>
            </el-menu>
            <el-input v-model="search" class="w-50 m-2 search-box" placeholder="搜索" :prefix-icon="Search" @change="startSeach()" />
        </div>
        <div v-if="animalList.length > 1" class="animals-container" v-infinite-scroll="loadMore" :infinite-scroll-disabled="disabled">
            <AnimalItem v-for="(item) in animalList" :key="item" :animalData="item" class="animal-item" />
        </div>
        <el-empty description="这里什么也没有哟~" v-else />
    </div>
</template>

<style scoped lang="scss">
.container {
    .animals-nav {
        background-color: #545c64;
        width: 100%;
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        padding-right: 3%;
        .el-menu-demo{
            flex: 3;
            height: 100%;
        }
        .search-box {
            flex: 1;
            width: 30%;
            height: 60%;
        }
    }

    .animals-container {
        /*     display: flex;
    flex-wrap: wrap;
    justify-content: start; */
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-column-gap: 20px;
        grid-row-gap: 20px;
    }
}
</style>
