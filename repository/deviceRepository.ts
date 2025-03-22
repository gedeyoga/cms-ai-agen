import type { Prisma } from '@prisma/client'
import prisma from '~/services/prisma/client'
import type { MetaInterface } from '~/types/PaginationInterface'

type DeviceWhatsappCreateInput = Prisma.DeviceWhatsappCreateInput
type DeviceWhatsappUpdateInput = Prisma.DeviceWhatsappUpdateInput

export const findDevice = async (id: string) => {
    return prisma.deviceWhatsapp.findFirst({
        where: {
            id: id,
        },
    })
}

export async function getDevicesWithPagination(
    page: number,
    pageSize: number,
    search?: string
) {
    // Hitung offset

    const skip = (page - 1) * pageSize

    // Ambil data kategori dengan pagination
    const devices = await prisma.deviceWhatsapp.findMany({
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
    const total = await prisma.deviceWhatsapp.count()

    // Hitung total halaman
    const totalPages = Math.ceil(total / pageSize)

    const meta: MetaInterface = {
        currentPage: page,
        pageSize,
        total,
        totalPages,
    }

    return {
        data: devices,
        meta,
    }
}

interface ListParams {
    search?: string
    orderBy?: string
}

export async function list(params: ListParams) {
    const devices = await prisma.deviceWhatsapp.findMany({
        where: {
            name: {
                contains: params.search,
            },
        },
        orderBy: {
            id: params.orderBy ? 'asc' : 'desc',
        },
    })

    return devices
}

export async function createDevice(data: DeviceWhatsappCreateInput) {
    const device = await prisma.deviceWhatsapp.create({
        data: data,
    })

    return device
}

export async function updateDevice(
    id: string,
    data: DeviceWhatsappUpdateInput
) {
    const device = await prisma.deviceWhatsapp.update({
        where: {
            id: id,
        },
        data: data,
    })

    return device
}

export async function destroyDevice(id: string) {
    const device = await prisma.deviceWhatsapp.delete({
        where: {
            id: id,
        },
    })

    return device
}

export const findDeviceByPhone = async (phone: string) => {
    return prisma.deviceWhatsapp.findFirst({
        where: {
            device: phone,
        },
    })
}
