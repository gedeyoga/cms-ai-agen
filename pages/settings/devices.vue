<script lang="ts" setup>
import Content from '~/components/layout/Content.vue'
import Sidebar from '~/components/layout/Sidebar.vue'
import DeviceList from '~/components/devices/DeviceList.vue'
import { menus } from '~/datas/settingMenu'
</script>

<template>
    <Content title="Devices">
        <template #left>
            <Sidebar :menus="menus" title="Menu"></Sidebar>
        </template>
        <template #right>
            <div class="mb-6">
                <h1 class="text-3xl font-semibold">Device</h1>
            </div>
            <DeviceList></DeviceList>
        </template>
    </Content>
</template>
