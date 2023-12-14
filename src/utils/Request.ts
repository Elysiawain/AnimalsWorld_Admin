import axios from "axios";
import { useAdminStore } from "@/stores/admin";
import { ElMessage } from 'element-plus';
const adminStore = useAdminStore();
// 创建axios实例
const request = axios.create({
    baseURL: '/api',
    timeout: 5000
})

// 添加请求拦截器
request.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    console.log(config.url)

    if (adminStore.token) {
        config.headers.Authorization = adminStore.token;
    } else if (adminStore && config.url != '/login') {
        window.location.href = '/login'
        ElMessage.error('请先登录!')
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
    return response;
}, error => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
});

export default request;