<script setup lang="ts">
import type { ContactInterface } from '~/types/ContactInterface'
import { Input } from '../ui/input'
import ListMessage from './ListMessage.vue'
import type { MessageInterface } from '~/types/MessageInterface'
import { Icon } from '@iconify/vue'
import { useChatState } from '~/composables/chatState'
import SidebarChatSkeleton from './SidebarChatSkeleton.vue'
import { useVirtualList } from '@vueuse/core'
const { $pusher } = useNuxtApp()

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
    setIncomingChat,
    markChatRead,
} = useChatState()
let loading = ref<boolean>(false)
let hasMoreData = ref(true)
let currentPage = ref(1)
let containerRef = ref<HTMLElement | null>(null)

// Virtual list setup
const itemHeight = 65 // Estimated height of each chat item in pixels
const { list, containerProps, wrapperProps } = useVirtualList(messages, {
    itemHeight,
    overscan: 11, // Number of extra items to render above/below the visible area
})

const setLoading = (val: boolean) => {
    loading.value = val
}

const fetchData = async (page = 1, append = false) => {
    if (!hasMoreData.value) return
    setLoading(true)
    const response: any = await $fetch('/api/contacts', {
        query: {
            search: search.value,
            per_page: 10,
            page: page,
        },
    })

    setLoading(false)

    if (response.status === 200) {
        const newContacts = response.data
        if (newContacts.length < 10) {
            hasMoreData.value = false
        }

        if (append) {
            contacts.value = [...contacts.value, ...newContacts]
            setMessages([
                ...messages.value,
                ...newContacts.map((item: ContactInterface) => ({
                    contactId: item.id,
                    name: item.name,
                    image: '/images/default-user.png',
                    message: item.chatHistories?.[0]?.content || '-',
                    createdAt: item.chatHistories?.[0]?.createdAt || '-',
                    unreadCount: item.unreadCount,
                    role: item.chatHistories?.[0]?.role || '-',
                })),
            ])
        } else {
            contacts.value = newContacts
            setMessages(
                newContacts.map((item: ContactInterface) => ({
                    contactId: item.id,
                    name: item.name,
                    image: '/images/default-user.png',
                    message: item.chatHistories?.[0]?.content || '-',
                    createdAt: item.chatHistories?.[0]?.createdAt || '-',
                    unreadCount: item.unreadCount,
                    role: item.chatHistories?.[0]?.role || '-',
                }))
            )
        }
    }
}

const loadMoreData = async () => {
    if (!hasMoreData.value || loading.value) return
    currentPage.value++
    await fetchData(currentPage.value, true)
}

const onScroll = (e: Event) => {
    const target = e.target as HTMLElement
    const { scrollTop, scrollHeight, clientHeight } = target

    // Check if we've scrolled near the bottom
    if (scrollHeight - (scrollTop + clientHeight) < 100) {
        loadMoreData()
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

        let unreadCount = val.contact?.unreadCount ?? 0

        if (chatActive.value) {
            unreadCount =
                chatActive.value.contactId == val.contactId ? 0 : unreadCount
        }

        // Add new message to the beginning of the list
        const newMessage = {
            contactId: val.contactId,
            name: val.contact?.name ?? '',
            image: '/images/default-user.png',
            message: val.content,
            createdAt: val.createdAt ?? '',
            unreadCount: unreadCount,
            role: val.role,
        }

        setMessages([newMessage, ...messages.value])
    }
})

const listMessageClicked = async (message: MessageInterface, index: number) => {
    let contact = contacts.value.find(
        (contact: ContactInterface) => contact.id == message.contactId
    )
    if (contact) {
        if (message.unreadCount > 0) {
            markChatRead(contact.id)
        }
        setChatActive(message)
        setContactActive(contact)
        openMessage(true)
    }
}

const searchData = () => {
    currentPage.value = 1
    hasMoreData.value = true
    fetchData()
}

const clearSearch = () => {
    search.value = ''
    fetchData()
}

onMounted(async () => {
    const channel = $pusher.subscribe('chat-channel')
    channel.bind('new-message', (data: ChatHistoryInterface) => {
        setIncomingChat(data)
    })

    await fetchData()
})
</script>

<template>
    <div class="flex flex-col max-w-[300px] w-full h-full">
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
            v-bind="containerProps"
            class="overflow-y-auto px-3"
            @scroll="onScroll"
        >
            <div v-bind="wrapperProps">
                <template v-for="item in list" :key="item.index">
                    <SidebarChatSkeleton
                        v-if="loading && item.index === messages.length - 1"
                    ></SidebarChatSkeleton>
                    <ListMessage
                        v-else
                        :name="item.data.name"
                        :message="item.data.message"
                        :image="item.data.image"
                        :created-at="item.data.createdAt"
                        :unread-count="item.data.unreadCount"
                        :role="item.data.role"
                        :clicked="chatActive?.contactId === item.data.contactId"
                        @onClick="listMessageClicked(item.data, item.index)"
                    />
                </template>
            </div>
        </div>
    </div>
</template>
