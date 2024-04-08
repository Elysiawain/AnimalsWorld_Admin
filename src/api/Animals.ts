// 动物相关请求数据接口
import request from "@/utils/Request"
import type {Animal, AnimalPre, AnimalRes, CategoryResponse} from "@/interfaces/Animal.d.ts";
import type {AnimalsSortType} from "@/types/SortType.d.ts";
import type {PageResult} from "@/types/PageResult";
import type {Suggest} from "@/types/Suggest";

/**
 * 获取动物数据
 * @param page
 * @param pageSize
 * @param categoryId
 * @param keyword
 * @param type
 * @returns
 */
export const getAnimalListApi = (page: number, pageSize: number, categoryId: number, keyword: string, type: AnimalsSortType) => {
    return request<any, Result<PageResult<AnimalPre>>>({
        url: `/AW/user/search/${keyword}`,
        method: 'get',
        params: {
            page,
            pageSize,
            categoryId,
            type
        }
    })
}
/**
 * 获取动物分类
 * @returns
 */
export const getAnimalClassificationApi = () => {
    return request<any, Result<CategoryResponse>>({
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
    return request<Animal,Result<null>>({
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
export const getAnimalByNameApi = (name: string) => {
    return request({
        url: `/AW/search/${name}`,
        method: 'get',
    })
}
/**
 * 根据id获取动物数据
 * @param id
 * @returns
 */
export const getAnimalByIdApi = (id: number) => {
    return request<any, Result<AnimalRes>>({
        url: `/AW/${id}`,
        method: 'get'
    })
}

/**
 * 搜索提示
 * @param keyword
 * @returns
 */
export const suggestAnimalApi = (keyword: string) => {
    return request<any,Result<Suggest[]>>({
        url: "/suggest",
        method: 'get',
        params: {
            keyword
        }
    })
}