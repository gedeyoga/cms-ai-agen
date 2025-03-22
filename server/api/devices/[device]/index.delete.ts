import { defineEventHandler, getRouterParams, readBody } from 'h3'
import { destroyDevice, findDevice } from '~/repository/deviceRepository'
import { deleteDevice } from '~/services/fonnte/device'
import { z } from 'zod'

export default defineEventHandler(async (event) => {
    const params = getRouterParams(event)
    const body = await readBody(event)

    try {
        const schema = z.object({
            otp: z.number().optional(),
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

    const response = await deleteDevice(deviceWhatsapp.token, body.otp)

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

    const device = await destroyDevice(params.device)

    return {
        status: 200,
        message: 'Delete successfuly.',
    }
})
