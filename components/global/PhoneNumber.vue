<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'
import { useVModel } from '@vueuse/core'

const props = defineProps<{
    defaultValue?: string | number
    modelValue?: string | number
    class?: HTMLAttributes['class']
}>()

const emits = defineEmits<{
    (e: 'update:modelValue', payload: string | number): void
}>()

const formatIndonesianPhoneNumber = (value: string | number | undefined) => {
    if (typeof value == 'number') {
        value = value.toString(value)
    } else if (typeof value == 'undefined') {
        value = ''
    }

    let phoneNumber = value.replace(/\D/g, '') // Hapus semua karakter non-digit
    console.log('format', phoneNumber)

    if (phoneNumber.startsWith('0')) {
        phoneNumber = '62' + phoneNumber.slice(1)
    }

    return phoneNumber
}

const modelValue = useVModel(props, 'modelValue', emits, {
    passive: true,
    defaultValue: props.defaultValue,
})

const formattedPhone = computed({
    get: () => props.modelValue,
    set: (newValue) => {
        emits('update:modelValue', formatIndonesianPhoneNumber(newValue))
    },
})
</script>

<template>
    <Input v-model="formattedPhone" :class="props.class" />
</template>
