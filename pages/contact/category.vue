<script lang="ts" setup>
import Content from '~/components/layout/Content.vue'
import Sidebar from '~/components/layout/Sidebar.vue'
import CategoryList from '~/components/category/CategoryList.vue'
import { menus } from "~/datas/contactMenu"


</script>

<template>
    <Content title="Contact">
        <template #left>
            <Sidebar :menus="menus" title="Menu"></Sidebar>
        </template>
        <template #right>
            <div class="mb-6">
                <h1 class="text-3xl font-semibold">Category</h1>
            </div>
            <CategoryList></CategoryList>
        </template>
    </Content>
</template>
