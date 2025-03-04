import { defineEventHandler, getQuery } from "h3";
import { update } from "~/repository/categoryRepository";
import { CategoryInterface } from "~/types/CategoryInterface";

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);
  const body = await readBody(event);

  const category: CategoryInterface = await update( parseInt(params.category), body); 

  return {
    status: 200,
    message: 'Update succesfully.',
    data: category,
  };

  
});