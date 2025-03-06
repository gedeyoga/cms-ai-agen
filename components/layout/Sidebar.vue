<script lang="ts" setup>
import type { MenuInterface } from '../interfaces/globalInterface'

const props = defineProps<{
    title: string
}>()

const menus = ref<MenuInterface[]>([
    {
        label: 'Contact',
        icon: '',
        link: '/contact',
        children: [],
    },
    {
        label: 'Category',
        icon: '',
        link: '/contact/category',
        children: [],
    },
])

const route = useRoute()
const activeRoute = route.path

console.log(activeRoute)
</script>

<template>
    <div>
        <h3 class="font-semibold mb-2 px-4 text-gray-400 text-sm">
            {{ props.title }}
        </h3>
        <ul>
            <li class="mb-2" v-for="(menu, key) in menus" :key="key">
                <RouterLink
                    :to="menu.link"
                    class="block py-1 hover:bg-white hover:bg-opacity-15 px-4 rounded-md"
                    :class="
                        activeRoute == menu.link ? 'bg-white bg-opacity-15' : ''
                    "
                    >{{ menu.label }}</RouterLink
                >
            </li>
        </ul>
    </div>
</template>
