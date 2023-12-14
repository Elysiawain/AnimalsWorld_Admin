// 管理员数据仓库
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', () => {
    const admin = ref<any>({})
    const token=ref<string>('')
    const getAdminInfo = (): Object => {
        admin.value = localStorage.getItem('admin')
        return admin.value
    }
    const setAdminInfo = (adminInfo: Object): void => {
        localStorage.setItem('adminInfo', JSON.stringify(adminInfo.adminData))
        localStorage.setItem('token', adminInfo.token)
        token.value = adminInfo.token
        admin.value = adminInfo
    }
    return {
        admin,
        token,
        getAdminInfo,
        setAdminInfo
    }
})