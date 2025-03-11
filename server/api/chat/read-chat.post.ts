import { defineEventHandler, getQuery } from 'h3'
import { z } from 'zod'
import { markUnreadMessagesAsRead } from '~/repository/chatHistoryRepository'

export default defineEventHandler(async (event) => {
    const { contactId } = await readBody(event)

    try {
        const data = {
            contactId,
        }

        const schema = z.object({
            contactId: z.number().min(1, 'Name minimum at leats 2 characters'),
        })

        schema.parse(data)

    } catch (error: any) {
        return createError({
            status: 422,
            message: 'Validation error',
            data: error.errors,
        })
    }

    const response = await markUnreadMessagesAsRead(contactId)

    return {
        status: 200,
        message: 'Message created succesfully',
        data: response,
    }
})
