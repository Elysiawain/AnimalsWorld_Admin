// 管理员数据仓库
import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', () => {
    const admin = ref<any>({})
    const token=ref<string>('')
    const getAdminInfo = ():Object => {
        admin.value = JSON.parse(localStorage.getItem('adminInfo')||'{}') 
        return admin.value
    }
    const setAdminInfo = (adminInfo: any): void => {
        localStorage.setItem('adminInfo', JSON.stringify(adminInfo.adminData))
        localStorage.setItem('token', adminInfo.token)
        token.value = adminInfo.token
        admin.value = adminInfo
    }
    const clearAdminInfo = (): void => {
        localStorage.removeItem('adminInfo')
        localStorage.removeItem('token')
        admin.value = {}
        token.value = ''
    }
    return {
        admin,
        token,
        getAdminInfo,
        setAdminInfo,
        clearAdminInfo
    }
})