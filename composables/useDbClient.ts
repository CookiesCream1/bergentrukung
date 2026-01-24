import { createConnection } from 'mariadb'

export const useDbClient = async () => {
  const conn = await createConnection({
    host: '127.0.0.1',
    port: 3307,
    user: 'pospislu20',
    password: 'pymyjipijema',
    database: 'pospislu20_1',
    connectTimeout: 10000
  })

  return conn
}
