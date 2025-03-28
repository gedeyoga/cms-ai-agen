<script setup lang="ts">
import SidebarChat from '~/components/chat/SidebarChat.vue'
import CardMessage from './CardMessage.vue'
import { useChatState } from '~/composables/chatState'
const { contactActive } = useChatState()
</script>

<template>
    <div
        class="h-[49rem] flex border border-gray-800 divide-x divide-gray-700 rounded-xl overflow-hidden"
    >
        <SidebarChat></SidebarChat>
        <CardMessage :contact="contactActive"></CardMessage>
    </div>
</template>
