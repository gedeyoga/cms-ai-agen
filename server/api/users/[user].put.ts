import { defineEventHandler, getQuery } from 'h3'
import { z } from 'zod'
import { updateUser, findUniqueEmail } from '~/repository/userRepository'
//@ts-ignore
import bcrypt from 'bcrypt'

export default defineEventHandler(async (event) => {
    const params = getRouterParams(event)

    let { name, phone, email, password } = await readBody(event)
    let data = {
        name,
        phone,
        password,
        email,
    }

    try {
        const schema = z.object({
            name: z.string().min(2, 'Name minimum at leats 2 characters'),
            email: z.string().min(2).email(),
            phone: z
                .string()
                .min(10, 'Phone must contain at least 10 character(s)')
                .max(16, 'Phone must contain at most 16 character(s)'),
            password: z
                .string()
                .optional()
                .refine((value) => {
                    return !value || value.length >= 8
                }),
        })

        const checkEmail = await findUniqueEmail(email, params.user)

        if (checkEmail != null) {
            return createError({
                status: 422,
                message: 'Email is registered use another email',
            })
        }

        schema.parse(data)
    } catch (error: any) {
        return createError({
            status: 422,
            message: 'Validation error',
            data: error.errors,
        })
    }

    if (password) {
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        password = hashPassword
    }

    const response = await updateUser(params.user, {
        name,
        email,
        password,
        phone,
    })

    return {
        status: 200,
        message: 'Update sucessfuly',
        data: response,
    }
})
