<script setup lang="ts">

    import AlertDialog from '~/components/global/AlertDialog.vue';
    import { Toaster } from '~/components/ui/sonner'

</script>

<template>
    <div class="min-h-screen bg-white dark:bg-black text-black dark:text-white">
        <NuxtPage />

        <AlertDialog class="bg-black"></AlertDialog>
        <Toaster theme="dark" />
    </div>
</template>
