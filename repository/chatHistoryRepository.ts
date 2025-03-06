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
        data: {
            contactId: data.contactId,
            role: data.role,
            content: data.content,
        },
    })

    return chatHistory
}

export async function findChatByContacts(contactId: number, orderBy = 'desc') {
    const chatHistories = await prisma.chatHistory.findMany({
        where: {
            contactId: contactId,
        },
        orderBy: {
            createdAt: orderBy == 'asc' ? 'asc' : 'desc',
        },
    })

    return chatHistories
}
