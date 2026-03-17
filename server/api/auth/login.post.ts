import { readBody } from 'h3'
import { authenticateUser, createAccessToken } from '~/server/utils/auth'

type LoginBody = {
  email?: string
  password?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<LoginBody>(event)
  const user = await authenticateUser(body.email, body.password)

  if (!user) {
    return {
      token: '',
      error: 'Neplatný e-mail nebo heslo.'
    }
  }

  return {
    token: createAccessToken(user),
    user
  }
})
