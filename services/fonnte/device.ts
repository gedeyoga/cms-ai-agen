import type {
    AddDeviceInterface,
    UpdateDeviceInterface,
} from './types/DeviceInterface'

const fonnteAPi = process.env.FONNTE_API
const fonnteToken = process.env.FONNTE_API_TOKEN

export const addDevice = async (device: AddDeviceInterface) => {
    try {
        const response = await fetch(`${fonnteAPi}add-device`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${fonnteToken}`,
            },
            body: JSON.stringify(device),
        })

        return await response.json()
    } catch (error) {
        return error
    }
}

export const updateDevice = async (
    deviceToken: string,
    device: UpdateDeviceInterface
) => {
    try {
        const response = await fetch(`${fonnteAPi}update-device`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${deviceToken}`,
            },
            body: JSON.stringify(device),
        })

        return await response.json()
    } catch (error) {
        return error
    }
}

export const deleteDevice = async (deviceToken: string, otp: number) => {
    try {
        const data = {
            otp: otp,
        }

        const response = await fetch(`${fonnteAPi}delete-device`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${deviceToken}`,
            },
            body: JSON.stringify(data),
        })

        return await response.json()
    } catch (error) {
        return error
    }
}

export const deviceProfile = async (deviceToken: string) => {
    try {
        const response = await fetch(`${fonnteAPi}device`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${deviceToken}`,
            },
        })

        return await response.json()
    } catch (error) {
        return error
    }
}

export const connectDevice = async (deviceToken: string) => {
    try {
        const response = await fetch(`${fonnteAPi}qr`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${deviceToken}`,
            },
        })

        return await response.json()
    } catch (error) {
        return error
    }
}

export const disconnectDevice = async (deviceToken: string) => {
    try {
        const response = await fetch(`${fonnteAPi}disconnect`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${deviceToken}`,
            },
        })

        return await response.json()
    } catch (error) {
        return error
    }
}
