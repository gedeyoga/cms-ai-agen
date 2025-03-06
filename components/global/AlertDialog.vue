<script setup lang="ts">
import { useAlertDialog } from '~/composables/alertDialog'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog'

const { isOpen, dialogOptions, close } = useAlertDialog()

const handleConfirm = () => {
    if (dialogOptions.value?.onConfirm) {
        dialogOptions.value.onConfirm()
    }
    close()
}

const handleCancel = () => {
    if (dialogOptions.value?.onCancel) {
        dialogOptions.value.onCancel()
    }
    close()
}
</script>

<template>
    <AlertDialog :open="isOpen">
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle class="text-white">{{
                    dialogOptions?.title || 'Alert'
                }}</AlertDialogTitle>
                <AlertDialogDescription>
                    {{ dialogOptions?.content || 'Are you sure?' }}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel as-child>
                    <Button
                        class="text-white"
                        variant="outline"
                        @click="handleCancel"
                    >
                        Cancel</Button
                    >
                </AlertDialogCancel>
                <Button @click="handleConfirm">Confirm</Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>
