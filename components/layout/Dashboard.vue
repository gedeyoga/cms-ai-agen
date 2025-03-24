<script setup lang="ts">
import Navigation from './Navigation.vue'

import { useAuth } from '#imports'
import { Icon } from '@iconify/vue/dist/iconify.js'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

const { data, signOut } = useAuth()

const logOut = () => {
    const { show } = useAlertDialog()

    show({
        title: 'Confirmation',
        content: 'Are you sure want to logout?',
        onConfirm: async () => {
            await signOut({ callbackUrl: '/login' })
        },
        onCancel: () => {},
    })
}
</script>
<template>
    <div class="flex justify-between px-10 py-6">
        <h2 class="text-2xl">Konek Market</h2>

        <Popover>
            <PopoverTrigger>
                <div class="flex items-center space-x-3 cursor-pointer">
                    <div class="flex flex-col items-end">
                        <span class="text-lg">{{ data?.user?.name }}</span>
                        <span class="text-sm">{{
                            data?.user?.companyName
                        }}</span>
                    </div>
                    <img
                        class="w-10 h-10 rounded-full object-center"
                        src="/images/default-user.png"
                        alt=""
                    />
                </div>
            </PopoverTrigger>
            <PopoverContent class="max-w-[250px] mt-2 mr-10 px-2 py-2">
                <ul>
                    <li class="">
                        <a
                            @click="logOut"
                            href="javascript:void(0)"
                            class="hover:bg-opacity-15 rounded-md flex justify-between items-center py-1 hover:bg-white px-3"
                        >
                            <span>Logout</span>
                            <Icon icon="mdi:logout" :ssr="true"></Icon>
                        </a>
                    </li>
                </ul>
            </PopoverContent>
        </Popover>
    </div>

    <Navigation></Navigation>

    <div class="p-10">
        <slot name="content"></slot>
    </div>
</template>
