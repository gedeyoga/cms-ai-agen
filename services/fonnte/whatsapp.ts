interface FonnteInterface {
    target: string
    url: string
    message: string
    schedule: string
    typing: string
    delay: string
    countryCode: string
}

const fonnteAPi = process.env.FONNTE_API

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

        const response = await fetch(`${fonnteAPi}send`, {
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
