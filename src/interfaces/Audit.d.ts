//审核返回数据
export interface Audit {
    // 审核id
    id: number;
    uploader: number;
    // 对应的user_animals表中的id
    adminId: number;
    // 审核时间（管理员审核完毕后记录）
    auditTime: string;
    // 审核状态
    status: number;
    // 审核附带信息
    msg: string;
    // 审核创建时间（用户上传时间）
    createTime: string;
}