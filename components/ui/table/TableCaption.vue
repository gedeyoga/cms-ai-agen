<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()
</script>

<template>
    <caption
        :class="
            cn('mt-4 text-sm text-zinc-500 dark:text-zinc-400', props.class)
        "
    >
        <slot />
    </caption>
</template>
