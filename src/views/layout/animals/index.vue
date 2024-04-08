<script lang="ts" setup>
import AnimalItem from '@/components/AnimalItem.vue'
import Drawer from '@/components/Drawer.vue'
import {onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'
import {Search} from '@element-plus/icons-vue'
import {getAnimalByIdApi, getAnimalClassificationApi, getAnimalListApi, suggestAnimalApi} from '@/api/Animals'
import {useAnimalStore} from '@/stores/animal'
import {debounce} from '@/utils/debounce'
import type {Animal, AnimalPre, Category} from "@/interfaces/Animal.d";
import type {AnimalsSortType} from "@/types/SortType.d";
import type {Suggest} from "@/types/Suggest";

const loading = ref(false)
const bottomLoading = ref(false) //底部加载
const animalList = ref<AnimalPre[]>([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)
const classification = ref<string>('')
const categoryId = ref()
const route = useRoute()
const search = ref('') // 搜索关键词
const sortType = ref<AnimalsSortType>(1) // 排序方式
// 初始化数据
const getAnimalList = async () => {
  loading.value = true
  try {
    const res = await getAnimalListApi(page.value, pageSize.value, categoryId.value, search.value || '鸡', sortType.value)
    animalList.value = res.data.data
    total.value = res.data.total
    loading.value = false
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
  if (key === '4') {
    return
  }
  //TODO 发送请求重新渲染
  classification.value = newIndex
  await getAnimalList()

}
// 获取动物分类
const categoryOptions = ref<string[]>([])
const clIndex = ref<number>(0)
const classificationList = ref<Category[]>([])
const animalStore = useAnimalStore()
const getAnimalClassification = async () => {
  loading.value = true
  const res = await getAnimalClassificationApi()
  classificationList.value = res.data.classificationList
  animalStore.setClassfication(classificationList.value)
  categoryOptions.value = classificationList.value.map(item => {
    return item.name
  })
  loading.value = false
}
getAnimalClassification()
// 搜索框
const startSearch = async () => {
  isShowSuggest.value = true
  //发送请求，根据输入框搜索，
  await getAnimalList()
  // 重新渲染页面
}

const isShowSuggest = ref(true) //搜索建议显示
/**
 * 搜索建议
 */
const suggestData = ref<Suggest[]>([])
const suggest = async () => {
  if (search.value.trim() === '') {
    suggestData.value = []
    return
  }
  // 发送请求
  const res = await suggestAnimalApi(search.value)
  suggestData.value = res.data
  return res.data
}

const debounceSuggest = debounce(suggest, 200, {leading: false})

const searchBySuggest = (keyword: string) => {
  search.value = keyword
  getAnimalList()
}

//失焦时
const onBlur = () => {
  isShowSuggest.value = false
}
const highlightKeyword = (keyword: string, text: string): string => {
  //返回一个处理后的字符串
  /**
   * 参数1：正则表达式
   * 参数2：替换成的内容
   * 'g':   全局匹配
   */
  return text.replace(new RegExp(keyword, 'g'), '<span style="color: #39c5bb">$&</span>')
  //return text.replace(new RegExp(keyword, 'g'),  `<span style="color: #66b1ff">${keyword}</span>`) //第二种写法
}

// 触底加载
const disabled = ref(false)
const loadMore = async () => {

  if (route.name !== 'animals' || page.value * pageSize.value > total.value) {
    return
  }
  page.value++
  const {data} = await getAnimalListApi(page.value, pageSize.value, categoryId.value, search.value || '鸡', sortType.value)
  bottomLoading.value = false
  // 拼接数组
  animalList.value = [...animalList.value!, ...data.data]
  if (data.page * data.pageSize > data.total) {
    disabled.value = true // 没有更多数据了
    return
  }
}
const debounceLoadMore = debounce(loadMore, 200, {leading: false})
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

/**
 *  添加动物
 * @param animalData 动物预览信息
 */
const initAnimal = async (animalData: AnimalPre) => {
  //TODO 请求详细数据
  const res = await getAnimalByIdApi(animalData.id)
  addAnimalForm.value = res.data.animalList[0]
  // 清空
  drawer_title.value = '编辑动物'
  // addAnimalForm.value.imgList.forEach(img => {
  //   let initImg = {
  //     name: '',
  //     url: ''
  //   }
  //   initImg.name = img.uid
  //   initImg.url = img.url
  // })
  animalDrawer.value.showDrawer = true
}

const animalDrawer = ref()
// 打开抽屉
const open = () => {
  drawer_title.value = '添加新动物'
  drawer.value = true
  animalDrawer.value.showDrawer = true
}
// 分类选择

const addAnimalForm = ref<Animal>({} as Animal)

/**
 * 关闭抽屉
 */
const closeDrawer = () => {
  drawer.value = false
  // getAnimalList()
  addAnimalForm.value = {} as Animal
  addAnimalForm.value.imgList = [{uid: '', url: ''}]
}


//搜索自动补全
const querySearch = async (queryString: string, cb: any) => {
  if (queryString.trim().length === 0) { // 如果输入框为空就不进行搜索
    return cb(suggestData.value)
  }
  await suggest()
  // call callback function to return suggestion objects
  cb(suggestData.value)
}
/*const createFilter = (queryString: any) => {
  return (restaurant: any) => {
    return (
        restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}*/
const handleSelectSuggest = (item: Suggest) => {
  search.value = item.name
  startSearch() // 选项改变，开始搜索
}

const handleIconClick = (ev: Event) => {
}
</script>
<template>
  <div id="container" ref="container" v-loading="loading" class="container">
    <el-affix :offset="0">
      <div class="animals-nav">
        <el-menu :default-active="nav_index" active-text-color="rgb(213,253,157)" background-color="#545c64"
                 class="el-menu-demo"
                 mode="horizontal" text-color="#fff" @select="handleSelect">
          <el-menu-item index="1">全部</el-menu-item>
          <el-sub-menu index="2" style="padding-bottom: 10px;">
            <template #title>{{ classificationList[clIndex]?.name }}</template>
            <el-menu-item v-for="(item, index) in classificationList" :key="item" :index="'2-' + index">{{
                item.name
              }}
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="3">世界之最</el-menu-item>

        </el-menu>
        <el-autocomplete
            v-model="search"
            :fetch-suggestions="querySearch"
            placeholder="可爱的动物(≧∇≦)ﾉ"
            popper-class="my-autocomplete"
            @change="searchBySuggest"
            @select="handleSelectSuggest"
        >
          <template #suffix>
            <el-icon class="el-input__icon" style="cursor: pointer" @click="handleIconClick">
              <Search/>
            </el-icon>
          </template>
          <template #default="{ item }">
            <div class="value" v-html="highlightKeyword(search,item.name)"></div>
          </template>
        </el-autocomplete>
        <!--        <el-input v-model="search" :placeholder="'鸡'" :prefix-icon="Search" class="w-50 m-2 search-box"
                          @blur="onBlur" @change="startSearch()" @focus="debounceSuggest"
                          @input="debounceSuggest"/>-->

        <!-- 搜索建议 -->
        <!--        <div v-if="suggestData?.length >= 1&&isShowSuggest" class="suggest-box">
                  <div v-for="(item, index) in suggestData.slice(0,10)" :key="index" class="suggest-item"
                        @click="searchBySuggest(item.name)">
                    {{highlightKeyword(search, item.name)}}
                  </div>
                </div>-->

      </div>
    </el-affix>
    <el-button color="#39c5bb" icon="Plus" plain style="margin-bottom: 20px"
               @click="open">添加动物
    </el-button>
    <div v-if="animalList!.length >0" v-infinite-scroll="startLoadMore" :infinite-scroll-disabled="disabled"
         class="animals-container">
      <AnimalItem v-for="(item) in animalList" :key="item.id" v-loading="loading" :animalData="item"
                  :drawer="drawer" class="animal-item" @update-drawer="handleDrawerUpdate"
                  @init-animal="initAnimal"/>
    </div>
    <el-empty v-else description="这里什么也没有哟~"/>
    <div style="display: flex;
    flex-direction: column;
        justify-content: center;
        align-items:center;
        height: 100px;
        background-color: rgb(247,247,247);">
      <div v-if="bottomLoading&&!disabled" class="bottom-loading">
        {{ disabled }}
      </div>
      <div v-else style="color: #cccccc;width: 100%;display: flex;justify-content: center;margin-top: 30px">
        没有更多了哟~
      </div>
    </div>
  </div>
  <!-- 侧边抽屉(组件化) -->
  <Drawer ref="animalDrawer" :add-animal-forms="addAnimalForm" :drawer_title="drawer_title" :options="categoryOptions"
          @close="closeDrawer"></Drawer>
</template>

<style lang="scss" scoped>
.container {
  position: relative;

  .back-top {
    width: 50px;
    height: 50px;
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
@/interface/Animal