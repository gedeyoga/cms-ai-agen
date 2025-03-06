import { defineEventHandler, getQuery } from 'h3'
import { getContactsWithPagination, list } from '~/repository/contactRepository'
import { ContactInterface } from '~/types/ContactInterface'
import { MetaInterface, PaginationInterface } from '~/types/PaginationInterface'

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    let contacts: ContactInterface[] = []
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
        const response = await getContactsWithPagination(
            params.page,
            params.per_page,
            params.search
        )
        contacts = response.data
        meta = response.meta

        return {
            status: 200,
            data: contacts,
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
