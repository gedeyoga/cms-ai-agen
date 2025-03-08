import moment from 'moment'
import 'moment/locale/id' // Import bahasa Indonesia

export const useFilters = () => {
    const formatDate = (dateString: string) => {
        return moment(dateString).locale('id').format('DD MMMM YYYY HH:mm')
    }

    const contextualDateFormat = (dateInput: string) => {
        const date = new Date(dateInput)
        const now = new Date()

        // Format waktu (jam:menit)
        const timeOptions: Intl.DateTimeFormatOptions = {
            hour: '2-digit',
            minute: '2-digit',
        }
        const timeString = date.toLocaleTimeString('id-ID', timeOptions)

        // Hitung selisih hari
        const diffTime = now.setHours(0, 0, 0, 0) - date.setHours(0, 0, 0, 0)
        const diffDays = diffTime / (1000 * 60 * 60 * 24)

        if (diffDays === 0) {
            return timeString // Hari ini → tampilkan jam
        } else if (diffDays === 1) {
            return 'Kemarin' // Kemarin
        } else {
            // Format tanggal (YYYY/MM/DD)
            const dateOptions: Intl.DateTimeFormatOptions = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            }
            return date
                .toLocaleDateString('id-ID', dateOptions)
                .replace(/-/g, '/')
        }
    }

    const chatFormat = (text: string) => {
        return text.replace(
            /(https?:\/\/[^\s]+)/gi,
            '<a href="$1" target="_blank" class="text-blue-500 underline">$1</a>'
        )
    }

    return { formatDate, contextualDateFormat, chatFormat }
}
