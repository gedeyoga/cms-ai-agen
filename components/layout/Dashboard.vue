<script setup lang="ts">
import Navigation from './Navigation.vue'
</script>
<template>
    <div class="flex justify-between px-10 py-6">
        <h2 class="text-2xl">Konek Market</h2>
        <div class="flex">Yoga Permana</div>
    </div>

    <Navigation></Navigation>

    <div class="p-10">
        <slot name="content"></slot>
    </div>
</template>
