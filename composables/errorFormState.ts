export const errorFormState = () => {
    const formatZodErrors = (zodErrors = []) => {
        const formattedErrors: any = {}

        zodErrors.forEach((error: any) => {
            const fieldName = error.path[0] // Ambil nama field (e.g., 'phone')
            formattedErrors[fieldName] = error.message // Simpan pesan error
        })

        return formattedErrors
    }

    return { formatZodErrors }
}
