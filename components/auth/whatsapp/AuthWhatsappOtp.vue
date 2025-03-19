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

import {
    PinInput,
    PinInputGroup,
    PinInputInput,
    PinInputSeparator,
} from '@/components/ui/pin-input'

import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { useAuth } from '#imports'
import { authWhatsappState } from '~/composables/authWhatsappState'
import { Loader2 } from 'lucide-vue-next'

const formSchema = toTypedSchema(
    z.object({
        otp: z
            .array(z.coerce.string())
            .length(5, { message: 'OTP must contain exactly 5 characters' }),
    })
)

const { signIn } = useAuth()
const { dataAuthWhatsapp } = authWhatsappState()
const router = useRouter()

let { handleSubmit, setFieldValue, setErrors } = useForm({
    validationSchema: formSchema,
    initialValues: {
        otp: [],
    },
})

let countdown = ref<string>('')
let countdownStart = ref<boolean>(false)
let countdownTimer: any
let loading = ref<boolean>(false)

const emit = defineEmits<{
    (event: 'closeDialog'): void
}>()

const onSubmit = handleSubmit(async ({ otp }) => {
    loading.value = true
    const result = await signIn('whatsapp', {
        phone: dataAuthWhatsapp.value.phone,
        otp: otp.join(''),
        callbackUrl: '/',
        redirect: false,
    })
    loading.value = false

    if (result?.error) {
        setErrors({
            otp: result.error,
        })
    } else {
        router.push('/')
    }
})

const updateCountdown = (time: string) => {
    countdownStart.value = true
    countdown.value = time
}

const handleCountdownComplete = () => {
    countdownStart.value = false
    countdown.value = ''
}

const startCountdown = (
    expiredAt: string,
    onUpdate: Function,
    onComplete: Function
) => {
    const interval = setInterval(() => {
        const now = new Date().getTime()
        const expiryTime = new Date(expiredAt).getTime()
        const timeLeft = expiryTime - now

        if (timeLeft <= 0) {
            clearInterval(interval)
            onComplete() // Callback saat waktu habis
        } else {
            const minutes = Math.floor((timeLeft / 1000 / 60) % 60)
            const seconds = Math.floor((timeLeft / 1000) % 60)
            onUpdate(`${minutes}:${seconds.toString().padStart(2, '0')}`)
        }
    }, 1000)

    return interval
}

const resendOtp = async () => {
    loading.value = true
    const result = await $fetch('/api/auth/send-otp', {
        method: 'post',
        body: {
            phone: dataAuthWhatsapp.value.phone,
        },
    })
    loading.value = false

    if (result.statusCode == 200) {
        dataAuthWhatsapp.value.expiredAt = result.data.userOtp.expiredAt
        countdownTimer = startCountdown(
            result.data.userOtp.expiredAt,
            updateCountdown,
            handleCountdownComplete
        )
    }
}

onUnmounted(() => {
    clearInterval(countdownTimer)
})

onMounted(() => {
    if (dataAuthWhatsapp.value.expiredAt) {
        countdownTimer = startCountdown(
            dataAuthWhatsapp.value.expiredAt,
            updateCountdown,
            handleCountdownComplete
        )
    }
})
</script>

<template>
    <div class="pt-10 pb-5">
        <h2 class="dark:text-white text-2xl text-center">
            Whatsapp Verification
        </h2>
    </div>
    <form @submit="onSubmit">
        <FormField v-slot="{ componentField, value }" name="otp">
            <FormItem>
                <FormLabel class="flex justify-center text-xl">OTP</FormLabel>
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
                                setFieldValue('otp', arrStr.filter(Boolean))
                            }
                        "
                    >
                        <PinInputGroup class="gap-1">
                            <template v-for="(id, index) in 5" :key="id">
                                <PinInputInput
                                    class="rounded-md border dark:bg-zinc-900 dark:text-white h-12 w-12"
                                    :index="index"
                                />
                                <template v-if="index !== 4">
                                    <PinInputSeparator />
                                </template>
                            </template>
                        </PinInputGroup>
                    </PinInput>
                </FormControl>
                <FormDescription>
                    <span class="mt-5 block text-center"
                        >An otp message has been send to your whatsapp message.
                        please input it and proceed</span
                    >
                </FormDescription>
                <FormMessage class="block text-center" />
            </FormItem>
        </FormField>

        <div class="flex flex-col space-y-5 mt-10">
            <Button :disabled="loading" type="submit">
                <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                Login
            </Button>
            <Button
                :disabled="countdownStart || loading"
                type="button"
                variant="secondary"
                @click="resendOtp"
            >
                <Loader2 v-if="loading" class="w-4 h-4 mr-2 animate-spin" />
                Resend OTP {{ countdownStart ? '(' + countdown + ')' : '' }}
            </Button>
        </div>
    </form>
</template>
