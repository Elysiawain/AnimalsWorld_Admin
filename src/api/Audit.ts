import request from "@/utils/Request";
import type {Animal} from "@/interfaces/Animal";

/**
 * 获取用户上传详细数据
 * @param auditId
 */
export const getUserAnimalDetail=(auditId:number)=>{
    return request<any,Result<Animal>>({
        url: '/admin/userAnimals?auditId='+auditId,
        method: 'get',
    })
}