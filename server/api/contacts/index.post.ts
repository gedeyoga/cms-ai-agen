import { defineEventHandler, getQuery } from 'h3'
import { z } from 'zod'
import { createContact, findUniquePhone } from '~/repository/contactRepository'

export default defineEventHandler(async (event) => {
    const { name, phone, categoryId, status } = await readBody(event)
    try {
        const data = {
            name,
            phone,
            status,
            categoryId,
        }

        const schema = z.object({
            name: z.string().min(2, 'Name minimum at leats 2 characters'),
            phone: z
                .string()
                .min(10, 'Phone must contain at least 10 character(s)')
                .max(16, 'Phone must contain at most 16 character(s)'),
            status: z.string().min(3, 'Status is required'),
            categoryId: z
                .array(z.number())
                .min(1, 'Category at least 1 category'),
        })
        schema.parse(data)

        const checkPhone = await findUniquePhone(phone)

        if (checkPhone != null) {
            return createError({
                status: 422,
                message: 'Phone is registered use another phone.',
            })
        }
    } catch (error: any) {
        return createError({
            status: 422,
            message: 'Validation error',
            data: error.errors,
        })
    }

    const response = await createContact({ name, phone, status }, categoryId)

    return {
        status: 200,
        message: 'Create sucessfuly',
        data: response,
    }
})
