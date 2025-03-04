import { defineEventHandler, getQuery } from "h3";
import { z } from "zod";
import { update , findUniquePhone } from "~/repository/contactRepository";
import { ContactInterface } from "~/types/ContactInterface";

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);

  const { name , phone, categoryId } = await readBody(event);
  const data = {
    name,
    phone,
    categoryId
  }
    try {
  
      const schema = z.object({
        name: z.string().min(2, 'Name minimum at leats 2 characters'),
        phone: z.string().min(10, 'Phone minimum at least 10 characters'),
        categoryId: z.array(z.number()).min(1, 'Category at least 1 category'),
      })
  
      const checkPhone = await findUniquePhone(phone , parseInt(params.contact));
  
      if(checkPhone != null){
        return createError({
          status: 422,
          message: "Phone is registered use another phone.",
        })
      }
  
    } catch (error: any) {
      return createError({
        status: 422,
        message: "Validation error",
        data: error.errors,
      })
    }
  
    const response = await update( parseInt(params.contact) , {name, phone} , categoryId); 
  
    return {
      status: 200,
      message: 'Update sucessfuly',
      data: response,
    };

  
});