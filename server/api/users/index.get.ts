import { defineEventHandler, getQuery } from 'h3'
import { getUsersWithPagination, list } from '~/repository/userRepository'
import { MetaInterface, PaginationInterface } from '~/types/PaginationInterface'
import { UserInterface } from '~/types/UserInterface'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const session = await getServerSession(event)
    const query = getQuery(event)
    let categories: UserInterface[] = []
    let meta: MetaInterface = {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
    }

    if (query.per_page && query.page) {
        const pagination = {
            page: parseInt(query.page as string, 10) || 1,
            per_page: parseInt(query.per_page as string, 10) || 10,
            search: query.search + '',
        }
        const params = {
            companyId: session?.user?.companyId,
        }

        const response = await getUsersWithPagination(
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
        }
        const response = await list(params)
        return {
            status: 200,
            data: response,
        }
    }
})
