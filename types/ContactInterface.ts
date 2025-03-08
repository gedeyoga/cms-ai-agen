import type { CategoryInterface } from './CategoryInterface'
import type { ChatHistoryInterface } from './ChatHistoryInterface'

export interface ContactInterface {
    id?: number | null
    phone: string
    name: string
    status: string
    categories?: CategoryInterface[]
    chatHistories?: ChatHistoryInterface[]
    createdAt?: Date | null
    updatedAt?: Date | null
}
