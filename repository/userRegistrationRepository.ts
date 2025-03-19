import prisma from '~/services/prisma/client'
import type { UserRegistrationCreateInterface } from '~/types/UserRegistrationCreateInterface'
import type { UserRegistrationInterface } from '~/types/UserRegistrationInterface'

export const createUserRegistration = async (
    data: UserRegistrationCreateInterface
) => {
    const userRegistration = await prisma.userRegistration.create({
        data: data,
    })

    return userRegistration as UserRegistrationInterface
}

export const findValidationToken = async (validationToken: string) => {
    const userRegistration = await prisma.userRegistration.findFirst({
        where: {
            validationToken: validationToken,
        },
    })

    return userRegistration as UserRegistrationInterface
}
