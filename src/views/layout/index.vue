<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

// 获取当前登录信息
const adminStore = useAdminStore()
adminStore.getAdminInfo()

const router = useRouter()
// 退出登录
const logOut = () => {
    // TODO 清除token
    adminStore.clearAdminInfo()
    router.replace('/login')
}
</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="200px">
                <!-- 侧边栏 -->
                <div class="logo"></div>
                <div class="aside-nav">
                    <router-link class="an_route" to="/home">首页</router-link>
                    <router-link class="an_route" to="/animals">动物数据</router-link>
                    <router-link class="an_route" to="/admin"> 管理员数据</router-link>
                    <router-link class="an_route" to="/center">个人中心</router-link>
                </div>
            </el-aside>
            <el-container>
                <el-header>
                    <div>管理员：{{ adminStore?.admin.nickname }}</div>
                    <el-dropdown>
                        <el-avatar :size="60"
                            :src="adminStore?.admin.avatar || 'https://javaweb-twj.oss-cn-beijing.aliyuncs.com/elysiaHead.jpg'" />
                        <template #dropdown>
                            <el-dropdown-item @click="logOut">退出登录</el-dropdown-item>
                            <el-dropdown-item @click="$router.push('/center')">个人中心</el-dropdown-item>
                        </template>
                    </el-dropdown>

                </el-header>
                <el-main>
                    <router-view v-slot="{ Component }">
                        <transition name="fade" mode="out-in" appear>
                            <keep-alive>
                                <component :is="Component" />
                            </keep-alive>
                        </transition>
                    </router-view>
                </el-main>
                <el-footer>
                    <p>CreateBy：elysia</p>
                    <p>联系方式：3215624200@qq.com</p>
                    <p>版权所属：© 2023 爱莉希雅天下第一！</p>
                </el-footer>
            </el-container>
        </el-container>
    </div>
</template>
  

<style scoped lang="scss">
.common-layout {
    display: flex;
    height: 100vh;
    background-color: #fff;

    .el-header {
        flex: .8;
        display: flex;
        align-items: center;
        background-color: $bgcColor;
        color: #333;
        font-size: 18px;
        justify-content: end;

        .el-avatar {
            margin: 20px;
        }

        img {
            border: none;
        }

        .example-showcase {
            cursor: pointer;
            color: var(--el-color-primary);
            display: flex;
            align-items: center;
        }
    }

    .el-footer {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: $footerBgcColor;
        color: $fontColor;
    }

    .el-main {
        flex: 6
    }

    .el-aside {
        background-color: $navBgcColor;
        color: #333;
        text-align: center;

        .logo {
            width: 100%;
            height: 95px;
            background-image: url("@/assets/logo.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            background-position: center;
        }

        .aside-nav {
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            align-items: center;
            width: 100%;
            font-size: 20px;

            .an_route {
                width: 100%;
                height: 80px;
                line-height: 80px;
                color: $asideFontColor;
                transition: all .2s linear;

                &:hover {
                    color: #fff;
                    background-color: $titleFontColor;
                }

            }

            .router-link-exact-active {
                color: $titleFontColor;
                border-right: $titleFontColor 4px solid;
            }
        }
    }


}
</style>