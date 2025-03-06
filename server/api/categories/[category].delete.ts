import { defineEventHandler, getQuery } from 'h3'
import { destroyCategory } from '~/repository/categoryRepository'
import { CategoryInterface } from '~/types/CategoryInterface'

export default defineEventHandler(async (event) => {
    const params = getRouterParams(event)

    const category = await destroyCategory(parseInt(params.category))

    return {
        status: 200,
        message: 'Delete successfuly.',
    }
})
