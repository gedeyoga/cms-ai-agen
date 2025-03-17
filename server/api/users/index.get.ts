import { defineEventHandler, getQuery } from 'h3'
import {
    getUsersWithPagination,
    list,
} from '~/repository/userRepository'
import { MetaInterface, PaginationInterface } from '~/types/PaginationInterface'
import { UserInterface } from '~/types/UserInterface'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    let categories: UserInterface[] = []
    let meta: MetaInterface = {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
    }

    if (query.per_page && query.page) {
        const params = {
            page: parseInt(query.page as string, 10) || 1,
            per_page: parseInt(query.per_page as string, 10) || 10,
            search: query.search + '',
        }
        const response = await getUsersWithPagination(
            params.page,
            params.per_page,
            params.search
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
        }
        const response = await list(params)
        return {
            status: 200,
            data: response,
        }
    }
})
