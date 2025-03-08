<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import { useFormValues } from 'vee-validate'
import { toast } from 'vue-sonner'
import * as z from 'zod'
import { dialogState } from '~/composables/dialog'
import type { CategoryInterface } from '~/types/CategoryInterface'

const formSchema = toTypedSchema(
    z.object({
        name: z.string().min(2),
    })
)

let { isOpen, closeDialog } = dialogState()

const props = defineProps({
    category: {
        type: Object as PropType<CategoryInterface>,
        required: true,
    },
})

let data = ref({ ...props.category })

watch(isOpen, (newVal) => {
    data.value = { ...props.category }
})

const emit = defineEmits<{
    (event: 'onSubmit'): void
}>()

const editForm = async (values: any) => {
    const response: any = await $fetch('/api/categories/' + data.value.id, {
        method: 'PUT',
        body: {
            id: data.value.id,
            name: values.name,
        },
    })
    if (response.status == 200) {
        toast.success(response.message)
        closeDialog()

        emit('onSubmit')
    }
}

const createForm = async (values: any) => {
    const response: any = await $fetch('/api/categories', {
        method: 'POST',
        body: {
            name: values.name,
        },
    })
    if (response.status == 200) {
        toast.success(response.message)
        closeDialog()

        emit('onSubmit')
    }
}

const onSubmit = async (values: any) => {
    if (data.value.id) {
        editForm(values)
    } else {
        createForm(values)
    }
}
</script>

<template>
    <Form
        v-slot="{ handleSubmit }"
        ref="myForm"
        as=""
        :validation-schema="formSchema"
        :initial-values="data"
    >
        <Dialog modal :open="isOpen">
            <DialogContent class="sm:max-w-[425px] [&>button]:text-white">
                <DialogHeader>
                    <DialogTitle class="text-white">
                        <span v-if="data.id">Edit Category</span>
                        <span v-else>Create Category</span>
                    </DialogTitle>
                </DialogHeader>

                <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
                    <FormField
                        v-slot="{ componentField }"
                        name="name"
                        v-model="data.name"
                    >
                        <FormItem>
                            <FormLabel class="text-white">Category</FormLabel>
                            <FormControl>
                                <Input
                                    class="text-white"
                                    type="text"
                                    placeholder="Ex: Customer"
                                    v-bind="componentField"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </form>

                <DialogFooter>
                    <DialogClose as-child>
                        <Button
                            @click="closeDialog"
                            type="button"
                            variant="secondary"
                        >
                            Batal
                        </Button>
                    </DialogClose>

                    <Button type="submit" form="dialogForm">
                        <span v-if="data.id">Edit</span>
                        <span v-else>Create</span>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </Form>
</template>
