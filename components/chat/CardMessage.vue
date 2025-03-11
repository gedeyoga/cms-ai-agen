<script lang="ts" setup>
import type { ChatHistoryInterface } from '~/types/ChatHistoryInterface'
import Button from '../ui/button/Button.vue'
import Input from '../ui/input/Input.vue'
import BoxMessage from './BoxMessage.vue'
import type { ContactInterface } from '~/types/ContactInterface'
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
const { $pusher } = useNuxtApp();

let message = ref<string>('')
let loading = ref<boolean>(false)
let loadingSendMessage = ref<boolean>(false)

const setLoading = (val: boolean) => {
    loading.value = val
}

const setLoadingSendMessage = (val: boolean) => {
    loadingSendMessage.value = val
}

const fetchMessages = async (contactId: number) => {
    setLoading(true)
    const response: any = await $fetch('/api/chat/' + contactId + '/messages', {
        method: 'GET',
    })
    setLoading(false)

    if (response.status == 200) {
        setChatHistories(response.data)
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
            fetchMessages(newVal.id ? newVal.id : 0)
        }
    }
)

onMounted(() => {
  const channel = $pusher.subscribe("chat-channel");
  channel.bind("new-message", (data: ChatHistoryInterface) => {
    if(contact.value) {
        if(data.contactId == contact.value.id) {
            chatHistories.value.unshift(data)
            markChatRead(contact.value.id)
        }
    }
  });
});


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
            <div
                v-if="loading"
                class="grow-1 h-full p-4 overflow-y-auto overflow-hidden flex flex-col-reverse"
            >
                <BoxMessageSkeleton></BoxMessageSkeleton>
            </div>
            <div
                v-else
                class="grow-1 h-full p-4 overflow-y-auto overflow-hidden flex flex-col-reverse"
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
                    <Button v-if="message" @click="sendMessage" :disabled="loadingSendMessage">
                        <Icon v-if="loadingSendMessage == false" icon="mdi:send" :ssr="true"></Icon>
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
