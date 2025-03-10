import { ref } from 'vue'
import type { ChatHistoryInterface } from '~/types/ChatHistoryInterface'
import type { ContactInterface } from '~/types/ContactInterface'

let contact = ref<ContactInterface>()
let showDetailChat = ref<boolean>(false)
let chatHistories = ref<ChatHistoryInterface[]>([])

export function useDetailChatState() {
    const toggleDetailContact = (val: boolean) => {
        showDetailChat.value = val
    }

    const setContact = (val: ContactInterface) => {
        contact.value = val
    }

    const setChatHistories = (val: ChatHistoryInterface[]) => {
        chatHistories.value = val
    }

    return {
        contact,
        showDetailChat,
        toggleDetailContact,
        setContact,
        setChatHistories,
        chatHistories,
    }
}
