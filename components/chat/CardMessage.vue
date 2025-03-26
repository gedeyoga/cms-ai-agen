<script lang="ts" setup>
import type { ChatHistoryInterface } from '~/types/ChatHistoryInterface'
import Button from '../ui/button/Button.vue'
import Input from '../ui/input/Input.vue'
import BoxMessage from './BoxMessage.vue'
import { Icon } from '@iconify/vue'
import { useChatState } from '~/composables/chatState'
import DetailChat from './DetailChat.vue'
import { useDetailChatState } from '~/composables/detailChatState'
import BoxMessageSkeleton from './BoxMessageSkeleton.vue'
import { Loader2 } from 'lucide-vue-next'

const {
    toggleDetailContact,
    setContact,
    contact,
    showDetailChat,
    setChatHistories,
    chatHistories,
} = useDetailChatState()

const { setIncomingChat, contactActive, markChatRead } = useChatState()
const { $pusher } = useNuxtApp()

let message = ref<string>('')
let loading = ref<boolean>(false)
let loadingSendMessage = ref<boolean>(false)
let loadingMore = ref<boolean>(false)
let currentPage = ref(1)
let hasMoreMessages = ref(true)
const perPage = 10
const messagesContainer = ref<HTMLElement | null>(null)

const setLoading = (val: boolean) => {
    loading.value = val
}

const setLoadingSendMessage = (val: boolean) => {
    loadingSendMessage.value = val
}

// const fetchMessages = async (contactId: number) => {
//     setLoading(true)
//     const response: any = await $fetch('/api/chat/' + contactId + '/messages', {
//         method: 'GET',
//     })
//     setLoading(false)

//     if (response.status == 200) {
//         setChatHistories(response.data)
//     }
// }

const fetchMessages = async (contactId: number, page = 1, append = false) => {
    if (page === 1) {
        setLoading(true)
    } else {
        loadingMore.value = true
    }
    
    const response: any = await $fetch(`/api/chat/${contactId}/messages`, {
        query: {
            page,
            per_page: perPage
        }
    })
    
    if (page === 1) {
        setLoading(false)
    } else {
        loadingMore.value = false
    }

    if (response.status === 200) {
        hasMoreMessages.value = response.data.hasMore
        
        if (append) {
            // For older messages, add to the end (since we're scrolling up)
            setChatHistories([...chatHistories.value, ...response.data.data])
        } else {
            // For initial load or refresh
            setChatHistories(response.data.data)
        }
    }
}

const sendMessage = async () => {
    setLoadingSendMessage(true)
    const response: any = await $fetch('/api/chat', {
        method: 'POST',
        body: {
            contactId: contact.value?.id,
            message: message.value,
        },
    })

    setLoadingSendMessage(false)

    if (response.status == 200) {
        chatHistories.value.unshift(response.data)
        setIncomingChat(response.data)
    }

    message.value = ''
}

const handleScroll = () => {
    if (!messagesContainer.value || loadingMore.value || !hasMoreMessages.value) return
    
    const container = messagesContainer.value
    const scrollPosition = container.scrollHeight - container.scrollTop - container.clientHeight
    
    // Load more when scrolled near the top
    if (scrollPosition > container.scrollHeight - 50) {
        loadMoreMessages()
    }
}

const loadMoreMessages = async () => {
    if (!hasMoreMessages.value || loadingMore.value) return;

    const container = messagesContainer.value;
    if (!container) return;

    // Simpan posisi scroll sebelum menambahkan pesan baru
    const previousScrollHeight = container.scrollHeight;

    currentPage.value++;
    await fetchMessages(contact.value?.id || 0, currentPage.value, true);

    await nextTick(); // Tunggu Vue merender data baru

    // Setel kembali posisi scroll setelah pesan baru dimuat
    container.scrollTop += container.scrollHeight - previousScrollHeight;
};

const showDetailContact = () => {
    if (contactActive.value) {
        setContact(contactActive.value)
        toggleDetailContact(!showDetailChat.value)
    }
}

watch(
    () => contactActive.value,
    (newVal) => {
        if (newVal) {
            setContact(newVal)
            currentPage = ref(1)
            fetchMessages(newVal.id ? newVal.id : 0)
        }
    }
)

onMounted(() => {
    const channel = $pusher.subscribe('chat-channel')
    channel.bind('new-message', async (data: ChatHistoryInterface) => {
        if (contact.value) {
            if (data.contactId == contact.value.id) {
                chatHistories.value.unshift(data)
                await markChatRead(contact.value.id)
            }
        }
    })
     // Add scroll listener
    if (messagesContainer.value) {
        messagesContainer.value.addEventListener('scroll', handleScroll)
    }
})

onUnmounted(() => {
    if (messagesContainer.value) {
        messagesContainer.value.removeEventListener('scroll', handleScroll)
    }
})
</script>

<template>
    <div class="flex flex-col justify-center w-full h-full">
        <template v-if="contact">
            <div class="flex justify-between p-4 border-b border-gray-800">
                <div class="flex items-center">
                    <div>
                        <img
                            class="w-10 h-10 rounded-full object-center"
                            :src="'/images/default-user.png'"
                            alt=""
                        />
                    </div>
                    <div class="ml-3">
                        <p class="text-lg font-semibold mb-1">
                            {{ contact?.name }}
                        </p>
                        <p class="text-xs text-gray-400">
                            <Badge>{{ contact?.status }}</Badge>
                        </p>
                    </div>
                </div>
                <div class="flex items-center">
                    <Button @click="showDetailContact">
                        <template v-if="showDetailChat">
                            <Icon icon="mdi:close" :ssr="true"></Icon>
                            Close
                        </template>
                        <span v-else>Detail</span>
                    </Button>
                </div>
            </div>
            <!-- Loading indicator for older messages -->
            <div v-if="loadingMore" class="w-full text-center py-2">
                <Loader2 class="w-4 h-4 mx-auto animate-spin" />
            </div>
            <div
                v-if="loading"
                class="grow-1 h-full p-4 overflow-y-auto overflow-hidden flex flex-col-reverse"
            >
                <BoxMessageSkeleton></BoxMessageSkeleton>
            </div>
            <div
                v-else
                ref="messagesContainer"
                class="grow-1 h-full p-4 overflow-y-auto overflow-hidden flex flex-col-reverse"
                @scroll="handleScroll"
            >   
                <BoxMessage
                    v-for="chat in chatHistories"
                    :position="chat.role == 'user' ? 'left' : 'right'"
                    :name="chat.contact?.name ?? ''"
                    :message="chat.content"
                    :date="chat.createdAt ?? ''"
                ></BoxMessage>
            </div>
            <div class="flex items-center p-4 border-t border-gray-800">
                <div class="flex grow items-center gap-1.5">
                    <Input
                        @keyup.enter="sendMessage"
                        v-model="message"
                        placeholder="Type message..."
                        :disabled="loadingSendMessage"
                    ></Input>
                    <Button
                        v-if="message"
                        @click="sendMessage"
                        :disabled="loadingSendMessage"
                    >
                        <Icon
                            v-if="loadingSendMessage == false"
                            icon="mdi:send"
                            :ssr="true"
                        ></Icon>
                        <Loader2 v-else class="w-4 h-4 mr-2 animate-spin" />
                    </Button>
                </div>
            </div>
        </template>
        <template v-else>
            <div
                class="text-zinc-950 dark:text-white flex items-center flex-col"
            >
                <h2 class="text-2xl">Konek Market</h2>
                <p>Please select chat to start a message</p>
            </div>
        </template>
    </div>

    <DetailChat></DetailChat>
</template>
