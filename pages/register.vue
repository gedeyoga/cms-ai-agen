<script lang="ts" setup>
import AuthRegister from '~/components/auth/AuthRegister.vue'

definePageMeta({
    auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' },
})
</script>
<template>
    <AuthRegister></AuthRegister>
</template>
