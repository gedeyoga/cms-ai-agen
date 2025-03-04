<script lang="ts" setup>
const props = defineProps<{
    message: string
    image: string
    name: string
    createdAt: string
    unreadCount: number
    clicked?: boolean
}>()

const emit = defineEmits<{
    onClick: () => void
}>()
</script>

<template>
    <div
        class="flex items-center space-x-3 w-full p-3 cursor-pointer hover:bg-white hover:bg-opacity-15"
        :class="props.clicked ? 'bg-white bg-opacity-15' : ''"
        @click="
            () => {
                emit('onClick')
            }
        "
    >
        <div>
            <img
                class="w-10 h-10 rounded-full object-center"
                :src="props.image"
                alt=""
            />
        </div>
        <div>
            <p>{{ props.name }}</p>
            <p class="text-sm text-gray-400">{{ props.message }}</p>
        </div>
    </div>
</template>
