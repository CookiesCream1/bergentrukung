import { requireAuthUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/user') && !event.path.startsWith('/api/admin')) {
    return
  }

  await requireAuthUser(event)
})
