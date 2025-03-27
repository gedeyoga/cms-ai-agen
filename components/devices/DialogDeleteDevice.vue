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
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import { Loader2 } from 'lucide-vue-next'
import type { DeviceInterface } from '~/services/fonnte/types/DeviceInterface'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

const props = defineProps({
    device: {
        type: Object as PropType<DeviceInterface>,
        required: true,
    },

    show: {
        type: Boolean as PropType<boolean>,
        required: true,
        default: false,
    },
})

let loading = ref<boolean>(false)

const formSchema = toTypedSchema(
    z.object({
        otp: z
            .array(z.coerce.string())
            .length(6, { message: 'OTP must contain exactly 6 characters' }),
    })
)

let { handleSubmit, setFieldValue, setErrors } = useForm({
    validationSchema: formSchema,
    initialValues: {
        otp: [],
    },
})

const onSubmit = handleSubmit(async ({ otp }) => {
    loading.value = true
    const response: any = await $fetch('/api/devices/' + props.device.id, {
        method: 'delete',
        body: {
            otp: parseInt(otp.join('')),
        },
    })
    loading.value = false

    if (response.status) {
        toast.success(response.message)
        emit('update:show', false)
        emit('onSubmit')
    }
})

const emit = defineEmits<{
    (event: 'onSubmit'): void
    (event: 'update:show', state: boolean): void
}>()
</script>

<template>
    <div>
        <Dialog modal :open="props.show">
            <DialogContent class="sm:max-w-[425px] [&>button]:text-white">
                <DialogHeader>
                    <DialogTitle class="text-white">
                        <span>Delete Device</span>
                    </DialogTitle>
                </DialogHeader>

                <form @submit="onSubmit">
                    <FormField v-slot="{ componentField, value }" name="otp">
                        <FormItem>
                            <FormLabel class="flex justify-center text-xl"
                                >OTP</FormLabel
                            >
                            <FormControl>
                                <PinInput
                                    id="pin-input"
                                    :model-value="value"
                                    placeholder="○"
                                    class="flex gap-2 items-center mt-1 justify-center"
                                    otp
                                    type="number"
                                    :name="componentField.name"
                                    @update:model-value="
                                        (arrStr) => {
                                            setFieldValue(
                                                'otp',
                                                arrStr.filter(Boolean)
                                            )
                                        }
                                    "
                                >
                                    <PinInputGroup class="gap-1">
                                        <template
                                            v-for="(id, index) in 6"
                                            :key="id"
                                        >
                                            <PinInputInput
                                                class="rounded-md border dark:bg-zinc-900 dark:text-white h-12 w-12"
                                                :index="index"
                                            />
                                            <template v-if="index !== 5">
                                                <PinInputSeparator />
                                            </template>
                                        </template>
                                    </PinInputGroup>
                                </PinInput>
                            </FormControl>
                            <FormDescription>
                                <span class="mt-5 block text-center"
                                    >An otp message has been send to your
                                    whatsapp message. please input it and
                                    proceed</span
                                >
                            </FormDescription>
                            <FormMessage class="block text-center" />
                        </FormItem>
                    </FormField>

                    <div class="flex flex-col space-y-5 mt-10">
                        <Button :disabled="loading" type="submit">
                            <Loader2
                                v-if="loading"
                                class="w-4 h-4 mr-2 animate-spin"
                            />
                            Delete Device
                        </Button>
                        <Button
                            :disabled="loading"
                            variant="secondary"
                            @click="emit('update:show', false)"
                        >
                            <Loader2
                                v-if="loading"
                                class="w-4 h-4 mr-2 animate-spin"
                            />
                            Cancel
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </div>
</template>
