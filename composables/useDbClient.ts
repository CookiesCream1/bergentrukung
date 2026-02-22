import * as mariadb from 'mariadb'

const connectionPool = mariadb.createPool({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'toor',
  database: 'zamazon',
  connectTimeout: 10000,
  connectionLimit: 16
})

export const useDbClient = async () => {
  const conn = await connectionPool.getConnection()

  return conn
}
