import { defineEventHandler, getQuery } from 'h3'
import { findChatByContacts } from '~/repository/chatHistoryRepository'
import { ChatHistoryInterface } from '~/types/ChatHistoryInterface'

export default defineEventHandler(async (event) => {
    const { contact } = getRouterParams(event)
    const { page = '1', per_page = '10' } = getQuery(event)

    const chatHistories = await findChatByContacts(parseInt(contact),'desc',parseInt(page.toString()),parseInt(per_page.toString()))

    return {
        status: 200,
        data: chatHistories,
    }
})
