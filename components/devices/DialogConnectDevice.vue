<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { toast } from 'vue-sonner'
import { Loader2 } from 'lucide-vue-next'
import type { DeviceInterface } from '~/services/fonnte/types/DeviceInterface'
const { $pusher } = useNuxtApp()

const props = defineProps({
    device: {
        type: Object as PropType<DeviceInterface>,
        required: true,
    },

    show: {
        type: Boolean as PropType<boolean>,
        required: true,
        default: false,
    },
})

let loading = ref<boolean>(false)
let qrCode = ref<string>('')

const generateQrCode = async () => {
    loading.value = true
    const response: any = await $fetch(
        '/api/devices/' + props.device.id + '/connect',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: props.device.token,
            },
        }
    )
    loading.value = false

    if (response.status == 200) {
        qrCode.value = 'data:image/png;base64,' + response.data.url
    }
}

watch(
    () => props.show,
    (newVal) => {
        if (newVal) {
            generateQrCode()
        }
    }
)

const emit = defineEmits<{
    (event: 'onSubmit'): void
    (event: 'update:show', state: boolean): void
}>()

onMounted(() => {
    const channel = $pusher.subscribe('device-channel')
    channel.bind('device-status', async (data: any) => {
        if (props.show) {
            emit('update:show', false)
            emit('onSubmit')
            if (data.status) {
                toast.success('Device connected successfully')
            } else {
                toast.error('Device disconnected')
            }
        }
    })
})
</script>

<template>
    <div>
        <Dialog modal :open="props.show">
            <DialogContent class="sm:max-w-[425px] [&>button]:text-white">
                <DialogHeader>
                    <DialogTitle class="text-white">
                        <span>Connect Whatsapp Device</span>
                    </DialogTitle>
                </DialogHeader>

                <div v-if="!loading" class="flex justify-center">
                    <img :src="qrCode" alt="QR Code" class="block p-4" />
                </div>

                <div v-else>
                    <Skeleton class="w-full h-80 p-4" />
                </div>

                <DialogFooter>
                    <DialogClose as-child>
                        <Button
                            :disabled="loading"
                            @click="emit('update:show', false)"
                            type="button"
                            variant="secondary"
                        >
                            <Loader2
                                v-if="loading"
                                class="w-4 h-4 mr-2 animate-spin"
                            />
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>
</template>
