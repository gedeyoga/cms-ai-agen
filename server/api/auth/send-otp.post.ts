import { defineEventHandler, getQuery } from 'h3'
import { z } from 'zod'
import { createOtpUser, findUniquePhoneUser } from '../../../repository/userRepository'
import { UserInterface } from '~/types/UserInterface'

//@ts-ignore
import bcrypt from 'bcrypt'
import moment from 'moment'
import { sendWhatsapp } from '~/services/gemini-ai/services/fonnteClient'

export default defineEventHandler(async (event) => {
    const { phone } = await readBody(event)

    try {
        const data = {
            phone: phone
        }

        const schema = z.object({
            phone: z.string().min(10, 'Phone must contain at least 10 character(s)').max(16, 'Phone must contain at most 16 character(s)')
        })
        schema.parse(data)

    } catch (error: any) {
        return createError({
            status: 422,
            message: 'Validation error',
            data: error.errors,
        })
    }

    const user = await findUniquePhoneUser(phone)

    if(!user) {
        return createError({
            status: 422,
            message: 'Validation error',
            data: [
                {
                    code: 'not_found',
                    message: 'Phone is not registered',
                    path: ['phone'],
                }
            ]
        })
    }

    const otp = generateOTP(5)
    const expiredAt = moment().add(5, 'minutes').toISOString();

    const salt = await bcrypt.genSalt(10)
    const hashedOtp = await bcrypt.hash(otp, salt);
    
    const userOtp = await createOtpUser(user.id, hashedOtp, expiredAt)

    await sendWhatsapp(user.phone, 'Your OTP code is ' + otp + '')

    return {
        statusCode: 200,
        message: 'OTP Send sucessfuly',
        data: {
            ...user,
            userOtp: userOtp, 
        }
    }
    


})


const generateOTP = (length : number = 6, alphanumeric: boolean = false) => {
    const digits = '0123456789';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const source = alphanumeric ? chars : digits;
    
    let otp = '';
    for (let i = 0; i < length; i++) {
        otp += source[Math.floor(Math.random() * source.length)];
    }

    return otp;
}