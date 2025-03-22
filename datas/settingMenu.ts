import type { MenuInterface } from '~/components/interfaces/globalInterface'

export const menus = ref<MenuInterface[]>([
    {
        label: 'User',
        icon: '',
        link: '/settings',
        children: [],
    },
    {
        label: 'Devices',
        icon: '',
        link: '/settings/devices',
        children: [],
    },
])
