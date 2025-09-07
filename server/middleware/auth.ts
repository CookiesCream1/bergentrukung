import { getServerSession } from '#auth'

export default defineEventHandler(async (event) => {
  // Only protect certain API routes
  if (!event.path.startsWith('/api/user') && !event.path.startsWith('/api/admin')) {
    // Do not enforce auth
    return
  }

  const session = await getServerSession(event)
  if (!session) {
    throw createError({ statusMessage: 'Unauthenticated', statusCode: 403 })
  }
})
