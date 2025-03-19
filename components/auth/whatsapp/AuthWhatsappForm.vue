<script setup lang="ts">
import { Button } from '@/components/ui/button'
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
import * as z from 'zod'
import { errorFormState } from '~/composables/errorFormState'
import { useForm } from 'vee-validate'
import { Loader2 } from 'lucide-vue-next'

const { formatZodErrors } = errorFormState()
const { dataAuthWhatsapp, resetState } = authWhatsappState()

const formSchema = toTypedSchema(
    z.object({
        phone: z.string().min(10, 'Phone must contain at least 10 character(s)').max(16, 'Phone must contain at most 16 character(s)'),
    })
)

let loading = ref<boolean>(false)

let {  handleSubmit, setErrors  } = useForm({
    validationSchema: formSchema,
    initialValues: {
        phone: '',
    },

})

const emit = defineEmits<{
    (event: 'onSendOtp' , stateForm: string): void,
    (event: 'closeDialog'): void
}>()

const onSubmit = handleSubmit(async (values: any) => {
    loading.value = true
    try{
        const result = await $fetch('/api/auth/send-otp' , {
            method: 'post',
            body: {
                phone: values.phone
            }
        })
        loading.value = false

        if(result.statusCode == 200) {
            dataAuthWhatsapp.value.phone = result.data.phone
            dataAuthWhatsapp.value.expiredAt = result.data.userOtp.expiredAt
            emit('onSendOtp' , 'validate-otp')
        }
    } catch(error: any) {
        loading.value = false

        resetState()

        if(error.status == 422) {
            if(error.data?.message == "Validation error") {
                const errors = formatZodErrors(error.data.data)                 
                setErrors(errors);
            }
        }
    }
    // emit('onSendOtp' , 'validate-otp')
})
</script>

<template>
    <div class="pt-10 pb-5">
        <h2 class="text-2xl text-center text-white">Sign in with Whatsapp</h2>
        <p class="text-center text-white">We will send you OTP number to your phone</p>
    </div>
    <form id="dialogForm" @submit="onSubmit">
        <FormField
            v-slot="{ componentField }"
            name="phone"
        >
            <FormItem>
                <FormLabel class="text-white">Whatsapp Number</FormLabel>
                <FormControl>
                    <Input
                        class="text-white"
                        type="text"
                        placeholder="ex: 08123634343"
                        v-bind="componentField"
                    />
                </FormControl>
                <FormMessage />
            </FormItem>
        </FormField>                    
        <div class="flex flex-col space-y-5 mt-10">
            <Button type="submit" :disabled="loading">
                <Loader2
                    v-if="loading"
                    class="w-4 h-4 mr-2 animate-spin"
                />
                Send OTP
            </Button>
            <Button
                :disabled="loading"
                @click="emit('closeDialog')"
                type="button"
                variant="secondary"
            >
                <Loader2
                    v-if="loading"
                    class="w-4 h-4 mr-2 animate-spin"
                />
                Cancel
            </Button>
            
        </div>
    </form>
    
</template>
