<script setup lang="ts">
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

const route = useRoute()

const listMenus = [
    {
        label: 'Chat',
        path: '/',
        isActive: route.path === '/',
    },
    {
        label: 'Contact',
        path: '/contact',
        isActive: route.path === '/contact',
    },
    {
        label: 'Settings',
        path: '/settings',
        isActive: route.path === '/settings',
    },
]
</script>

<template>
    <div class="px-10 sticky top-0 bg-white dark:bg-black z-10">
        <div class="border-b border-gray-800 w-full">
            <NavigationMenu class="">
                <NavigationMenuList>
                    <NavigationMenuItem
                        v-for="(menu, key) in listMenus"
                        :key="key"
                    >
                        <NavigationMenuLink
                            @click="navigateTo(menu.path)"
                            class="cursor-pointer"
                            :class="
                                (menu.isActive
                                    ? 'border-b border-white'
                                    : 'text-gray-400 ') +
                                navigationMenuTriggerStyle()
                            "
                        >
                            {{ menu.label }}
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>
    </div>
</template>
