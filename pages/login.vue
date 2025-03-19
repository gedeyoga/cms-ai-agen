<script lang="ts" setup>
import AuthForm from '~/components/auth/AuthForm.vue'
import DialogWhatsappAuth from '~/components/auth/whatsapp/DialogWhatsappAuth.vue'

let { openDialog } = dialogState()
definePageMeta({
    auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' },
})

const loginProviders = (provider: string) => {
    openDialog()
}
</script>
<template>
    <AuthForm @on-login-providers="loginProviders"></AuthForm>

    <DialogWhatsappAuth></DialogWhatsappAuth>
</template>
