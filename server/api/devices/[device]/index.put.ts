import { defineEventHandler, getRouterParams, readBody } from 'h3'
import {
    destroyDevice,
    findDevice,
    updateDevice as updateDeviceRepo,
} from '~/repository/deviceRepository'
import { deleteDevice, updateDevice } from '~/services/fonnte/device'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
    const params = getRouterParams(event)
    const body = await readBody(event)

    try {
        const schema = z.object({
            name: z
                .string()
                .min(2, 'Name is required')
                .max(30, 'Name maximum at most 30 characters'),
            device: z
                .string()
                .min(8, 'Phone minimum at leats 8 characters')
                .max(15, 'Phone maximum at most 15 characters'),
            autoread: z.boolean().optional(), //activate autoread chat feature, boolean
            personal: z.boolean().optional(), //autoread personal chat, boolean
            group: z.boolean().optional(), //autoread group chat, boolean
            quick: z.boolean().optional(), //autoread self chat, boolean
            resend: z.boolean().optional(), //forward incoming attachment, boolean
            // target: z.string().optional() //target number for resend feature, string
        })

        schema.parse(body)
    } catch (error: any) {
        return createError({
            status: 422,
            message: 'Validation error',
            data: error.errors,
        })
    }

    const deviceWhatsapp = await findDevice(params.device)

    if (!deviceWhatsapp) {
        return createError({
            status: 404,
            message: 'Device not found',
        })
    }

    const response = await updateDevice(deviceWhatsapp.token, {
        name: body.name,
        device: body.device,
        autoread: body.autoread,
        personal: body.personal,
        group: body.group,
        quick: body.quick,
        resend: body.resend,
    })

    if (!response.status) {
        return createError({
            status: response.reason ? 422 : 500,
            message: 'Validation error',
            data: [
                {
                    code: 'not_found',
                    message: response.reason
                        ? response.reason
                        : 'Internal server error',
                    path: ['otp'],
                },
            ],
        })
    }

    if (response.detail == 'otp sent') {
        return {
            status: 200,
            message: 'OTP sent to your device',
        }
    }

    const device = await updateDeviceRepo(params.device, {
        name: body.name,
        device: body.device,
        autoread: body.autoread,
        personal: body.personal,
        group: body.group,
        quick: body.quick,
        resend: body.resend,
    })

    return {
        status: 200,
        message: 'Update device successfuly.',
        data: device,
    }
})
