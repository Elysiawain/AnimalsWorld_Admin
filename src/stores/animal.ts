import { ref } from 'vue'
import { defineStore } from 'pinia'
export const useAnimalStore = defineStore('animal', () => {
    const classfication = ref<any>()
    const setClassfication = (value: any) => {
        classfication.value = value
    }
    return { classfication, setClassfication }
})