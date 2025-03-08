import type { ContactInterface } from './ContactInterface'

export interface ChatHistoryInterface {
    id?: number
    contactId: number
    role: string
    content: string
    createdAt?: string
    updatedAt?: string

    contact?: ContactInterface | undefined
}
