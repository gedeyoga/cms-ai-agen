export interface PaginationInterface {
    page: number,
    per_page: number,
}

export interface MetaInterface {
    currentPage: number,
    pageSize: number,
    total: number,
    totalPages: number,
}