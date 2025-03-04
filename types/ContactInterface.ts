import type { CategoryInterface } from "./CategoryInterface";

export interface ContactInterface {
    id?: number | null,
    phone: string,
    name: string | null,
    categories: CategoryInterface[],
    createdAt?: Date | null,
    updatedAt?: Date | null,
}