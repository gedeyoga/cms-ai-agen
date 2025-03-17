import { NuxtAuthHandler } from '#auth'
import Credentials from 'next-auth/providers/credentials'
import { z, ZodError } from 'zod'
import { findUniqueEmail } from '~/repository/userRepository'
// @ts-ignore
import bcrypt from 'bcrypt'

export default NuxtAuthHandler({
  secret: useRuntimeConfig().authSecret,
  providers: [
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
                    console.log('error')
                    throw new Error('Invalid credentials')
                }        
            
                return dataUser
        
            } catch (error) {
                if(error instanceof ZodError){
                    return null
                }
            }
        },

      }),
  ],

  callbacks: {
    async signIn({user}) {
        console.log('user')
      if (!user) {
        return '/login?error=invalid_credentials' // Redirect dengan query error
      }
      return true
    }
  },

  pages: {
    signIn: '/login',
  }
  // your authentication configuration here!
})