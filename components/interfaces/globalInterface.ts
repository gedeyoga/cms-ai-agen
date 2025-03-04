interface MenuInterface {
    label: string
    icon: string
    link: string
    children: Array<MenuInterface>
}

export type { MenuInterface }
