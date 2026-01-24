import { promises as fs } from 'fs'
import bcrypt from 'bcrypt'
import { defineEventHandler, readBody } from 'h3'

// path to our mock DB file
const dbPath = 'server/data/users.json'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { email, username, password } = body

  if (!email || !username || !password) {
    return { error: 'Chybí údaje.' }
  }

  try {
    // ensure db file exists
    try {
      await fs.access(dbPath)
    } catch {
      await fs.writeFile(dbPath, JSON.stringify([]))
    }

    // read users
    const usersRaw = await fs.readFile(dbPath, 'utf-8')
    const users = JSON.parse(usersRaw)

    // check for existing email or username
    const existing = users.find(
      (u: any) => u.email === email || u.username === username
    )
    if (existing) {
      return { error: 'Účet s tímto e-mailem nebo jménem již existuje.' }
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10)

    // new user object
    const newUser = {
      id: Date.now(),
      email,
      username,
      password: hashed
    }

    // add to db and save
    users.push(newUser)
    await fs.writeFile(dbPath, JSON.stringify(users, null, 2))

    return { success: true }
  } catch (err) {
    console.error('Signup error:', err)
    return { error: 'Došlo k chybě při registraci.' }
  }
})
