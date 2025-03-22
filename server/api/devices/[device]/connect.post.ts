import { defineEventHandler, getRouterParams } from 'h3'
import { findDevice } from '~/repository/deviceRepository'
import { connectDevice } from '~/services/fonnte/device'

export default defineEventHandler(async (event) => {
    const params = getRouterParams(event)

    const deviceWhatsapp = await findDevice(params.device)

    if (!deviceWhatsapp) {
        return createError({
            status: 404,
            message: 'Device not found',
        })
    }

    const response = await connectDevice(deviceWhatsapp.token)

    if (!response.status) {
        return createError({
            status: 500,
            message: 'Internal server error',
        })
    }

    return {
        status: 200,
        message: 'Qr code generated',
        data: {
            consent: response.consent,
            url: response.url,
        },
    }
})
