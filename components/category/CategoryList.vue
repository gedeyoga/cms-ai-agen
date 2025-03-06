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
import type { CategoryInterface } from '~/types/CategoryInterface'
import type { MetaInterface } from '~/types/PaginationInterface'
import DialogCategoryForm from './DialogCategoryForm.vue'
import { dialogState } from '~/composables/dialog'
import { useFilters } from '~/composables/useFilters'
import { useAlertDialog } from '~/composables/alertDialog'
import { toast } from 'vue-sonner'

let meta = ref<MetaInterface>({
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
})

let search = ref<string | number>('')

const { openDialog } = dialogState()
const { formatDate } = useFilters()

let categories = ref<CategoryInterface[]>([])

const fetchData = async () => {
    const response: any = await $fetch('/api/categories', {
        query: {
            search: search.value,
            per_page: meta.value.pageSize,
            page: meta.value.currentPage,
        },
    })

    if (response.status == 200) {
        meta.value = response.meta
        categories.value = response.data
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

let dataCategory = ref<CategoryInterface>({
    id: null,
    name: '',
    createdAt: null,
    updatedAt: null,
})

const handleDelete = (id: number) => {
    const { show } = useAlertDialog()

    show({
        title: 'Confirmation',
        content: 'Are you sure want to delete this item?',
        onConfirm: async () => {
            const response: any = await $fetch('/api/categories/' + id, {
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
    dataCategory.value = {
        id: null,
        name: '',
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
            >Create</Button
        >
    </div>
    <Table>
        <!-- <TableCaption>A list of your recent invoices.</TableCaption> -->
        <TableHeader>
            <TableRow class="border-gray-800">
                <TableHead> Name </TableHead>
                <TableHead> Created At </TableHead>
                <TableHead class="text-right"> Action </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow
                v-for="(category, key) in categories"
                :key="key"
                class="border-gray-800"
            >
                <TableCell>
                    {{ category.name }}
                </TableCell>
                <TableCell>
                    {{ formatDate(category.createdAt + '') }}
                </TableCell>
                <TableCell class="text-right">
                    <div class="space-x-2">
                        <!-- <DialogCategoryForm :key="key" :category="category"></DialogCategoryForm> -->
                        <Button
                            variant="outline"
                            @click="
                                () => {
                                    dataCategory = category
                                    openDialog()
                                }
                            "
                            >Edit</Button
                        >
                        <Button
                            @click="handleDelete(parseInt(category.id + ''))"
                            variant="destructive"
                            >Delete</Button
                        >
                    </div>
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

    <DialogCategoryForm
        :category="dataCategory"
        @onSubmit="fetchData"
    ></DialogCategoryForm>
</template>
