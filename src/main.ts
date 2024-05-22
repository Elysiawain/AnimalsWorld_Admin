import '@/styles/common.scss'
import '@/styles/transition.scss'
import '@/styles/repair.scss'
import 'element-plus/dist/index.css'
import {createApp} from 'vue'
import {createPinia} from 'pinia'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import App from './App.vue'
import router from './router'

import * as echarts from 'echarts'; //引入echarts

const app = createApp(App)
app.directive('focus', {
    inserted: function (el:any) {
        el.focus();
    }
})
app.use(router)
app.use(createPinia()) //仓库使用Pinia
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(ElementPlus, {
    locale: zhCn,
})

app.config.globalProperties.$echarts = echarts;//全局使用
app.mount('#app')
