import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto'
import bcrypt from 'bcrypt'
import { createError, getCookie, getHeader, type H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'
import { useDbClient } from '~/composables/useDbClient'

type TokenPayload = {
  sub: string
  email: string
  exp: number
}

type UserRecord = {
  user_id: string
  email: string
  pwd_hash: string
  role_name: string | null
}

export type AuthenticatedUser = {
  id: string
  email: string
  name: string
  role: string
}

type RegisterBody = {
  email?: string
  password?: string
}

const AUTH_TOKEN_COOKIE_NAME = 'auth.token'

const normalizeEmail = (email?: string) => email?.trim().toLowerCase() ?? ''

const getAuthSecret = () => {
  const runtimeConfig = useRuntimeConfig()

  if (!runtimeConfig.authSecret) {
    throw new Error('Missing authSecret runtime config.')
  }

  return runtimeConfig.authSecret
}

const getTokenMaxAgeInSeconds = () => {
  const runtimeConfig = useRuntimeConfig()
  return Number(runtimeConfig.authTokenMaxAgeInSeconds || 60 * 60 * 24 * 7)
}

const encodePayload = (payload: TokenPayload) => Buffer.from(JSON.stringify(payload)).toString('base64url')

const signPayload = (encodedPayload: string) => createHmac('sha256', getAuthSecret())
  .update(encodedPayload)
  .digest('base64url')

const decodePayload = (encodedPayload: string) => {
  const decoded = Buffer.from(encodedPayload, 'base64url').toString('utf8')
  return JSON.parse(decoded) as TokenPayload
}

const mapUserRecord = (user: Pick<UserRecord, 'user_id' | 'email' | 'role_name'>): AuthenticatedUser => ({
  id: user.user_id,
  email: user.email,
  name: user.email,
  role: user.role_name ?? 'user'
})

const readTokenFromRequest = (event: H3Event) => {
  const authorizationHeader = getHeader(event, 'authorization')

  if (authorizationHeader?.startsWith('Bearer ')) {
    const headerToken = authorizationHeader.slice('Bearer '.length).trim()
    if (headerToken.length > 0) {
      return headerToken
    }
  }

  const cookieToken = getCookie(event, AUTH_TOKEN_COOKIE_NAME)
  return typeof cookieToken === 'string' && cookieToken.length > 0 ? cookieToken : null
}

const verifyToken = (token: string) => {
  const [encodedPayload, signature] = token.split('.')

  if (!encodedPayload || !signature) {
    return null
  }

  const expectedSignature = signPayload(encodedPayload)

  if (signature.length !== expectedSignature.length) {
    return null
  }

  const signatureBuffer = Buffer.from(signature)
  const expectedSignatureBuffer = Buffer.from(expectedSignature)

  if (!timingSafeEqual(signatureBuffer, expectedSignatureBuffer)) {
    return null
  }

  try {
    const payload = decodePayload(encodedPayload)

    if (!payload.sub || !payload.email || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null
    }

    return payload
  } catch {
    return null
  }
}

export const createAccessToken = (user: Pick<AuthenticatedUser, 'id' | 'email'>) => {
  const payload: TokenPayload = {
    sub: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + getTokenMaxAgeInSeconds()
  }

  const encodedPayload = encodePayload(payload)
  const signature = signPayload(encodedPayload)

  return `${encodedPayload}.${signature}`
}

export const authenticateUser = async (emailInput?: string, password?: string) => {
  const email = normalizeEmail(emailInput)

  if (!email || !password) {
    return null
  }

  const db = await useDbClient()

  try {
    const userRows = (await db.query(
      `SELECT u.user_id, u.email, u.pwd_hash, COALESCE(ur.role_name, 'user') AS role_name
       FROM users AS u
       LEFT JOIN user_roles AS ur ON u.user_role = ur.role_id
       WHERE u.email = ?
       LIMIT 1`,
      [email]
    )) as UserRecord[]

    if (userRows.length !== 1) {
      return null
    }

    const user = userRows[0]!
    const passwordMatches = await bcrypt.compare(password, user.pwd_hash)

    if (!passwordMatches) {
      return null
    }

    return mapUserRecord(user)
  } finally {
    db.end()
  }
}

export const registerUser = async (body: RegisterBody) => {
  const email = normalizeEmail(body.email)
  const password = body.password ?? ''

  if (!email || !password) {
    return { error: 'Vyplňte prosím e-mail a heslo.' }
  }

  if (password.length < 8) {
    return { error: 'Heslo musí mít alespoň 8 znaků.' }
  }

  const db = await useDbClient()

  try {
    const existingUsers = (await db.query(
      'SELECT user_id FROM users WHERE email = ? LIMIT 1',
      [email]
    )) as Array<{ user_id: string }>

    if (existingUsers.length > 0) {
      return { error: 'Účet s tímto e-mailem už existuje.' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await db.query(
      'INSERT INTO users (user_id, email, pwd_hash) VALUES (?, ?, ?)',
      [randomUUID(), email, hashedPassword]
    )

    return { success: true }
  } catch (error) {
    console.error('Registration failed:', error)
    return { error: 'Registrace se nezdařila kvůli chybě serveru.' }
  } finally {
    db.end()
  }
}

export const getAuthUser = async (event: H3Event) => {
  const token = readTokenFromRequest(event)

  if (!token) {
    return null
  }

  const payload = verifyToken(token)

  if (!payload) {
    return null
  }

  const db = await useDbClient()

  try {
    const userRows = (await db.query(
      `SELECT u.user_id, u.email, COALESCE(ur.role_name, 'user') AS role_name
       FROM users AS u
       LEFT JOIN user_roles AS ur ON u.user_role = ur.role_id
       WHERE u.user_id = ? AND u.email = ?
       LIMIT 1`,
      [payload.sub, payload.email]
    )) as Array<Pick<UserRecord, 'user_id' | 'email' | 'role_name'>>

    if (userRows.length !== 1) {
      return null
    }

    return mapUserRecord(userRows[0]!)
  } finally {
    db.end()
  }
}

export const requireAuthUser = async (event: H3Event) => {
  const user = await getAuthUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not authenticated'
    })
  }

  return user
}

export const requireAdminUser = async (event: H3Event) => {
  const user = await requireAuthUser(event)

  if (user.role !== 'admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Not authorized'
    })
  }

  return user
}
