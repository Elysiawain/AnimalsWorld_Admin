<script setup lang="ts">
import { ref } from 'vue'
defineProps({
    // 动物数据
    animalData: Object,
    
})

</script>

<template>
    <div class="container">
        <div class="title-img" :style="{ backgroundImage: `url(${animalData?.imgURL})` }">
            <div class="edit"><span>编辑</span></div>
        </div>
        <div>{{ animalData?.name }}</div>
    </div>
</template>

<style scoped lang="scss">
.container {
    background-color: $bgcColor;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 300px;
    //min-height: 250px;
     width: 100%;
    min-width: 200px;
    color: black;
    font-size: 30px;
    transition: all 0.2s linear;
    border-radius: 2%;
    overflow: hidden;
    &:hover {
        transform: translate3d(0px, -10px, 0px);
    }

    .title-img {
        width: 100%;
        height: 70%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        font-size: 24px;
        .edit {
            display: flex;
            justify-content: center;
            align-items: end;
            width: 100%;
            height: 100%;
            bottom: 0%;
            opacity: 0;
            transition: all 0.2s linear;
            &:hover{
                opacity: 1;
                transition: all 0.2s linear;
            }
            span{
                display: flex;
                justify-content: center;
                cursor: pointer;
                transition: all 0.2s linear;
                width: 100%;
                background-color: rgba($color: #000000, $alpha: .2);
                &:hover{
                    color: white;
                }
            }
        }

        .animal-img {
            width: 100%;
            transition: all 0.2s linear;


        }
    }
}
</style>