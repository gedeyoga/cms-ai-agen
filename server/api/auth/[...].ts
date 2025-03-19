import { NuxtAuthHandler } from '#auth'
import Credentials from 'next-auth/providers/credentials'
import { z, ZodError } from 'zod'
import { findOtpUser, findUniqueEmail, findUniquePhoneUser } from '~/repository/userRepository'
// @ts-ignore
import bcrypt from 'bcrypt'
import moment from 'moment'

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
    // @ts-ignore
    Credentials.default({
        id: 'credentials',
        name: 'credentials',
        credentials: {
          email: { label: "Email" , type: 'text'},
          password: { label: "Password", type: "password" },
        },
        async authorize(credentials: any) {
            const data = {
                email: credentials.email,
                password: credentials.password
            }

            try {
                const schema = z.object({
                    email: z.string().min(2).email(),
                    password: z.string().min(8),
                })
                
                const {email, password } = await schema.parseAsync(data)

                const dataUser = await findUniqueEmail(email)
        
                if (dataUser == null) {
                    throw new Error('User not found')
                }

                const isMatched = await bcrypt.compare(password, dataUser.password)

                if(!isMatched) {
                  throw new Error('User not found')
                }        
            
                return dataUser
        
            } catch (error) {
                if(error instanceof ZodError){
                    throw new Error('Invalid input credentials')
                    return null
                }else {
                  throw error
                  return null
                }
            }
        },

      }),

      // @ts-ignore
      Credentials.default({
        id: 'whatsapp',
        name: 'whatsapp',
        credentials: {
          phone: { label: "Phone" , type: 'text'},
          otp: { label: "OTP", type: "text" },
        },
        async authorize(credentials: any) {
            const data = {
                phone: credentials.phone,
                otp: credentials.otp
            }

            try {
                const schema = z.object({
                    phone: z.string().min(8),
                    otp: z.string().min(5),
                })
                
                const {phone, otp } = await schema.parseAsync(data)

                const dataOtp = await findOtpUser(phone)
        
                if (dataOtp == null) {
                    throw new Error('User not found')
                }

                if(moment().isAfter(moment(dataOtp.expiredAt))) {
                  throw new Error('OTP code has been expired')
                }

                const isMatched = await bcrypt.compare(otp, dataOtp.otp)

                if(!isMatched) {
                  throw new Error('Invalid OTP')
                }        
            
                return {
                  ...dataOtp.user
                }
        
            } catch (error) {
                if(error instanceof ZodError){
                    throw new Error('Invalid input credentials')
                    return null
                }else {
                  throw error
                  return null
                }
            }
        },

      }),
  ],

  callbacks: {
    async signIn({user}) {
      return user ? true : false
    }
  },

  pages: {
    signIn: '/login',
  }
  // your authentication configuration here!
})