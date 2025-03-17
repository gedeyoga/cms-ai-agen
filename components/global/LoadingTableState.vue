<script lang="ts" setup>
import { Loader2 } from 'lucide-vue-next'
</script>

<template>
    <div class="flex justify-center items-center py-10">
        <Loader2 class="w-10 h-10 mr-2 animate-spin text-zinc-400" />
        <span class="text-lg"> Loading...</span>
    </div>
</template>
