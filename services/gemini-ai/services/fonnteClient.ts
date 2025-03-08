import axios from 'axios'
import FormData from 'form-data'
const base_url = process.env.FONNTE_API
const token = process.env.FONNTE_TOKEN

interface FonnteInterface {
    target: string
    url: string
    message: string
    schedule: string
    typing: string
    delay: string
    countryCode: string
}

export const sendWhatsapp = async (target: string, message: string) => {
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

    const headers = {
        Authorization: token,
        ...formData.getHeaders(),
    }

    const response = await axios.post(base_url + 'send', formData, {
        headers: headers,
    })

    return response
}
