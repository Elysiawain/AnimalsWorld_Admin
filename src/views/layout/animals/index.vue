<script setup lang="ts">
import AnimalItem from '@/components/AnimalItem.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import { getAnimalListApi, getAnimalClassificationApi, addAnimalApi, getAnimalByName } from '@/api/Animals'
import type { Animal } from '@/pojo/Animal'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { upload } from '@/api/Common'
import { isValidAddAnimalForm } from '@/utils/Check'
import { debounce } from '@/utils/debounce'

const loading = ref(false)
const animalList = ref<any>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(10)
const classification = ref<string>('')
const route = useRoute()
// 初始化数据
const getAnimalList = async () => {
    loading.value = true
    const { data: { data } } = await getAnimalListApi(page.value, pageSize.value, classification.value)
    animalList.value = data.AWList
    total.value = data.total
    loading.value = false
    return data.AWList
}
onMounted(() => getAnimalList())

// 导航栏
const nav_index = ref('1')
const handleSelect = async (key: string) => {
    const newIndex = key.split('-')[1]
    if (newIndex !== undefined) {
        clIndex.value = Number(newIndex)
    }
    if (key === '4') { return }
    //TODO 发送请求重新渲染
    classification.value = newIndex
    getAnimalList()

}
// 获取动物分类
let options: [] = []
const clIndex = ref<number>(0)
const classificationList = ref<[]>([])
const getAnimalClassification = async () => {
    loading.value = true
    const res = await getAnimalClassificationApi()
    classificationList.value = res.data.data.classificationList
    options = classificationList.value

    loading.value = false
}
getAnimalClassification()
// 搜索框
const search = ref('')
const startSeach = async () => {
    //发送请求，根据输入框搜索，
    const res = await getAnimalByName(search.value)
    console.log(res)
    search.value = ''
    // 重新渲染页面
    getAnimalList()
}
// 触底加载
const disabled = ref(false)
const loadMore = async () => {
    if (route.name !== 'about') {
        return
    }
    const { data: { data } } = await getAnimalListApi(1, 10, '哺乳动物')
    // page++

    if (data.AWList.length == 0) {
        disabled.value = true
        return
    }
    // 拼接数组
    animalList.value = [...animalList.value, ...data.AWList]
}
const debounceLoadMore = debounce(loadMore, 300, { leading: false })
// 添加新动物
const drawer_title = ref<any>('添加新动物')
const drawer = ref<boolean>(false)
// 子组件打开
const handleDrawerUpdate = (newDrawerStatus: any) => {
    drawer.value = newDrawerStatus
}
//子组件初始化抽屉
const imageUrlList = ref<UploadUserFile[]>([{
    name: '',
    url: ''
}])
const initAnimal = (animalData: Animal) => {
    addAnimalForm.value = animalData
    // 清空
    imageUrlList.value = []
    drawer_title.value = '编辑动物'
    addAnimalForm.value.imgURL.forEach(img => {
        let initImg = {
            name: '',
            url: ''
        }
        initImg.name = img.uid
        initImg.url = img.url
        imageUrlList.value.push(initImg)
    })


}
// 打开抽屉
const open = () => {
    imageUrlList.value = []
    drawer_title.value = '添加新动物'
    drawer.value = true
}
// 分类选择

const addAnimalForm = ref<Animal>({
    name: '',
    imgURL: [{
        uid: '',
        url: ''
    }],
    description: '',
    classification: '',
    distribution: '',
    protectLevel: '',
    diet: '',
    breeding: '',
    lifestyle: '',
    predator: '',
})
// 保护级别
const protectionLevel = [
    {
        value: '1',
        label: '一级保护'
    },
    {
        value: '2',
        label: '二级保护'
    },
    {
        value: '3',
        label: '三级保护'
    },
    {
        value: '4',
        label: '普通'
    }
]
// 繁殖方式
const breedList = [
    {
        value: '1',
        label: '胎生'
    },
    {
        value: '2',
        label: '卵生'
    },
    {
        value: '3',
        label: '无性'
    }
]
// 图片上传

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
// 取消已上传图片
const handleRemove: UploadProps['onRemove'] = (uploadFile) => {
    // 清除对应的图片
    const index = addAnimalForm.value.imgURL.findIndex(item => item.uid === uploadFile.raw?.uid.toString())
    addAnimalForm.value.imgURL.splice(index, 1)
    console.log(addAnimalForm.value.imgURL)

}
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    console.log(uploadFile.url)
    dialogVisible.value = true
}
const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
        ElMessage.error('图片格式必须为jpg/png格式')
        return false
    } else if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('上传图片大小必须小于2MB!')
        return false
    }
    return true
}
const uploadImg = async (rawFile: any) => {
    const { data } = await upload(rawFile)
    let newImg = { uid: rawFile.file.uid, url: data.data.imgURL }
    addAnimalForm.value.imgURL.push(newImg)
    console.log(addAnimalForm.value.imgURL)
}

// 添加请求
const addAnimal = async () => {
    const res = await addAnimalApi(addAnimalForm.value)
    if (res.data.code === '1') {
        ElMessage.success('添加成功')
        return true
    }
    ElMessage.error('添加失败')
    return false
}
const cancelClick = () => {
    console.log("取消")
    drawer.value = false
}
const confirmClick = async () => {
    console.log("确认")
    // 发送前校验
    const isValid = await isValidAddAnimalForm(addAnimalForm.value)
    if (!isValid) {
        ElMessage.error('请填写完整数据')
        return
    }
    // 发送添加请求
    const res = await addAnimal()
    console.log(res)

    drawer.value = false
}
// 添加结束，重新渲染页面
const close = () => {
    // 1、判断添加或修改内容是否经保存，没保存提醒
    addAnimalForm.value = {}
    addAnimalForm.value.imgURL = []

}
</script>
v-infinite-scroll
<template>
    <div class="container" ref="container" id="container">
        <el-affix :offset="0">
            <div class="animals-nav">
                <el-menu :default-active="nav_index" class="el-menu-demo" mode="horizontal" background-color="#545c64"
                    text-color="#fff" active-text-color="rgb(213,253,157)" @select="handleSelect">
                    <el-menu-item index="1">全部</el-menu-item>
                    <el-sub-menu index="2">
                        <template #title>{{ classificationList[clIndex] }}</template>
                        <el-menu-item v-for="(item, index) in classificationList" :index="'2-' + index" :key="item">{{ item
                        }}</el-menu-item>
                    </el-sub-menu>
                    <el-menu-item index="3">导航三</el-menu-item>

                    <el-menu-item index="4" @click="open">添加动物<el-icon>
                            <CirclePlus />
                        </el-icon></el-menu-item>
                    <el-row>
                        <el-statistic :value="total" value-style="color: rgb(135,206,235);" style="margin-left: 20px;">
                            <template #title>
                                <div style="color:rgb(213,253,157) ; font-size: 16px; display:flex;  align-items:center;">
                                    数据总量
                                    <el-icon style="font-size:30px">
                                        <PieChart />
                                    </el-icon>
                                </div>
                            </template>

                        </el-statistic>
                    </el-row>

                </el-menu>
                <el-input v-model="search" class="w-50 m-2 search-box" placeholder="搜索" :prefix-icon="Search"
                    @change="startSeach()" />
            </div>
        </el-affix>

        <div v-if="animalList.length > 1" class="animals-container" v-infinite-scroll="debounceLoadMore"
            :infinite-scroll-disabled="disabled">
            <AnimalItem v-for="(item) in animalList" :key="item" :animalData="item" :drawer="drawer"
                @update-drawer="handleDrawerUpdate" @init-animal="initAnimal" class="animal-item" v-loading="loading" />
            <!-- 侧边抽屉 -->
            <el-drawer v-model="drawer" :title="drawer_title" @close="close" size="30%">
                <template #header>
                    <div style="font-size: larger;display:flex;align-items:center;">
                        <img src="@/assets/logoHead.ico" alt="" width="30px" style="margin-right:15px;">
                        {{ drawer_title }}
                        <el-icon style="margin-left:2px;font-size:20px;">
                            <Edit />
                        </el-icon>
                    </div>
                </template>
                <div class="add-name">
                    动物名称：
                    <el-input v-model="addAnimalForm.name" placeholder="动物名称" clearable style="width: 52%;" />
                </div>
                <div class="classify">
                    动物分类：
                    <el-select v-model="addAnimalForm.classification" clearable placeholder="请选择">
                        <el-option v-for="item in options" :key="item" :label="item" :value="item" />
                    </el-select>
                </div>
                <div class="pro-level">
                    保护级别：
                    <el-select v-model="addAnimalForm.protectLevel" clearable placeholder="请选择">
                        <el-option v-for="item in protectionLevel" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                </div>
                <div class="breed">
                    繁殖方式：
                    <el-select v-model="addAnimalForm.breeding" clearable placeholder="请选择">
                        <el-option v-for="item in breedList" :key="item.value" :label="item.label" :value="item.value" />
                    </el-select>
                </div>
                <div>
                    添加图片：
                    <el-upload v-model:file-list="imageUrlList" action="#" list-type="picture-card"
                        :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :http-request="uploadImg"
                        :before-upload="beforeUpload">
                        <el-icon>
                            <Plus />
                        </el-icon>
                    </el-upload>
                    <el-dialog v-model="dialogVisible">
                        <img w-full :src="dialogImageUrl" alt="Preview Image" />
                    </el-dialog>
                </div>
                <div class="description">
                    动物简述：
                    <el-input v-model="addAnimalForm.description" type="textarea" placeholder="请输入该动物的描述"
                        :autosize="{ minRows: 2, maxRows: 4 }" maxlength="200" show-word-limit />
                </div>
                <template #footer>
                    <div style="display: flex; justify-content: start;">
                        <el-button @click="cancelClick">取消</el-button>
                        <el-button type="primary" @click="confirmClick">提交</el-button>
                    </div>
                </template>
            </el-drawer>
        </div>
        <el-empty description="这里什么也没有哟~" v-else />
    </div>
</template>

<style scoped lang="scss">
.container {
    position: relative;

    .back-top {
        width: 50px;
        height: 50px;
        position: absolute;
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        color: $titleFontColor;
        font-size: 40px;
        top: 70%;
        right: 0.2%;
        z-index: 99;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 50%;
        transition: all 0.2s linear;

        &:hover {
            background-color: $asideFontColor;
        }
    }

    .active-back-top {
        opacity: 1;
    }

    .animals-nav {
        background-color: #545c64;
        width: 100%;
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        padding-right: 3%;
        border-radius: 8px;
        overflow: hidden;

        .el-menu-demo {
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

        .el-drawer {

            div {
                margin-bottom: 10px;
            }

            .classify .add-name {
                width: 100%;
                display: flex;
                justify-content: start;
                align-items: center;
                flex-wrap: wrap;
            }

        }
    }
}
</style>
