import { getServerSession } from '#auth'
import { defineEventHandler, getQuery } from 'h3'
import { getDevicesWithPagination, list } from '~/repository/deviceRepository'
import { MetaInterface } from '~/types/PaginationInterface'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const session = await getServerSession(event)
    let devices = []
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

        const response = await getDevicesWithPagination(
            pagination.page,
            pagination.per_page,
            pagination.search,
            params
        )
        devices = response.data
        meta = response.meta

        return {
            status: 200,
            data: devices,
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
