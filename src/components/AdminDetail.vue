<script setup lang="ts">
import { ref } from 'vue'
import AnimalItem from './AnimalItem.vue'
const props = defineProps({
    titie: String,
    animalData: Object
})
</script>

<template>
    <div class="detail">
        <h3>{{ titie }}
            <el-icon>
                <ArrowRightBold />
            </el-icon>
            <span>查看更多<el-icon :size="18"><Expand /></el-icon></span>
        </h3>
        <el-divider />
        <div class="detail-item">
            <AnimalItem v-for="(item) in animalData?.slice(0, 4)" :key="item" :animal-data="item" class="item" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.detail {
    margin-bottom: 20px;

    h3 {
        display: flex;
        align-items: center;
        color: #525457;
        position: relative;
        font-size: large;
        span{
            position: absolute;
            right: 10px;
            font-size: 14px;
            color: #999;
            display: flex;
            align-items: center;
            &:hover{
                cursor: pointer;
                color: #525457;
                transition: all .2s;
            }
        }
    }

    .detail-item {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        grid-gap: 20px;

        .item {
            margin-right: 20px;
            width: 80px;
            height: 200px;
            font-size: 20px;
        }
    }
}
</style>