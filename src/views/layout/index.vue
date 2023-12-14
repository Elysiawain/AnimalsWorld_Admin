<script setup lang="ts">
</script>

<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="200px">
                <!-- 侧边栏 -->
                <div class="logo">Logo</div>
                <div class="aside-nav">
                    <router-link class="an_route" to="/home">首页</router-link>
                    <router-link class="an_route" to="/animals">动物数据</router-link>
                    <router-link class="an_route" to="/admin"> 管理员数据</router-link>
                    <router-link class="an_route" to="/center">个人中心</router-link>
                </div>
            </el-aside>
            <el-container>
                <el-header>Header</el-header>
                <el-main>
                    <transition name="fade">
                        <router-view></router-view>
                    </transition>

                </el-main>
                <el-footer>Footer</el-footer>
            </el-container>
        </el-container>
    </div>
</template>
  

<style scoped lang="scss">
.common-layout {
    height: 100vh;
    display: flex;
    background-color: $bgcColor;

    .el-header {
        background-color: #B3C0D1;
        color: #333;
    }

    .el-footer {
        background-color: #B3C0D1;
        color: #333;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;

        .logo {
            width: 100%;
            height: 50px;
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
                color: $fontColor;
                transition: all .2s linear;

                &:hover {
                    color: $titleFontColor;
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