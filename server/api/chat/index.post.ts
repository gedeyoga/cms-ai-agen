import { defineEventHandler, getQuery } from 'h3'
import { z } from 'zod'
import { createChat } from '~/repository/chatHistoryRepository'
import { find } from '~/repository/contactRepository'
import { ChatHistoryInterface } from '~/types/ChatHistoryInterface'

export default defineEventHandler(async (event) => {
    const { contactId, message } = await readBody(event)

    try {
        const data = {
            contactId,
            message,
        }

        const schema = z.object({
            contactId: z.number().min(2, 'Name minimum at leats 2 characters'),
            message: z.string(),
        })

        schema.parse(data)

        const checkPhone = await find(contactId)

        if (checkPhone == null) {
            return createError({
                status: 404,
                message: 'Phone not found.',
            })
        }
    } catch (error: any) {
        return createError({
            status: 422,
            message: 'Validation error',
            data: error.errors,
        })
    }

    const chatHistory: ChatHistoryInterface = {
        contactId: contactId,
        content: message,
        role: 'user',
    }

    const response = await createChat(chatHistory)

    return {
        status: 200,
        message: 'Message created succesfully',
        data: response,
    }
})
