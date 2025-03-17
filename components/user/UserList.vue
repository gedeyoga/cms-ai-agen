<script setup lang="ts">
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import {
    Pagination,
    PaginationEllipsis,
    PaginationFirst,
    PaginationLast,
    PaginationList,
    PaginationListItem,
    PaginationNext,
    PaginationPrev,
} from '@/components/ui/pagination'
import type { UserInterface } from '~/types/UserInterface'
import type { MetaInterface } from '~/types/PaginationInterface'
import DialogUserForm from './DialogUserForm.vue'
import { dialogState } from '~/composables/dialog'
import { useFilters } from '~/composables/useFilters'
import { useAlertDialog } from '~/composables/alertDialog'
import { toast } from 'vue-sonner'
import { Icon } from '@iconify/vue/dist/iconify.js'
import EmptyState from '../global/EmptyState.vue'
import LoadingTableState from '../global/LoadingTableState.vue'

let meta = ref<MetaInterface>({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
})

let search = ref<string | number>('')
let loading = ref<boolean>(false)

const { openDialog } = dialogState()
const { formatDate } = useFilters()

let users = ref<UserInterface[]>([])

const fetchData = async () => {
    users.value = []
    loading.value = true
    const response: any = await $fetch('/api/users', {
        query: {
            search: search.value,
            per_page: meta.value.pageSize,
            page: meta.value.currentPage,
        },
    })
    loading.value = false

    if (response.status == 200) {
        meta.value = response.meta
        users.value = response.data
    }
}

const prevClick = (val: any) => {
    meta.value.currentPage = val
    fetchData()
}

const nextClick = (val: any) => {
    meta.value.currentPage = val
    fetchData()
}

const pageClicked = (val: any) => {
    meta.value.currentPage = val
    fetchData()
}

let dataUser = ref<UserInterface>({
    id: '',
    name: '',
    email: '',
    phone: '',
    password: '',
    createdAt: null,
    updatedAt: null,
})

const handleDelete = (id: string) => {
    const { show } = useAlertDialog()

    show({
        title: 'Confirmation',
        content: 'Are you sure want to delete this item?',
        onConfirm: async () => {
            const response: any = await $fetch('/api/users/' + id, {
                method: 'DELETE',
            })

            if (response.status == 200) {
                toast.success(response.message)
                fetchData()
            }
        },
        onCancel: () => {},
    })
}

const resetDialog = () => {
    dataUser.value = {
        id: '',
        name: '',
        email: '',
        phone: '',
        password: null,
        createdAt: null,
        updatedAt: null,
    }
}

const searchData = () => {
    meta.value.currentPage = 1
    fetchData()
}
onMounted(async () => {
    await fetchData()
})
</script>

<template>
    <div class="flex justify-between mb-5">
        <div class="flex w-full max-w-sm items-center gap-1.5">
            <Input v-model="search" type="text" placeholder="Search..." />
            <Button @click="searchData" variant="outline"> Search </Button>
        </div>

        <Button
            @click="
                () => {
                    resetDialog()
                    openDialog()
                }
            "
            ><Icon icon="mdi:add" :ssr="true"></Icon>Create</Button
        >
    </div>
    <Table>
        <!-- <TableCaption>A list of your recent invoices.</TableCaption> -->
        <TableHeader>
            <TableRow class="border-gray-800">
                <TableHead> Name </TableHead>
                <TableHead> Email </TableHead>
                <TableHead> Phone </TableHead>
                <TableHead> Created At </TableHead>
                <TableHead class="text-right"> Action </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow
                v-for="(user, key) in users"
                :key="key"
                class="border-gray-800"
            >
                <TableCell>
                    {{ user.name }}
                </TableCell>
                <TableCell>
                    {{ user.email }}
                </TableCell>
                <TableCell>
                    {{ user.phone }}
                </TableCell>
                <TableCell>
                    {{ formatDate(user.createdAt + '') }}
                </TableCell>
                <TableCell class="text-right">
                    <div class="space-x-2">
                        <!-- <DialogUserForm :key="key" :user="user"></DialogUserForm> -->
                        <Button
                            variant="outline"
                            @click="
                                () => {
                                    dataUser = user
                                    openDialog()
                                }
                            "
                        >
                            <Icon icon="mdi:edit" :ssr="true"></Icon>
                            Edit</Button
                        >
                        <Button
                            @click="handleDelete(user.id)"
                            variant="destructive"
                        >
                            <Icon icon="mdi:delete" :ssr="true"></Icon
                        ></Button>
                    </div>
                </TableCell>
            </TableRow>

            <TableRow v-if="loading">
                <TableCell colspan="6">
                    <LoadingTableState></LoadingTableState>
                </TableCell>
            </TableRow>
            <TableRow
                v-if="users.length == 0 && loading == false"
                class="border-gray-800"
            >
                <TableCell colspan="6">
                    <EmptyState :icon="'mdi:account-tag-outline'">
                        <p class="text-xl text-zinc-400">No data user</p>
                    </EmptyState>
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>

    <div class="flex justify-center my-10">
        <Pagination
            v-slot="{ page }"
            :items-per-page="meta.pageSize"
            :total="meta.total"
            :sibling-count="1"
            show-edges
            :default-page="meta.currentPage"
        >
            <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                <!-- <PaginationFirst /> -->
                <PaginationPrev
                    v-if="meta.currentPage > 1"
                    @click="prevClick(meta.currentPage - 1)"
                />

                <template v-for="(item, index) in items">
                    <PaginationListItem
                        v-if="item.type === 'page'"
                        :key="index"
                        :value="item.value"
                        as-child
                    >
                        <Button
                            @click="pageClicked(item.value)"
                            class="w-9 h-9 p-0"
                            :variant="
                                item.value === page ? 'default' : 'outline'
                            "
                        >
                            {{ item.value }}
                        </Button>
                    </PaginationListItem>
                    <PaginationEllipsis
                        v-else
                        :key="item.type"
                        :index="index"
                    />
                </template>

                <PaginationNext
                    v-if="meta.currentPage < meta.totalPages"
                    @click="nextClick(meta.currentPage + 1)"
                />
                <!-- <PaginationLast /> -->
            </PaginationList>
        </Pagination>
    </div>

    <DialogUserForm
        :user="dataUser"
        @onSubmit="fetchData"
    ></DialogUserForm>
</template>
