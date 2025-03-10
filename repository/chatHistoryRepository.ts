import moment from 'moment'
import prisma from '~/services/prisma/client'
import type { ChatHistoryInterface } from '~/types/ChatHistoryInterface'

export const find = async (id: number) => {
    return prisma.chatHistory.findFirst({
        where: {
            id: id,
        },
    })
}

export async function createChat(data: ChatHistoryInterface) {
    const chatHistory = await prisma.chatHistory.create({
        include: {
            contact: true,
        },
        data: {
            contactId: data.contactId,
            role: data.role,
            content: data.content,
            readedAt: data.role == 'assistant' ? moment().format() : null
        },
    })

    return chatHistory
}

export async function findChatByContacts(contactId: number, orderBy = 'desc') {
    const chatHistories = await prisma.chatHistory.findMany({
        include: {
            contact: true,
        },
        where: {
            contactId: contactId,
        },
        orderBy: {
            createdAt: orderBy == 'asc' ? 'asc' : 'desc',
        },
    })

    return chatHistories
}
