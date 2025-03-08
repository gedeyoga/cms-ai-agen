import { defineEventHandler, getQuery } from 'h3'
import { findChatByContacts } from '~/repository/chatHistoryRepository'
import { ChatHistoryInterface } from '~/types/ChatHistoryInterface'

export default defineEventHandler(async (event) => {
    const { contact } = getRouterParams(event)

    const chatHistories = await findChatByContacts(parseInt(contact), 'desc')

    return {
        status: 200,
        data: chatHistories,
    }
})
