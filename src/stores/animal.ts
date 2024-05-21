import {ref} from 'vue'
import {defineStore} from 'pinia'
import type {Category} from "@/interfaces/Animal";

export const useAnimalStore = defineStore('animal', () => {
    const category = ref<Category[]>()
    return {category}
})