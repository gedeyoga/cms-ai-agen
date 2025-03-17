<script lang="ts" setup>
import { Icon } from '@iconify/vue/dist/iconify.js'

const props = defineProps<{
    icon?: string
    src?: string
}>()
</script>

<template>
    <div class="flex flex-col items-center py-10">
        <Icon
            v-if="props.icon"
            class="text-6xl text-zinc-400"
            :icon="props.icon"
            :ssr="true"
        ></Icon>
        <img v-if="props.src" :src="props.src" class="w-10 h-10 object-cover" />
        <slot>
            <p class="text-xl text-zinc-400">Empty</p>
        </slot>
    </div>
</template>
