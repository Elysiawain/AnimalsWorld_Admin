import type {Admin} from "@/interfaces/Admin";
import type {AnimalPre} from "@/interfaces/Animal";

export interface AdminDetailData extends Admin {
    auditList: AnimalPre[],
    addList: AnimalPre[],
    editList: AnimalPre[]
}