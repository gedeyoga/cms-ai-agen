import { ref } from 'vue'

interface AlertDialogOptions {
    title: string
    content: string
    onConfirm?: () => void
    onCancel?: () => void
}

const isOpen = ref(false)
const dialogOptions = ref<AlertDialogOptions | null>(null)

export function useAlertDialog() {
    const show = (options: AlertDialogOptions) => {
        dialogOptions.value = options
        isOpen.value = true
    }

    const close = () => {
        isOpen.value = false
    }

    return { isOpen, dialogOptions, show, close }
}
