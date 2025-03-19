import { defineEventHandler, getQuery } from 'h3'
import { z } from 'zod'
import {
    findUniqueEmail,
    findUniquePhoneUser,
} from '../../../repository/userRepository'
import { UserInterface } from '~/types/UserInterface'

//@ts-ignore
import bcrypt from 'bcrypt'
import moment from 'moment'
import { sendWhatsapp } from '~/services/gemini-ai/services/fonnteClient'
import { generateBase64Token } from '~/shared/codeCreation'
import { UserRegistrationInterface } from '~/types/UserRegistrationInterface'
import { UserRegistrationCreateInterface } from '~/types/UserRegistrationCreateInterface'
import { createUserRegistration } from '~/repository/userRegistrationRepository'

export default defineEventHandler(async (event) => {
    const { name, email, phone } = await readBody(event)

    try {
        const data = {
            phone: phone,
            name: name,
            email: email,
        }

        const schema = z.object({
            phone: z
                .string()
                .min(10, 'Phone must contain at least 10 character(s)')
                .max(16, 'Phone must contain at most 16 character(s)'),
            name: z.string().min(2, 'Name is required'),
            email: z.string().min(2, 'Email is required').email(),
        })
        schema.parse(data)
    } catch (error: any) {
        return createError({
            status: 422,
            message: 'Validation error',
            data: error.errors,
        })
    }

    const userPhone = await findUniquePhoneUser(phone)

    if (userPhone) {
        return createError({
            status: 422,
            message: 'Validation error',
            data: [
                {
                    code: 'not_found',
                    message: 'Phone already registered',
                    path: ['phone'],
                },
            ],
        })
    }

    const userEmail = await findUniqueEmail(email)

    if (userEmail) {
        return createError({
            status: 422,
            message: 'Validation error',
            data: [
                {
                    code: 'not_found',
                    message: 'Email already registered',
                    path: ['email'],
                },
            ],
        })
    }

    const dataRegis: UserRegistrationCreateInterface = {
        name: name,
        email: email,
        phone: phone,
        validationToken: generateBase64Token(41),
    }

    const regisUser = await createUserRegistration(dataRegis)

    return {
        statusCode: 200,
        message: 'Register successfuly',
        data: {
            validationToken: 'registration:' + regisUser.validationToken,
            redirectPhone: process.env.FONNTE_DEVICE_WA,
        },
    }
})
