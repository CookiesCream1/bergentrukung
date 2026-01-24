import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { NuxtAuthHandler } from '#auth'
import { useDbClient } from '~/composables/useDbClient'

export default NuxtAuthHandler({
  secret: process.env.auth_secret,
  providers: [
    // @ts-expect-error
    GoogleProvider.default({
      clientId: process.env.google_client_id,
      clientSecret: process.env.google_client_secret
    }),
    // Manual login
    CredentialsProvider.default({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials) {
        const db = await useDbClient()
        const [user] = await db.query(
          'SELECT user_id, email, password_hash FROM users WHERE email = ?',
          [credentials?.email]
        )
        db.end()

        if (!user) { return null }

        const valid = await bcrypt.compare(credentials!.password, user.password_hash)
        if (!valid) { return null }

        return { id: user.user_id, email: user.email }
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt ({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session ({ session, token }) {
      session.user = { ...session.user, id: token.id, email: token.email }
      return session
    }
  }
})
