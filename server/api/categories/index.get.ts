import { defineEventHandler, getQuery } from 'h3'
import {
    getCategoriesWithPagination,
    list,
} from '~/repository/categoryRepository'
import { MetaInterface, PaginationInterface } from '~/types/PaginationInterface'
import { CategoryInterface } from '~/types/CategoryInterface'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const session = await getServerSession(event)
    let categories: CategoryInterface[] = []
    let meta: MetaInterface = {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
    }
    const params = {
        companyId: session?.user?.companyId,
    }

    if (query.per_page && query.page) {
        const pagination = {
            page: parseInt(query.page as string, 10) || 1,
            per_page: parseInt(query.per_page as string, 10) || 10,
            search: query.search + '',
        }

        const response = await getCategoriesWithPagination(
            pagination.page,
            pagination.per_page,
            pagination.search,
            params
        )

        categories = response.data
        meta = response.meta

        return {
            status: 200,
            data: categories,
            meta,
        }
    } else {
        const params = {
            orderBy: query.orderBy ? query.orderBy + '' : 'asc',
            search: query.search ? query.search + '' : '',
            companyId: session?.user?.companyId,
        }
        const response = await list(params)
        return {
            status: 200,
            data: response,
        }
    }
})
