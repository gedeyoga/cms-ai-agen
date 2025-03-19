<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { Dialog, DialogContent, DialogClose } from '@/components/ui/dialog'

import { dialogState } from '~/composables/dialog'
import { authWhatsappState } from '~/composables/authWhatsappState'

let { isOpen, closeDialog } = dialogState()
let { resetState } = authWhatsappState()

let stateForm = ref<string>('send-otp')

const closingDialog = () => {
    closeDialog()
    resetState()
    stateForm.value = 'send-otp'
}
</script>

<template>
    <Dialog modal :open="isOpen">
        <DialogTitle></DialogTitle>
        <DialogContent class="sm:max-w-[425px] [&>button]:text-white">
            <DialogClose
                @click="closingDialog"
                class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-zinc-950 focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-zinc-100 data-[state=open]:text-zinc-500 dark:ring-offset-zinc-950 dark:focus:ring-zinc-300 dark:data-[state=open]:bg-zinc-800 dark:data-[state=open]:text-zinc-400"
            >
                <X class="w-4 h-4" />
                <span class="sr-only">Close</span>
            </DialogClose>
            <AuthWhatsappForm
                @close-dialog="closingDialog"
                @on-send-otp="(state: string) => (stateForm = state)"
                v-if="stateForm == 'send-otp'"
            ></AuthWhatsappForm>
            <AuthWhatsappOtp
                @close-dialog="closingDialog"
                v-if="stateForm == 'validate-otp'"
            ></AuthWhatsappOtp>
        </DialogContent>
    </Dialog>
</template>
