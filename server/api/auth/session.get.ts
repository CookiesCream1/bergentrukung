import { getAuthUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  return getAuthUser(event)
})
