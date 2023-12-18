import type { Animal } from '@/pojo/Animal'
/**
 * 校验动物数据完整性
 * @param addAnimalForm 
 * @returns 
 */
export function isValidAddAnimalForm(addAnimalForm: Animal) {
    // 检查 name 属性是否为空
    if (addAnimalForm.name.trim() === '') {
        return false;
    }
 
    // 检查 imgURL 属性是否为空
    if (addAnimalForm.imgURL?.length === 1) {
        return false;
    }
 
    // 检查 description 属性是否为空
    if (addAnimalForm.description.trim() === '') {
        return false;
    }
 
    // 检查 classification 属性是否为空
    if (addAnimalForm.classification.trim() === '') {
        return false;
    }
 
    // 检查 distribution 属性是否为空
/*     if (addAnimalForm.distribution.trim() === '') {
        return false;
    } */
 
    // 检查 protectionLevel 属性是否为空
    if (addAnimalForm.protectLevel.trim() === '') {
        return false;
    }
 
    // 检查 diet 属性是否为空
/*     if (addAnimalForm.diet.trim() === '') {
        return false;
    } */
 
    // 检查 breeding 属性是否为空
    if (addAnimalForm.breeding.trim() === '') {
        return false;
    }
 
/*     // 检查 lifeHabit 属性是否为空
    if (addAnimalForm.lifeHabit.trim() === '') {
        return false;
    } */
 
/*     // 检查 predator 属性是否为空
    if (addAnimalForm.predator.trim() === '') {
        return false;
    } */
 
    // 如果所有属性都不为空，则表单有效
    return true;
 }
 