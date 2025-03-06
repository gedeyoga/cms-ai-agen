import { defineEventHandler, getQuery } from 'h3'
import { createCategory, list } from '~/repository/categoryRepository'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)

    const response = await createCategory(body)

    return {
        status: 200,
        message: 'Create sucessfuly',
        data: response,
    }
})
