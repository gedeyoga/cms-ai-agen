import axios from 'axios'
import FormData from 'form-data'
interface FonnteInterface {
    target: string
    url: string
    message: string
    schedule: string
    typing: string
    delay: string
    countryCode: string
}

export const fonnteAPi = process.env.FONNTE_API
export const fonnteToken = process.env.FONNTE_TOKEN

export const sendWhatsapp = async (
    target: string,
    message: string,
    deviceToken: string
) => {
    try {
        const data: FonnteInterface = {
            target: target,
            message: message,
            url: '',
            schedule: '0',
            typing: 'true',
            delay: '2',
            countryCode: '62',
        }

        const formData = new FormData()
        for (const key in data) {
            formData.append(key, data[key as keyof FonnteInterface])
        }

        const response = await axios.post(`${fonnteAPi}send`, formData, {
            headers: {
                Authorization: deviceToken,
                ...formData.getHeaders(),
            },
        })
        return response
    } catch (error) {
        return error
    }
}
