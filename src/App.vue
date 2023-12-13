<script setup lang="ts">
import { testGet } from './api/Test';
const testData={
    username:'elysiawain',
    password:'123456'
  }
const testLogin = async () => {

  const res= await testGet(testData.username,testData.password)
  console.log(res)
  
}
</script>

<template>

  <el-button type="primary" @click="testLogin">测试登录数据</el-button>
  <RouterView />
</template>

<style scoped>
</style>
