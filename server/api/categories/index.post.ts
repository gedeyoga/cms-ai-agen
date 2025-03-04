import { defineEventHandler, getQuery } from "h3";
import { create, list } from "~/repository/categoryRepository";
import { CategoryInterface } from "~/types/CategoryInterface";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const response = await create(body); 

  return {
    status: 200,
    message: 'Create sucessfuly',
    data: response,
  };

  
});