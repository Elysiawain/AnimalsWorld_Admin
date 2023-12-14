// 管理员相关接口
import request from "@/utils/Request"
export const getAdminApi = (adminName: string, password: string) => {
    return request({
        url: '/admin/login',
        method: 'post',
        params: {
            adminName,
            password
        }
    })
}