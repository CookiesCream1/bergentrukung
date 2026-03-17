import { requireAdminUser } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  if (!event.path.startsWith('/api/admin')) {
    return
  }

  await requireAdminUser(event)
})
