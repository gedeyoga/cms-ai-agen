<script lang="ts" setup>
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { z } from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useAuth } from '#imports'

const { signIn } = useAuth()

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
import { Loader2 } from 'lucide-vue-next'

const router = useRouter()

let formLogin = ref({
    email: '',
    password: '',
})

let loading = ref<boolean>(false)

let error = ref<string | null>(null)

const formSchema = toTypedSchema(
    z.object({
        email: z.string().min(2),
        password: z.string().min(8),
    })
)

const onSubmit = async (values: any) => {
    loading.value = true
    const result = await signIn('credentials', {
        email: formLogin.value.email,
        password: formLogin.value.password,
        callbackUrl: '/',
        redirect: false,
    })
    loading.value = false

    if (result?.error) {
        error.value = result.error + ''
    } else {
        router.push('/')
    }
}

const emit = defineEmits<{
    (event: 'onLoginProviders', provider: string): void
}>()
</script>
<template>
    <div class="flex items-center h-screen">
        <div class="container flex justify-center">
            <Card class="w-full ease-in-out duration-300 max-w-[400px]">
                <CardContent class="p-10">
                    <Form
                        v-slot="{ handleSubmit }"
                        ref="myForm"
                        :validation-schema="formSchema"
                    >
                        <h2 class="text-3xl text-center mb-6">Sign In</h2>

                        <form
                            id="loginForm"
                            class="my-10"
                            @submit="handleSubmit($event, onSubmit)"
                        >
                            <div
                                v-if="error"
                                class="bg-red-900/90 w-full rounded p-3 mb-5 text-xs"
                            >
                                {{ error }}
                            </div>

                            <FormField
                                v-slot="{ componentField }"
                                name="email"
                                v-model="formLogin.email"
                            >
                                <FormItem class="mb-5">
                                    <FormLabel class="text-white"
                                        >Email</FormLabel
                                    >
                                    <FormControl>
                                        <Input
                                            class="text-white"
                                            type="text"
                                            placeholder="Input your email.."
                                            v-bind="componentField"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>
                            <FormField
                                v-slot="{ componentField }"
                                name="password"
                                v-model="formLogin.password"
                            >
                                <FormItem>
                                    <FormLabel class="text-white"
                                        >Password</FormLabel
                                    >
                                    <FormControl>
                                        <Input
                                            class="text-white"
                                            type="password"
                                            placeholder="Input your password.."
                                            v-bind="componentField"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>
                        </form>

                        <div class="space-y-3">
                            <Button
                                :disabled="loading"
                                type="submit"
                                form="loginForm"
                                class="w-full mb-5"
                            >
                                <Loader2
                                    v-if="loading"
                                    class="w-4 h-4 mr-2 animate-spin"
                                />
                                Login
                            </Button>

                            <div class="text-center">
                                <span>Or sign in with</span>
                            </div>

                            <div class="">
                                <Button
                                    :disabled="loading"
                                    type="button"
                                    @click="
                                        emit('onLoginProviders', 'whatsapp')
                                    "
                                    variant="whatsapp"
                                    class="w-full"
                                >
                                    <Icon
                                        v-if="loading == false"
                                        icon="mdi:whatsapp"
                                        :ssr="true"
                                    ></Icon>
                                    <Loader2
                                        v-else="loading"
                                        class="w-4 h-4 mr-2 animate-spin"
                                    />
                                    Whatsapp
                                </Button>
                            </div>
                        </div>

                        <div class="flex flex-col items-center mt-10 w-full">
                            <span class="font-light"
                                >Don't have an account ?</span
                            >
                            <Button
                                type="button"
                                :disabled="loading"
                                @click="router.push('/register')"
                                variant="link"
                            >
                                <Loader2
                                    v-if="loading"
                                    class="w-4 h-4 mr-2 animate-spin"
                                />
                                Sign Up
                            </Button>
                        </div>
                    </Form>
                </CardContent>
            </Card>
        </div>
    </div>
</template>
