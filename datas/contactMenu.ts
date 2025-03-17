import type { MenuInterface } from "~/components/interfaces/globalInterface";

export const menus = ref<MenuInterface[]>([
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