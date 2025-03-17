<script lang="ts" setup>
import Content from '~/components/layout/Content.vue'
import Sidebar from '~/components/layout/Sidebar.vue'
import UserList from '~/components/user/UserList.vue'
import { menus } from '~/datas/settingMenu'

</script>

<template>
    <Content title="User">
        <template #left>
            <Sidebar :menus="menus" title="Menu"></Sidebar>
        </template>
        <template #right>
            <div class="mb-6">
                <h1 class="text-3xl font-semibold">User</h1>
            </div>
            <UserList></UserList>
        </template>
    </Content>
</template>
