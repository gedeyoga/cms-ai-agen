<script lang="ts" setup>
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
const { formatZodErrors } = errorFormState()
import { Card, CardContent } from '@/components/ui/card'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { useForm } from 'vee-validate'
import PhoneNumber from '../global/PhoneNumber.vue'
import { Loader2 } from 'lucide-vue-next'

const router = useRouter()

let error = ref<string | null>(null)
let loading = ref<boolean>(false)

const formSchema = toTypedSchema(
    z.object({
        name: z.string().min(2, 'Name is required'),
        phone: z
            .string()
            .min(10, 'Phone must contain at least 10 character(s)'),
        email: z.string().min(2, 'Email is requried').email(),
        companyName: z.string().min(2, 'Company name is required'),
    })
)

const { handleSubmit, setErrors } = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: '',
        phone: '',
        email: '',
        companyName: '',
    },
})

const onSubmit = handleSubmit(async (values: any) => {
    loading.value = true
    try {
        const result = await $fetch('/api/auth/register', {
            method: 'post',
            body: {
                name: values.name,
                email: values.email,
                phone: values.phone,
                companyName: values.companyName,
            },
        })

        loading.value = false

        if (result.statusCode == 200) {
            const message = encodeURIComponent(result.data.validationToken)
            navigateTo(
                `https://wa.me/${result.data.redirectPhone}?text=${message}`,
                { external: true }
            )
        }
    } catch (error: any) {
        loading.value = false

        if (error.status == 422) {
            if (error.data?.message == 'Validation error') {
                const errors = formatZodErrors(error.data.data)
                setErrors(errors)
            }
        }
    }
})

const emit = defineEmits<{
    (event: 'onLoginProviders', provider: string): void
}>()
</script>
<template>
    <div class="flex items-center h-screen">
        <div class="container flex justify-center">
            <Card class="w-full ease-in-out duration-300 max-w-[400px]">
                <CardContent class="px-10 py-5">
                    <h2 class="text-3xl text-center mb-6">Sign Up</h2>

                    <form class="" @submit="onSubmit">
                        <div
                            v-if="error"
                            class="bg-red-900/90 w-full rounded p-3 mb-5 text-xs"
                        >
                            {{ error }}
                        </div>

                        <FormField
                            v-slot="{ componentField }"
                            name="companyName"
                        >
                            <FormItem class="mb-2">
                                <FormLabel class="text-white"
                                    >Company</FormLabel
                                >
                                <FormControl>
                                    <Input
                                        class="text-white"
                                        type="text"
                                        placeholder="Ex: PT Mari Buka Akses"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField v-slot="{ componentField }" name="name">
                            <FormItem class="mb-2">
                                <FormLabel class="text-white">Name</FormLabel>
                                <FormControl>
                                    <Input
                                        class="text-white"
                                        type="text"
                                        placeholder="Ex: Jhon Doe"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="email">
                            <FormItem class="mb-2">
                                <FormLabel class="text-white">Email</FormLabel>
                                <FormControl>
                                    <Input
                                        class="text-white"
                                        type="text"
                                        placeholder="example@example.com"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="phone">
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
                                            class="absolute start-0 inset-y-0 flex items-center justify-center px-3"
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

                        <div class="mt-10">
                            <Button
                                :disabled="loading"
                                type="submit"
                                class="w-full mb-5"
                            >
                                <Loader2
                                    v-if="loading"
                                    class="w-4 h-4 mr-2 animate-spin"
                                />

                                Register
                            </Button>
                        </div>
                    </form>

                    <div class="flex flex-col items-center">
                        <span class="font-light"
                            >Already have an account ?</span
                        >
                        <Button
                            :disabled="loading"
                            @click="router.push('/login')"
                            variant="link"
                        >
                            <Loader2
                                v-if="loading"
                                class="w-4 h-4 mr-2 animate-spin"
                            />
                            Sign In</Button
                        >
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
