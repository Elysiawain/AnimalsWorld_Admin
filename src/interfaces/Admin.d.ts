/**
 *  管理员对象
 */
export interface Admin {
    adminID: string
    createTime: string
    name: string
    status: number
    avatarURL: string
    message: string
    bgImg: string
}

/**
 * 接收返回数据
 */
export interface AdminInfo {
    token: string
    adminData: Admin
}