import { existsSync } from 'fs'
import { join } from 'path'
import { cwd } from 'process'

export default defineEventHandler(() => {
  const root = cwd()
  return {
    cwd: root,
    envExists: existsSync(join(root, '.env')),
    stripePk: process.env.NUXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? null
  }
})
