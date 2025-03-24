import type { Prisma } from '@prisma/client'
import prisma from '~/services/prisma/client'
import type { MetaInterface } from '~/types/PaginationInterface'

export const find = async (id: number) => {
    return prisma.category.findFirst({
        where: {
            id: id,
        },
    })
}

interface PaginationParamsinterface {
    companyId: string | null | undefined
}

export async function getCategoriesWithPagination(
    page: number,
    pageSize: number,
    search?: string,
    params?: PaginationParamsinterface
) {
    //Check Params
    let where: any = {}
    if (params?.companyId) {
        where['companyId'] = params.companyId
    }

    // Hitung offset
    const skip = (page - 1) * pageSize

    // Ambil data kategori dengan pagination
    const categories = await prisma.category.findMany({
        skip,
        take: pageSize,
        where: {
            name: {
                contains: search,
            },
            ...where,
        },
        orderBy: { id: 'desc' }, // Urutkan berdasarkan tanggal terbaru (opsional)
    })

    // Hitung total kategori
    const total = await prisma.category.count()

    // Hitung total halaman
    const totalPages = Math.ceil(total / pageSize)

    const meta: MetaInterface = {
        currentPage: page,
        pageSize,
        total,
        totalPages,
    }

    return {
        data: categories,
        meta,
    }
}

interface ListParams {
    search?: string
    orderBy?: string
    companyId?: string
}

export async function list(params: ListParams) {
    const categories = await prisma.category.findMany({
        where: {
            name: {
                contains: params.search,
            },
            companyId: params.companyId,
        },
        orderBy: {
            id: params.orderBy ? 'asc' : 'desc',
        },
    })

    return categories
}

export async function createCategory(data: Prisma.CategoryCreateInput) {
    const category = await prisma.category.create({
        data: data,
    })

    return category
}

export async function updateCategory(
    id: number,
    data: Prisma.CategoryUpdateInput
) {
    const category = await prisma.category.update({
        where: {
            id: id,
        },
        data: data,
    })

    return category
}

export async function destroyCategory(id: number) {
    const category = await prisma.category.delete({
        where: {
            id: id,
        },
    })

    return category
}
