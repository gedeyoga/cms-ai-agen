<script setup lang="ts">
import Card from '../ui/card/Card.vue'
import { useFilters } from '~/composables/useFilters'

const props = defineProps({
    position: String,
    message: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
})

const { contextualDateFormat, chatFormat } = useFilters()
</script>
<template>
    <div
        class="flex mb-5"
        :class="
            props.position === 'right'
                ? 'justify-start flex-row-reverse space-x-reverse space-x-4'
                : 'justify-start space-x-4'
        "
    >
        <div class="mt-2" v-if="props.position === 'left'">
            <img
                class="w-7 h-7 rounded-full object-center"
                :src="'https://www.gravatar.com/avatar/?d=identicon'"
                alt=""
            />
        </div>
        <Card
            class="min-w-[20%] max-w-[50%] p-4 rounded-none justify-start"
            :class="
                props.position === 'right'
                    ? 'rounded-tl-2xl rounded-br-2xl rounded-bl-2xl !bg-white !text-black'
                    : 'space-x-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
            "
        >
            <p class="!ml-0 mb-3" v-if="props.position === 'left'">
                {{ props.name }}
            </p>
            <p class="!ml-0" v-html="chatFormat(props.message)"></p>
            <span class="block text-right text-sm"
                ><small>{{ contextualDateFormat(props.date) }}</small></span
            >
        </Card>
    </div>
</template>
