import { ref } from 'vue'
import type { ChatHistoryInterface } from '~/types/ChatHistoryInterface'
import type { ContactInterface } from '~/types/ContactInterface'
import type { MessageInterface } from '~/types/MessageInterface'

let incomingChat = ref<ChatHistoryInterface>()
let messageOpen = ref<boolean>(false)
let chatActive = ref<MessageInterface>()
let contactActive = ref<ContactInterface>()
let messages = ref<MessageInterface[]>([])

export function useChatState() {
    const setIncomingChat = (chat: ChatHistoryInterface) => {
        incomingChat.value = chat
    }

    const openMessage = (val: boolean) => {
        messageOpen.value = val
    }

    const setChatActive = (val: MessageInterface) => {
        chatActive.value = val
    }

    const setContactActive = (val: ContactInterface) => {
        contactActive.value = val
    }

    const setMessages = (val: MessageInterface[]) => {
        messages.value = val
    }

    const markChatRead = async (contactId: number) => {
        const response: any = await $fetch('/api/chat/read-chat', {
            method: 'POST',
            body: {
                contactId: contactId
            },
        })
    
        if (response.status == 200) {
            messages.value = messages.value.map((item: MessageInterface) => {
                if(item.contactId == contactId) {
                    item.unreadCount = 0;
                }
                return item;
            });
        }
    }

    return {
        incomingChat,
        setIncomingChat,
        openMessage,
        setChatActive,
        chatActive,
        messageOpen,
        setContactActive,
        contactActive,
        messages,
        setMessages,
        markChatRead
    }
}
