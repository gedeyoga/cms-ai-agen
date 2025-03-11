<script lang="ts" setup>
import Skeleton from '../ui/skeleton/Skeleton.vue'
</script>

<template>
    <div class="flex mb-5 justify-start space-x-4">
        <Skeleton class="h-12 w-12 rounded-full" />
        <Skeleton
            class="rounded-none h-[100px] w-[30%] space-x-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl"
        />
    </div>
    <div
        class="flex mb-5 justify-start flex-row-reverse space-x-reverse space-x-4"
    >
        <Skeleton
            class="rounded-none h-[60px] w-[50%] rounded-tl-2xl rounded-br-2xl rounded-bl-2xl"
        />
    </div>
    <div
        class="flex mb-5 justify-start flex-row-reverse space-x-reverse space-x-4"
    >
        <Skeleton
            class="rounded-none h-[70px] w-[30%] rounded-tl-2xl rounded-br-2xl rounded-bl-2xl"
        />
    </div>
</template>
