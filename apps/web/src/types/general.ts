export type PaginationMeta = {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
}

export type PaginatedResponse<T> = {
    data: T[]
    meta: PaginationMeta
}