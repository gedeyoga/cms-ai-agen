<script lang="ts" setup>
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import { useDetailChatState } from '~/composables/detailChatState'
import { Icon } from '@iconify/vue'
import DialogContactForm from '../contact/DialogContactForm.vue'
import type { ContactInterface } from '~/types/ContactInterface'
import { dialogState } from '~/composables/dialog'

const { showDetailChat, contact, setContact } = useDetailChatState()
const { openDialog } = dialogState()
</script>

<template>
    <Card
        class="w-full ease-in-out duration-300 max-w-[300px]"
        :class="showDetailChat ? 'mr-0' : 'mr-[-300px]'"
    >
        <CardHeader>
            <CardTitle>Contact Info</CardTitle>
        </CardHeader>
        <CardContent>
            <div class="mb-5">
                <img
                    class="w-20 h-20 rounded object-center"
                    :src="'/images/default-user.png'"
                    alt=""
                />
            </div>
            <div>
                <div class="mb-10">
                    <h2 class="text-2xl mb-3 font-semibold">
                        {{ contact?.name }}
                    </h2>
                    <p class="font-light">+{{ contact?.phone }}</p>
                </div>
                <div class="mb-5">
                    <span class="block light">Categories</span>
                    <Badge v-for="category in contact?.categories">{{
                        category.name
                    }}</Badge>
                    <span
                        class="font-medium"
                        v-if="contact?.categories?.length == 0"
                        >Empty</span
                    >
                </div>
                <div class="mb-5">
                    <span class="block light">Status</span>
                    <Badge>{{ contact?.status }}</Badge>
                </div>
            </div>
        </CardContent>
        <CardFooter class="flex justify-center px-6 pb-6">
            <Button @click="openDialog">
                <Icon icon="mdi:account-box-edit-outline" :ssr="true"></Icon>
                Edit Contact
            </Button>
        </CardFooter>
    </Card>

    <DialogContactForm
        v-if="contact"
        :contact="contact"
        @onSubmit="setContact"
    ></DialogContactForm>
</template>
