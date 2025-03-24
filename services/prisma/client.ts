import pkg from '@prisma/client'
const { PrismaClient } = pkg
const prisma = new PrismaClient({
    omit: {
        user: {
            password: true,
        },
    },
})
export default prisma
