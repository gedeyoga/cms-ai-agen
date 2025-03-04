import { defineEventHandler, getQuery } from "h3";
import { destroy } from "~/repository/categoryRepository";
import { CategoryInterface } from "~/types/CategoryInterface";

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);

  const category = await destroy( parseInt(params.category)); 

  return {
    status: 200,
    message: 'Delete successfuly.',
  };

  
});