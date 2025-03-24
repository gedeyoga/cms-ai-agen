import type { CategoryInterface } from './CategoryInterface'
import type { ChatHistoryInterface } from './ChatHistoryInterface'

export interface ContactInterface {
    id?: number | null
    companyId?: string | null | undefined
    phone: string
    name: string
    status: string
    categories?: CategoryInterface[]
    chatHistories?: ChatHistoryInterface[]
    unreadCount?: number
    createdAt?: Date | null
    updatedAt?: Date | null
}
