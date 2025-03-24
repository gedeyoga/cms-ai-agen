import prisma from '~/services/prisma/client'
import { Prisma } from '@prisma/client'

export const findCompany = async (id: string) => {
    return prisma.company.findFirst({
        where: {
            id: id,
        },
    })
}

export async function createCompany(data: Prisma.CompanyCreateInput) {
    const company = await prisma.company.create({
        data: data,
    })

    return company
}

export async function updateCompany(
    id: string,
    data: Prisma.CompanyUpdateInput
) {
    const company = await prisma.company.update({
        where: {
            id: id,
        },
        data: data,
    })

    return company
}

export async function destroyCompany(id: string) {
    const company = await prisma.company.delete({
        where: {
            id: id,
        },
    })

    return company
}
