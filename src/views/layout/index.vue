<script setup lang="ts">
import { ref, watch,onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'

// 获取当前登录信息
const adminStore = useAdminStore()
adminStore.getAdminInfo()

const router = useRouter()
const route = useRoute()
// 退出登录
const logOut = () => {
    // TODO 清除token
    adminStore.clearAdminInfo()
    router.replace('/login')
}

// 头部标题切换
let routerTitle: any = ''
const title = ref<string>('首页')
const activeName = ref<number>()
// 监听路由变化，动态设置头部标题
const changeTitle = () => {
    routerTitle = route.name
    if (routerTitle === 'home') {
        title.value = '首页'
        activeName.value = 1
    } else if (routerTitle === 'about') {
        title.value = '动物数据'
        activeName.value = 2
    } else if (routerTitle === 'admin') {
        title.value = '管理员'
        activeName.value = 3
    } else if (routerTitle === 'center') {
        title.value = '个人中心'
        activeName.value = 4
    }
}
watch(route, () => {
    changeTitle()
})
onMounted(() => changeTitle())
</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="200px">
                <!-- 侧边栏 -->
                <div class="logo"></div>
                <div class="aside-nav">
                    <router-link class="an_route" to="/home">
                        <div :class="{ 'check-active': activeName === 1 }"><el-icon>
                                <Menu />
                            </el-icon>首页</div>
                    </router-link>
                    <router-link class="an_route" to="/animals">
                        <div :class="{ 'check-active': activeName === 2 }"><el-icon>
                                <Star />
                            </el-icon>动物数据</div>
                    </router-link>
                    <router-link class="an_route" to="/admin">
                        <div :class="{ 'check-active': activeName === 3 }"><el-icon>
                                <Notebook />
                            </el-icon>管理员</div>
                    </router-link>
                    <router-link class="an_route" to="/center">
                        <div :class="{ 'check-active': activeName === 4 }"><el-icon>
                                <UserFilled />
                            </el-icon>个人中心</div>
                    </router-link>
                </div>
            </el-aside>
            <el-container>
                <el-header>
                    <div class="header-title">{{ title }}</div>
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
        position: relative;

        .header-title {
            position: absolute;
            left: 5%;
            font-size: larger;
            font-weight: bold;
        }

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
        justify-content: space-around;
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
                display: flex;
                justify-content: start;
                align-items: center;
                padding-left: 10%;
                position: relative;

                &:hover {
                    color: #fff;
                    transform: translate3d(0, -5px, 0);
                }

                div {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .el-icon {
                        margin-right: 4px;
                    }
                }

                .check-active {
                    position: absolute;
                    left: 0%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 80%;
                    height: 60%;
                    background-color: rgb(208, 233, 173);
                    z-index: 3;

                    &::after {
                        content: '';
                        position: absolute;
                        right: 0;
                        transform: translateX(50%);
                        width: 48px;
                        height: 100%;
                        background-color: rgb(208, 233, 173);
                        z-index: -1;
                        border-radius: 50%;
                    }
                }

            }

            .router-link-exact-active {
                color: $titleFontColor;
                font-weight: bold;
                border-right: $titleFontColor 4px solid;
            }
        }
    }


}
</style>