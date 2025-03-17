<script lang="ts" setup>
    definePageMeta({
        auth: { unauthenticatedOnly: true, navigateAuthenticatedTo: '/' }
    })

    import { Button } from '~/components/ui/button'
    import { Input } from '~/components/ui/input'
    import { z } from 'zod'
    import { toTypedSchema } from '@vee-validate/zod'
    import { useAuth } from '#imports'

    const { signIn } = useAuth()

    import {
        Card,
        CardContent,
        CardHeader,
        CardTitle,
    } from '@/components/ui/card'
    import {
        Form,
        FormControl,
        FormField,
        FormItem,
        FormLabel,
        FormMessage,
    } from '@/components/ui/form'

    const route = useRoute()
    
    let formLogin = ref({
        email: '',
        password: ''
    });

    const errorCode = computed(() => route.query.error)

    const formSchema = toTypedSchema(
        z.object({
            email: z.string().min(2).email(),
            password: z.string().min(8)
        })
    )

    const onSubmit = async (values: any) => {

        const result = await signIn('credentials', {
            email: formLogin.value.email,
            password: formLogin.value.password,
            callbackUrl: '/',
        });

    }

</script>
<template>
    <div class="flex items-center h-screen">
        <div class="container flex justify-center">
                <Card
                    class="w-full ease-in-out duration-300 max-w-[400px]"
                >
                    <CardContent class="p-10">
                        <Form
                            v-slot="{ handleSubmit }"
                            ref="myForm"
                            :validation-schema="formSchema"
                        >
                            <h2 class="text-3xl text-center mb-6">Sign In</h2>    

                            
                                <form id="loginForm" class="my-10" @submit="handleSubmit($event, onSubmit)">
                                    <div v-if="errorCode" class="bg-red-900/90 w-full rounded p-3 mb-5 text-xs">
                                        Invalid email / password credentials
                                    </div>
                                    
                                    <FormField
                                        v-slot="{ componentField }"
                                        name="email"
                                        v-model="formLogin.email"
                                    >
                                        <FormItem class="mb-5">
                                            <FormLabel class="text-white">Email</FormLabel>
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
                                            <FormLabel class="text-white">Password</FormLabel>
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
                                <Button type="submit" form="loginForm" class="w-full">Login</Button>

                                <div class="flex flex-col justiy-center">
                                    <hr>
                                    <span>Or sign in with</span>
                                </div>

                                <div class="">
                                    <Button class="bg-emerald-800 text-white w-full">Whatsapp</Button>
                                </div>
                            </div>

                        </Form>
                    </CardContent>
                </Card>

        </div>
    </div>
</template>
