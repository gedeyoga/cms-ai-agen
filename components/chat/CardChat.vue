<script setup lang="ts">
import SidebarChat from '~/components/chat/SidebarChat.vue'
import CardMessage from './CardMessage.vue'
</script>

<template>
    <div
        class="h-screen flex border border-gray-800 divide-x divide-gray-700 rounded-xl overflow-hidden"
    >
        <SidebarChat></SidebarChat>
        <CardMessage></CardMessage>
    </div>
</template>
