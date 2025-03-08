<script setup lang="ts">
import type { ContactInterface } from '~/types/ContactInterface'
import { Input } from '../ui/input'
import ListMessage from './ListMessage.vue'
import type { MessageInterface } from '~/types/MessageInterface'
import { Icon } from '@iconify/vue'

let messages = ref<MessageInterface[]>([])
let contacts = ref<ContactInterface[]>([])
let search = ref('')
let messageActive = ref<MessageInterface>()

const fetchData = async () => {
    const response: any = await $fetch('/api/contacts', {
        query: {
            search: search.value,
            per_page: 10,
            page: 1,
        },
    })

    if (response.status == 200) {
        messages.value = response.data.map((item: ContactInterface) => {
            const chatHistory = item.chatHistories
                ? item.chatHistories.length > 0
                    ? item.chatHistories[0]
                    : null
                : null

            return {
                contactId: item.id,
                name: item.name,
                image: 'https://www.gravatar.com/avatar/?d=identicon',
                message: chatHistory ? chatHistory.content : '-',
                createdAt: chatHistory ? chatHistory.createdAt : '-',
                unreadCount: 0,
                clicked: false,
            }
        })
        contacts.value = response.data
    }
}

const emit = defineEmits<{
    (event: 'messageClick', contact: ContactInterface): void
}>()

const listMessageClicked = (message: MessageInterface, index: number) => {
    messageActive.value = message

    emit('messageClick', contacts.value[index])
}

const searchData = () => {
    fetchData()
}

const clearSearch = () => {
    search.value = ''
    fetchData()
}

onMounted(async () => {
    await fetchData()
})
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
            class="space-y-1 overflow-y-auto scroll-smooth h-full overflow-hidden px-3"
        >
            <ListMessage
                v-for="(message, key) in messages"
                :key="key"
                :name="message.name"
                :message="message.message"
                :image="'https://www.gravatar.com/avatar/?d=identicon'"
                :created-at="message.createdAt"
                :unread-count="message.unreadCount"
                :clicked="messageActive?.contactId === message.contactId"
                @onClick="listMessageClicked(message, key)"
            ></ListMessage>
        </div>
    </div>
</template>
