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

/**
 * 管理员列表单个对象
 */
export interface adminListItem {
    adminID: string
    name: string
    status: number
    avatarURL: string
    createTime: string
}

export interface adminList {
    adminList: adminListItem[]
}