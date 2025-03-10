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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { toTypedSchema } from '@vee-validate/zod'
import { toast } from 'vue-sonner'
import * as z from 'zod'
import { dialogState } from '~/composables/dialog'
import type { ContactInterface } from '~/types/ContactInterface'
import type { CategoryInterface } from '~/types/CategoryInterface'

const formSchema = toTypedSchema(
    z.object({
        name: z.string().min(2),
        phone: z.string().min(10).max(16),
        status: z.string().min(3),
        categoryId: z.array(z.string().min(1)),
    })
)

let { isOpen, closeDialog } = dialogState()

const props = defineProps({
    contact: {
        type: Object as PropType<ContactInterface>,
        required: true,
    },
})

let data = ref({
    categoryId: [] as string[],
    ...props.contact,
})

watch(isOpen, (newVal) => {
    const categories = props.contact.categories ? props.contact.categories : []
    data.value = {
        ...props.contact,
        categoryId: categories.map((item: CategoryInterface) =>
            item.id ? item.id.toString() : ''
        ),
    }
})

// const emit = defineEmits<{
//     onSubmit: () => void
// }>()

const emit = defineEmits<{
    (event: 'onSubmit', val: ContactInterface): void
}>()

const editForm = async (values: any) => {
    const response: any = await $fetch('/api/contacts/' + data.value.id, {
        method: 'PUT',
        body: {
            id: data.value.id,
            name: values.name,
            phone: values.phone,
            status: values.status,
            categoryId: values.categoryId.map((id: string) => parseInt(id)),
        },
    })
    if (response.status == 200) {
        toast.success(response.message)
        closeDialog()

        emit('onSubmit', response.data)
    }
}

const createForm = async (values: any) => {
    const response: any = await $fetch('/api/contacts', {
        method: 'POST',
        body: {
            name: values.name,
            phone: values.phone,
            status: values.status,
            categoryId: values.categoryId.map((id: string) => parseInt(id)),
        },
    })
    if (response.status == 200) {
        toast.success(response.message)
        closeDialog()

        emit('onSubmit', response.data)
    }
}

const onSubmit = async (values: any) => {
    if (data.value.id) {
        editForm(values)
    } else {
        createForm(values)
    }
}

let categories: CategoryInterface[] = []
const fetchCategory = async () => {
    const response = await $fetch('/api/categories', {
        method: 'GET',
    })

    categories = response.data.map((category: any) => ({
        ...category,
        createdAt: category.createdAt ? new Date(category.createdAt) : null,
        updatedAt: category.updatedAt ? new Date(category.updatedAt) : null,
    }))
}

const statuses = [
    {
        name: 'New',
        value: 'NEW',
    },
    {
        name: 'Hot',
        value: 'HOT',
    },
    {
        name: 'Warm',
        value: 'WARM',
    },
    {
        name: 'Cold',
        value: 'COLD',
    },
    {
        name: 'Follow Up',
        value: 'FOLLOWUP',
    },
    {
        name: 'Lost',
        value: 'LOST',
    },
    {
        name: 'Active',
        value: 'ACTIVE',
    },
]

fetchCategory()
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
                        <span v-if="data.id">Edit Contact</span>
                        <span v-else>Create Contact</span>
                    </DialogTitle>
                </DialogHeader>

                <form id="dialogForm" @submit="handleSubmit($event, onSubmit)">
                    <FormField
                        v-slot="{ componentField }"
                        name="name"
                        v-model="data.name"
                    >
                        <FormItem>
                            <FormLabel class="text-white">Contact</FormLabel>
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
                    <FormField
                        v-slot="{ componentField }"
                        name="phone"
                        v-model="data.phone"
                    >
                        <FormItem>
                            <FormLabel class="text-white">Phone</FormLabel>
                            <FormControl>
                                <Input
                                    class="text-white"
                                    type="text"
                                    placeholder="Ex: 0812345678912"
                                    v-bind="componentField"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField
                        v-slot="{ componentField }"
                        name="categoryId"
                        v-model="data.categoryId"
                    >
                        <FormItem>
                            <FormLabel class="text-white">Category</FormLabel>
                            <Select v-bind="componentField" multiple>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            class="text-white"
                                            placeholder="Select category"
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem
                                            v-for="(
                                                category, key
                                            ) in categories"
                                            :value="category.id + ''"
                                            :key="key"
                                        >
                                            {{ category.name }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField
                        v-slot="{ componentField }"
                        name="status"
                        v-model="data.status"
                    >
                        <FormItem>
                            <FormLabel class="text-white">Status</FormLabel>
                            <Select v-bind="componentField">
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue
                                            class="text-white"
                                            placeholder="Select status"
                                        />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem
                                            v-for="(status, key) in statuses"
                                            :value="status.value + ''"
                                            :key="key"
                                        >
                                            {{ status.name }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
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
