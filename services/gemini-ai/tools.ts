import { tool } from '@langchain/core/tools'
import { z } from 'zod'
import { orderProductDigital } from '~/services/gemini-ai/openaccess-client'
import { getInformasiProductKonek } from '~/services/gemini-ai/rag'

export const listProductDigital = tool(
    async ({ prompt }) => {
        const response = await getInformasiProductKonek(prompt)
        return response
    },
    {
        name: 'list_product_digital',
        description:
            'Gunakan tools ini untuk informasi mengenai produk konek market.',
        schema: z.object({
            prompt: z
                .string()
                .describe(
                    'Prompt untuk mencari data produk. Data tidak boleh berupa string kosong'
                ),
        }),
    }
)

export const orderProduct = tool(
    async ({
        name,
        phone,
        paket_addon_id,
        subscription_type,
        duration,
        user,
    }) => {
        try {
            const response: any = await orderProductDigital(
                name,
                phone,
                paket_addon_id,
                subscription_type,
                duration,
                user
            )
            if (response.status == 200) {
                return 'link pembayaran : ' + response.data.data.checkout_link
            }
        } catch (error) {
            return 'gagal membuat pembayaran'
        }
    },
    {
        name: 'create_order_product',
        description: `Gunakan tools ini untuk membuat order produk atau pemesanan produk digital konek market.`,
        schema: z.object({
            name: z
                .string()
                .describe(
                    'Nama dari pelanggan yang ingin memesan produk digital. Wajib didapatkan sebelum menggunakan fungsi ini.'
                ),
            phone: z
                .string()
                .describe(
                    'Nomor telepon dari pelanggan yang ingin atau tertarik membeli produk digital. Wajib didapatkan sebelum menggunakan fungsi ini.'
                ),
            paket_addon_id: z
                .string()
                .describe(
                    'Gunakan tools mencari produk digital berdasarkan nama produk untuk mendapatkan id yang berupa angka contoh prompt: berapa id dari nama_produk'
                ),
            subscription_type: z
                .enum(['monthly', 'daily'])
                .describe(
                    'Tipe langganan yang dipilih oleh pelanggan. Biasanya berupa bulanan, harian dan tahunan. ketika pelanggan sudah memilih tipe langganan, ubah bentuk data menjadi monthly, daily, yearly hanya saat menggunakan tools. Wajib didapatkan sebelum menggunakan fungsi ini.'
                ),
            duration: z
                .number()
                .default(1)
                .describe(
                    'Lama durasi langganan pelanggan. Wajib didapatkan sebelum menggunakan fungsi ini. jika harian dimulai dari angka 1. jika monthly dimulai dari angka 1'
                ),
            user: z
                .number()
                .default(1)
                .describe(
                    'Jumlah akun atau profil produk digital yang ingin dibeli. Biasanya berupa angka yang diberikan oleh pelanggan. Wajib didapatkan sebelum menggunakan fungsi ini.'
                ),
        }),
    }
)
