import { defineEventHandler, getQuery } from "h3";
import { destroy } from "~/repository/contactRepository";

export default defineEventHandler(async (event) => {
  const params = getRouterParams(event);

  const contact = await destroy( parseInt(params.contact)); 

  return {
    status: 200,
    message: 'Delete successfuly.',
  };

  
});