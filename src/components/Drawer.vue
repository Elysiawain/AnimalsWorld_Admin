<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { addAnimalApi } from '@/api/Animals'
import { upload } from '@/api/Common'
import { isValidAddAnimalForm } from '@/utils/Check'
import type { Animal } from "@/interfaces/Animal";

const props = defineProps<{
  drawer_title: string,
  addAnimalForms: Animal,
  options: string[],
}>()
/**
 * 定义事件
 */
const emit = defineEmits<{
  close: [],// 关闭抽屉
}>()
const showDrawer = ref(false) // 抽屉是否显示

const addAnimalForm = ref<Animal>(props.addAnimalForms)
// 图片列表
const imageList = ref<UploadUserFile[]>([])


//监视props变化
watch(props, () => {
  addAnimalForm.value = props.addAnimalForms
  tags.value = addAnimalForm.value.tags?.split(',')
  score.value = Number((addAnimalForm.value.score / 20).toFixed(2))
  imageList.value = [] // 清空图片列表，防止图片重复添加
  let i = addAnimalForm.value.imgList?.length
  for (let j = 0; j < i; j++) {
    imageList.value.push({
      name: addAnimalForm.value.imgList[j].uid,
      url: addAnimalForm.value.imgList[j].url
    })
  }
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
    label: '可爱的动物'
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
const handleRemove: UploadProps['onRemove'] = (file) => {
  // 清除对应的图片
  let index = addAnimalForm.value.imgList.findIndex((item) => item.url === file.url)
  addAnimalForm.value.imgList.splice(index, 1)
}
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}
// 图片上传前校验
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
//上传图片
const uploadImg = async (rawFile: any) => {
  const res = await upload(rawFile.file)
  let newImg = { uid: rawFile.file.uid, url: res.data }
  addAnimalForm.value.imgList.push(newImg)
}
const uploadMainImg = async (rawFile: any) => {
  const res = await upload(rawFile.file)
  addAnimalForm.value.imgURL = res.data
}
// 添加请求
const addAnimal = async () => {
  const res = await addAnimalApi(addAnimalForm.value)
  ElMessage.success('操作成功')
}
const cancelClick = () => {
  // 提交事件
  showDrawer.value = false
}
const confirmClick = async () => {
  // 修改tag
  tags.value ? addAnimalForm.value.tags = tags.value?.join(',') : ''
  // 发送前校验
  try {
    const isValid = isValidAddAnimalForm(addAnimalForm.value)
    if (!isValid) {
      ElMessage.error('请填写完整数据')
      return
    } else {
      // 发送添加请求
      await addAnimal()
    }

    showDrawer.value = false
  } catch (err: any) {
    ElMessage.error('请填写完整数据')
  }
}
// 添加结束，重新渲染页面
const close = () => {
  addAnimalForm.value = {} as Animal
  tags.value = []
  showDrawer.value = false
  emit('close')
}
const open = () => {
  showDrawer.value = true
}
defineExpose({
  showDrawer,
  open,
  close
})

// 添加tags
const tags = ref<string[]>([])
const tag = ref('')
const isShowTagInput = ref(false)
/**
 *
 * @param index 删除索引
 */
const delTag = (index: number) => {
  tags.value!.splice(index, 1)
}
/**
 * 添加标签
 */
const addTag = () => {
  isShowTagInput.value = true
}
/**
 * 修改标签
 * @param index
 */
const editTag = (index: number) => {
  console.log(index)
}
/**
 *
 */
const onInputBlur = () => {
  isShowTagInput.value = false
  if (tag.value) {
    tags.value?.length > 0
      ? tags.value.push(tag.value)
      : tags.value = [tag.value]
    tag.value = ''
    return
  }
}

// 评分
const rateColors = ref(['#99A9BF', '#F7BA2A', '#FF9900'])
const score = ref(0)
</script>

<template>
  <div>
    <el-drawer :model-value="showDrawer" :title="drawer_title" size="30%" @close="close">
      <template #header>
        <div style="font-size: larger;display:flex;align-items:center;">
          <img alt="" src="@/assets/logoHead.ico" style="margin-right:15px;" width="30px">
          {{ drawer_title }}
          <el-icon style="margin-left:5px;font-size:20px;">
            <img alt="" src="@/assets/edit.png" style="margin-right: 5px; line-height:20px ;" width="20px">
          </el-icon>
        </div>
      </template>
      <h4 style="color:#cccccc" v-if="addAnimalForm.searchCount">浏览次数：<span style="color: #3ebed3">{{ addAnimalForm.searchCount }}</span> </h4>
      <el-rate v-if="addAnimalForm.score" v-model="score" :allow-half="true" :colors="rateColors" disabled size="large" score-template="{value} 分"
        show-score text-color="#39c5bb" />
      <div class="add-name">
        动物名称：
        <el-input v-model="addAnimalForm.name" clearable placeholder="动物名称" style="width: 52%;" />
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
          <el-option v-for="item in protectionLevel" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="breed">
        繁殖方式：
        <el-select v-model="addAnimalForm.breeding" clearable placeholder="请选择">
          <el-option v-for="item in breedList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div class="add-name">
        动物分布：
        <el-input v-model="addAnimalForm.distribution" clearable placeholder="动物分布" style="width: 70%;" />
      </div>
      <div>
        <p style="margin-bottom: 20px">主图：</p>
        <el-upload :before-upload="beforeUpload" :http-request="uploadMainImg" :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove" :show-file-list="false" action="#" class="upload">
          <el-icon v-if="!addAnimalForm.imgURL" :size="50" color="#ccc">
            <Plus />
          </el-icon>
          <img v-else :src="addAnimalForm.imgURL" height="200px" style="border-radius: 10px" width="200px">
        </el-upload>
        <div v-if="addAnimalForm.imgList?.length > 0">
          <p style="margin-bottom: 20px;margin-top: 30px">已添加副图：<span
              style="color: #39c5bb;font-size: 10px">（注：副图不可修改）</span>
          </p>
          <div style="display: flex;gap: 20px;width: 100%;align-items: center;flex-wrap: wrap">
            <img v-for="(item) in addAnimalForm.imgList" :key="item.uid" :src="item.url" height="150px"
              style="border-radius: 10px" width="150px">
          </div>
        </div>
        添加副图：
        <el-upload :before-upload="beforeUpload" :http-request="uploadImg" :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove" action="#" list-type="picture-card">
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible">
          <img :src="dialogImageUrl" alt="Preview Image" w-full />
        </el-dialog>
      </div>
      <div class="description">
        动物简述：
        <el-input v-model="addAnimalForm.description" :autosize="{ minRows: 2, maxRows: 4 }" maxlength="800"
          placeholder="请输入该动物的描述" show-word-limit type="textarea" />
      </div>
      <div class="tag">
        <div class="tag">
          <el-button v-for="(item, index) in tags" :key="index" :color="'#39c5bb'" plain round size="small"
            @click="editTag">{{
              item }}
            <el-icon class="tag-del" @click="delTag(index)">
              <Delete />
            </el-icon>
          </el-button>
          <el-button v-if="!isShowTagInput" :color="'#3ebed3'" plain round size="small" style="overflow:hidden;"
            @click="addTag">
            <span style="display: flex;align-items: center;justify-content: center;gap: 5px">添加标签 <el-icon>
                <Plus />
              </el-icon></span>
          </el-button>
          <input v-show="isShowTagInput" v-model="tag" :maxlength="8" class="tag-input" placeholder="请输入"
            @blur="onInputBlur" @keyup.enter="onInputBlur" />
        </div>
      </div>
      <template #footer>
        <div style="display: flex; justify-content: start;">
          <el-button @click="cancelClick">取消</el-button>
          <el-button type="primary" @click="confirmClick">提交</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<style lang="scss" scoped>
.el-drawer {

  .tag {
    width: 100%;
    padding: 10px;
    background-color: #e6e6e6;
    backdrop-filter: blur(10px);
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

    .tag-input {
      border: none;
      outline: none;
      background: #EBF9F8;
      width: 100px;
      height: 20px;
      border-radius: 10px;
      padding-left: 10px;
      font-size: 12px;
      color: #333333;
      caret-color: #3ebed3;

      &:focus {
        border: none;
        caret-color: #3ebed3;
      }
    }

    .tag-del {
      margin-left: 5px;

      &:hover {
        color: #F44258;
      }
    }
  }

  .upload {
    border: #cccccc dashed 1px;
    width: 200px;
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      border: $mainColor1 dashed 1px;
    }
  }

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
</style>@/interface/Animal