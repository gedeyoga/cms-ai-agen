<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import { useFormValues } from 'vee-validate'
import { toast } from 'vue-sonner'
import * as z from 'zod'
import { dialogState } from '~/composables/dialog'
import type { UserInterface } from '~/types/UserInterface'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { Loader2 } from 'lucide-vue-next'

let { isOpen, closeDialog } = dialogState()

const props = defineProps({
    user: {
        type: Object as PropType<UserInterface>,
        required: true,
    },
})

let data = ref({ ...props.user })
let loading = ref<boolean>(false)

watch(isOpen, (newVal) => {
    data.value = { ...props.user }
})

const formSchema = toTypedSchema(
    z.object({
        name: z.string().min(2),
        email: z.string().min(2).email(),
        phone: z
            .string()
            .min(10, 'Phone must contain at least 10 character(s)')
            .max(16, 'Phone must contain at most 16 character(s)'),
        password: props.user.id
            ? z.string().min(8)
            : z
                  .string()
                  .optional()
                  .refine((value) => {
                      return !value || value.length >= 8
                  }, 'Min 8 characters'),
    })
)

const emit = defineEmits<{
    (event: 'onSubmit'): void
}>()

const editForm = async (values: any) => {
    loading.value = true
    const response: any = await $fetch('/api/users/' + data.value.id, {
        method: 'PUT',
        body: {
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone,
        },
    })
    loading.value = false

    if (response.status == 200) {
        toast.success(response.message)
        closeDialog()

        emit('onSubmit')
    }
}

const createForm = async (values: any) => {
    loading.value = true
    const response: any = await $fetch('/api/users', {
        method: 'POST',
        body: {
            name: values.name,
            email: values.email,
            password: values.password,
            phone: values.phone,
        },
    })
    loading.value = false

    if (response.status == 200) {
        toast.success(response.message)
        closeDialog()

        emit('onSubmit')
    }
}

const onSubmit = async (values: any) => {
    if (data.value.id) {
        editForm(values)
    } else {
        createForm(values)
    }
}
</script>

<template>
    <Form
        v-slot="{ handleSubmit }"
        ref="myForm"
        as=""
        :validation-schema="formSchema"
        :initial-values="data"
    >
        <Dialog modal :open="isOpen">
            <DialogContent class="sm:max-w-[425px] [&>button]:text-white">
                <DialogHeader>
                    <DialogTitle class="text-white">
                        <span v-if="data.id">Edit User</span>
                        <span v-else>Create User</span>
                    </DialogTitle>
                </DialogHeader>

                <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
                    <FormField
                        v-slot="{ componentField }"
                        name="name"
                        v-model="data.name"
                    >
                        <FormItem>
                            <FormLabel class="text-white">Name</FormLabel>
                            <FormControl>
                                <Input
                                    class="text-white"
                                    type="text"
                                    placeholder="Ex: Bagus"
                                    v-bind="componentField"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField
                        v-slot="{ componentField }"
                        name="email"
                        v-model="data.email"
                    >
                        <FormItem>
                            <FormLabel class="text-white">Email</FormLabel>
                            <FormControl>
                                <Input
                                    class="text-white"
                                    type="text"
                                    placeholder="Ex: example@mail.com"
                                    v-bind="componentField"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField
                        v-slot="{ componentField }"
                        name="phone"
                        v-model="data.phone"
                    >
                        <FormItem>
                            <FormLabel class="text-white">Phone</FormLabel>
                            <FormControl>
                                <div
                                    class="relative w-full max-w-sm items-center"
                                >
                                    <PhoneNumber
                                        class="text-white pl-10"
                                        type="text"
                                        placeholder="Ex: 0812345678901"
                                        v-bind="componentField"
                                    ></PhoneNumber>
                                    <span
                                        class="absolute start-0 inset-y-0 flex items-center justify-center px-3 dark:text-white"
                                    >
                                        <Icon
                                            icon="mdi:whatsapp"
                                            :ssr="true"
                                        ></Icon>
                                    </span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField
                        v-slot="{ componentField }"
                        name="password"
                        v-model="data.password"
                    >
                        <FormItem>
                            <FormLabel class="text-white">
                                {{ data.id ? 'New Password' : 'Password' }}
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="password"
                                    class="text-white"
                                    placeholder="Type password..."
                                    v-bind="componentField"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </form>

                <DialogFooter>
                    <DialogClose as-child>
                        <Button
                            :disabled="loading"
                            @click="closeDialog"
                            type="button"
                            variant="secondary"
                        >
                            <Loader2
                                v-if="loading"
                                class="w-4 h-4 mr-2 animate-spin"
                            />
                            Cancel
                        </Button>
                    </DialogClose>

                    <Button :disabled="loading" type="submit" form="dialogForm">
                        <Loader2
                            v-if="loading"
                            class="w-4 h-4 mr-2 animate-spin"
                        />
                        <span v-if="data.id">Edit</span>
                        <span v-else>Create</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Form>
</template>
