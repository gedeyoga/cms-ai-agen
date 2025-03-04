<script lang="ts" setup>
import Content from '~/components/layout/Content.vue'
import Sidebar from '~/components/layout/Sidebar.vue'
import ContactList from '~/components/contact/ContactList.vue';
</script>

<template>
    <Content title="Contact">
        <template #left>
            <Sidebar title="Menu"></Sidebar>
        </template>
        <template #right>
            <div class="mb-6">
                <h1 class="text-3xl font-semibold">Contact</h1>
            </div>
            <ContactList></ContactList>
        </template>
    </Content>
</template>
