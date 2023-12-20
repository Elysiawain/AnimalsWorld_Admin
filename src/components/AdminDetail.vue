<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps({
    titie: String
})
</script>

<template>
    <div class="detail">
        <h3>{{ titie }}<el-icon>
                <ArrowRightBold />
            </el-icon>
        </h3>
        <el-divider />
        <div>
            数据将在此渲染
        </div>
    </div>
</template>

<style scoped lang="scss">
.detail {
    margin-bottom: 20px;
    h3 {
        display: flex;
        align-items: center;
        color: #525457;
    }
}
</style>