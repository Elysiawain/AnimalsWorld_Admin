import type AdminDetail from "@/components/AdminDetail.vue";
import type AnimalDetail from "@/components/AnimalDetail.vue";
import type AnimalItem from "@/components/AnimalItem.vue";
import type Drawer from "@/components/Drawer.vue";
import type Suggest from "@/components/Suggest.vue";

declare module 'vue' {
    export interface GlobalComponents {
        AdminDetail:typeof AdminDetail
        AnimalDetail:typeof AnimalDetail
        AnimalItem:typeof  AnimalItem
        Drawer:typeof Drawer
        Suggest:typeof Suggest
    }
}