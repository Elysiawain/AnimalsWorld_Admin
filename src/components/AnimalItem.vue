<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
const props = defineProps({
    // 动物数据
    animalData: Object,
    drawer: Boolean,

})
//预发送图片请求
//TODO
const loading = ref<boolean>(false)


const emit = defineEmits(['updateDrawer', 'initAnimal']) // 定义事件
const showDrawer = () => {
    emit('updateDrawer', !props.drawer)

    const animalData = props.animalData

    emit('initAnimal', animalData)
}


</script>

<template>
    <div class="container">
        <div class="title-img" id="titleImg" :style="{ backgroundImage: `url(${animalData?.imgURL[0]?.url || ' '})` }"
         v-loading="loading"   >
            <div class="edit"><span @click="showDrawer"><img src="@/assets/edit.png" alt="" width="20px"
                        style="margin-right: 5px; line-height:20px ;"> 编辑 </span></div>
        </div>
        <div class="animal-name">{{ animalData?.name }}</div>
    </div>
</template>

<style scoped lang="scss">
.container {
    background-color: white;
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
        // 加一点背景阴影
        box-shadow: 0 15px 30px rgb(0 0 0 / 0.2);
    }

    .animal-name {
        margin-bottom: 12%
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

            &:hover {
                opacity: 1;
                transition: all 0.2s linear;
            }

            span {
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                transition: all 0.2s linear;
                width: 100%;
                font-size: 20px;
                background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));

                &:hover {
                    color: #bbbfff;
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