<script lang="ts" setup>
import {ref} from 'vue'
import type {AnimalPre} from "@/interfaces/Animal";

const props = defineProps<{
  drawer: boolean,
  animalData: AnimalPre
}>()
//预发送图片请求
//TODO
const loading = ref<boolean>(false)


const emit = defineEmits<{
  updateDrawer: [drawer: boolean]
  initAnimal: [animalData: AnimalPre]
}>() // 定义事件
const showDrawer = () => {
  emit('updateDrawer', !props.drawer)

  const animalData = props.animalData

  emit('initAnimal', animalData)
}

// 鼠标进入时放大图片
const expansion = ref(1)
const onMouseEnter = () => {
  expansion.value = 1.1
}

</script>

<template>
  <div class="container">
    <div id="titleImg" v-loading="loading" class="title-img" @mouseenter="onMouseEnter"
         @mouseleave="expansion=1">
      <img :src="animalData.img" :style="{}" class="img" style="width: 100%;height: 100%;position: absolute;"/>
      <div class="edit"><span @click="showDrawer">
        <img alt="" src="@/assets/edit.png" style="margin-right: 5px; line-height:20px ;"
             width="20px"> 编辑 </span></div>
    </div>
    <div class="animal-name">{{ animalData?.name }}</div>
  </div>
</template>

<style lang="scss" scoped>
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
    box-shadow: 0 15px 30px rgb(0 0 0 / 0.3);
  }

  .animal-name {
    flex: 1;
    font-size: 24px;
    display: flex;
    align-items: center;
  }

  .title-img {
    width: 100%;
    height: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    font-size: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease-in-out;
    .img {
      transition: all 0.2s ease-in-out;
      transform: scale(v-bind(expansion));
    }

    .edit {
      display: flex;
      justify-content: center;
      align-items: end;
      width: 100%;
      height: 100%;
      bottom: 0%;
      opacity: 0;
      transition: all 0.2s linear;
      z-index: 9;
      background: rgba(0, 0, 0, 0.2);

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
        color: #cccccc;

        &:hover {
          color: #39c5bb;
        }
      }
    }
  }
}
</style>