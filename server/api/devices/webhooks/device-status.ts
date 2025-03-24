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
import { findValidationToken } from '~/repository/userRegistrationRepository'
import { UserRegistrationInterface } from '~/types/UserRegistrationInterface'
import { createUser, findUniqueEmail } from '~/repository/userRepository'
import { generateBase64Token, passwordGenerator } from '~/shared/codeCreation'
import { findDeviceByPhone, updateDevice } from '~/repository/deviceRepository'

export default defineEventHandler(async (event) => {
    const formData =
        event.method == 'GET' ? getQuery(event) : await readBody(event)

    if (
        (event.method == 'GET' && !formData.hasOwnProperty('device')) ||
        (event.method == 'POST' && !formData.hasOwnProperty('device'))
    ) {
        return {
            status: 200,
            message: 'No data fetched!',
        }
    }

    const { device, status } =
        event.method == 'GET' ? getQuery(event) : await readBody(event)

    try {
        const data = {
            device,
            status,
        }

        const schema = z.object({
            device: z.string(),
            status: z.string(),
        })

        schema.parse(data)
    } catch (error: any) {
        return createError({
            status: 422,
            message: 'Validation error',
            data: error.errors,
        })
    }

    const deviceWhatsapp = await findDeviceByPhone(device)

    if (!deviceWhatsapp) {
        return createError({
            status: 404,
            message: 'Device not found',
        })
    }

    const newDeviceStatus = await updateDevice(deviceWhatsapp.id, {
        status: status == 'connect' ? true : false,
    })

    await pusher.trigger('device-channel', 'device-status', newDeviceStatus)

    return {
        status: 200,
        message: 'Message created succesfully',
        data: newDeviceStatus,
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
