import prisma from "~/services/prisma/client";
import type { MetaInterface, PaginationInterface } from "~/types/PaginationInterface";

export const find = async (id: number) => {
  return prisma.contact.findFirst({
    where: {
        id: id,
    }
  });
};

export async function getContactsWithPagination(page: number, pageSize:number, search?: string ) {
    // Hitung offset

    const skip = (page - 1) * pageSize;

    // Ambil data kategori dengan pagination
    const contacts = await prisma.contact.findMany({
      skip,
      take: pageSize,
      include: {
        categories: {
          include: {
            category: true, // Ambil detail Role dari UserRole
          },
        },
      },
      where: {
        name: {
            contains: search,
        }
      },
      orderBy: { id: "desc" }, // Urutkan berdasarkan tanggal terbaru (opsional)
    });
  
    // Hitung total kategori
    const total = await prisma.contact.count();
  
    // Hitung total halaman
    const totalPages = Math.ceil(total / pageSize);

    const meta:MetaInterface = {
        currentPage: page,
        pageSize,
        total,
        totalPages,
    } 
  
    return {
      data: contacts.map((contact: any) => {
        contact.categories = contact.categories.map((item: any) => item.category);
        return contact;
      }),
      meta,
    };
  }

  interface ListParams {
    search?: string,
    orderBy?: string,
  }

  export async function list(params: ListParams ) {
    const contacts =  await prisma.contact.findMany({
        include: {
          categories: true,
        },
        where: {
            name: {
                contains: params.search,
            }
        },
        orderBy: {
            id: params.orderBy
        }
    })

    return contacts;
  }

  export async function create(data: any , categoryId = []) {

    const contact = await prisma.contact.create({
      data: {
        name: data.name,
        phone: data.phone,
        categories: {
          create: categoryId.map((item) => {
            return {
              categoryId: item,
            }
          })
        }
      }
    });

    return contact;
  }

  export async function update(id: number, data: any , categoryId = []) {

    await prisma.contactCategory.deleteMany({
      where: {
        contactId: id,
      }
    });

    const contact = await prisma.contact.update({
        where: {
          id: id,
        },
        data: {
            name: data.name,
            phone: data.phone,
            categories: {
              create: categoryId.map((item) => {
                return {
                  categoryId: item,
                }
              })
            }
        },
      })

    return contact;
  }

  export async function destroy(id: number) {
    const contact = await prisma.contact.delete({
        where: {
          id: id,
        }
      })

    return contact;
  }

  export async function findUniquePhone(phone: string , contactId: number | null = null){
    
    let contact = null;

    if(contactId != null) {
      contact = await prisma.contact.findFirst({
        where: {
          phone: phone,
          id: { not: contactId }, // Pastikan tidak mengecek user yang sedang diedit
        },
      })
    }else {
      contact = await prisma.contact.findUnique({
        where: {
          phone: phone,
        }
      })
    }

    return contact;
  }