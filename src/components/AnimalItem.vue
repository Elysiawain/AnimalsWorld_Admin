<script setup lang="ts">
defineProps({
    // 动物数据
    animalData: Object,
})

</script>

<template>
    <div class="container">
        <img :src="animalData?.imgURL" alt="" class="animal-img">

        <div>{{ animalData?.name }}</div>
    </div>
</template>

<style scoped lang="scss">
.container {
    background-color: pink;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 20%;
    width: 21%;
    min-width: 200px;
    color: black;
    font-size: 30px;
    transition: all 0.2s linear;
    &:hover {
        transform: translate3d(10px, -10px, 10px);
    }

    .animal-img {
        width: 100%;
        transition: all 0.2s linear;

        &:hover {
            transform: translate3d(10px, -10px, 10px);
        }
    }
}</style>