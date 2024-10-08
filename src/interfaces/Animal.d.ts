/**动物基本信息
 @property {string} animalID - 动物ID
 @property {string} name - 动物名称
 @property {string} imgURL - 动物图片信息
 @property {string} description - 动物描述
 @property {string} classification - 动物分类
 @property {string} distribution - 动物分布
 @property {string} protectionLevel - 动物保护等级
 @property {string} diet - 动物饮食
 @property {string} breeding - 动物繁殖
 @property {string} lifestyle - 动物生活习性
 @property {string} predator - 动物天敌
 @property {string} tag - 动物标签
 @property {number} score - 动物评分
 @property searchCount
 @property imgList*/
export interface Animal {
    animalID: string
    name: string
    imgURL: string
    description: string
    classification: string
    distribution: string
    protectionLevel: string
    diet: string
    breeding: string
    lifestyle: string
    predator: string
    tags: string
    score:number
    searchCount:number
    imgList: [{
        uid: string
        url: string
    }]
}
// 后端返回
export type AnimalRes = {
    animalList: Animal[]
    total: number
}
/**
 * 动物预览类型
 * @property id 动物id
 * @property img 动物图片
 * @property name 动物名称
 * @property desc 动物描述
 */
export type AnimalPre = {
    id: number;
    img: string;
    name: string;
    desc: string
}

/**
 * 动物分类
 * @property id 分类id
 * @property name 分类名称
 * @property desc 分类描述
 * @property img 分类图片
 */
export interface Category {
    id: number;
    name: string;
    desc: string;
    img: string;
}

// 获取分类返回数据
export type CategoryResponse = {
    classificationList: Category[];
}
export type AuditAnimal={
    // 唯一id
     id:number;
    // 关联的审核表id
     auditId:number;
    // 审核通过后的主数据id
    animalId:number;
    // 动物名称
     name:string;
    // 主图地址
     imgURL:string;
    // 副图地址，以逗号分隔
     imgList:string;
    // 描述
     description:string;
    // 分类
     classification:string;
    // 分布
     distribution:string;
    // 保护级别
     protectionLevel:string;
    // 饮食习性
     diet:string;
    // 繁殖
     breeding:string;
    // 生活习性
     lifestyle:string;
    // 天敌
     predator:string;
    //  创建者
    creator:number;
    // 更新者
     updater:number;
    // 状态0——待审核；1——通过；2——不通过：3——用户取消
     status:number;
    // 标签
    tags:string;
    // 创建时间
     createTime:string;
    // 更新时间
     updateTime:string;
}