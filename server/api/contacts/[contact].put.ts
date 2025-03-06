import { defineEventHandler, getQuery } from 'h3'
import { z } from 'zod'
import { updateContact, findUniquePhone } from '~/repository/contactRepository'

export default defineEventHandler(async (event) => {
    const params = getRouterParams(event)

    const { name, phone, categoryId, status } = await readBody(event)
    const data = {
        name,
        phone,
        categoryId,
        status,
    }
    try {
        const schema = z.object({
            name: z.string().min(2, 'Name minimum at leats 2 characters'),
            phone: z.string().min(10, 'Phone minimum at least 10 characters'),
            status: z.string().min(3, 'Status is required'),
            categoryId: z
                .array(z.number())
                .min(1, 'Category at least 1 category'),
        })

        const checkPhone = await findUniquePhone(
            phone,
            parseInt(params.contact)
        )

        if (checkPhone != null) {
            return createError({
                status: 422,
                message: 'Phone is registered use another phone.',
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

    const response = await updateContact(
        parseInt(params.contact),
        { name, phone, status },
        categoryId
    )

    return {
        status: 200,
        message: 'Update sucessfuly',
        data: response,
    }
})
