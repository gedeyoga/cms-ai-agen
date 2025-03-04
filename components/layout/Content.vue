<script lang="ts" setup>
import Dashboard from './Dashboard.vue'
import { defineProps } from 'vue'

const props = defineProps<{
    title: string
}>()
</script>

<template>
    <Dashboard>
        <template #content>
            <div class="border-b border-gray-800 pb-10">
                <div class="container">
                    <h3 class="text-4xl font-semibold">{{ props.title }}</h3>
                </div>
            </div>
            <div class="container">
                <div
                    class="flex relative divide-x divide-gray-800 min-h-screen w-full"
                >
                    <div class="w-1/6 px-4 py-10">
                        <slot name="left"></slot>
                    </div>
                    <div class="grow px-10 py-10">
                        <slot name="right"></slot>
                    </div>
                </div>
            </div>
        </template>
    </Dashboard>
</template>
