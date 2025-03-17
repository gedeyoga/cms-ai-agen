import { defineEventHandler, getQuery } from 'h3'
import { destroyUser } from '~/repository/userRepository'
import { CategoryInterface } from '~/types/CategoryInterface'

export default defineEventHandler(async (event) => {
    const params = getRouterParams(event)

    const userRepository = await destroyUser(params.user)

    return {
        status: 200,
        message: 'Delete successfuly.',
    }
})
