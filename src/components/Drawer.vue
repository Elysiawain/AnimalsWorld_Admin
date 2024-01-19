<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'
import { addAnimalApi } from '@/api/Animals'
import type { Animal } from '@/pojo/Animal'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { upload } from '@/api/Common'
import { isValidAddAnimalForm } from '@/utils/Check'
const props = defineProps<{
    drawer: boolean,
    drawer_title: string,
    addAnimalForm: Animal,
    options: []
}>()
const showDrawer = ref<boolean>(props.drawer) // 抽屉是否显示
console.log(showDrawer.value)

// 定义提交事件
const emit = defineEmits(['closeDrawer']) // 定义事件

const addAnimalForm = ref<any>(props.addAnimalForm)
// 图片列表
const imageList = ref<UploadUserFile[]>([])
//监视props变化
watch(props, () => {
    showDrawer.value = props.drawer
    addAnimalForm.value = props.addAnimalForm
    imageList.value = [] // 清空图片列表，防止图片重复添加
    let i = addAnimalForm.value.imgURL.length
    for (let j = 0; j < i; j++) {
        imageList.value.push({
            name: addAnimalForm.value.imgURL[j].uid,
            url: addAnimalForm.value.imgURL[j].url
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
const handleRemove: UploadProps['onRemove'] = (file) => {
    // 清除对应的图片
    console.log("清除图片")
    console.log(file)
    let index = addAnimalForm.value.imgURL.findIndex(item => item.url === file.url)
    console.log("索引：" + index)

    addAnimalForm.value.imgURL.splice(index, 1)
    console.log(imageList.value)
    
}
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    console.log(uploadFile.url)
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
    const { data } = await upload(rawFile)
    let newImg = { uid: rawFile.file.uid, url: data.data.imgURL }
    addAnimalForm.value.imgURL.push(newImg)
    imageList.value = addAnimalForm.value.imgURL
}

// 添加请求
const addAnimal = async () => {
    const res = await addAnimalApi(addAnimalForm.value)
    if (res.data.code === '1') {
        ElMessage.success('操作成功')
        return true
    }
    ElMessage.error('操作失败')
    return false
}
const cancelClick = () => {
    console.log("取消")
    // 提交事件
    emit('closeDrawer')
}
const confirmClick = async () => {
    console.log(addAnimalForm.value)

    // 发送前校验
    const isValid = isValidAddAnimalForm(addAnimalForm.value)
    if (!isValid) {
        ElMessage.error('请填写完整数据')
        return
    }
    // 发送添加请求
    const res = await addAnimal()
    console.log(res)

    emit('closeDrawer')
}
// 添加结束，重新渲染页面
const close = () => {
    imageList.value = []
    location.reload()
    emit('closeDrawer')

}
</script>

<template>
    <el-drawer v-model="showDrawer" :title="drawer_title" @close="close" size="30%">
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
                <el-option v-for="item in protectionLevel" :key="item.value" :label="item.label" :value="item.value" />
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
            <el-upload v-model:file-list="imageList" action="#" list-type="picture-card"
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
</template>

<style scoped lang="scss">
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
</style>