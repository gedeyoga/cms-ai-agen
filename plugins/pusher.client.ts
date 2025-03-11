import Pusher from 'pusher-js'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    if (!config.public.pusherKey) {
        throw new Error('PUSHER_KEY is not defined')
    }

    if (!config.public.pusherCluster) {
        throw new Error('PUSHER_CLUSTER is not defined')
    }

    const pusher = new Pusher(config.public.pusherKey, {
        cluster: config.public.pusherCluster,
    })

    return {
        provide: { pusher },
    }
})
