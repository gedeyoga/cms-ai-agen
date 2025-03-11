// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-11-01',
    devtools: { enabled: true },
    modules: ['@nuxtjs/tailwindcss', 'shadcn-nuxt', '@nuxtjs/color-mode'],
    colorMode: {
        classSuffix: '', // Hapus suffix agar class menjadi 'dark' saja
    },
    shadcn: {
        /**
         * Prefix for all the imported component
         */
        prefix: '',
        /**
         * Directory that the component lives in.
         * @default "./components/ui"
         */
        componentDir: './components/ui',
    },
    runtimeConfig: {
        public: {
            pusherKey: process.env.PUSHER_KEY,
            pusherCluster: process.env.PUSHER_CLUSTER,
        }
    },
    plugins: [
        { src: "~/plugins/pusher.client.ts", mode: "client" }
    ],
})
