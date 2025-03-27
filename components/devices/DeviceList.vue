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
import type { DeviceInterface } from '~/types/DeviceInterface'
import type { MetaInterface } from '~/types/PaginationInterface'
import DialogDeviceForm from './DialogDeviceForm.vue'
import DialogConnectDevice from './DialogConnectDevice.vue'
import { dialogState } from '~/composables/dialog'
import { useFilters } from '~/composables/useFilters'
import { useAlertDialog } from '~/composables/alertDialog'
import { toast } from 'vue-sonner'
import { Icon } from '@iconify/vue/dist/iconify.js'
import EmptyState from '../global/EmptyState.vue'
import LoadingTableState from '../global/LoadingTableState.vue'
import DialogDeleteDevice from './DialogDeleteDevice.vue'

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

let devices = ref<DeviceInterface[]>([])
let showDialogConnect = ref<boolean>(false)
let showDialogDeleteDevice = ref<boolean>(false)

const fetchData = async () => {
    devices.value = []
    loading.value = true
    const response: any = await $fetch('/api/devices', {
        query: {
            search: search.value,
            per_page: meta.value.pageSize,
            page: meta.value.currentPage,
        },
    })
    loading.value = false

    if (response.status == 200) {
        meta.value = response.meta
        devices.value = response.data
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

let dataDevice = ref<DeviceInterface>({
    id: null,
    name: '',
    createdAt: null,
    updatedAt: null,
})

const handleDelete = (id: string) => {
    const { show } = useAlertDialog()

    dataDevice.value = devices.value.find((item: any) => item.id == id)

    show({
        title: 'Confirmation',
        content: 'Are you sure want to delete this item?',
        onConfirm: async () => {
            try {
                const response = await $fetch('/api/devices/' + id, {
                    method: 'delete',
                    body: {},
                })
            } catch (error) {}

            showDialogDeleteDevice.value = true
        },
        onCancel: () => {},
    })
}

const resetDialog = () => {
    dataDevice.value = {
        id: '',
        name: '',
        device: '',
        personal: false,
        autoread: false,
        group: false,
        createdAt: null,
        updatedAt: null,
    }
}

const connectDevice = (device) => {
    dataDevice.value = device
    showDialogConnect.value = true
}

const disconnectDevice = async (device) => {
    const { show } = useAlertDialog()

    show({
        title: 'Confirmation',
        content: 'Are you sure want to disconnect this device?',
        onConfirm: async () => {
            loading.value = true
            const response: any = await $fetch(
                '/api/devices/' + device.id + '/disconnect',
                {
                    method: 'POST',
                    headers: {
                        Authorization: device.token,
                    },
                }
            )

            if (response.status == 200) {
                toast.success(response.message)
                fetchData()
            }

            loading.value = false
        },
        onCancel: () => {},
    })
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
                <TableHead> Device </TableHead>
                <TableHead> Created At </TableHead>
                <TableHead class="text-right"> Action </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow
                v-for="(device, key) in devices"
                :key="key"
                class="border-gray-800"
            >
                <TableCell>
                    {{ device.name }}
                </TableCell>
                <TableCell>
                    {{ device.device }}
                </TableCell>
                <TableCell>
                    {{ formatDate(device.createdAt + '') }}
                </TableCell>
                <TableCell class="text-right">
                    <div class="space-x-2">
                        <!-- <DialogDeviceForm :key="key" :device="device"></DialogDeviceForm> -->
                        <Button
                            variant="secondary"
                            v-if="device.status"
                            @click="disconnectDevice(device)"
                        >
                            Disconnect</Button
                        >
                        <Button
                            variant="success"
                            @click="connectDevice(device)"
                            v-else
                        >
                            Connect</Button
                        >
                        <Button
                            variant="outline"
                            @click="
                                () => {
                                    dataDevice = device
                                    openDialog()
                                }
                            "
                        >
                            <Icon icon="mdi:edit" :ssr="true"></Icon>
                            Edit</Button
                        >
                        <Button
                            @click="handleDelete(device.id)"
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
                v-if="devices.length == 0 && loading == false"
                class="border-gray-800"
            >
                <TableCell colspan="6">
                    <EmptyState :icon="'mdi:account-tag-outline'">
                        <p class="text-xl text-zinc-400">No data device</p>
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

    <DialogDeviceForm
        :device="dataDevice"
        @onSubmit="fetchData"
    ></DialogDeviceForm>

    <DialogConnectDevice
        v-model:show="showDialogConnect"
        :device="dataDevice"
        @onSubmit="fetchData"
    />
    <DialogDeleteDevice
        v-model:show="showDialogDeleteDevice"
        :device="dataDevice"
        @onSubmit="fetchData"
    ></DialogDeleteDevice>
</template>
