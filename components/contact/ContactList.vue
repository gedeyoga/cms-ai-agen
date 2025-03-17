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
import type { ContactInterface } from '~/types/ContactInterface'
import type { MetaInterface } from '~/types/PaginationInterface'
import DialogContactForm from './DialogContactForm.vue'
import { dialogState } from '~/composables/dialog'
import { useFilters } from '~/composables/useFilters'
import { useAlertDialog } from '~/composables/alertDialog'
import { toast } from 'vue-sonner'
import { Badge } from '../ui/badge'
import LoadingTableState from '../global/LoadingTableState.vue'
import EmptyState from '../global/EmptyState.vue'
import type { CategoryInterface } from '~/types/CategoryInterface'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Icon } from '@iconify/vue/dist/iconify.js'
import contactStatus from '~/datas/contactStatus'
import { filterFns } from '@tanstack/vue-table'

let meta = ref<MetaInterface>({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
})

let search = ref<string | number>('')
let categoryIds = ref<string[]>([])
let statuses = ref<string[]>([])
let loading = ref<boolean>(false)
let categories = ref<CategoryInterface[]>([])

const { openDialog } = dialogState()
const { formatDate } = useFilters()

let contacts = ref<ContactInterface[]>([])

const fetchData = async () => {
    contacts.value = []
    loading.value = true

    const response: any = await $fetch('/api/contacts', {
        query: {
            search: search.value,
            per_page: meta.value.pageSize,
            page: meta.value.currentPage,
            categoryId: categoryIds.value,
            status: statuses.value,
        },
    })
    loading.value = false

    if (response.status == 200) {
        meta.value = response.meta
        contacts.value = response.data.map((contact: ContactInterface) => {
            contact.categories = contact.categories ? contact.categories : []
            return contact
        })
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

let dataContact = ref<ContactInterface>({
    id: null,
    name: '',
    phone: '',
    status: '',
    createdAt: null,
    updatedAt: null,
    categories: [],
})

const handleDelete = (id: number) => {
    const { show } = useAlertDialog()

    show({
        title: 'Confirmation',
        content: 'Are you sure want to delete this item?',
        onConfirm: async () => {
            const response: any = await $fetch('/api/contacts/' + id, {
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
    dataContact.value = {
        id: null,
        name: '',
        phone: '',
        status: '',
        createdAt: null,
        updatedAt: null,
        categories: [],
    }
}

const searchData = () => {
    meta.value.currentPage = 1
    fetchData()
}
const fetchCategory = async () => {
    loading.value = true
    const response = await $fetch('/api/categories', {
        method: 'GET',
    })
    loading.value = false

    categories.value = response.data.map((category: any) => ({
        ...category,
        createdAt: category.createdAt ? new Date(category.createdAt) : null,
        updatedAt: category.updatedAt ? new Date(category.updatedAt) : null,
    }))
}

onMounted(async () => {
    await fetchCategory()
    await fetchData()
})
</script>

<template>
    <div class="flex justify-end mb-5">
        <Button
            @click="
                () => {
                    resetDialog()
                    openDialog()
                }
            "
        >
            <Icon icon="mdi:add" :ssr="true"></Icon> Create</Button
        >
    </div>
    <div class="grid grid-cols-2 mb-5 items-end">
        <div class="flex gap-x-3">
            <div class="grow">
                <label for="">Category</label>
                <Select v-model="categoryIds" multiple>
                    <SelectTrigger>
                        <SelectValue
                            class="text-white"
                            placeholder="Choose category"
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem
                                v-for="(category, key) in categories"
                                :value="category.id + ''"
                                :key="key"
                            >
                                {{ category.name }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>

            <div class="grow">
                <label for="">Status</label>
                <Select v-model="statuses" multiple>
                    <SelectTrigger>
                        <SelectValue
                            class="text-white"
                            placeholder="Choose status"
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectItem
                                v-for="(status, key) in contactStatus"
                                :value="status.value + ''"
                                :key="key"
                            >
                                {{ status.name }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>

        <div class="flex justify-end">
            <div class="flex w-full max-w-sm items-center gap-1.5">
                <Input v-model="search" type="text" placeholder="Search..." />
                <Button @click="searchData" variant="outline">
                    <Icon icon="mdi:search" :ssr="true"></Icon> Search
                </Button>
            </div>
        </div>
    </div>
    <Table>
        <TableHeader>
            <TableRow class="border-gray-800">
                <TableHead> Name </TableHead>
                <TableHead> Phone </TableHead>
                <TableHead> Status </TableHead>
                <TableHead width="200px"> Categories </TableHead>
                <TableHead width="200px"> Created At </TableHead>
                <TableHead class="text-right" width="200px"> Action </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow
                v-for="(contact, key) in contacts"
                :key="key"
                class="border-gray-800"
            >
                <TableCell width="200px">
                    {{ contact.name }}
                </TableCell>
                <TableCell>
                    {{ contact.phone }}
                </TableCell>
                <TableCell>
                    {{ contact.status }}
                </TableCell>
                <TableCell>
                    <div class="space-x-1">
                        <Badge v-for="category in contact.categories">{{
                            category.name
                        }}</Badge>
                    </div>
                </TableCell>
                <TableCell>
                    {{ formatDate(contact.createdAt + '') }}
                </TableCell>
                <TableCell class="text-right">
                    <div class="space-x-2">
                        <!-- <DialogContactForm :key="key" :contact="contact"></DialogContactForm> -->
                        <Button
                            variant="outline"
                            @click="
                                () => {
                                    dataContact = contact
                                    openDialog()
                                }
                            "
                        >
                            <Icon icon="mdi:edit" :ssr="true"></Icon> Edit
                        </Button>
                        <Button
                            @click="handleDelete(parseInt(contact.id + ''))"
                            variant="destructive"
                            ><Icon icon="mdi:delete" :ssr="true"></Icon
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
                v-if="contacts.length == 0 && loading == false"
                class="border-gray-800"
            >
                <TableCell colspan="6">
                    <EmptyState :icon="'mdi:account-box-outline'">
                        <p class="text-xl text-zinc-400">No data contact</p>
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

    <DialogContactForm
        :contact="dataContact"
        @onSubmit="fetchData"
    ></DialogContactForm>
</template>
