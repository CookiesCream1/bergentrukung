export default defineNuxtRouteMiddleware(async () => {
  try {
    const role = await $fetch('/api/user/role')

    if (role === 'admin') {
      return
    }
  } catch (error) {
    const statusCode = (error as { statusCode?: number }).statusCode

    if (statusCode === 401) {
      return navigateTo('/login')
    }
  }

  return abortNavigation('Not authorized')
})
