<script lang="ts" setup>
import {ref} from 'vue'
import AnimalItem from './AnimalItem.vue'
import type {Animal, AnimalPre} from '@/interfaces/Animal'
import {useAnimalStore} from '@/stores/animal'
import {getAnimalByIdApi, getAnimalClassificationApi} from "@/api/Animals";

const props = defineProps<{
  title: string,
  animalData?: AnimalPre[]
}>()
const limit = ref(4)
const limitChange = () => {
  limit.value = props.animalData!.length
}

//动物编辑抽屉
const animalStore = useAnimalStore()
const drawer_title = ref('')
const drawer = ref<boolean>(false)
// 子组件打开
const handleDrawerUpdate = (newDrawerStatus: any) => {
  drawer.value = newDrawerStatus
}
const categoryOptions = ref()
const delay = ref(false)
const initAnimal = async (animalData: AnimalPre) => {
  if (delay.value) {
    return
  }
  delay.value = true
  const res = await getAnimalByIdApi(animalData.id);
  if (!animalStore.category) {
    const res = await getAnimalClassificationApi()
    animalStore.category = res.data.classificationList
  }
  categoryOptions.value = animalStore.category!.map(item => {
    return item.name
  })
  delay.value = false
  addAnimalForm.value = res.data.animalList[0]
  // 清空
  drawer_title.value = '编辑动物'
  addAnimalForm.value.imgList.forEach((img) => {
    let initImg = {
      name: '',
      url: ''
    }
    initImg.name = img.uid
    initImg.url = img.url
  })
  animalDrawer.value.open()
}
// 分类选择

const addAnimalForm = ref<Animal>({
  animalID: "",
  imgList: [{uid: "", url: ""}],
  score: 0, searchCount: 0,
  tags: "",
  name: '',
  imgURL: '',
  description: '',
  classification: '',
  distribution: '',
  protectionLevel: '',
  diet: '',
  breeding: '',
  lifestyle: '',
  predator: ''
})
const emit = defineEmits(['closeEditDrawer'])
const closeDrawer = () => {
  drawer.value = false
  addAnimalForm.value = {} as Animal
  addAnimalForm.value.imgURL = ''
  addAnimalForm.value.imgList = [{uid: "", url: ""}]
  emit('closeEditDrawer')
}

const animalDrawer=ref()
</script>

<template>
  <div class="detail">
    <h3>
          <span>{{ title }}
          <el-icon>
                <ArrowRightBold/>
            </el-icon></span>
      <span @click="limitChange">查看更多<el-icon :size="18">
                    <Expand/>
                </el-icon></span>
    </h3>
    <el-divider/>
    <div class="detail-item">
      <AnimalItem v-for="(item) in animalData?.slice(0, limit)" :key="item.id" :animal-data="item"
                  class="item" @update-drawer="handleDrawerUpdate" @init-animal="initAnimal"/>

      <!-- 编辑详情 -->
      <view v-if="drawer">
      </view>
    </div>
    <div v-if="limit === animalData?.length" style="margin-top: 20px; display: flex;justify-content: center;">
      已经没有了(●'◡'●)~
    </div>
  </div>
  <Drawer :add-animal-forms="addAnimalForm" ref="animalDrawer" :drawer_title="drawer_title"
          :options="categoryOptions" @close-drawer="closeDrawer"></Drawer>
</template>

<style lang="scss" scoped>
.detail {
  margin-bottom: 20px;
  width: 100%;
  padding: 15px 20px;

  h3 {
    display: flex;
    align-items: center;
    color: #525457;
    position: relative;
    font-size: large;
    width: 100%;
    justify-content: space-between;

    span {
      font-size: 14px;
      color: #999;
      display: flex;
      align-items: center;

      &:hover {
        cursor: pointer;
        color: #525457;
        transition: all .2s;
      }
    }
  }

  .detail-item {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;

    .item {
      margin-right: 20px;
      width: 80px;
      height: 200px;
      font-size: 20px;
    }
  }
}
</style>@/interface/Animal