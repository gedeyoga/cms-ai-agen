import type { AuthWhatsappDataInterface } from "~/types/AuthWhatsappInterface";

let dataAuthWhatsapp = ref<AuthWhatsappDataInterface>({
    phone: null,
    expiredAt: null
})

export const authWhatsappState = () => {

    const resetState = () => {
        dataAuthWhatsapp.value.phone = null
        dataAuthWhatsapp.value.expiredAt = null
    }

    return { dataAuthWhatsapp, resetState }
}