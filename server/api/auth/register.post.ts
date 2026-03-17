import { readBody } from 'h3'
import { registerUser } from '~/server/utils/auth'

type RegisterBody = {
  email?: string
  password?: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody<RegisterBody>(event)
  return registerUser(body)
})
