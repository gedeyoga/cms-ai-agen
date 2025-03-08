<script lang="ts" setup>
import type { ChatHistoryInterface } from '~/types/ChatHistoryInterface'
import Button from '../ui/button/Button.vue'
import Input from '../ui/input/Input.vue'
import BoxMessage from './BoxMessage.vue'
import type { ContactInterface } from '~/types/ContactInterface'
import { Icon } from '@iconify/vue'

const props = defineProps({
    contact: {
        type: Object as PropType<ContactInterface>,
    },
})

let chatHistories = ref<ChatHistoryInterface[]>([])
let message = ref<string>('')

const fetchMessages = async (contactId: number) => {
    const response: any = await $fetch('/api/chat/' + contactId + '/messages', {
        method: 'GET',
    })

    if (response.status == 200) {
        chatHistories.value = response.data
    }
}

const sendMessage = async () => {
    const response: any = await $fetch('/api/chat', {
        method: 'POST',
        body: {
            contactId: props.contact?.id,
            message: message.value,
        },
    })

    if (response.status == 200) {
        chatHistories.value.unshift(response.data)
    }

    message.value = ''
}

watch(
    () => props.contact,
    (newVal) => {
        if (newVal) {
            fetchMessages(newVal.id ? newVal.id : 0)
        }
    }
)
</script>

<template>
    <div class="flex flex-col justify-center w-full h-full">
        <template v-if="contact">
            <div class="flex justify-between p-4 border-b border-gray-800">
                <div class="flex items-center">
                    <div>
                        <img
                            class="w-10 h-10 rounded-full object-center"
                            src="https://gravatar.com/avatar/5c3e210bcdb637430f921e6f9a956ab1eda894dc9fe019fdd6b7c7f701dcf2e7"
                            alt=""
                        />
                    </div>
                    <div class="ml-3">
                        <p class="text-lg font-semibold mb-1">
                            {{ props.contact?.name }}
                        </p>
                        <p class="text-xs text-gray-400">
                            <Badge>{{ props.contact?.status }}</Badge>
                        </p>
                    </div>
                </div>
                <div class="flex items-center">
                    <Button>Detail</Button>
                </div>
            </div>
            <div
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
                    ></Input>
                    <Button v-if="message" @click="sendMessage">
                        <Icon icon="mdi:send" :ssr="true"></Icon>
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
</template>
