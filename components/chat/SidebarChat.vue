<script setup lang="ts">
import { Input } from '../ui/input'
import ListMessage from './ListMessage.vue'

const messages = ref([
    {
        name: 'Yoga Permana',
        image: 'https://gravatar.com/avatar/5c3e210bcdb637430f921e6f9a956ab1eda894dc9fe019fdd6b7c7f701dcf2e7',
        message: 'Hello, how are you?',
        createdAt: '10:00 AM',
        unreadCount: 1,
        clicked: false,
    },
    {
        name: 'Yoga Permana',
        image: 'https://gravatar.com/avatar/5c3e210bcdb637430f921e6f9a956ab1eda894dc9fe019fdd6b7c7f701dcf2e7',
        message: 'Hello, how are you?',
        createdAt: '10:00 AM',
        unreadCount: 1,
        clicked: false,
    },
    {
        name: 'Yoga Permana',
        image: 'https://gravatar.com/avatar/5c3e210bcdb637430f921e6f9a956ab1eda894dc9fe019fdd6b7c7f701dcf2e7',
        message: 'Hello, how are you?',
        createdAt: '10:00 AM',
        unreadCount: 1,
        clicked: false,
    },
    {
        name: 'Yoga Permana',
        image: 'https://gravatar.com/avatar/5c3e210bcdb637430f921e6f9a956ab1eda894dc9fe019fdd6b7c7f701dcf2e7',
        message: 'Hello, how are you?',
        createdAt: '10:00 AM',
        unreadCount: 1,
        clicked: false,
    },
    {
        name: 'Yoga Permana',
        image: 'https://gravatar.com/avatar/5c3e210bcdb637430f921e6f9a956ab1eda894dc9fe019fdd6b7c7f701dcf2e7',
        message: 'Hello, how are you?',
        createdAt: '10:00 AM',
        unreadCount: 1,
        clicked: false,
    },
    {
        name: 'Yoga Permana',
        image: 'https://gravatar.com/avatar/5c3e210bcdb637430f921e6f9a956ab1eda894dc9fe019fdd6b7c7f701dcf2e7',
        message: 'Hello, how are you?',
        createdAt: '10:00 AM',
        unreadCount: 1,
        clicked: false,
    },
])
</script>

<template>
    <div class="flex flex-col max-w-[300px] w-full">
        <div class="px-5 py-7 w-full">
            <h2 class="text-xl mb-5">Chats</h2>
            <Input
                class="block"
                type="text"
                name="search"
                placeholder="Search message..."
            />
        </div>

        <div
            class="space-y-1 overflow-y-scroll scroll-smooth h-full overflow-hidden"
        >
            <ListMessage
                v-for="(message, key) in messages"
                :key="key"
                :name="message.name"
                :image="message.image"
                :message="message.message"
                :created-at="message.createdAt"
                :unread-count="message.unreadCount"
                :clicked="message.clicked"
                @onClick="
                    () => {
                        messages = messages.map((item: any) => {
                            item.clicked = false
                            console.log('aslkfjasl')

                            return item
                        })

                        messages[key].clicked = true
                    }
                "
            ></ListMessage>
        </div>
    </div>
</template>
