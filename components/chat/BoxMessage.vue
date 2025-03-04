<script setup lang="ts">
import Card from '../ui/card/Card.vue'

const props = defineProps({
    position: String,
})
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
                :src="'https://gravatar.com/avatar/5c3e210bcdb637430f921e6f9a956ab1eda894dc9fe019fdd6b7c7f701dcf2e7'"
                alt=""
            />
        </div>
        <Card
            class="max-w-[50%] p-4 rounded-none"
            :class="
                props.position === 'right'
                    ? 'rounded-tl-2xl rounded-br-2xl rounded-bl-2xl !bg-white !text-black'
                    : 'justify-start space-x-4 rounded-tr-2xl rounded-br-2xl rounded-bl-2xl'
            "
        >
            <p class="mb-3" v-if="props.position === 'left'">Yoga Permana</p>
            <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Obcaecati neque quibusdam quos itaque alias impedit ipsam natus,
                assumenda iure corrupti culpa, nulla magnam dolorum veritatis
                sunt cupiditate, atque repellat explicabo.
            </p>
            <span class="block text-right text-sm"><small>10:10</small></span>
        </Card>
    </div>
</template>
