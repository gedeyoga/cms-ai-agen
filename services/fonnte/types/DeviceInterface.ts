export interface AddDeviceInterface {
    name: string //device name, min 2 max 30
    device: string //device number (not necessarily actual whatsapp number), min 8 max 15
    autoread: boolean //activate autoread chat feature, boolean
    personal: boolean //autoread personal chat, boolean
    group: boolean //autoread group chat, boolean
}

export interface UpdateDeviceInterface {
    name: string //device name, min 2 max 30
    device: string
    webhook?: string //url to receive incoming chat
    webhookconnect?: string //url to receive connection event
    webhookstatus?: string //url to receive updated message status
    webhookchaining?: string //url to receive response of chaining message
    autoread?: boolean //activate autoread chat feature, boolean
    personal?: boolean //autoread personal chat, boolean
    group?: boolean //autoread group chat, boolean
    quick?: boolean //autoread self chat, boolean
    resend?: boolean //forward incoming attachment, boolean
    target?: string //target number for resend feature, string
    countryCode?: string //county code of the target,default 62
    source?: string //source for autoreply : autoreply,spreadsheet,flow. string
}

export interface DeviceInterface {
    id: string
    companyId: string
    token: string
    name: string
    device: string
    countryCode: string
    autoread: boolean
    group: boolean
    personal: boolean
    status: boolean
    quick: boolean
    resend: boolean
    expired?: string
    package?: string
    source?: string
    quota?: number
    messages?: number
    webhook?: string
    webhookConnect?: string
    webhookStatus?: string
    webhookChaining?: string
    createdAt: string
    updatedAt: string
}
