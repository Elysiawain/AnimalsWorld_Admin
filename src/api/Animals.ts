// 动物相关请求数据接口
import request from "@/utils/Request"
import type { Animal } from "@/pojo/Animal"
/**
 * 获取动物数据
 * @param page 
 * @param pageSize 
 * @param classification 
 * @returns 
 */
export const getAnimalListApi = (page: number, pageSize: number, classification: string) => {
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
/**
 * 获取动物分类
 * @returns 
 */
export const getAnimalClassificationApi = () => {
    return request({
        url: '/AW/classification',
        method: 'get',
    })
}
/**
 * 添加动物数据
 * @param animal 
 * @returns 
 */
export const addAnimalApi = (animal: Animal) => {
    return request({
        url: '/AW',
        method: 'post',
        data: animal
    })
}
/**
 * 搜索
 * @param name 
 * @returns 
 */
export const getAnimalByName = (name:string) => {
    return request({
        url: `/AW/search/${name}`,
        method: 'get',
    })
}