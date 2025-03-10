<script setup lang="ts">
import type { ContactInterface } from '~/types/ContactInterface'
import { Input } from '../ui/input'
import ListMessage from './ListMessage.vue'
import type { MessageInterface } from '~/types/MessageInterface'
import { Icon } from '@iconify/vue'
import { useChatState } from '~/composables/chatState'
import SidebarChatSkeleton from './SidebarChatSkeleton.vue'

let contacts = ref<ContactInterface[]>([])
let search = ref('')
const {
    incomingChat,
    openMessage,
    setChatActive,
    chatActive,
    setContactActive,
    messages,
    setMessages,
} = useChatState()
let loading = ref<boolean>(false)

const setLoading = (val: boolean) => {
    loading.value = val
}

const fetchData = async () => {
    setLoading(true)
    const response: any = await $fetch('/api/contacts', {
        query: {
            search: search.value,
            per_page: 10,
            page: 1,
        },
    })

    setLoading(false)

    if (response.status == 200) {
        setMessages(
            response.data.map((item: ContactInterface) => {
                const chatHistory = item.chatHistories
                    ? item.chatHistories.length > 0
                        ? item.chatHistories[0]
                        : null
                    : null

                return {
                    contactId: item.id,
                    name: item.name,
                    image: '/images/default-user.png',
                    message: chatHistory ? chatHistory.content : '-',
                    createdAt: chatHistory ? chatHistory.createdAt : '-',
                    unreadCount: item.unreadCount,
                    role: chatHistory ? chatHistory.role : '-',
                }
            })
        )
        contacts.value = response.data
    }
}

watch(incomingChat, (val) => {
    if (val) {
        const index = messages.value.findIndex(
            (message) => message.contactId == val.contactId
        )
        if (index >= 0) {
            messages.value.splice(index, 1)
        }

        messages.value.unshift({
            contactId: val.contactId,
            name: val.contact?.name ?? '',
            image: '/images/default-user.png',
            message: val.content,
            createdAt: val.createdAt ?? '',
            unreadCount: val.contact?.unreadCount ?? 0,
            role: val.role,
        })
    }
})

const listMessageClicked = (message: MessageInterface, index: number) => {
    setChatActive(message)
    setContactActive(contacts.value[index])
    openMessage(true)
}

const searchData = () => {
    fetchData()
}

const clearSearch = () => {
    search.value = ''
    fetchData()
}

await fetchData()
</script>

<template>
    <div class="flex flex-col max-w-[300px] w-full">
        <div class="px-5 py-7 w-full">
            <h2 class="text-xl mb-5">Chats</h2>
            <div class="relative w-full max-w-sm items-center">
                <Input
                    @keyup.enter="searchData"
                    :autocomplete="false"
                    v-model="search"
                    type="text"
                    placeholder="Search message..."
                    class="block px-7"
                />
                <span
                    class="absolute start-0 inset-y-0 flex items-center justify-center px-2"
                >
                    <Icon icon="mdi:search" :ssr="true"></Icon>
                </span>
                <span
                    v-if="search"
                    class="absolute end-0 inset-y-0 flex items-center justify-center px-2"
                >
                    <button
                        @click="clearSearch"
                        class="p-1 rounded-full bg-gray-900 hover:bg-gray-800"
                    >
                        <Icon
                            class="text-xs"
                            icon="mdi:close"
                            :ssr="true"
                        ></Icon>
                    </button>
                </span>
            </div>
        </div>

        <div
            v-if="loading"
            class="space-y-4 overflow-y-auto scroll-smooth h-full overflow-hidden px-3"
        >
            <SidebarChatSkeleton></SidebarChatSkeleton>
        </div>

        <div
            v-else
            class="space-y-1 overflow-y-auto scroll-smooth h-full overflow-hidden px-3"
        >
            <ListMessage
                v-for="(message, key) in messages"
                :key="key"
                :name="message.name"
                :message="message.message"
                :image="message.image"
                :created-at="message.createdAt"
                :unread-count="message.unreadCount"
                :role="message.role"
                :clicked="chatActive?.contactId === message.contactId"
                @onClick="listMessageClicked(message, key)"
            ></ListMessage>
        </div>
    </div>
</template>
