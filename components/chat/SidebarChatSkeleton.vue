<script lang="ts" setup>
import Skeleton from '../ui/skeleton/Skeleton.vue'
</script>

<template>
    <div v-for="index in 7" class="flex items-center space-x-4">
        <Skeleton class="h-12 w-12 rounded-full" />
        <div class="space-y-3 grow">
            <Skeleton class="h-4 w-full" />
            <Skeleton class="h-3 w-[60%]" />
        </div>
    </div>
</template>
