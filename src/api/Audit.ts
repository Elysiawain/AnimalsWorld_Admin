import request from "@/utils/Request";
import type {Animal, AuditAnimal} from "@/interfaces/Animal";
import type {PageResult} from "@/types/PageResult";

/**
 * 获取用户上传详细数据
 * @param auditId
 */
export const getUserAnimalDetail = (auditId: number) => {
    return request<any, Result<AuditAnimal>>({
        url: '/admin/userAnimals?auditId=' + auditId,
        method: 'get',
    })
}

/**
 *  关闭审核
 * @param ids 未审核数据id
 */
export const closingAuditApi = (ids: string) => {
    return request<any, Result<Animal>>({
        url: '/audit/close?ids=' + ids,
        method: 'post',
    })
}

export const getHistoryAuditListApi = (page: number, pageSize: number, id?: string | number) => {
    return request<any, Result<PageResult<AuditAnimal>>>({
        url: `/audit/history/list?page=` + page + '&&pageSize=' + pageSize + '&&id=' + id,
        method: 'get',
    })
}