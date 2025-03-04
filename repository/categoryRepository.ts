import prisma from "~/services/prisma/client";
import type { MetaInterface, PaginationInterface } from "~/types/PaginationInterface";

export const find = async (id: number) => {
  return prisma.category.findFirst({
    where: {
        id: id,
    }
  });
};

export async function getCategoriesWithPagination(page: number, pageSize:number, search?: string ) {
    // Hitung offset

    const skip = (page - 1) * pageSize;

    // Ambil data kategori dengan pagination
    const categories = await prisma.category.findMany({
      skip,
      take: pageSize,
      where: {
        name: {
            contains: search,
        }
      },
      orderBy: { id: "desc" }, // Urutkan berdasarkan tanggal terbaru (opsional)
    });
  
    // Hitung total kategori
    const total = await prisma.category.count();
  
    // Hitung total halaman
    const totalPages = Math.ceil(total / pageSize);

    const meta:MetaInterface = {
        currentPage: page,
        pageSize,
        total,
        totalPages,
    } 
  
    return {
      data: categories,
      meta,
    };
  }

  interface ListParams {
    search?: string,
    orderBy?: string,
  }

  export async function list(params: ListParams ) {
    const categories =  await prisma.category.findMany({
        where: {
            name: {
                contains: params.search,
            }
        },
        orderBy: {
            id: params.orderBy
        }
    })

    return categories;
  }

  export async function create(data: any) {
    const category = await prisma.category.create({
      data: {
        name: data.name
      }
    });

    return category;
  }

  export async function update(id: number, data: any) {
    const category = await prisma.category.update({
        where: {
          id: id,
        },
        data: {
            name: data.name
        },
      })

    return category;
  }

  export async function destroy(id: number) {
    const category = await prisma.category.delete({
        where: {
          id: id,
        }
      })

    return category;
  }