export type PageResult<T> = {
    page: number
    pageSize: number
    total: number
    data: T[]
}