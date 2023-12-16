// 管理员相关接口
import request from "@/utils/Request"
/**
 * 管理员登录
 * @param adminName 
 * @param password 
 * @returns 
 */
export const adminLoginApi = (adminName: string, password: string) => {
    return request({
        url: '/admin/login',
        method: 'post',
        params: {
            adminName,
            password
        }
    })
}
/**
 * 获取管理员相关信息
 * @returns 
 */
export const getAdminListApi = () => {
    return request({
        url: '/admin',
        method: 'get'
    })
}
/**
 * 修改账号（管理员）信息
 * @param adminID 
 * @param adminName 
 * @param status 
 * @returns 
 */
export const updateAdminStatusApi = (adminID: string, status: number) => {
    return request({
        url: '/admin/status',
        method: 'put',
        params: {
            adminID,
            status
        }
    }
    )
}
/**
 * 删除管理员
 * @param adminID 
 * @returns 
 */
export const deleteAdminApi = (adminID: string) => {
    return request({
        url: '/admin',
        method: 'delete',
        params: {
            adminID
        }
    }
    )
}