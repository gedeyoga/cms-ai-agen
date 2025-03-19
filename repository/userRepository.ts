import prisma from '~/services/prisma/client'
import type { MetaInterface } from '~/types/PaginationInterface'

export const find = async (id: string) => {
    return prisma.user.findFirst({
        where: {
            id: id,
        },
    })
}

export async function getUsersWithPagination(
    page: number,
    pageSize: number,
    search?: string
) {
    // Hitung offset

    const skip = (page - 1) * pageSize

    // Ambil data kategori dengan pagination
    const categories = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
        },
        skip,
        take: pageSize,
        where: {
            name: {
                contains: search,
            },
        },
        orderBy: { id: 'desc' }, // Urutkan berdasarkan tanggal terbaru (opsional)
    })

    // Hitung total kategori
    const total = await prisma.user.count()

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
}

export async function list(params: ListParams) {
    const categories = await prisma.user.findMany({
        where: {
            name: {
                contains: params.search,
            },
        },
        orderBy: {
            id: params.orderBy ? 'asc' : 'desc',
        },
    })

    return categories
}

export async function createUser(data: any) {
    const user = await prisma.user.create({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
        },
        data: {
            name: data.name,
            email: data.email,
            password: data.password,
            phone: data.phone,
        },
    })

    return user
}

export async function updateUser(id: string, data: any) {
    let dataForm: any = {
        name: data.name,
        email: data.email,
        phone: data.phone,
    }

    if(data.password ) {
        dataForm.password = data.password
    }

    const user = await prisma.user.update({
        where: {
            id: id,
        },
        data: dataForm,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            createdAt: true,
            updatedAt: true,
        }
    })

    return user
}

export async function destroyUser(id: string) {
    const user = await prisma.user.delete({
        where: {
            id: id,
        },
    })

    return user
}

export async function findUniqueEmail(
    email: string,
    userId: string | null = null
) {
    let user = null

    if (userId != null) {
        user = await prisma.user.findFirst({
            where: {
                phone: email,
                id: { not: userId }, // Pastikan tidak mengecek user yang sedang diedit
            },
        })
    } else {
        user = await prisma.user.findUnique({
            where: {
                email: email,
            },
        })
    }

    return user
}

export async function findUniquePhoneUser(phone: string) {
    const user = await prisma.user.findUnique({
        where: {
            phone: phone
        }
    })

    return user
}

export async function createOtpUser(userId: string, otp: string , expiredAt: string){

    await prisma.userOtp.deleteMany({
        where: {
            userId: userId,
        }
    });

    const userOtp = await prisma.userOtp.create({
        select: {
            userId: true,
            expiredAt: true,
            createdAt: true,
        },
        data: {
            userId: userId,
            otp: otp,
            expiredAt: expiredAt
        }
    })

    return userOtp
}

export async function findOtpUser(phone: string) {
    const userOtp = await prisma.userOtp.findFirst({
        where: {
            user: {
                phone: phone
            }
        },
        include: {
            user: true
        }
    })

    return userOtp
}