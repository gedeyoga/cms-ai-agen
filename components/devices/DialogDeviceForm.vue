<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
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
import { toast } from 'vue-sonner'
import * as z from 'zod'
import { dialogState } from '~/composables/dialog'
import type { DeviceInterface } from '~/types/DeviceInterface'
import { Loader2 } from 'lucide-vue-next'
import PhoneNumber from '~/components/global/PhoneNumber'
import { Icon } from '@iconify/vue/dist/iconify.js'

const formSchema = toTypedSchema(
    z.object({
        name: z.string().min(2, 'Name is required'),
        device: z
            .string()
            .min(8, 'Phone minimum at leats 8 characters')
            .max(15, 'Phone maximum at most 15 characters'),
        personal: z.boolean().optional(),
        autoread: z.boolean().optional(),
        group: z.boolean().optional(),
    })
)

let { isOpen, closeDialog } = dialogState()

const props = defineProps({
    device: {
        type: Object as PropType<DeviceInterface>,
        required: true,
    },
})

let data = ref({ ...props.device })
let loading = ref<boolean>(false)

watch(isOpen, (newVal) => {
    data.value = { ...props.device }
})

const emit = defineEmits<{
    (event: 'onSubmit'): void
}>()

const editForm = async (values: any) => {
    loading.value = true

    const response: any = await $fetch('/api/devices/' + data.value.id, {
        method: 'PUT',
        body: {
            name: values.name,
            device: values.device,
            autoread: values.autoread ?? false,
            personal: values.personal ?? false,
            group: values.group ?? false,
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
    const response: any = await $fetch('/api/devices', {
        method: 'POST',
        body: {
            name: values.name,
            device: values.device,
            autoread: values.autoread ?? false,
            personal: values.personal ?? false,
            group: values.group ?? false,
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
                        <span v-if="data.id">Edit Device</span>
                        <span v-else>Create Device</span>
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
                                    placeholder="Ex: Name of device"
                                    v-bind="componentField"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField
                        v-slot="{ componentField }"
                        name="device"
                        v-model="data.device"
                    >
                        <FormItem>
                            <FormLabel class="text-white">Device</FormLabel>
                            <FormControl>
                                <div
                                    class="relative w-full max-w-sm items-center"
                                >
                                    <PhoneNumber
                                        :disabled="data.id != '' ? true : false"
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

                    <Button type="submit" form="dialogForm">
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
