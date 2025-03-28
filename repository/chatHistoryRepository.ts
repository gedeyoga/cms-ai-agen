import moment from 'moment'
import prisma from '~/services/prisma/client'
import type { ChatHistoryInterface } from '~/types/ChatHistoryInterface'
import { findUniquePhone } from './contactRepository'

export const find = async (id: number) => {
    return prisma.chatHistory.findFirst({
        where: {
            id: id,
        },
    })
}

export async function createChat(data: ChatHistoryInterface) {
    let chatHistory = await prisma.chatHistory.create({
        include: {
            contact: true,
        },
        data: {
            contactId: data.contactId,
            role: data.role,
            content: data.content,
            readedAt: data.role == 'assistant' ? moment().format() : null,
        },
    })

    return chatHistory
}

export async function findChatByContacts(
    contactId: number,
    orderBy = 'desc',
    page = 1,
    perPage = 10
) {
    const skip = (page - 1) * perPage

    const [chatHistories, totalCount] = await Promise.all([
        prisma.chatHistory.findMany({
            include: {
                contact: true,
            },
            where: {
                contactId: contactId,
            },
            orderBy: {
                createdAt: orderBy == 'asc' ? 'asc' : 'desc',
            },
            skip,
            take: perPage,
        }),
        prisma.chatHistory.count({
            where: {
                contactId: contactId,
            },
        }),
    ])

    return {
        data: chatHistories,
        total: totalCount,
        page,
        perPage,
        hasMore: skip + perPage < totalCount,
    }
}

export async function countUnreadedChat(contactId: number) {
    let countUnreadedChat = await prisma.chatHistory.count({
        where: {
            readedAt: null,
            contactId: contactId,
        },
    })

    return countUnreadedChat
}

export async function markUnreadMessagesAsRead(contactId: number) {
    const chatHistories = await prisma.chatHistory.updateMany({
        where: {
            contactId: contactId,
            readedAt: null,
        },
        data: {
            readedAt: new Date(),
        },
    })

    return chatHistories
}
