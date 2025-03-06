import { defineEventHandler, getQuery } from 'h3'
import { updateCategory } from '~/repository/categoryRepository'
import { CategoryInterface } from '~/types/CategoryInterface'

export default defineEventHandler(async (event) => {
    const params = getRouterParams(event)
    const body = await readBody(event)

    const category: CategoryInterface = await updateCategory(
        parseInt(params.category),
        body
    )

    return {
        status: 200,
        message: 'Update succesfully.',
        data: category,
    }
})
