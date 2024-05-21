// 管理员相关接口
import request from "@/utils/Request"
import type {Admin, adminList} from "@/interfaces/Admin";
import type {AdminDetailData} from "@/interfaces/AdminDetail";

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
    return request<any, Result<adminList>>({
        url: '/admin',
        method: 'get'
    })
}
/**
 * 修改管理员个人信息
 * @param name
 * @param avatarURL
 * @param message
 * @param bgcImgURL
 * @returns
 */
export const updateAdminApi = (name: string, avatarURL: string, message: string, bgcImgURL: string) => {
    return request<any, Result<null>>({
        url: '/admin/update/center',
        method: 'post',
        params: {
            name,
            avatarURL,
            message,
            bgcImgURL
        }
    })
}
/**
 * 修改账号（管理员）信息
 * @param adminID
 * @param status
 * @returns
 */
export const updateAdminStatusApi = (adminID: string, status: number) => {
    return request({
            url: '/admin/status',
            method: 'POST',
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
            method: 'post',
            params: {
                adminID
            }
        }
    )
}
/**
 * 获取管理员详情
 * @param adminID
 * @returns
 */
export const getAdminDetailApi = (adminID: string) => {
    return request<string, Result<Admin>>({
            url: `/admin/detail/${adminID}`,
            method: 'get',
        }
    )
}
/**
 * 管理员端获取用户得数据
 * @returns
 */
export const getUserApi = (page: Number, pageSize: Number, userID: String | undefined, userName: String) => {
    return request({
        url: '/admin/user',
        method: 'get',
        data: {
            page,
            pageSize,
            userID,
            userName
        }
    })
}
/**
 * 修改用户的数据
 * @param userID
 * @param status
 * @returns
 */
export const updaeUserStatusApi = (userID: string, status: number) => {
    return request({
        url: '/admin/user/status',
        method: 'put',
        params: {
            userID,
            status
        }
    })
}
/**
 * 获取审核数据（1：已审核，0：待审核）
 * @param page
 * @param pageSize
 * @param status
 * @returns
 */
export const getAuditListApi = (page: Number, pageSize: Number, status: number) => {
    return request({
        url: `/admin/userUpload/${status}`,
        method: 'get',
        params: {
            page,
            pageSize,
        }
    })
}
/**
 * 修改审核状态信息
 * @param userID
 * @param status
 * @returns
 */
export const updateAuditApi = (auditID: string, adminID: string, status: number) => {
    return request({
        url: `/admin/userUpload/${status}`,
        method: 'put',
        params: {
            auditID,
            adminID,
        }
    })
}
/**
 * 获取待处理数量
 * @returns
 */
export const getBadgeNumApi = () => {
    return request({
        url: '/admin/userUpload/badgeNum',
        method: 'get',
    })
}

/**
 * 获取管理员详情
 * @returns
 */
export const getAdminDetailCenterApi = () => {
    return request<string, Result<AdminDetailData>>({
            url: `/admin/detail/center`,
            method: 'get',
        }
    )
}
