import { defineEventHandler, getQuery } from 'h3'
import { createUser, findUniqueEmail } from '~/repository/userRepository'
import { z } from 'zod'

//@ts-ignore
import bcrypt from 'bcrypt'
import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
    const { name, email, password, phone } = await readBody(event)
    const session = await getServerSession(event)

    try {
        const data = {
            name,
            email,
            phone,
            password,
        }

        const schema = z.object({
            name: z.string().min(2, 'Name minimum at leats 2 characters'),
            email: z.string().min(2).email(),
            phone: z
                .string()
                .min(10, 'Phone must contain at least 10 character(s)')
                .max(16, 'Phone must contain at most 16 character(s)'),
            password: z.string().min(8),
        })
        schema.parse(data)

        const checkEmail = await findUniqueEmail(email)

        if (checkEmail != null) {
            return createError({
                status: 422,
                message: 'Email is registered use another phone.',
            })
        }
    } catch (error: any) {
        return createError({
            status: 422,
            message: 'Validation error',
            data: error.errors,
        })
    }

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)

    const response = await createUser({
        name,
        email,
        phone,
        company: {
            connect: {
                id: session?.user?.companyId,
            },
        },
        password: hashPassword,
    })

    return {
        status: 200,
        message: 'Create sucessfuly',
        data: response,
    }
})
