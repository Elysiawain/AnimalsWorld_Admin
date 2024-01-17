<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { useCounterStore} from '@/stores/counter'
import {getBadgeNumApi}from '@/api/Admin'
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
const activeName = ref<number>(1)
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
        title.value = '管理员数据'
        activeName.value = 3
    } else if (routerTitle === 'center') {
        title.value = '个人中心'
        activeName.value = 4
    } else if (routerTitle === 'user') {
        title.value = '用户数据'
        activeName.value = 5
    } else if (routerTitle === 'userUpload') {
        title.value = '用户上传数据'
        activeName.value = 6
    }
}
watch(route, () => {
    changeTitle()
})
onMounted(() => changeTitle())

const train = ref<any>(15)
const trainLocation = computed(() => {
    return {
        top: `${train.value}%`
    }
})
onMounted(() => train.value = (activeName.value - 1) * 11.4 + 15)

//徽标数字提醒
const countStore=useCounterStore()
//发送请求获取数量
const getBadgeNum = async () => {
    const res = await getBadgeNumApi()
    countStore.setBadgeNum(res.data.data.count)
}
onMounted(() => getBadgeNum())
</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="200px">
                <!-- 滑动轨道 -->
                <div class="track" :style="trainLocation">
                    <div class="train"></div>
                </div>
                <!-- 侧边栏 -->
                <div class="logo"></div>
                <div class="aside-nav">
                    <router-link class="an_route" to="/home" @mouseenter="train = 15"
                        @mouseleave="train = (activeName - 1) * 11.4 + 15">
                        <div :class="{ 'check-active': activeName === 1 }"><el-icon
                                :class="{ 'icon-active': activeName === 1 }">
                                <Menu />
                            </el-icon>首页</div>
                    </router-link>
                    <router-link class="an_route" to="/animals" @mouseenter="train = 27"
                        @mouseleave="train = (activeName - 1) * 11.4 + 15">
                        <div :class="{ 'check-active': activeName === 2 }"><el-icon
                                :class="{ 'icon-active': activeName === 2 }">
                                <Star />
                            </el-icon>动物数据</div>
                    </router-link>
                    <router-link class="an_route" to="/admin" @mouseenter="train = 39"
                        @mouseleave="train = (activeName - 1) * 11.4 + 15">
                        <div :class="{ 'check-active': activeName === 3 }"><el-icon
                                :class="{ 'icon-active': activeName === 3 }">
                                <Notebook />
                            </el-icon>管理员数据
                        </div>
                    </router-link>
                    <router-link class="an_route" to="/center" @mouseenter="train = 49"
                        @mouseleave="train = (activeName - 1) * 11.4 + 15">
                        <div :class="{ 'check-active': activeName === 4 }">
                            <el-icon :class="{ 'icon-active': activeName === 4 }">
                                <Setting />
                            </el-icon>个人中心
                        </div>
                    </router-link>
                    <router-link class="an_route" to="/user" @mouseenter="train = 61"
                        @mouseleave="train = (activeName - 1) * 11.4 + 15">
                        <div :class="{ 'check-active': activeName === 5 }">
                            <el-icon :class="{ 'icon-active': activeName === 5 }">
                                <UserFilled />
                            </el-icon>
                            用户数据
                        </div>
                    </router-link>
                    <router-link class="an_route" to="/userUpload" @mouseenter="train = 73"
                        @mouseleave="train = (activeName - 1) * 11.4 + 15">
                        <div :class="{ 'check-active': activeName === 6 }">
                            <el-badge :hidden="false" :value="countStore.badgeNum" class="mark" :max="99">
                                <el-icon :class="{ 'icon-active': activeName === 6 }">
                                    <Document />
                                </el-icon>
                                待处理上传
                            </el-badge>
                        </div>
                    </router-link>
                </div>
            </el-aside>
            <el-container>
                <el-header>
                    <div class="header-title">{{ title }}</div>
                    <div>管理员：{{ adminStore?.admin.name }}</div>
                    <el-dropdown>
                        <el-avatar :size="60"
                            :src="adminStore?.admin.avatarURL || 'https://javaweb-twj.oss-cn-beijing.aliyuncs.com/elysiaHead.jpg'" />
                        <template #dropdown>
                            <el-dropdown-item @click="logOut"><el-icon>
                                    <SwitchButton />
                                </el-icon> 退出登录</el-dropdown-item>
                            <el-dropdown-item @click="$router.push('/center')"><el-icon>
                                    <User />
                                </el-icon> 个人中心</el-dropdown-item>
                        </template>
                    </el-dropdown>

                </el-header>
                <el-main>
                    <router-view v-slot="{ Component }">
                        <transition name="fade" mode="out-in" appear>
                            <!-- <keep-alive> -->
                                <component :is="Component" />
                            <!-- </keep-alive> -->
                        </transition>
                    </router-view>
                </el-main>
<!--                 <el-footer>
                    <p>CreateBy：elysia</p>
                    <p>版权所属：© 2023 爱莉希雅天下第一！</p>
                </el-footer> -->
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
        color: $titleHeader;
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
            margin: 40px;
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
        flex: .7;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        background-color: $footerBgcColor;
        color: $fontColor;
    }

    .el-main {
        flex: 6;
        background-color: $mainBgcColor;
    }

    .el-aside {
        background-color: $navBgcColor;
        color: #333;
        text-align: center;
        position: relative;

        .track {
            position: absolute;
            height: 100%;
            width: 2%;
            right: 0%;
            transition: all 0.1s linear;

            .train {
                width: 100%;
                height: 50px;
                background-color: #66b1ff;
                position: absolute;
                //top: 15%;
                transition: all 0.3s linear;
            }
        }

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
                color: $titleHeader;
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

                    .badge-item {
                        margin-top: 0px;
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

                    .icon-active {
                        animation: icon 0.3s;
                    }

                    @keyframes icon {
                        0% {
                            scale: 1;
                        }

                        50% {
                            scale: 0.6;
                        }

                        100% {
                            scale: 1;
                        }
                    }

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
                // border-right: $titleFontColor 4px solid;
            }
        }
    }


}
</style>