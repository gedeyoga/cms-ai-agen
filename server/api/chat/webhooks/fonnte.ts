import { defineEventHandler, getQuery } from 'h3'
import { z } from 'zod'
import {
    countUnreadedChat,
    createChat,
} from '~/repository/chatHistoryRepository'
import { createContact, findUniquePhone } from '~/repository/contactRepository'
import { removeTrailingNewlines } from '~/services/gemini-ai/helpers/stringHelper'
import { askAgen } from '~/services/gemini-ai/repositories/agenRepository'
import { ChatHistoryInterface } from '~/types/ChatHistoryInterface'
import { ContactInterface } from '~/types/ContactInterface'
import { sendWhatsapp } from '~/services/gemini-ai/services/fonnteClient'
import { pusher } from '~/services/pusher/pusher'

export default defineEventHandler(async (event) => {
    const formData =
        event.method == 'GET' ? getQuery(event) : await readBody(event)

    if (
        (event.method == 'GET' && !formData.hasOwnProperty('sender')) ||
        (event.method == 'POST' && !formData.hasOwnProperty('sender'))
    ) {
        return {
            status: 200,
            message: 'No data fetched!',
        }
    }

    const { sender, name, message } =
        event.method == 'GET' ? getQuery(event) : await readBody(event)

    try {
        const data = {
            sender,
            name,
            message,
        }

        const schema = z.object({
            sender: z.string().min(10, 'Sender minimum at leats 10 characters'),
            name: z.string(),
            message: z.string(),
        })

        schema.parse(data)
    } catch (error: any) {
        return createError({
            status: 422,
            message: 'Validation error',
            data: error.errors,
        })
    }

    let contact = await findUniquePhone(sender)

    if (contact == null) {
        const dataContact: ContactInterface = {
            name: name,
            phone: sender,
            status: 'NEW',
            categories: [],
        }
        contact = await createContact(dataContact)
    }

    const chatHistory: ChatHistoryInterface = {
        contactId: contact.id,
        content: message,
        role: 'user',
    }

    //create chat user and trigger pusher
    const userChat = await createChat(chatHistory)

    const userChatResource = await chatHistoryResource(userChat)

    await pusher.trigger('chat-channel', 'new-message', userChatResource)

    const agenResponse = await askAgen(contact.id, message)

    const output = removeTrailingNewlines(agenResponse)

    //create agen and trigger pusher
    const agenChatHistory: ChatHistoryInterface = {
        contactId: contact.id,
        content: output,
        role: 'assistant',
    }

    let agenChat = await createChat(agenChatHistory)
    const agenChatResource = await chatHistoryResource(agenChat)

    await pusher.trigger('chat-channel', 'new-message', agenChatResource)

    await sendWhatsapp(sender, output)

    return {
        status: 200,
        message: 'Message created succesfully',
        data: agenChatResource,
    }
})

const chatHistoryResource = async (chatHistory: any) => {
    return {
        ...chatHistory,
        contact: {
            ...chatHistory.contact,
            unreadCount: await countUnreadedChat(chatHistory.contactId),
        },
    }
}
