// 管理员数据仓库
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {Admin, AdminInfo} from "@/interfaces/Admin.d";

export const useAdminStore = defineStore('admin', () => {
    const admin = ref<Admin>()
    const token=ref<string>(localStorage.getItem('token')||'')
    const getAdminInfo = () => {
        admin.value = JSON.parse(localStorage.getItem('adminInfo')||'{}') 
        return admin.value
    }
    const setAdminInfo = (adminInfo: AdminInfo): void => {
        localStorage.setItem('adminInfo', JSON.stringify(adminInfo.adminData))
        localStorage.setItem('token', adminInfo.token)
        token.value = adminInfo.token
        admin.value = adminInfo.adminData
    }
    const clearAdminInfo = (): void => {
        localStorage.removeItem('adminInfo')
        localStorage.removeItem('token')
        admin.value = {} as  Admin
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