import { randomUUID } from 'node:crypto'
import bcrypt from 'bcryptjs'
import { defineEventHandler, getRequestURL, readBody } from 'h3'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { PoolConnection } from 'mariadb/*'
import { NuxtAuthHandler } from '#auth'
import { useDbClient } from '~/composables/useDbClient'

type SignupBody = {
  email?: string
  username?: string
  password?: string
}

const signUpUser = async (body: SignupBody) => {
  const email = body.email?.trim().toLowerCase()
  const username = body.username?.trim()
  const password = body.password

  if (!email || !username || !password) {
    return { error: 'Missing email, username or password.' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long.' }
  }

  let db: undefined | PoolConnection

  try {
    db = await useDbClient()
    const existingUsers = (await db.query(
      'SELECT user_id FROM users WHERE email = ? LIMIT 1',
      [email]
    )) as Array<{ user_id: string }>
    
    if (existingUsers.length > 0) {
      return { error: 'Account with this email already exists.' }
    }

    const hashedPassword = await bcrypt.hash(password, 5)
    const userId = randomUUID()
    
    const values = [userId, email, hashedPassword]

    await db.query(`INSERT INTO users (user_id, email, pwd_hash) VALUES (?, ?, ?)`, values)

    return { success: true }
  } catch (error) {
    console.error('Signup failed:', error)
    return { error: 'Signup failed due to a server error.' }
  } finally {
    db?.end()
  }
}

const authHandler = NuxtAuthHandler({
  secret: process.env.auth_secret,
  providers: [
    // @ts-expect-error
    CredentialsProvider.default({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize (credentials: Record<'email' | 'password', string> | undefined) {
        const email = credentials?.email?.trim().toLowerCase()
        const password = credentials?.password

        if (!email || !password) {
          return null
        }

        const db = await useDbClient()

        try {
          const userRows = (await db.query(
            `SELECT user_id, email, pwd_hash AS password_value FROM users WHERE email = ? LIMIT 1`,
            [email]
          )) as Array<{ user_id: string; email: string; password_value: string }>

          if (userRows.length !== 1) {
            return null
          }

          const user = userRows[0]!
          const passwordMatches = await bcrypt.compare(password, user.password_value)

          if (!passwordMatches) {
            return null
          }

          return {
            id: user.user_id,
            email: user.email,
            name: user.email
          }
        } finally {
          db.end()
        }
      }
    }),
    // @ts-expect-error
    GoogleProvider.default({
      clientId: process.env.google_client_id ?? (() => { throw new Error('Missing google_client_id') })(),
      clientSecret: process.env.google_client_secret ?? (() => { throw new Error('Missing google_client_secret') })()
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
      // @ts-expect-error
      session.user = { ...session.user, id: token.id, email: token.email }
      return session
    }
  }
})

export default defineEventHandler(async (event) => {
  const { pathname } = getRequestURL(event)

  if (pathname === '/api/auth/signup' && event.method === 'POST') {
    const body = await readBody<SignupBody>(event)
    return await signUpUser(body)
  }

  return await authHandler(event)
})
