<script setup lang="ts">
import { ref, onMounted,watch } from 'vue'
import { getUserApi } from '@/api/Admin'
const props = defineProps({
    animasData: Object,
    uploadUser: String,
    uploadTime: String,
})
const uploadUser=ref(props.uploadUser)
const user = ref<any>()
let imgUrl: [] = []
props?.animasData?.imgURL.forEach((item: any) => imgUrl.push(item.url))
const getUploadUser = async () => {
    const res = await getUserApi(0, 0, props.uploadUser, '')
    user.value = res.data.data.userList[0]
    console.log('用户数据')
    console.log(user.value)
    
    
    console.log(user.value)
    
}
onMounted(() => getUploadUser())
watch(props, () =>{
    getUploadUser()
})
</script>

<template>
    <div class="container">
        <div class="uploader"><span>上传者：</span><img :src="user?.avatarURL" alt="点击查看详情">{{ user?.userName }}</div>
        <div class="uploader"><span>用户ID：</span>{{ user?.userID }}</div>
        <div><span>上传时间：</span>{{ uploadTime }}</div>
        <div><span>动物名：</span>{{ animasData?.name }}</div>
        <div class="picture"><span>动物图片预览：</span>
            <div class="img-list">
                <el-image v-for="img in animasData?.imgURL" :key="img.uid" :src="img.url" :zoom-rate="1.2" :max-scale="7"
                    :min-scale="0.2" :preview-src-list="imgUrl" fit="scale-down" />
            </div>

        </div>
        <div class="detail">
            <div><span>描述：</span>{{ animasData?.description }}</div>
            <div><span>分类：</span>{{ animasData?.classification }}</div>
            <div><span>分布：</span>{{ animasData?.distribution }}</div>
            <div><span>保护级别：</span>{{ animasData?.protectionLevel }}</div>
            <div><span>饮食：</span>{{ animasData?.diet }}</div>
            <div><span>繁殖方式：</span>{{ animasData?.breeding }}</div>
            <div><span>天敌：</span>{{ animasData?.predator }}</div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    font-size: 16px;
    color: #6C6E72;
    div{
        margin-bottom: 10px;
    }
    div>span {
            font-weight: bold;
        }
    .detail {
        div>span {
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