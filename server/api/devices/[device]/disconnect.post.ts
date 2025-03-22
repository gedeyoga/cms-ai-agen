import { defineEventHandler, getRouterParams } from 'h3'
import { findDevice, updateDevice } from '~/repository/deviceRepository'
import { disconnectDevice } from '~/services/fonnte/device'

export default defineEventHandler(async (event) => {
    const params = getRouterParams(event)

    const deviceWhatsapp = await findDevice(params.device)

    if (!deviceWhatsapp) {
        return createError({
            status: 404,
            message: 'Device not found',
        })
    }

    const response = await disconnectDevice(deviceWhatsapp.token)

    if (!response.status) {
        return createError({
            status: 500,
            message: 'Internal server error',
        })
    }

    const device = await updateDevice(deviceWhatsapp.id, {
        status: false,
    })

    return {
        status: 200,
        message: 'Device disconnected',
    }
})
