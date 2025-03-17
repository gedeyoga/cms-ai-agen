export interface UserInterface {
    id?: string | null
    name: string
    phone: string
    email: string
    password?: string | null
    createdAt?: Date | null
    updatedAt?: Date | null
}
