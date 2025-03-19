<script lang="ts" setup>
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useAuth } from '#imports'
const { formatZodErrors } = errorFormState()
import { Card, CardContent } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Icon } from '@iconify/vue/dist/iconify.js'
import { useForm } from 'vee-validate'
import PhoneNumber from '../global/PhoneNumber.vue'

const router = useRouter()

let error = ref<string | null>(null)

const formSchema = toTypedSchema(
    z.object({
        name: z.string().min(2, 'Name is required'),
        phone: z
            .string()
            .min(10, 'Phone must contain at least 10 character(s)'),
        email: z.string().min(2, 'Email is requried').email(),
    })
)

const { handleSubmit, setErrors } = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: '',
        phone: '',
    },
})

const onSubmit = handleSubmit(async (values: any) => {
    try {
        const result = await $fetch('/api/auth/register', {
            method: 'post',
            body: {
                name: values.name,
                email: values.email,
                phone: values.phone,
            },
        })

        if (result.statusCode == 200) {
            const message = encodeURIComponent(result.data.validationToken)
            navigateTo(
                `https://wa.me/${result.data.redirectPhone}?text=${message}`,
                { external: true }
            )
        }
    } catch (error: any) {
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
                <CardContent class="p-10">
                    <h2 class="text-3xl text-center mb-6">Sign Up</h2>

                    <form class="my-10" @submit="onSubmit">
                        <div
                            v-if="error"
                            class="bg-red-900/90 w-full rounded p-3 mb-5 text-xs"
                        >
                            {{ error }}
                        </div>

                        <FormField v-slot="{ componentField }" name="name">
                            <FormItem class="mb-5">
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
                            <FormItem class="mb-5">
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
                            <Button type="submit" class="w-full mb-5"
                                >Register</Button
                            >
                        </div>
                    </form>

                    <div class="flex flex-col items-center">
                        <span class="font-light"
                            >Already have an account ?</span
                        >
                        <Button @click="router.push('/login')" variant="link"
                            >Sign In</Button
                        >
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
