<script lang="ts" setup>
import { useFilters } from '~/composables/useFilters'

const props = defineProps<{
    message: string
    image: string
    name: string
    createdAt: string
    unreadCount: number
    clicked?: boolean
    role: string
}>()

const { contextualDateFormat } = useFilters()

const emit = defineEmits<{
    (event: 'onClick'): void
}>()
</script>

<template>
    <div
        class="flex items-center space-x-3 w-full p-3 cursor-pointer rounded hover:bg-white hover:bg-opacity-15"
        :class="props.clicked ? 'bg-white bg-opacity-15' : ''"
        @click="
            () => {
                emit('onClick')
            }
        "
    >
        <div class="flex-none">
            <img
                class="w-10 h-10 rounded-full object-center"
                :src="props.image"
                alt=""
            />
        </div>
        <div class="overflow-hidden grow">
            <div
                class="flex align-center justify-between overflow-hidden space-x-5"
            >
                <p class="flex-1 truncate">{{ props.name }}</p>
                <span class="flex-none text-xs font-light">{{
                    contextualDateFormat(props.createdAt)
                }}</span>
            </div>
            <div class="flex justify-between align-items-center">
                <p class="text-sm text-gray-400 truncate">
                    {{ props.role == 'assistant' ? 'You :' : '' }}
                    {{ props.message }}
                </p>
                <div v-if="props.unreadCount > 0" class="ml-2">
                    <div
                        class="px-1.5 py-[1px] text-zinc-950 dark:text-zinc-950 rounded-full bg-black dark:bg-white text-xs"
                    >
                        {{props.unreadCount}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
