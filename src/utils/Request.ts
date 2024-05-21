import axios from "axios";
import { useAdminStore } from "@/stores/admin";
import { ElMessage } from 'element-plus';

const adminStore = useAdminStore();
axios.defaults.baseURL = '/api'
// 创建axios实例
const request = axios.create({
    timeout: 10000
})
// 添加请求拦截器
request.interceptors.request.use((config: any) => {
    // 在发送请求之前做些什么
    if (adminStore.token) {
        config.headers['token'] = adminStore.token // 配置请求头·
    } else if (config.url != '/admin/login') {
        ElMessage.error('请先登录!')
        window.location.href = '/animals/login'
        return false
    }

    return config;
}, error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
request.interceptors.response.use(response => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (response.data.code != 1) {
        return ElMessage.error(response.data.message || '服务异常，请稍后重试')
    }
    return response.data;
}, error => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    ElMessage.error('服务异常，请稍后重试')
    return Promise.reject(error);
});

export default request;