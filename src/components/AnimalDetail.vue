<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {getUserByUserIdApi} from '@/api/Admin'
import type {Animal} from "@/interfaces/Animal";
import type {User} from "@/interfaces/User";

const props = defineProps<{
  animalsData: Animal,
  uploadUser: string,
  uploadTime: string,
}>()
watch(props,() =>{

})
const uploadUser = ref(props.uploadUser)
const user = ref<User>()
let imgUrl: [] = []
props?.animalsData?.imgURL.forEach((item: any) => imgUrl.push(item.url))
const getUploadUser = async () => {
  const res = await getUserByUserIdApi(props.uploadUser)
  user.value = res.data

}
onMounted(() => getUploadUser())
watch(props, () => {
  getUploadUser()
})
</script>

<template>
  <div class="container">
    <div class="uploader"><span>上传者：</span><img :src="user?.avatarURL" alt="点击查看详情">{{ user?.userName }}</div>
    <div class="uploader"><span>用户ID：</span>{{ user?.userID }}</div>
    <div><span>上传时间：</span>{{ uploadTime }}</div>
    <div><span>动物名：</span>{{ animalsData?.name }}</div>
    <div class="picture"><span>动物图片预览：</span>
      <div class="img-list">
        <el-image v-for="img in animalsData?.imgList.toString().split(',')" :key="img.uid" :max-scale="7" :min-scale="0.2"
                  :preview-src-list="animalsData?.imgList.toString().split(',')"
                  :src="img" :zoom-rate="1.2" fit="scale-down"/>
      </div>

    </div>
    <div class="detail">
      <div><span>描述：</span>{{ animalsData?.description }}</div>
      <div><span>分类：</span>{{ animalsData?.classification }}</div>
      <div><span>分布：</span>{{ animalsData?.distribution }}</div>
      <div><span>保护级别：</span>{{ animalsData?.protectionLevel }}</div>
      <div><span>饮食：</span>{{ animalsData?.diet }}</div>
      <div><span>繁殖方式：</span>{{ animalsData?.breeding }}</div>
      <div><span>天敌：</span>{{ animalsData?.predator }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  font-size: 16px;
  color: #6C6E72;

  div {
    margin-bottom: 10px;
  }

  div > span {
    font-weight: bold;
  }

  .detail {
    div > span {
      font-weight: bold;
    }
  }

  .uploader {
    display: flex;
    align-items: center;

    img {
      border-radius: 50%;
      width: 50px;
      height: 50px;
      cursor: pointer;
      margin: 0 10px 10px 10px;
    }
  }

  .picture {
    display: flex;
    flex-direction: column;

    .img-list {
      display: grid;
      width: 100%;
      height: 400px;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 10px;
    }
  }
}
</style>