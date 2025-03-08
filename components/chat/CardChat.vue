<script setup lang="ts">
import SidebarChat from '~/components/chat/SidebarChat.vue'
import CardMessage from './CardMessage.vue'
import type { ContactInterface } from '~/types/ContactInterface'

let contact = ref<ContactInterface | undefined>()

const getDataContact = (val: ContactInterface) => {
    contact.value = val
}
</script>

<template>
    <div
        class="h-screen flex border border-gray-800 divide-x divide-gray-700 rounded-xl overflow-hidden"
    >
        <SidebarChat @messageClick="getDataContact"></SidebarChat>
        <CardMessage :contact="contact"></CardMessage>
    </div>
</template>
