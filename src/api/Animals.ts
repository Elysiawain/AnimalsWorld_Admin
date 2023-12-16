// 动物相关请求数据接口
import request from "@/utils/Request"
/**
 * 获取动物数据
 * @param page 
 * @param pageSize 
 * @param classification 
 * @returns 
 */
export const getAnimalListApi = (page:number,pageSize:number,classification:string) => {
    return request({
        url: '/AW',
        method: 'get',
        params: {
            page,
            pageSize,
            classification
        }
    })
}