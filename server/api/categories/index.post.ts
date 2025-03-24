import { getServerSession } from '#auth'
import { defineEventHandler, getQuery } from 'h3'
import { createCategory, list } from '~/repository/categoryRepository'

export default defineEventHandler(async (event) => {
    const { name } = await readBody(event)
    const session = await getServerSession(event)

    const response = await createCategory({
        name,
        company: {
            connect: {
                id: session?.user?.companyId,
            },
        },
    })

    return {
        status: 200,
        message: 'Create sucessfuly',
        data: response,
    }
})
