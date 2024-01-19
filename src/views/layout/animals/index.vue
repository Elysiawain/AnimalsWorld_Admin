<script setup lang="ts">
import AnimalItem from '@/components/AnimalItem.vue'
import Drawer from '@/components/Drawer.vue'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Search, Plus } from '@element-plus/icons-vue'
import { getAnimalListApi, getAnimalClassificationApi, addAnimalApi, getAnimalByName, suggestAnimalApi } from '@/api/Animals'
import type { Animal } from '@/pojo/Animal'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { upload } from '@/api/Common'
import {useAnimalStore}from '@/stores/animal'
import { debounce } from '@/utils/debounce'

const loading = ref(false)
const bottomLoading = ref(false) //底部加载
const animalList = ref<any>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const classification = ref<string>('')
const route = useRoute()
// 初始化数据
const getAnimalList = async () => {
    loading.value = true

    try {
        const { data: { data } } = await getAnimalListApi(page.value, pageSize.value, classification.value)
        animalList.value = data.AWList
        total.value = data.total
        loading.value = false
        return data.AWList
    } catch (err) {
        ElMessage.error('获取动物列表失败')
        loading.value = false
        return
    }
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
const animalStore=useAnimalStore()
const getAnimalClassification = async () => {
    loading.value = true
    const res = await getAnimalClassificationApi()
    classificationList.value = res.data.data.classificationList
    options = classificationList.value
    animalStore.setClassfication(options)
    loading.value = false
}
getAnimalClassification()
// 搜索框
const search = ref('')
const startSearch = async () => {
    //发送请求，根据输入框搜索，

    const res = await getAnimalByName(search.value)
    console.log(res)
    search.value = ''
    // 重新渲染页面
    getAnimalList()
}

/**
 * 搜索建议
 */
const suggestData = ref<any>([])
const suggest = async () => {
    if (search.value === '') {
        suggestData.value = []
        return
    }
    // 发送请求
    const { data: { data } } = await suggestAnimalApi(search.value)
    suggestData.value = data.dataList
}

const debounceSuggest = debounce(suggest, 200, { leading: false })

const searchBySuggest = (keyword: string) => {
    search.value = keyword
    startSearch()
}

const highlightKeyword = (keyword: string, text: string): string => {
    //返回一个处理后的字符串
    /**
     * 参数1：正则表达式
     * 参数2：替换成的内容
     * 'g':   全局匹配
     */
    return text.replace(new RegExp(keyword, 'g'), '<span style="color: #66b1ff">$&</span>')
    //return text.replace(new RegExp(keyword, 'g'),  `<span style="color: #66b1ff">${keyword}</span>`) //第二种写法
}

// 触底加载
const disabled = ref(false)
const loadMore = async () => {
    
    if (route.name !== 'about' || page.value * pageSize.value > total.value) {
        return
    }
    const { data: { data } } = await getAnimalListApi(page.value, pageSize.value, classification.value)
    page.value++

    if (data.AWList.length == 0) {
        disabled.value = true
        return
    }
    bottomLoading.value = false
    // 拼接数组
    animalList.value = [...animalList.value, ...data.AWList]
}
const debounceLoadMore = debounce(loadMore, 200, { leading: false })
const startLoadMore = () => {
    bottomLoading.value = true
    debounceLoadMore()
}
// 添加新动物
const drawer_title = ref<any>('添加新动物')
const drawer = ref<boolean>(false)
// 子组件打开
const handleDrawerUpdate = (newDrawerStatus: any) => {
    drawer.value = newDrawerStatus
}
const initAnimal = (animalData: Animal) => {
    addAnimalForm.value = animalData
    // 清空
    drawer_title.value = '编辑动物'
    addAnimalForm.value.imgURL.forEach(img => {
        let initImg = {
            name: '',
            url: ''
        }
        initImg.name = img.uid
        initImg.url = img.url
    })


}
// 打开抽屉
const open = () => {
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
    protectionLevel: '',
    diet: '',
    breeding: '',
    lifestyle: '',
    predator: '',
})

const closeDrawer = () => {
    drawer.value = false
    addAnimalForm.value = {}
    addAnimalForm.value.imgURL = []
}

</script>
<template>
    <div class="container" ref="container" id="container" v-loading="loading">
        <el-affix :offset="0">
            <div class="animals-nav">
                <el-menu :default-active="nav_index" class="el-menu-demo" mode="horizontal" background-color="#545c64"
                    text-color="#fff" active-text-color="rgb(213,253,157)" @select="handleSelect">
                    <el-menu-item index="1">全部</el-menu-item>  
                    <el-sub-menu index="2" style="padding-bottom: 10px;">
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
                                    <el-icon style="font-size:30px;margin-left: 5px;">
                                        <svg t="1705468306061" class="icon" viewBox="0 0 1027 1024" version="1.1"
                                            xmlns="http://www.w3.org/2000/svg" p-id="10079" width="200" height="200">
                                            <path
                                                d="M0 560.56134v-25.569029 25.569029zM1019.565052 448.696836C978.015379 224.967828 799.032172 45.984621 575.303164 1.238819c-25.56903-6.392257-54.334188 12.784515-57.530316 38.353545V458.285222c0 28.765158 22.372901 51.138059 51.138059 51.138059h405.908343c28.765158 0 51.138059-22.372901 51.138059-51.138059-3.196129-3.196129-3.196129-6.392257-6.392257-9.588386z"
                                                fill="#D4F2FF" p-id="10080"></path>
                                            <path
                                                d="M898.112162 592.522627h-15.980644c-22.372901 3.196129-41.549673 25.56903-41.549673 47.94193 0-25.56903 15.980643-44.745802 41.549673-47.94193H524.165105c-51.138059 0-92.687732-41.549673-92.687732-92.687732V132.280096c0-28.765158-22.372901-51.138059-51.138059-51.138059h-9.588386C163.002563 129.083967 6.392257 314.459431 0 534.992311v25.569029C6.392257 816.251635 217.336751 1024 476.223175 1024c220.53288 0 405.908344-150.218048 460.242531-357.966413h-3.196129c3.196129-3.196129 3.196129-3.196129 3.196129-6.392258 3.196129-6.392257 3.196129-12.784515 3.196129-19.176772 0-22.372901-15.980643-44.745802-41.549673-47.94193z"
                                                fill="#ADE6FE" p-id="10081"></path>
                                        </svg>
                                    </el-icon>
                                </div>
                            </template>

                        </el-statistic>
                    </el-row>

                </el-menu>
                <el-input v-model="search" class="w-50 m-2 search-box" placeholder="搜索" :prefix-icon="Search"
                    @change="startSearch()" @input="debounceSuggest" @focus="debounceSuggest" @blur="suggestData = ''" />

                <!-- 搜索建议 -->
                <div class="suggest-box" v-if="suggestData.length > 1">
                    <div v-for="(item, index) in suggestData.slice(0, 10)" :key="index" class="suggest-item"
                        @click="searchBySuggest(item)" v-html="highlightKeyword(search, item)">

                    </div>
                </div>

            </div>
        </el-affix>

        <div v-if="animalList.length > 1" class="animals-container" v-infinite-scroll="startLoadMore"
            :infinite-scroll-disabled="disabled">
            <AnimalItem v-for="(item) in animalList" :key="item" :animalData="item" :drawer="drawer"
                @update-drawer="handleDrawerUpdate" @init-animal="initAnimal" class="animal-item" v-loading="loading" />

            <!-- 侧边抽屉(组件化) -->
            <Drawer :drawer="drawer" :drawer_title="drawer_title" :add-animal-form="addAnimalForm"
             :options="options" @close-drawer="closeDrawer"></Drawer>
             <!-- 侧边抽屉 -->
<!--             <el-drawer v-model="drawer" :title="drawer_title" @close="close" size="30%">
                <template #header>
                    <div style="font-size: larger;display:flex;align-items:center;">
                        <img src="@/assets/logoHead.ico" alt="" width="30px" style="margin-right:15px;">
                        {{ drawer_title }}
                        <el-icon style="margin-left:5px;font-size:20px;">
                            <img src="@/assets/edit.png" alt="" width="20px" style="margin-right: 5px; line-height:20px ;">
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
                    <el-select v-model="addAnimalForm.protectionLevel" clearable placeholder="请选择">
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
            </el-drawer> -->
        </div>

        <el-empty description="这里什么也没有哟~" v-else />
        <div style="display: flex;
        justify-content: center;
        align-items:center;
        height: 100px;
        background-color: rgb(247,247,247);">
            <div class="bottom-loading" v-if="bottomLoading">
            </div>
        </div>
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
        // overflow: hidden;
        position: relative;

        .suggest-box {
            position: absolute;
            width: 23%;
            right: 4%;
            top: 76%;
            z-index: 99;
            display: flex;
            flex-direction: column;
            background-color: #ffffff;
            border-radius: 5px;
            transition: all 0.2s linear;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;

            .suggest-item {
                padding-left: 5%;
                width: 100%;
                height: 30px;
                display: flex;
                align-items: center;
                color: #6C6E72;
                cursor: pointer;

                &:hover {
                    background-color: #E5EAF3;
                    color: #000;
                }
            }
        }

        .el-menu-demo {
            flex: 3;
            height: 100%;
            border-radius: 3px;
            overflow: hidden;
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

    .bottom-loading {
        width: 2.5em;
        height: 3em;
        border: 3px solid transparent;
        border-top-color: $asideFontColor;
        border-bottom-color: $titleFontColor;
        border-radius: 50%;
        animation: spin-stretch 2s ease infinite;

        @keyframes spin-stretch {
            50% {
                transform: rotate(360deg) scale(0.4, 0.33);
                border-width: 8px;
            }

            100% {
                transform: rotate(720deg) scale(1, 1);
                border-width: 3px;
            }
        }

    }
}
</style>
