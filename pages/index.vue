<script setup lang="ts">
import Chat from '~/components/chat/CardChat.vue'
import Dashboard from '~/components/layout/Dashboard.vue'
</script>

<template>
    <Dashboard>
        <template #content>
            <Chat> </Chat>
        </template>
    </Dashboard>
</template>
