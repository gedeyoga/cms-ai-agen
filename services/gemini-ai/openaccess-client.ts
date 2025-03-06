import axios from 'axios'

const base_url = process.env.OA_API
const headers = {
    Authorization: 'Bearer ' + process.env.OA_TOKEN,
    Accept: 'application/json',
}

export async function fetchProductDigitals() {
    // This mock API returns the requested lighting values
    const response = await axios.get(
        base_url +
            'konek/paket-addons?with=price&status=active&company_id=1&type=produk_digital',
        {
            headers: headers,
        }
    )

    return response.data.data
}

export async function orderProductDigital(
    name: string,
    phone: string,
    paket_addon_id: string,
    subscription_type: string,
    duration: number,
    user: number
) {
    const data = {
        name,
        phone,
        paket_addon_id,
        subscription_type,
        duration,
        user,
    }

    // This mock API returns the requested lighting values
    const response = await axios.post(base_url + 'konek/plus/pelanggan', data, {
        headers: headers,
    })
    return response
}
