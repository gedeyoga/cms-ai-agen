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
</script>

<template>
    <Table>
        <!-- <TableCaption>A list of your recent invoices.</TableCaption> -->
        <TableHeader>
            <TableRow class="border-gray-800">
                <TableHead class="w-[100px]"> Invoice </TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Method</TableHead>
                <TableHead class="text-right"> Amount </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow class="border-gray-800">
                <TableCell class="font-medium"> INV001 </TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Credit Card</TableCell>
                <TableCell class="text-right"> $250.00 </TableCell>
            </TableRow>
        </TableBody>
    </Table>

    <div class="flex justify-center my-10">
        <Pagination
            v-slot="{ page }"
            :items-per-page="10"
            :total="100"
            :sibling-count="1"
            show-edges
            :default-page="3"
        >
            <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                <PaginationFirst />
                <PaginationPrev />

                <template v-for="(item, index) in items">
                    <PaginationListItem
                        v-if="item.type === 'page'"
                        :key="index"
                        :value="item.value"
                        as-child
                    >
                        <Button
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

                <PaginationNext />
                <PaginationLast />
            </PaginationList>
        </Pagination>
    </div>
</template>
