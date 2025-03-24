import { defineEventHandler, getQuery } from 'h3'
import { z } from 'zod'
import { createDevice } from '~/repository/deviceRepository'
import { addDevice, updateDevice } from '~/services/fonnte/device'
export default defineEventHandler(async (event) => {
    const { name, device, personal, autoread, group } = await readBody(event)

    try {
        const data = { name, device, personal, autoread, group }

        const schema = z.object({
            name: z.string().min(2, 'Name is required'),
            device: z
                .string()
                .min(8, 'Phone minimum at leats 8 characters')
                .max(15, 'Phone maximum at most 15 characters'),
            personal: z.boolean().optional(),
            autoread: z.boolean().optional(),
            group: z.boolean().optional(),
        })

        schema.parse(data)
    } catch (error: any) {
        return createError({
            status: 422,
            message: 'Validation error',
            data: error.errors,
        })
    }

    const response = await addDevice({
        name,
        device,
        personal,
        autoread,
        group,
    })

    if (!response.status) {
        return createError({
            status: 500,
            message: response.reason
                ? response.reason
                : 'Internal server error',
        })
    }

    const { token } = response

    try {
        const responseUpdate = await updateDevice(token, {
            name,
            device,
            webhookconnect:
                process.env.BASE_URL + '/api/devices/webhooks/device-status',
            webhook: process.env.BASE_URL + '/api/chat/webhooks/fonnte',
        })
        console.log('response update webhook', responseUpdate)
    } catch (error) {
        console.log('error update webhook', error)
    }

    const deviceWhatsapp = await createDevice({
        name,
        device,
        personal,
        autoread,
        group,
        token,
        webhookConnect:
            process.env.BASE_URL + '/api/devices/webhooks/device-status',
        webhook: process.env.BASE_URL + '/api/chat/webhooks/fonnte',
    })

    return {
        status: 200,
        message: 'Create device sucessfuly',
        data: deviceWhatsapp,
    }
})
