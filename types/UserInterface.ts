import '#auth' // Ganti dengan nama package yang memiliki Session
import type { ISODateString } from 'next-auth'
export interface UserInterface {
    id?: string | null
    name: string
    phone: string
    email: string
    password?: string | null
    createdAt?: Date | null
    updatedAt?: Date | null
}
declare module '#auth' {
    interface DefaultSession {
        user?: {
            name?: string | null
            email?: string | null
            image?: string | null
            companyId?: string | null
        }
        expires: ISODateString
    }
}
