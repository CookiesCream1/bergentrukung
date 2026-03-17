import { getAuthUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await getAuthUser(event)

  if (!user) {
    setResponseStatus(event, 401)
    return
  }

  return user.role
})
