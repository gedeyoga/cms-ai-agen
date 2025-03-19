// @ts-ignore
import bcrypt from 'bcrypt'

export const generateBase64Token = (length = 16) => {
    const randomBytes = new Uint8Array(length)
    crypto.getRandomValues(randomBytes)
    return btoa(String.fromCharCode(...randomBytes))
        .replace(/\+/g, '')
        .replace(/\//g, '')
        .replace(/=+$/, '') // URL-safe
}

export const generateOTP = (
    length: number = 6,
    alphanumeric: boolean = false
) => {
    const digits = '0123456789'
    const chars =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const source = alphanumeric ? chars : digits

    let otp = ''
    for (let i = 0; i < length; i++) {
        otp += source[Math.floor(Math.random() * source.length)]
    }

    return otp
}

export const passwordGenerator = async (password: string) => {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    return hashPassword
}
